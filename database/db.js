import { MongoClient, ObjectId } from 'mongodb'; // import our mongo client
import dotenv from 'dotenv'; // dotenv for environment variables functions

// ------------------------------------------------------------------------------------------------------
// | NOTE: this basically a remake of the postController, but for using our MongoDB Atlas Cloud Test DB |
// | also, I sort of combined 'connecting to db' functions with each function, this is NOT ideal        |
// | ideally, we would have a continous connection during use and disconnect when done
// ------------------------------------------------------------------------------------------------------

dotenv.config(); // load our environment variables

const uri = process.env.MONGODB_URI; // from our .env file

const client = new MongoClient(uri); // this function connects us to our database using our URI

// @desc GET all posts from mongo database
// @route api/posts
export const getPostDB = async (req, res) => {
  console.log('getting all posts from DB');
  try {
      await client.connect(); // connect to the database
      const database = client.db('test_blogDB'); // doesn't exist, just testing right now
      const posts = database.collection('blog_posts'); // same as above

      // Retrieve a single post (optionally filtered by a query)
      const query = req.query || {}; // optional: Add filters via query params
      const exPost = await posts.findOne(query);

      // if post doesn't exist
      if (!exPost) {
          return res.status(404).json({ message: 'Post not found' });
      }

      // Return the found post
      return res.status(200).json(exPost);
  } catch (error) {
      console.error('Error getting posts:', error);
      return res.status(500).json({ error: 'Failed to read blog posts directory' });
  } finally {
      await client.close(); // ensure the database connection is closed
  }
};

// @desc GET single post from mongo database
// @route api/posts/:id
export const getSinglePostDB = async (req, res) => {
  console.log('getting single post from DB');
  try {
      await client.connect(); // connect to the database
      const database = client.db('test_blogDB');
      const posts = database.collection('blog_posts');

      const postId = req.params.id; // convert the id param to an ObjectId the way mongoDB stores

      if (!ObjectId.isValid(postId)) { // check if our id is a valid ObjectId before searching
          return res.status(400).json({ error: 'Invalid post id' });
      }

      const post = await posts.findOne({ _id: new ObjectId(postId) }); // query the database for the post by ID

      if (!post) { // if our post isn't found
          return res.status(404).json({ error: `Post with id ${postId} not found` });
      }

      return res.status(200).json(post); // otherwise success!
  } catch (error) {
      console.error('Error getting post:', error);
      return res.status(500).json({ error: 'Failed to read blog posts directory' });
  } finally {
      await client.close(); // ensure the database connection is closed
  }
};

// @desc GET posts by category filter 
// @route api/posts/filter?tag=tagTitle
export const getByTagDB = async (req, res) => {
  console.log('getting posts with tag from DB');
  try {
    await client.connect(); // connect to the database
    const database = client.db('test_blogDB');
    const posts = database.collection('blog_posts');

    // get the category from query params
    const tag = req.query.tag;

    // check if we have a category
    if(!tag) {
        return res.status(400).json({ error: 'Tag required to filter by tag' }); // 400 user error didn't submit category
    };

    const postsWithTag = await posts.find({ tags: tag }).toArray(); // query the database for the posts with tag

    if (postsWithTag.length > 0) { // if our post isn't found
        return res.status(200).json(postsWithTag); // otherwise success!
    } else {
        res.status(404).json({ error: `No posts found with tag ${tag}` })
    }
  } catch (error) {
    console.error('Error getting posts:', error);
    return res.status(500).json({ error: 'Failed to read blog posts directory' });
  } finally {
    await client.close(); // ensure the database connection is closed
  }
};

// @desc POST new post
// @route api/posts
export const createPostDB = async (req, res) => {
  console.log('creating new post in DB');

  try {
    await client.connect(); // connect to the database
    const database = client.db('test_blogDB');
    const posts = database.collection('blog_posts');

    const { title, content, category, tags } = req.body; // get title, content, category, and tags from the request body

    // check we have all necessary info AND check that our tags array is in fact an array
    if (!title || !content || !category || !tags || !Array.isArray(tags)) {
      return res.status(400).json({
        error: 'title, content, category, and tags (in array format) are required',
      });
    }

    // switching to date object instead of file system date string conversion thing I had earlier
    const date = new Date(); // 
    const newPost = { title, content, category, tags, createdOn: date, updatedOn: date }; // the new post

    const result = await posts.insertOne(newPost); // use insert one to add the post to our db

    res.status(201).json({ id: result.insertedId, ...newPost }); // success! send back our inserted ID we got from mongoDB with our post
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  } finally {
    await client.close(); // Ensure the database connection is closed
  }
};

// @desc PUT update post
// @route api/posts/:id
export const updatePostDB = async (req, res) => {
    console.log('updating post in DB');

    try {
      await client.connect(); // connect to the database
      const database = client.db('test_blogDB');
      const posts = database.collection('blog_posts');

      const postId = req.params.id; // convert the id param to an ObjectId the way mongoDB stores
      const { title, content, category, tags } = req.body; // get what we want to update from our request body

      if (!ObjectId.isValid(postId)) { // check if our id is a valid ObjectId before searching
          return res.status(400).json({ error: 'Invalid post id' });
      }

      // create our blog post as an object
      const updatedPostInfo = {};
      if (title) updatedPostInfo.title = title; // if we have ___ update it in our object
      if (content) updatedPostInfo.content = content; // repeat
      if (category) updatedPostInfo.category = category; // repeat
      if (tags) updatedPostInfo.tags = tags; // repeat
      updatedPostInfo.updatedOn = new Date(); // remember, using built in date object now

      const updatedPOst = await posts.updateOne(
        { _id: new ObjectId(postId) }, // search by ID, why is this deprecated now? 
        { $set: updatedPostInfo } // $set updates only specified fields, more info if you look up $set
      );

      if (!updatedPOst) { // if our post isn't found
          return res.status(404).json({ error: `Post with id ${postId} not found` });
      }

      return res.status(200).json(updatedPOst); // otherwise success!
  } catch (error) {
      console.error('Error getting post:', error);
      return res.status(500).json({ error: 'Failed to read blog posts directory' });
  } finally {
      await client.close(); // ensure the database connection is closed
  }
};

// @desc DELETE delete post
// @route api/posts/:id
export const deletePostDB = async (req, res) => {
    console.log('deleting single post from DB');
    try {
        await client.connect(); // connect to the database
        const database = client.db('test_blogDB'); // doesn't exist, just testing right now
        const posts = database.collection('blog_posts'); // same as above

        // Retrieve a single post (optionally filtered by a query)
        const postId = req.params.id; // convert the id param to an ObjectId the way mongoDB stores

        if (!ObjectId.isValid(postId)) { // check our object id is valid
          return res.status(400).json({ error: 'Invalid post ID' });
        }

        const exPost = await posts.deleteOne({ _id: new ObjectId(postId) });

        // Return the found post
        return res.status(200).json({ message: `Post ${postId} deleted`}); // 200 or 204 here? we are returning a message so maybe 204 isn't appropriate but 204 tells us we have nothing left? 
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ error: 'Failed to read blog posts directory' });
    } finally {
        await client.close(); // ensure the database connection is closed
    }
}











// test function using the example movie set from the documentation, gives a good idea on how to approach
async function run() {
  try {
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');

    // Queries for a movie that has a title value of 'Back to the Future'
    const query = { title: 'Back to the Future' };
    const movie = await movies.findOne(query);

    console.log(movie);
  } finally {
    await client.close();
  }
}