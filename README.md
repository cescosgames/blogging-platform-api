# Blogging Platform API (backend)

This is a Node.js + Express + MongoDB [blogging platform api project, from roadmap.sh](https://roadmap.sh/projects/blogging-platform-api). This currently backend-only blogging
API allows users to perform basic CRUD operations to a remote database.
<br>
<br>

## How it was made:

**Tech used:** 
- ExpressJS used to set up API routes for managing content
- MongoDB for remote database 
- dotenv for using environment variables
- NOTE: postman was also used to facilitate testing

## How To Run The Project

1. Download the files onto your local environment or copy this repo and navigate into the folder you downloaded them into
```
cd blogging-platform-api
```
2. Open in your preferred IDE and install dependencies
```
npm install
```
3. In your integrated terminal, call npm run dev
```
npm run dev
```
4. Make sure you set up a test MongoDB Atlas database and connect your personal URI in your .env file, which could look like this
```
PORT='your-port'
MONGODB_URI='your-mongodb-uri'
```
5. Open postman (or any similar program) and run commands to test the DB out!
```
// @GET all
http://localhost:{your-port}/api/posts
// @GET single
http://localhost:{your-port}/api/posts/:id
// @GET tags
http://localhost:{your-port}/api/posts/filter?tag={your-tag}
// @POST send with required json body:
{
"title": "Example",
"content": "Example",
"category": "Example",
"tags": [
    "Example",
    "Test"
]
}
http://localhost:{your-port}/api/posts
// PUT update post by id, send with desired updated categories, min. 1 required
http://localhost:{your-port}/api/posts/:id
// DELETE delete post by id
http://localhost:{your-port}/api/posts/:id
```

## Features:

Following the project guidelines, this project features...
1. Full CRUD operations; create a new post, update an existing post, delete a post, get a single post, get all posts, get posts by category
2. Connected to Database

<hr>

## the goals were
### understand what restful apis are: 
Restful APIs are essentially a standardized way for computers to communicate with each other over the internet
<br>

### learn how to create a restful api
you can create a restful api by following the core principle of REST. For example, you need client-server separation, which here is done by using express for the server
and a frontend (or something like postman) for the client. You need statelessness which means the client must provide all the information the server needs. You need
resource based design like we have here with our routing, /posts, /posts/:id etc. You have to use HTTP methods like we have here with GET POST PUT and DELETE. You need
stateless responses like we have with sending back information in JSON. And finally you need proper status codes.
<br>

### learn about GET POST PUT PATCH and DELETE
GET gets a resource, POST creates a resource, PUT updates a resource, DELETE deletes a resource, and PATCH (although I haven't used it) is like PUT but doesn't replace 
the entire resource, just part of it. In this project however, I made PUT behave more like PATCH which goes against RESTFUL API structure. 
<br>

### learn about status codes and error handling in APIs
Only used a few standard status codes of note like 200 (OK) 201 (created) 204 (no content) 400 (client error) 404 (not found) and 500 (internal server error). There are lots
of other standard/commonly used codes that can be easily found online. 
<br>

### learn how to perform CRUD operations using an API
Check out the posts route and postController to see our CRUD operations!
<br>

### learn how to work with databases
Lots to learn here! But getting started is very straightforward, just need to learn the basic MongoDB commands like insertOne, findOne, etc. Lots of different things to 
learn here however for optimal performance and such. One note, I sort of combined my controller functions with my DB functions - not great. I should separate them.

## update notes (updated on:6/5/25)
Changed db.js to handle only database connection and disconnection logic and updated the postController.js to reflect that. Now connection persists through program lifetime and
closes with signals processed in server.js.

## Gameplan
1. Set up the blog
- Since I already have done this, with full CRUD operations, I will REDO this but without saving locally, instead I will not save any information until the DB step
- example blog posts for setup will be in public/exPosts/post*x*.json
2. Set up the database
- Brand new, need to learn!
3. (stretch goals) Clean up the project
- Separate database logic from controller functions
- Set up simple frontend

## final structure example (ascii tree)
project/
|- controllers/
|   |- postController.js # here is where we have all our CRUD logic
|- database/
|   |- db.js # here is where we handle our database connection/disconnection logic
|- public # frontend and local storage for testing
|   |- exposts # example posts for testing
|   |- html # contains all our html
|   |- scripts # frontend scripts
|   |- styles # frontend css
|- routes
|   |- posts.js # here is where we handling our backend routes for our posts (i.e. /api/posts/:id)
|- .env # our environment variables
|- .gitignore # our gitignore
|- package-lock.json
|- package.json
|- README.md # our readme
|_ server.js # our main express script