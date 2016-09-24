angular.module("contactsApp", ['ngRoute','angular-filepicker'])
    .config(function($routeProvider, filepickerProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    contacts: function(Contacts) {
                        return Contacts.getContacts();
                    }
                }
            })
            .when("/quiz", {
                    templateUrl: "quizlet.html",
                    controller: "FunkyController",
                    resolve: {
                        cards: function(Contacts) {
                            return Contacts.getContacts();
                        }
                    }
                })
            .when("/new/contact", {
                controller: "NewContactController",
                templateUrl: "contact-form.html"
            })
            .when("/contact/:contactId", {
                controller: "EditContactController",
                templateUrl: "contact.html"
            })
            .when("/quiz_other", {
              templateUrl: "quizlet.html",
              controller: "HelloWorldController"
            })
            .when("/changecards", {
              templateUrl: "changecards.html",
              controller: "ChangeCardsController",
              resolve: {
                  cards: function(Contacts) {

                      var crds = Contacts.getContacts();
                      console.log("we got cards " + crds);
                      console.log(crds);
                      return crds;
                  },
                  collections: function(Contacts) {

                      var col = Contacts.getCollections();
                      console.log("the collections are " + col);
                      return col;
                  }
              }
            })
            .when("/sets", {
              templateUrl: "sets.html",
              controller: "SetsController",
              resolve: {
                collections: function(Contacts) {

                    var col = Contacts.getCollections();
                    console.log("the collections are " + col);
                    return col;
                }
              }
            })
            .otherwise({
                redirectTo: "/quiz"
            })

            filepickerProvider.setKey("AWX9VlO2hTR2EWljLfbPoz");
    })
    .service("Contacts", function($http) {
        this.getContacts = function() {
            console.log("getting cards now");
            return $http.get("/contacts").
                then(function(response) {
                  console.log("found our cards");
                    return response;
                }, function(response) {
                    alert("Error finding contacts.");
                });

            console.log("end of getting cards function");
        }
        this.createContact = function(contact) {
            return $http.post("/contacts", contact).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating contact.");
                });
        }
        this.getContact = function(contactId) {
            var url = "/contacts/" + contactId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this contact.");
                });
        }
        this.editContact = function(contact) {
            var url = "/contacts/" + contact._id;
            console.log(contact._id);
            return $http.put(url, contact).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this contact.");
                    console.log(response);
                });
        }
        this.deleteContact = function(contactId) {
          console.log("beginning of delete contact");


            var url = "/contacts/" + contactId;
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
          console.log("were in the beginning of get collections");

          return $http.get("/sets").
            then(function(response) {
              console.log('end of get collections');
              console.log(response);
              return response;
            }, function(response) {
                alert("Error finding collections!!.");
            });

            console.log("will this ever trigger?");
        }
        this.addCollection = function(collectionName) {
          console.log("beginning of add collection");
          var url = "/sets/" + collectionName;
          return $http.put(url).
            then(function(response) {
              console.log(response);
            });

        }
        this.barf = function()
        {
            console.log("why am i here");
        }
    })
    .controller("ListController", function(contacts, $scope) {
        $scope.contacts = contacts.data;
    })
    .controller("FunkyController", function(cards, $scope) {


        $scope.pieces = cards.data;
        $scope.origPieces = $scope.pieces;

        var a = Math.floor( Math.random()* $scope.pieces.length);

        $scope.quizMode = true;

        $scope.originalLength = $scope.pieces.length;
        $scope.current = $scope.pieces[a];
        $scope.currentIndex= a;

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
    .controller("NewContactController", function($scope, $location, Contacts) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveContact = function(contact) {
            Contacts.createContact(contact).then(function(doc) {
                var contactUrl = "/contact/" + doc.data._id;
                $location.path(contactUrl);
            }, function(response) {
                alert(response);
            });
        }
    })
    .controller("SetsController", function(collections, $scope) {
        $scope.dupp = "lupp";

    })
    .controller("ChangeCardsController", function(cards, collections, $scope, $routeParams, $route, Contacts) {
      console.log("beginning of change cards controller");

      $scope.pieces = cards.data;
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



      $scope.deleteContact = function(contactId) {
          console.log("delete contact function");
          Contacts.deleteContact(contactId);
          console.log("back here");
          $route.reload();
      }

      $scope.editContact = function(contactId)
      {
        if($scope.edited == contactId)
        {
          console.log("the thing to be edited " + $scope.pieces[contactId]._id);
          Contacts.editContact($scope.pieces[contactId]);
          $scope.edited = -1;
        }
        else
        {
          $scope.edited = contactId;
        }
      }

      $scope.addContact = function()
      {
        $scope.adding = true;
      }
      $scope.addContactDone = function()
      {

        Contacts.createContact($scope.toAdd).then(function(doc) {
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
      $scope.testNewCollection = function(name)
      {
        Contacts.addCollection(name);

      }

    })
    .controller("EditContactController", function($scope, $routeParams, Contacts) {
        Contacts.getContact($routeParams.contactId).then(function(doc) {
            $scope.contact = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.contactFormUrl = "contact-form.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        }

        $scope.saveContact = function(contact) {
            Contacts.editContact(contact);
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        }

        $scope.deleteContact = function(contactId) {
            Contacts.deleteContact(contactId);
        }
    });
