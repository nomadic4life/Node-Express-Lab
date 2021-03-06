// import your node modules
const express = require('express');

const db = require('./data/db.js');

// add your server code starting here
const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send('hello developer, welcome to my world');
});

server.get('/api/posts', (req, res) => {

  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => res.status(500).json({error: "The Posts information could not be retrieved."}))

});

server.get('/api/posts/:id', (req, res) => {

  const id = req.params.id;
  db.findById(id)
    .then(post => {

      if(post.length) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message: "The post with the specified ID does not exist."});
      }
      
    })
    .catch(err => res.status(500).json({ error: "The post information could not be retrieved." }))
});

server.post('/api/posts', (req, res) => {
  const {title, contents} = req.body;

  if(title && contents) {
    db.insert({title, contents})
      .then(id => {
        
        const post_id = id.id;

        db.findById(post_id)
          .then(post => {
            res.status(201).json({ url: '/api/posts', operation: 'POST', post });
          })
          .catch(err => res.status(400).json({errorMessage: "findById search failed"}))

      })
      .catch(err => res.status(500).json({error: "There was an error while saving the post to the database "}))

  } else {
    res.status(400).json({errorMessage:  "Please provide title and contents for the post." });
  };

});

server.delete('/api/posts/:id', (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(post => {
      db.remove(id)
        .then(item => {
          console.log(item)
          if(item){
            res.status(200).json(post);
          } else res.status(404).json({message: "The post with the specified ID does not exist."})
        })
    })
    .catch(err => res.status(500).json({error: "The post could not be removed"}))
});

server.put('/api/posts/:id', (req, res) => {
  const id = req.params.id;
  const {title, contents} = req.body;

  if(title && contents) {
    db.update(id, {title, contents})
    .then(post => {
      if(post) {
        db.findById(id)
          .then(post => {
              res.status(200).json({url: `/api/posts/${id}`, operation: `PUT for posts with id ${id}`, post});
            })
        } else {
          res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
      })
      .catch(err => res.status(500).json({ error: "The post information could not be modified." }))
  } else {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
  }

});

server.listen(8000, () => console.log('Server running, listening on port 8000'));