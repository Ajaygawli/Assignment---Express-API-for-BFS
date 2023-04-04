{
  value: <node value>,
  left: <left child document>,
  right: <right child document>
}

const express = require('express');
const mongodb = require('mongodb');
const Queue = require('queue-fifo');

const app = express();
const client = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'binaryTreeDB';
const collectionName = 'binaryTreeCollection';

// Endpoint for breadth-first search
app.get('/bfs/:startValue', async (req, res) => {
  try {
    // Connect to MongoDB
    const connection = await client.connect(url);
    const db = connection.db(dbName);
    const collection = db.collection(collectionName);

    // Find the starting node
    const startNode = await collection.findOne({ value: req.params.startValue });

    if (!startNode) {
      res.status(404).send('Node not found');
      return;
    }

    // Perform breadth-first search
    const queue = new Queue();
    const visited = new Set();
    queue.enqueue(startNode);

    while (!queue.isEmpty()) {
      const currentNode = queue.dequeue();

      if (!visited.has(currentNode)) {
        visited.add(currentNode);
        console.log(currentNode.value);

        if (currentNode.left) {
          queue.enqueue(currentNode.left);
        }

        if (currentNode.right) {
          queue.enqueue(currentNode.right);
        }
      }
    }

    res.status(200).send('BFS completed');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started');
});





