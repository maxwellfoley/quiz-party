var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});


// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/collection/:id", function(req, res) {
  db.collection(req.params.id).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get cards.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/cards/:set", function(req, res) {
  var newCard = req.body;
  newCard.createDate = new Date();


  db.collection(req.params.set).insertOne(newCard, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new card.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});



app.get("/cards/:set/:id", function(req, res) {
  db.collection(req.params.set).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get card");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get("/sets/", function(req,res) {

  db.listCollections().toArray(function(err, collections) {
        if (err) {
          handleError(res, err.message, "Failed to get list of collections.");
        } else {
          res.status(200).json(collections);
        }
      });

});

app.put("/sets/:id", function(req, res) {
  db.createCollection(req.params.id, function(err,result) {
    if (err) {
      handleError(res, err.message, "Failed to place collection");
    } else {
      res.status(204).end();
    }

  });
  /*
  if (err)
  {
    handleError(res, err.message, "Could not create new collection");

  }*/
});

app.put("/cards/:set/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(req.params.set).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update card");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/cards/:set/:id", function(req, res) {
  db.collection(req.params.set).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      console.log("error in deletion");
      handleError(res, err.message, "Failed to delete card");
    } else {
      console.log("no error");
      res.status(204).end();
    }
  });
});
