// this is our backend routing for handling posts, creating, reading (all, single, filter), updating, deleting
import express from 'express'; // bring in express
const router = express.Router(); // using express router to route

// -- temporary for getting our blog posts route --
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const postsDir = path.join(__dirname, '../public/exPosts');
// --

// get route, currently using public folder, will move to DB at end

// GET all posts | route api/posts
router.get('/', (req, res) => {
    // read the whole directory, argument and files as arguments
    fs.readdir(postsDir, (err, files) => {
        // check for errors and return JSON message if error
        if (err) {
            return res.status(500).json({ error: 'Failed to read blog posts directory' });
        };

        // otherwise, mapp over our files to get our posts
        const posts = files.map(file => {
            const content = fs.readFileSync(path.join(postsDir, file), 'utf-8'); // reads the file at postsdir/filename in utf-8 encoding
            return JSON.parse(content); // return the parsed content
        });

        res.status(200).json(posts); // return a 200 success status with all the posts
    });
});

// GET single post | route api/posts/:id
router.get('/:id', (req, res) => {
    // read the posts path, posts are labelled as 'postX.json'
    const postPath = path.join(postsDir, `post${req.params.id}.json`); // since posts are labelled as such, use request params ID to get the post you want
    
    // check if the post exists
    if(!fs.existsSync(postPath)) {
        return res.status(404).json({ error: `Post with id ${req.params.id} not found` });
    }

    const content = fs.readFileSync(postPath, 'utf-8'); // if it does exist, read the file

    res.status(200).json(JSON.parse(content));  // return back the single post
});






// // just testing the route with an iife
// (function() {
//   console.log(JSON.parse(fs.readFileSync(path.join(postsDir, 'post1.json'), 'utf-8')));
// })();

export default router;