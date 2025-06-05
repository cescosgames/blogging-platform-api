import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// cleaning up our DB to only handle connection and disconnecting from our database

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let database;

// function to connect and disconnect from our database
export const connectToDB = async () => {
  // check if we have a database
  if (!database) {
    console.log('initial database connection')
    await client.connect(); // if we don't, connect to it
    database = client.db('test_blogDB'); // and set it
  }
  return database; // return it as our current use database
};

// function to close connection 
export const closeDB = async () => {
  if (client) { // if our client exists
    try {
      await client.close(); // close it
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }
  }
};