const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {BlogPosts} = require('./models');

// we're going to add some recipes to Blogposts
// so there's some data to look at
BlogPosts.create(
  'Lorem Ipsum', "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ipsum nulla, laoreet eu nisl eu, maximus posuere ante. Nam vestibulum ex eget finibus rutrum. Fusce ultricies semper velit, vitae rutrum massa accumsan id. Vivamus mi nunc, convallis ut tellus eget, tristique venenatis est. Nulla in suscipit leo. Vivamus vel massa sem. Praesent vestibulum nulla nec nisi sagittis, in condimentum lacus blandit. Etiam posuere urna eu quam scelerisque rhoncus. Cras nulla erat, varius a ullamcorper id, auctor non nisi. Donec et iaculis dolor. Donec vel nisi posuere, mattis mi et, malesuada arcu. Nam vulputate, arcu sed ornare consectetur, lacus mauris finibus enim, at condimentum dui enim vel dui. Ut placerat interdum purus.", "Lorem Ipsum", "Dec. 2017");
BlogPosts.create(
  'Lorem Ipsum Jr', "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ipsum nulla, laoreet eu nisl eu, maximus posuere ante. Nam vestibulum ex eget finibus rutrum. Fusce ultricies semper velit, vitae rutrum massa accumsan id. Vivamus mi nunc, convallis ut tellus eget, tristique venenatis est. Nulla in suscipit leo. Vivamus vel massa sem. Praesent vestibulum nulla nec nisi sagittis, in condimentum lacus blandit. Etiam posuere urna eu quam scelerisque rhoncus. Cras nulla erat, varius a ullamcorper id, auctor non nisi. Donec et iaculis dolor. Donec vel nisi posuere, mattis mi et, malesuada arcu. Nam vulputate, arcu sed ornare consectetur, lacus mauris finibus enim, at condimentum dui enim vel dui. Ut placerat interdum purus.", "Lorem Ipsum Jr.", "Dec. 2017");

// send back JSON representation of all blogposts
// on GET requests to root
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});


// when new blogposts are added, ensure has required fields. if not,
// log error and return 400 status code with hepful message.
// if okay, add new item, and return it with a status 201.
router.post('/', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['title', 'content', 'author', 'pulishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).json(item);
});

// Delete recipes (by id)!
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post item \`${req.params.ID}\``);
  res.status(204).end();
});

// when PUT request comes in with updated blogposts, ensure has
// required fields. also ensure that blogpost id in url path, and
// blogpost id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `BlogPosts.updateItem` with updated recipe.
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'publishDate', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blogpost item \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).end();
})

module.exports = router;