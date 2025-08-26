// app.js
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const articleRoutes = require("./routes/articles");
const recentTopicsRoute = require('./routes/recentTopics');
const storyRoutes = require('./routes/stories');
const matchesRoutes = require('./routes/matches');

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload()); // to handle image uploads

app.use("/api/articles", articleRoutes);
app.use("/api/recent-topics", recentTopicsRoute);
app.use("/api/stories", storyRoutes);
app.use("/api/matches", matchesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
