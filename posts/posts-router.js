const express = require(`express`);

const Posts = require("../data/db.js")

const router = express.Router();

router.post('/', (req, res) => {
    const data = req.body;
    if(!data.title || !data.contents) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        });
    } else if (data.title && data.contents) {
    Posts.insert(req.body)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            console.log("Error inserting post to db", err);
            res.status(500).json({
                message: "error inserting the post"
            })

    })
    } else {
        res.status(500).json({
            message: "Error inserting the post"
        })
    }
});

router.post("/:id/comments", (req, res) => {
    const { id } = req.params;
    const commentInfo = { ...req.body, post_id: id };
  
    if (!id) {
      res.status(404).json({ 
          message: "The post with the specified ID does not exist." 
        });
    } else if (!req.body.text) {
      res
        .status(400)
        .json({
            errorMessage: "Please provide text for the comment." 
        });
    } else {
      Posts.insertComment(commentInfo)
        .then(comment => {
          res.status(201).json(comment);
        })
        .catch(error => {
          console.log("Error: ", error);
          res.status(500).json({
            error: "There was an error while saving the comment to the database"
          });
        });
    }
  });

router.get('/', (req, res) => {
    Posts.find()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        console.error("Error getting postst from DB...", err);
        res.status(500).json({
            error: "The posts information could not be retrieved."
        })
    })

});

router.get("/:id", (req, res) => {
    Posts.findById(req.params.id)
      .then(post => {
        if (post) {
          res.status(200).json(post);
        } else {
          res.status(404).json({ 
              message: "The post with the specified ID does not exist." 
            });
        }
      })
      .catch(error => {
        console.log("Error: ", error);
        res.status(500).json({
          message: "The post information could not be retrieved."
        });
      });
  });

router.get("/:id/comments", (req, res) => {
    const postId = req.params.id;
    Posts.findPostComments(postId)
      .then(post => {
        if (post.length === 0) {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        } else {
          res.status(200).json(post);
        }
      })
      .catch(error => {
        console.log("Error: ", error);
        res
          .status(500)
          .json({ error: "The comments information could not be retrieved." });
      });
  });

  router.delete("/:id", (request, response) => {
    const { id } = request.params;
    Posts.remove(id)
      .then(post => {
        if (!post) {
          response.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        } else {
          response.status(200).json(post);
        }
      })
      .catch(error => {
        console.log("Error: ", error);
        response
          .status(500)
          .json({ errorMessage: "The post could not be removed" });
      });
  });

module.exports = router