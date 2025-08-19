const express = require('express');
const router = express.Router();
const { db, storage, auth } = require('../firebase');

// Get a single story by ID
router.get('/:id', async (req, res) => {
    try {
      const storyId = req.params.id;
      const storyRef = db.collection('stories').doc(storyId);
      const doc = await storyRef.get();
  
      if (!doc.exists) {
        return res.status(404).json({ error: 'Story not found' });
      }
  
      res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error fetching story:', error);
      res.status(500).json({ error: 'Failed to fetch story' });
    }
  });

// 🔽 Add a new story
router.post('/', async (req, res) => {
  try {
    const { title, date, summary, content, imageUrl } = req.body;
    let img = imageUrl;

    if (!title || !content || !date || !summary) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if(!img){
      img = '';
    }

    const newStory = {
      title,
      date,
      summary,
      content,
      img,
      createdAt: new Date(),
    };

    const docRef = await db.collection('stories').add(newStory);
    res.status(201).json({ id: docRef.id, ...newStory });
  } catch (error) {
    console.error('Error adding story:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// 🔽 Get all stories
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('stories').orderBy('createdAt', 'desc').get();
    const stories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
