const express = require('express');
const helmet = require('helmet');

const userRouter = require('./users/userRouter.js');
const postRouter = require('./posts/postRouter');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(logger);
server.use('/api/posts', postRouter);


server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`);
  next(); 
}

function validateUserId(id){
  return function(req, res, next){
    if(id && id === users.getById(id)){
      res.send(req.user);
      next();
    } else {
      res.status(400).json({message: "invalid user id"})
    }
  }
}

function validateUser(body){
  return function(req,res,next){
    const body = req.body;
    const name = req.params.name;
    if(!body){
      res.status(400).json({message: "missing user data"})
    } else if(!name){
      res.status(400).json({message: 'missing required name field'})
    } else {
      next();
    }
  }
}

// function validatePost(body){
//   return function(req,res,next){
//     const body = req.body;
//     const text = req.params.text;
//     if(!body){
//       res.status(400).json({message: "missing post data"})
//     } else if(!text){
//       res.status(400).json({message: 'missing required text field'})
//     } else {
//       next();
//     }
//   }
// }




module.exports = server;
