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

// @desc GET all posts
// @route api/posts
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

// @desc GET single post 
// @route api/posts/:id
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

// @desc POST new post
// @route api/posts
router.post('/', (req, res) => {
    // get the title and content from the body of the request
    const { title, content, category, tags } = req.body;

    // check we have all the necessary information
    if(!title || !content || !category || !tags) {
        return res.status(404).json({ error: 'Title, content, category, and at least 1 tag are required' });
    }

    // read the directory in order to get our id
    fs.readdir(postsDir, (err, files) => {
        // check for error reading
        if(err) {
            return res.status(500).json({ error: 'Failed to load posts directory' });
        };

        // get last post for id assignment, temporary while I set up a DB
        const lastPost = files[files.length-1]; // get the last one
        if(!lastPost) { // if it doesn't exit, id is 1
            const id = 1
            // converting millisecond date to mm/dd/yyyy
            const MSdate = Date.now();
            const dateObj = new Date(MSdate); // make a date object from our MSdate
            const month = String(dateObj.getMonth() + 1).padStart(2,'0'); // months start at 0, adding 1 for human reading. padStart pads the string with another string until it reaches a given length i.e. add 0 until we reach length 2
            const day = String(dateObj.getDate()).padStart(2,'0') // same pad as above,
            const year = dateObj.getFullYear(); // returns YYYY
            const date = `${month}/${day}/${year}`; // put it all together
            const updated = date;
            // make the post json
            const newPost = { id, title, content, category, tags, date, updated };
            const newPostPath = path.join(postsDir, `post${id}.json`); // save the path
            fs.writeFileSync(newPostPath, JSON.stringify(newPost, null, 2)); // write the json file to the path 
            res.status(201).json(newPost); // 201 success creation
            return;
        };

        // if we do have a last post
        const lastPostPath = path.join(postsDir, lastPost);
        // read the file to extract the ID
        fs.readFile(lastPostPath, 'utf-8', (err, data) => {
            try {
                const post = JSON.parse(data); // get the post to extract the ID
                const prevID = post.id; // extract the id
                const id = prevID + 1;
                // repeat the date thing from above
                const MSdate = Date.now();
                const dateObj = new Date(MSdate); // make a date object from our MSdate
                const month = String(dateObj.getMonth() + 1).padStart(2,'0'); // months start at 0, adding 1 for human reading. padStart pads the string with another string until it reaches a given length i.e. add 0 until we reach length 2
                const day = String(dateObj.getDate()).padStart(2,'0') // same pad as above,
                const year = dateObj.getFullYear(); // returns YYYY
                const date = `${month}/${day}/${year}`; // put it all together
                const updated = date;
                // make the post
                const newPost = { id, title, content, category, tags, date, updated };
                const newPostPath = path.join(postsDir, `post${id}.json`); // save the path
                fs.writeFileSync(newPostPath, JSON.stringify(newPost, null, 2)); // write the json file to the path 
                res.status(201).json(newPost); // 201 success creation
            } catch (error) {
                return res.status(500).json({ error: `Failed to find previous blog post ID` });
            }
        });
    });
});

// @desc PUT update post
// @route api/posts/:id
router.put('/:id', (req, res) => {
    // like getting the single post
    const postPath = path.join(postsDir, `post${req.params.id}.json`); // getting the post we want to update by id
    // check if our filepath exists
    if(!fs.existsSync(postPath)) {
        return res.status(404).json({ error: `Post with id ${id} not found` });
    };

    const updatedPost = {...JSON.parse(fs.readFileSync(postPath, 'utf-8')), ...req.body }; // spread the original post and add the request body 
    fs.writeFileSync(postPath, JSON.stringify(updatedPost, null, 2));

    res.status(200).json(updatedPost);
});

// @desc DELETE delete post
// @route api/posts/:id
router.delete('/:id', (req, res) => {
    // super similar to get single post
    const postPath = path.join(postsDir, `post${req.params.id}.json`); // getting the post we want to update by id

    // check if our filepath exists
    if(!fs.existsSync(postPath)) {
        return res.status(404).json({ error: `Post not found` });
    };

    fs.unlinkSync(postPath); // deletes our file on this path
    res.status(200).json({ message: `Post id ${id} Deleted` }); // send back a success message
});




// // just testing the route with an iife
// (function() {
//   console.log(JSON.parse(fs.readFileSync(path.join(postsDir, 'post1.json'), 'utf-8')));
// })();

export default router;