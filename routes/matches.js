const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const {db} = require('../firebase'); // Firestore config

// GET recent finished matches (last 24 hrs)
router.get('/recent-matches', async (req, res) => {
  try {
    // Cricbuzz API call
    const response = await fetch("https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent", {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      }
    });

    const data = await response.json();
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    const recentMatches = [];

    if (data.typeMatches) {
      data.typeMatches.forEach(type => {
        if (type.seriesMatches && type.matchType == 'International') {
          type.seriesMatches.forEach(series => {
            if (series.seriesAdWrapper && series.seriesAdWrapper.matches) {
              series.seriesAdWrapper.matches.forEach(match => {
                const matchInfo = match.matchInfo;
                if (matchInfo && matchInfo.state === "Complete") {
                  const endTime = parseInt(matchInfo.endDate, 10);
                  if (endTime >= oneDayAgo && endTime <= now) {
                    recentMatches.push({
                      title: `${matchInfo.seriesName} - ${matchInfo.matchDesc}`,
                      desc: `${matchInfo.team1.teamName} vs ${matchInfo.team2.teamName} | ${matchInfo.status}`
                    });
                  }
                }
              });
            }
          });
        }
      });
    }

    // Save to Firestore
    if (recentMatches.length > 0) {
      const batch = db.batch();
      recentMatches.forEach(match => {
        const docRef = db.collection('recentMatches').doc();
        batch.set(docRef, match);
      });
      await batch.commit();
    }
    res.status(200).json({
      count: recentMatches.length,
      matches: recentMatches
    });

  } catch (error) {
    console.error("Error fetching recent matches:", error);
    res.status(500).json({ error: "Failed to fetch recent matches" });
  }
});

module.exports = router;
