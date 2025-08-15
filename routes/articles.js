const express = require('express');
const router = express.Router();
const { db, storage, auth } = require('../firebase');

// Get a single article by ID
router.get('/:id', async (req, res) => {
    try {
      const articleId = req.params.id;
      const articleRef = db.collection('articles').doc(articleId);
      const doc = await articleRef.get();
  
      if (!doc.exists) {
        return res.status(404).json({ error: 'Article not found' });
      }
  
      res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error fetching article:', error);
      res.status(500).json({ error: 'Failed to fetch article' });
    }
  });

// 🔽 Add a new article
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

    const newArticle = {
      title,
      date,
      summary,
      content,
      img,
      createdAt: new Date(),
    };

    const docRef = await db.collection('articles').add(newArticle);
    res.status(201).json({ id: docRef.id, ...newArticle });
  } catch (error) {
    console.error('Error adding article:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// 🔽 Get all articles
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('articles').orderBy('createdAt', 'desc').get();
    const articles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
