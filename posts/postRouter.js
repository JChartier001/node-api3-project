const express = require('express');

const router = express.Router();
const posts = require('./postDb.js');

router.use(express.json());


router.get('/posts', (req, res) => {
  // do your magic!
  posts.get(req.query)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error => {
        res.status(500).json({errorMessage: "Error in retrieving posts."})
    })
  
});

  router.get('/posts/:id', validatePostId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  posts.getById(id)
    .then(post => {
      console.log(post)
      res.status(200).json(post);
      })
    .catch(error => {
       console.log(error);
       res.status(500).json({error: 'The comments information could not be retrieved'})
          })
       
});

router.delete('/posts/:id', validatePostId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  console.log(id)  
    posts.remove(id)
      .then(deleted => {
        console.log(posts)
        res.status(200).json(id);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({error: 'The comments information could not be retrieved'});
      })
});

router.put('/posts/:id', validatePostId, validatePost, (req, res) => {
  // do your magic!
  const { id } = req.params;
  const changes = req.body;
  posts.update(id, changes)                
  .then(post => {
          res.status(200).json(changes);
      })
  .catch(error => {
      console.log(error);
      res.status(500).json({error: 'The comments information could not be retrieved'})
      })
});

// custom middleware

function validatePostId(req, res, next) {
 
  const postId = req.params.id;
  const { id } = req.params;
  posts.getById(id)
  .then(post => {
    if(post){
      next();
    } else {
      res.status(404).json({error: 'The post with the specified ID does not exist.'});
    }
  })  
}

function validatePost(req,res,next){
  // return function(req,res,next){
    
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
// }


module.exports = router;
