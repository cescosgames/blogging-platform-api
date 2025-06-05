// this is our backend routing for handling posts, creating, reading (all, single, filter), updating, deleting
import express from 'express'; // bring in express
const router = express.Router(); // using express router to route
// our controller
import { getPostDB, getSinglePostDB, getByTagDB, createPostDB, updatePostDB, deletePostDB } from '../controllers/postController.js';

// @desc GET all posts
// @route api/posts
router.get('/', getPostDB);

// @desc GET filtered post NOTE! Must go above /:id or else it will think filter is an id 
// @route api/posts/filter?tag=tagTitle
router.get('/filter', getByTagDB); 

// @desc GET single post 
// @route api/posts/:id
router.get('/:id', getSinglePostDB);

// @desc POST new post
// @route api/posts
router.post('/', createPostDB);

// @desc PUT update post
// @route api/posts/:id
router.put('/:id', updatePostDB);

// @desc DELETE delete post
// @route api/posts/:id
router.delete('/:id', deletePostDB);

export default router;