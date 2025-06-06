import express from 'express'; // start with express to build our API
import path from 'path'; // for setting up  public folder
import { fileURLToPath } from 'url'; // for using __dirname in modules
import dotenv from 'dotenv'; // import dotenv to manage env variables
import { closeDB } from './database/db.js';

// importing our routes
import posts from './routes/posts.js';

// managing environment variables
dotenv.config();
const port = process.env.PORT || 8080; // default to 5173 or use environment variables

// get the directory name to load static folder path
const __filename = fileURLToPath(import.meta.url); // gives ur our file URL, just like filename in commonJS
const __dirname = path.dirname(__filename); // pass in our file name to get our dirname

// initialize express
const app = express();

// middleware to allow us to submit raw json
app.use(express.json());

// set up static folder path
app.use(express.static(path.join(__dirname, 'public'))); // __dirname doesn't work with es modules! need to add lines


// ------ current routes below, will move to router soon ------

// test route make sure postman works
app.get('/test', (req, res) => {
    console.log('checking test route');
    res.status(200).json({ message: 'test route success!' });
});

// backend posts route
app.use('/api/posts', (req, res, next) => {
    // console.log('Middleware reached for /api/posts'); // just a checking middleware to make sure we are hitting our routes
    next();
}, posts);

// frontend index route NOTE: frontend is not currently implemented
app.use((req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, 'public/html', 'index.html'));
});

// 404 for undefined routes
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public/html', '404.html'));
});

// ------------------------------------------------------------

// checking for signals to close our db connection when we're done using the application
process.on('SIGINT', async () => { // SIGINT is a signal sent when interrupted, like pressing ctrl+c sends a sigint
    console.log('Received SIGINT closing DB connection');
    await closeDB();
    process.exit(0); // don't forget to exit! 
});
process.on('SIGTERM', async () => { // SIGTERM is like SIGINT but from external programs, like if something shuts down our program, it sends a SIGTERM
    console.log('Received SIGTERM closing DB connection');
    await closeDB();
    process.exit(0); // don't forget to exit! 
});


// listening function: REMEMBER, node has a bult in watch feature, similar to nodemon - see package.json dev function
app.listen(port, () => console.log(`Server started on port ${port}`));