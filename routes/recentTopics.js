const express = require('express');
const router = express.Router();
const { db, storage, auth } = require('../firebase');

router.get('/', async (req, res) => {
    try {
      const snapshot = await db
        .collection('articles')
        .orderBy('createdAt', 'desc')
        .limit(6)
        .get();
  
      const titles = snapshot.docs.map(doc => doc.data().title);
  
      res.status(200).json(titles);
    } catch (error) {
      console.error('Error fetching latest article titles:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

  module.exports = router;