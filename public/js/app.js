angular.module("QuizParty", ['ngRoute','angular-filepicker'])
    .config(function($routeProvider, filepickerProvider) {
        $routeProvider
            .when("/quiz/:set", {
                    templateUrl: "quizlet.html",
                    controller: "FunkyController",
                    resolve: {
                        cards: function(Cards) {
                            return Cards.getCards("cards");
                        }
                    }
                })

            .when("/changecards/:set", {
              templateUrl: "changecards.html",
              controller: "ChangeCardsController",
              resolve: {
                  cards: function(Cards) {

                      var crds = Cards.getCards("cards");
                      console.log("we got cards " + crds);
                      console.log(crds);
                      return crds;
                  },
                  collections: function(Cards) {

                      var col = Cards.getCollections();
                      console.log("the collections are " + col);
                      return col;
                  }
              }
            })
            .when("/sets", {
              templateUrl: "sets.html",
              controller: "SetsController",
              resolve: {
                collections: function(Cards) {

                    var col = Cards.getCollections();
                    console.log("the collections are " + col);
                    return col;
                }
              }
            })
            .otherwise({
                redirectTo: "/sets"
            })

            filepickerProvider.setKey("AWX9VlO2hTR2EWljLfbPoz");
    })
    .service("Cards", function($http) {
        this.getCards = function(setName) {
            console.log("getting cards now");
            return $http.get("/collection/"+setName).
                then(function(response) {
                  console.log("found our cards");
                    return response;
                }, function(response) {
                    alert("Error finding contacts.");
                });

            console.log("end of getting cards function");
        }
        this.createCard = function(set,contact) {
            return $http.post("/contacts/"+set, contact).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating contact.");
                });
        }
        this.getCard = function(set,contactId) {
            var url = "/contacts/" + set + "/" + contactId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this contact.");
                });
        }
        this.editCard = function(set,contact) {
            var url = "/contacts/" + set + "/" + contact._id;
            console.log(contact._id);
            return $http.put(url, contact).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this contact.");
                    console.log(response);
                });
        }
        this.deleteCard = function(set,contactId) {


            var url = "/contacts/" + set + "/" + contactId;
            return $http.delete(url).
                then(function(response) {
                    //console.log("response" + EntityUtils.toString(response.getEntity()));
                    return response;
                }, function(response) {
                    alert("Error deleting this contact.");
                    console.log(response);
                });


        }
        this.getCollections = function(){

          return $http.get("/sets").
            then(function(response) {
              console.log('end of get collections');
              console.log(response);
              return response;
            }, function(response) {
                alert("Error finding collections!!.");
            });

        }
        this.addCollection = function(collectionName) {
          console.log("beginning of add collection");
          var url = "/sets/" + collectionName;
          return $http.put(url).
            then(function(response) {
              console.log(response);
            });

        }
    })
    .controller("FunkyController", function(cards, $scope, $routeParams, Cards) {

        $scope.set = $routeParams.set;

        Cards.getCards($routeParams.set).then(function(doc) {
          console.log("we here boy");
            $scope.pieces = doc.data;

            $scope.origPieces = $scope.pieces;

            var a = Math.floor( Math.random()* $scope.pieces.length);

            $scope.quizMode = true;

            $scope.originalLength = $scope.pieces.length;
            $scope.current = $scope.pieces[a];
            $scope.currentIndex= a;

        }, function(response) {
            alert(response);
        });


        $scope.next = function(){
            var a = Math.floor( Math.random()* $scope.pieces.length);
            $scope.current = $scope.pieces[a];
            $scope.currentIndex = a;
            $scope.phaseOne = false;
        };

        $scope.submitGuess = function(){
             $scope.phaseOne = true;
             $scope.correct = []
             $scope.correct[0] = ($scope.guess.title == $scope.current.title);
             $scope.correct[1] = ($scope.guess.artist == $scope.current.artist);
             $scope.correct[2] = ($scope.guess.country == $scope.current.country);
             $scope.correct[3] = ($scope.guess.period == $scope.current.period);
             $scope.correct[4] = ($scope.guess.material == $scope.current.material);

             $scope.allCorrect = ($scope.correct[0] || !$scope.current.title) &&
               ($scope.correct[1] || !$scope.current.artist) &&
               ($scope.correct[2] || !$scope.current.country) &&
               ($scope.correct[3] || !$scope.current.period) &&
               ($scope.correct[4] || !$scope.current.material);


        }

        $scope.right = function(){
             $scope.pieces.splice($scope.currentIndex, 1);

            var a = Math.floor( Math.random()* $scope.pieces.length);
            $scope.current = $scope.pieces[a];
             $scope.currentIndex = a;
            $scope.phaseOne = false;
            $scope.guess = [];
        }

        $scope.wrong = function(){
            var a = Math.floor( Math.random()* $scope.pieces.length);
            $scope.current = $scope.pieces[a];
             $scope.currentIndex = a;
            $scope.phaseOne = false;
            $scope.guess = [];
        }

    })
    .controller("SetsController", function(collections, $scope, Cards) {

        $scope.collectionNamesRaw = collections;

        console.log("collections names raw " + collections);

        console.log($scope.collectionNamesRaw);
        $scope.collectionNames = [];
        for(var i = 0; i < $scope.collectionNamesRaw.data.length; i++)
        {
          $scope.collectionNames[i] = $scope.collectionNamesRaw.data[i].name;

        }
        console.log(  $scope.collectionNames);

        $scope.newCollection = function(name)
        {
          console.log("bginning new collection");
          Cards.addCollection(name);

        }

    })
    .controller("ChangeCardsController", function(cards, collections, $scope, $routeParams, $route, Cards) {
      console.log("change cards controller");
      console.log( $routeParams.set);

      $scope.set = $routeParams.set;
      $scope.toAdd = {};

      Cards.getCards($routeParams.set).then(function(doc) {
        console.log("we here boy");
          $scope.pieces = doc.data;
      }, function(response) {
          alert(response);
      });


//     $scope.pieces = cards.data;
      $scope.edited = -1;


      $scope.collectionNamesRaw = collections;//Contacts.getCollections();
      console.log("collections names raw " + collections);

      console.log($scope.collectionNamesRaw);
      $scope.collectionNames = [];
      for(var i = 0; i < $scope.collectionNamesRaw.data.length; i++)
      {
        $scope.collectionNames[i] = $scope.collectionNamesRaw.data[i].name;

      }
      console.log(  $scope.collectionNames);



      $scope.deleteCard = function( contactId) {
          console.log("delete contact function");
          Cards.deleteCard($scope.set,contactId).then(function(doc){
            console.log("here");
            $route.reload();
            console.log("after");

          });
      }

      $scope.editCard = function(cardId)
      {
        if($scope.edited == cardId)
        {
          console.log("the thing to be edited " + $scope.pieces[cardId]._id);
          Cards.editCard($scope.set,$scope.pieces[cardId]);
          $scope.edited = -1;
        }
        else
        {
          $scope.edited = contactId;
        }
      }

      $scope.addCard = function()
      {
        $scope.adding = true;
      }
      $scope.addCardDone = function()
      {

        Cards.createCard($scope.set,$scope.toAdd).then(function(doc) {
            //var contactUrl = "/contact/" + doc.data._id;
          //  $location.path(contactUrl);
          $route.reload();
        }, function(response) {
            alert(response);
        });

      }
      $scope.imageToEdit = function(whatever)
      {
        $scope.pieces[$scope.edited].image = whatever.url;
        $scope.$apply();

      }
      $scope.imageToAdd = function(whatever)
      {
        $scope.toAdd.image = whatever.url;
        $scope.$apply();

      }


    });
