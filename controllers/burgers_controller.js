
// Node Dependencies
// ----------------------------------------------------
var express = require("express");
var router = express.Router();

var models = require('../models'); // Pulls out the Burger Models


// Extracts the sequelize connection from the models object
var sequelizeConnection = models.sequelize;

// Sync the tables
sequelizeConnection.sync();


// Routes
// ----------------------------------------------------

// get route -> index
router.get("/", function(req, res) {
  res.redirect("/burgers");
});

// get route -> index
// Index Page
router.get("/burgers", function(req, res) {
  // Sequelize Query to get all burgers from database (and join them to their devourers, if applicable)
  models.burger.findAll({
   include: [{model: models.devourers}]
  }).then(function(data){
    // Wrapping the array of returned burgers in a object so it can be referenced inside our handlebars
    var hbsObject = { burger: data };
    res.render("index", hbsObject);
  });
});

// post route -> back to index
// Create Burger
router.post("/burgers/create", function(req, res) {
  // Sequelize Query to add new burger to database
  models.burger.create(
    {
      burger_name: req.body.burger_name,
      devoured: false
    }
  ).then(function(){
    // After the burger is added to the database, refresh the page
    res.redirect('/burgers');
  });
});

// // put route -> back to index
// router.put("/burgers/update", function(req, res) {
//   burger.update(req.body.burger_id, function(result) {
//     // wrapper for orm.js that using MySQL update callback will return a log to console,
//     // render back to index with handle
//     console.log(result);
//     res.redirect("/");
//   });
// });

// Eat a Burger
router.post('/burger/eat/:id', function (req, res) {

  // If not name was added, make it "Anonymous"
  if(req.body.burgerEater == "" || req.body.burgerEater == null){
    req.body.burgerEater = "Anonymous";
  }

  // Create a new burger devourer (and also associate it to the eaten burger's id)
  models.devourers.create({
    devourer_name: req.body.burgerEater,
    burgerId: req.params.id
  })

  // Then, select the eaten burger by it's id
  .then(function(newDevourer){

    models.burger.findOne( {where: {id: req.params.id} } )

    // Then, use the returned burger object to...
    .then(function(eatenBurger){
      // ... Update the burger's status to devoured
      eatenBurger.update({
        devoured: true,
      })

      // Then, the burger is devoured, so refresh the page
      .then(function(){
        res.redirect('/index');
      });
    });
  });
});

module.exports = router;
