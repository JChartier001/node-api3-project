const express = require('express');
const router = express.Router();
const users= require('./userDb.js');
const posts = require('../posts/postDb')

router.use(express.json());

router.post('/', validateUser, (req, res) => {
  // do your magic!
  const body = req.body;
  users.insert(body) 
  .then(user => {
    res.status(201).json(user);
  })
  .catch(error => {
    res.status(500).json({error: "There was an error while saving the user to the database" })
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const body = req.body;
  const {id} = req.params;
  
  users.getById(id)
  .then(user =>{
    posts.insert(body)    
    .then(post => {
      res.status(201).json(body);
    })
    .catch(error => {
      res.status(500).json({message: "Error creating new post"})
    })
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: "There was an error finding user"})
  })
});


router.get('/', (req, res) => {
  // do your magic!
  users.get()
  .then(users => {
    res.status(200).json(users);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: "There was an error retrieving users."})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  const {id} = req.params;  
  users.getById(id)
  .then(user => {
    res.status(200).json(user);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: "There was an error retrieving user."})
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  const {id} = req.params;
  users.getUserPosts(id)
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(error =>{
    console.log(error)
    res.status(500).json({message: "there was an error getting users posts"})
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  const {id} = req.params;
  users.remove(id)
  .then(removed =>{
    res.status(200).json(id)
  })
  .catch(error => {
    res.status(500).json({message: "There was an error deleting user"})
  })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // do your magic!
  const { id } = req.params;
  const changes = req.body;
  users.update(id, changes)                
  .then(post => {
          res.status(200).json(changes);
      })
  .catch(error => {
      console.log(error);
      res.status(500).json({error: 'The user information could not be retrieved'})
      })
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;  
  users.getById(id)  
    .then(user => {
      if(user){
      req.user = user;
      next();
    } else {
      res.status(400).json({message: "invalid user id"})
    }
  })
    .catch(error =>{
      res.status(500).json({message: "There was an error retrieving specified user"})
    })
  }



function validateUser(req, res, next) {  
    const body = req.body;
    const name = req.body.name;
    console.log(name)
    if(!body){
      res.status(400).json({message: "missing user data"})
    } else if(!name){
      res.status(400).json({message: 'missing required name field'})
    } else {
      next();
    }
  }


function validatePost(req, res, next) {
  const body = req.body;
    const text = req.body.text;
    if(!body){
      res.status(400).json({message: "missing post data"})
    } else if(!text){
      res.status(400).json({message: 'missing required text field'})
    } else {
      next();
    }
}

module.exports = router;
