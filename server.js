const express = require('express');
const mongoose = require('mongoose');
const app = express();
const articleRouter = require("./routes/articles");
const Article = require('./models/article');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost/BlogWebsiteDatabase');

app.set('view engine', 'ejs'); 

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.get('/', async (req, res) => {
    const { query } = req.query; 
    let articles;

    if (query) {
        
        articles = await Article.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // Search in title (case insensitive)
                { description: { $regex: query, $options: 'i' } } 
            ]
        }).sort({ createdAt: 'desc' }); 
    } else {
        // If no query, fetch all articles
        articles = await Article.find().sort({ createdAt: 'desc' });
    }

    // Render the articles, include a message if no articles are found
    const message = articles.length === 0 ? 'No articles found.' : null;
    res.render('articles/index', { articles: articles, message: message });
});

app.use('/articles', articleRouter);

app.listen(3000);
