const express = require('express');
const { validateToken } = require('../middleware');
const { getArticles, addArticle } = require('../model/articlesModel');

const articleRoutes = express.Router();

articleRoutes.get('/articles', validateToken, async (req, res) => {
  let conn;
  try {
    const articles = await getArticles();
    res.json({ articles, user_id: req.userId });
  } catch (error) {
    console.log('error in getting articles', error);
    res.status(500);
  } finally {
    conn?.end();
  }
});
articleRoutes.post('/articles', validateToken, async (req, res) => {
  let conn;

  const { date, title, content, user_id } = req.body;
  try {
    const articles = await addArticle(date, title, content, user_id);
    console.log('articles ===', articles);
    if (articles.affectedRows === 1) {
      res.status(201).json({ success: true, msg: 'articles created' });
      return;
    }
    res.status(400).json('no articles created');
  } catch (error) {
    console.log('error in getting articles', error);
    res.status(500);
  } finally {
    conn?.end();
  }
});

module.exports = articleRoutes;
