import http from 'http';
import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://localhost:27017/mestodb');

await client.connect();

// const db = client.db('myDatabase');
// db.users;
const server = http.createServer(() => {
  console.log('Пришёл запрос!');
});

server.listen(3000);
