# blogging platform API assignment

[Project from roadmap.sh](https://roadmap.sh/projects/blogging-platform-api)

## the goals are
- understand what restful apis are: 
Restful APIs are essentially a standardized way for computers to communicate with each other over the internet
<br>
- learn how to create a restful api
you can create a restful api by following the core principle of REST. For example, you need client-server separation, which here is done by using express for the server
and a frontend (or something like postman) for the client. You need statelessness which means the client must provide all the information the server needs. You need
resource based design like we have here with our routing, /posts, /posts/:id etc. You have to use HTTP methods like we have here with GET POST PUT and DELETE. You need
stateless responses like we have with sending back information in JSON. And finally you need proper status codes.
<br>
- learn about GET POST PUT PATCH and DELETE
GET gets a resource, POST creates a resource, PUT updates a resource, DELETE deletes a resource, and PATCH (although I haven't used it) is like PUT but doesn't replace 
the entire resource, just part of it. I'm realizing now that in my project however, I made PUT behave more like PATCH which goes against RESTFUL API structure. 
<br>
- learn about status codes and error handling in APIs
Only used a few standard status codes of note like 200 (OK) 201 (created) 204 (no content) 400 (client error) 404 (not found) and 500 (internal server error). There are lots
of other standard/commonly used codes that can be easily found online. 
<br>
- learn how to perform CRUD operations using an API
Check out the posts route and postController to see our CRUD operations!
<br>
- learn how to work with databases
WIP

## initial notes
Feels like I learned a lot of this stuff already with the last blog assignment EXCEPT for working with remote databases. The recommendation here was to use 
MongoDB so I think it's about time I learn. 

## Gameplan
1. Set up the blog
- Since I already have done this, with full CRUD operations, I will REDO this but without saving locally, instead I will not save any information until the DB step
- example blog posts for setup will be in public/exPosts/post*x*.json
2. Set up the database
- Brand new, need to learn!