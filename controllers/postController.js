// -- temporary for getting our blog posts route --
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const postsDir = path.join(__dirname, '../public/exPosts');
// --

// @desc GET all posts
// @route api/posts
export const getAllPosts = (req, res) => {
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
};

// @desc GET single post 
// @route api/posts/:id
export const getSinglePost = (req, res) => {
    // read the posts path, posts are labelled as 'postX.json'
    const postPath = path.join(postsDir, `post${req.params.id}.json`); // since posts are labelled as such, use request params ID to get the post you want
    
    // check if the post exists
    if(!fs.existsSync(postPath)) {
        return res.status(404).json({ error: `Post with id ${req.params.id} not found` });
    }

    const content = fs.readFileSync(postPath, 'utf-8'); // if it does exist, read the file

    res.status(200).json(JSON.parse(content));  // return back the single post
};

// @desc GET posts by category filter 
// @route api/posts/filter?tag=tagTitle
export const getByTag = (req, res) => {
    // get the category from query params
    const tag = req.query.tag;

    // check if we have a category
    if(!tag) {
        return res.status(400).json({ error: 'Category required to filter by category' }); // 400 user error didn't submit category
    };

    // if we have a category, read the whole directory
    fs.readdir(postsDir, (err, files) => {
        // check for errors and return JSON message if error
        if (err) {
            return res.status(500).json({ error: 'Failed to read blog posts directory' });
        };

        // otherwise, loop over our files to find any that have the relevant tag and add them to our new filteredPosts array
        const filteredPosts = [];
        files.forEach(file => {
            const filePath = path.join(postsDir, file); // get each file
            const post = JSON.parse(fs.readFileSync(filePath, 'utf-8')); // parse the json
            if(post.tags.includes(tag)) { // if the parsed post tags has our tag
                filteredPosts.push(post); // push the post to our filtered posts
            }
        });

        // return the filtered posts if we have more than 1 otherwise don't
        if(filteredPosts.length > 0) {
            res.status(200).json(filteredPosts); // return a 200 success status with all the posts
        } else {
            res.status(404).json({ error: `No posts found with tag ${tag}` })
        }
    });
};

// @desc POST new post
// @route api/posts
export const createPost = (req, res) => {
    // get the title and content from the body of the request
    const { title, content, category, tags } = req.body;

    // check we have all the necessary information
    if(!title || !content || !category || !tags) {
        return res.status(400).json({ error: 'Title, content, category, and at least 1 tag are required' }); // 400, client error submitting information
    }

    // read the directory in order to get our id
    fs.readdir(postsDir, (err, files) => {
        // check for error reading
        if(err) {
            return res.status(500).json({ error: 'Failed to load posts directory' }); // 500 internal server error, something went wrong on my end
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
            const updatedOn = date;
            // make the post json
            const newPost = { id, title, content, category, tags, date, updatedOn };
            const newPostPath = path.join(postsDir, `post${id}.json`); // save the path
            fs.writeFileSync(newPostPath, JSON.stringify(newPost, null, 2)); // write the json file to the path 
            res.status(201).json(newPost); // 201 success creation of something
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
                const updatedOn = date;
                // make the post
                const newPost = { id, title, content, category, tags, date, updatedOn };
                const newPostPath = path.join(postsDir, `post${id}.json`); // save the path
                fs.writeFileSync(newPostPath, JSON.stringify(newPost, null, 2)); // write the json file to the path 
                res.status(201).json(newPost); // 201 success creation
            } catch (error) {
                return res.status(500).json({ error: `Failed to find previous blog post ID` });
            }
        });
    });
};

// @desc PUT update post
// @route api/posts/:id
export const updatePost = (req, res) => {
    // like getting the single post
    const postPath = path.join(postsDir, `post${req.params.id}.json`); // getting the post we want to update by id
    // check if our filepath exists
    if(!fs.existsSync(postPath)) {
        return res.status(404).json({ error: `Post with id ${id} not found` }); // 404, requested path not found
    };

    const MSdate = Date.now();
    const dateObj = new Date(MSdate); // make a date object from our MSdate
    const month = String(dateObj.getMonth() + 1).padStart(2,'0'); // months start at 0, adding 1 for human reading. padStart pads the string with another string until it reaches a given length i.e. add 0 until we reach length 2
    const day = String(dateObj.getDate()).padStart(2,'0') // same pad as above,
    const year = dateObj.getFullYear(); // returns YYYY
    const newDate = `${month}/${day}/${year}`; // put it all together

    const updatedPost = {...JSON.parse(fs.readFileSync(postPath, 'utf-8')), ...req.body, updatedOn: newDate }; // spread the original post merge/overwrite with the request body, then update the updatedOn datestamp
    fs.writeFileSync(postPath, JSON.stringify(updatedPost, null, 2));

    res.status(200).json(updatedPost); // 200 OK status code succesfully submitted request
};

// @desc DELETE delete post
// @route api/posts/:id
export const deletePost = (req, res) => {
    // super similar to get single post
    const postPath = path.join(postsDir, `post${req.params.id}.json`); // getting the post we want to update by id

    // check if our filepath exists
    if(!fs.existsSync(postPath)) {
        return res.status(404).json({ error: `Post not found` });
    };

    fs.unlinkSync(postPath); // deletes our file on this path
    res.status(204).json({ message: `Post Deleted` }); // 204, action was succesful and no further information needs to be supplied
}