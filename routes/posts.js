// this is our backend routing for handling posts, creating, reading (all, single, filter), updating, deleting
import express from 'express'; // bring in express
const router = express.Router(); // using express router to route
// our controller
import { getAllPosts, getSinglePost, createPost, updatePost, deletePost, getByTag  } from '../controllers/postController.js';

// @desc GET all posts
// @route api/posts
router.get('/', getAllPosts);

// @desc GET filtered post NOTE! Must go above /:id or else it will think filter is an id 
// @route api/posts/filter?tag=tagTitle
router.get('/filter', getByTag); 

// @desc GET single post 
// @route api/posts/:id
router.get('/:id', getSinglePost);

// @desc POST new post
// @route api/posts
router.post('/', createPost);

// @desc PUT update post
// @route api/posts/:id
router.put('/:id', updatePost);

// @desc DELETE delete post
// @route api/posts/:id
router.delete('/:id', deletePost);

export default router;