angular.module("contactsApp", ['ngRoute'])
    .config(function($routeProvider) {
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
            .when("/test", {
                    templateUrl: "quizlet.html",
                    controller: "FunkyController",
                    resolve: {
                        contacts: function(Contacts) {
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
            .when("/quiz", {
              templateUrl: "quizlet.html",
              controller: "HelloWorldController"

            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Contacts", function($http) {
        this.getContacts = function() {
            return $http.get("/contacts").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding contacts.");
                });
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
            var url = "/contacts/" + contactId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this contact.");
                    console.log(response);
                });
        }
    })
    .controller("ListController", function(contacts, $scope) {
        $scope.contacts = contacts.data;
    })
    .controller("FunkyController", function(contacts, $scope) {
        $scope.contacts = contacts.data;


        $scope.pieces = [
         {title:"tomb of the first emperor of qin",period:"qin dynasty",country:"china",material:"terra cotta",image:"1.jpg"},
         {title:"taotie mask",period:"western zhou dynasty",country:"china",material:"bronze",image:"2.jpg"},
         {title:"tripod wine vessel with design of zoomorphic masks",period:"shang dynasty",country:"china",material:"bronze",image:"3.png"},
         {title:"covered wine vessel with design of zoomorphic masks and animal headed handles",period:"western zhou dynasty",country:"china",material:"bronze",image:"4.jpg"}
        ];


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
    })
    .controller('HelloWorldController', function( $scope){

      // $scope.contacts = Contacts.getContacts();

       $scope.pieces = [
        {title:"tomb of the first emperor of qin",period:"qin dynasty",country:"china",material:"terra cotta",image:"1.jpg"},
        {title:"taotie mask",period:"western zhou dynasty",country:"china",material:"bronze",image:"2.jpg"},
        {title:"tripod wine vessel with design of zoomorphic masks",period:"shang dynasty",country:"china",material:"bronze",image:"3.png"},
        {title:"covered wine vessel with design of zoomorphic masks and animal headed handles",period:"western zhou dynasty",country:"china",material:"bronze",image:"4.jpg"},
        {title:"preface to the orchard pavilion", artist:"wang xizhi", period:"eastern jin dynasty", material:"ink on paper", country:"china", image:"5.jpg"},
        {title:"admonitions of the court instructress to palace ladies", artist:"gu kaizhi", period:"eastern jin dynasty", material:"ink on paper", country:"china",image:"6.jpg"},
        {title:"ashokan pillar at topra", period:"mauryan dynasty", material:"sandstone", country:"india",image:"7.jpg"},
        {title:"lion capital from ashokan column", period:"mauryan dynasty", material:"sandstone", country:"india",image:"8.jpg"},
        {title:"great stupa at sanchi", period:"sunga",material:"stone",country:"india",image:"9.jpg"},
        {title:"great departure from east gate of great stupa at sanchi", period:"sunga", material:"stone",country:"india",image:"10.jpg"},
        {title:"gandharan-style standing shakyamuni", period:"kushan empire", material:"stone", country:"india",image:"11.jpg"},
        {title:"guptan-style shakyamuni", period:"guptan empire", material:"stone", country:"india",image:"12.png"},
        {title:"ajanta cave 10", period:"sunga period",country:"india",image:"13.jpg"},
        {title:"avalokitesvara as padmapani", period:"guptan empire",country:"india",image:"14.jpg"},
        {title:"dunhuang cave 254",period:"northern wei dynasty",country:"china",image:"15.png"},
        {title:"colossal seated shakyamuni from yungang cave 20",period:"northern wei dynasty",country:"china",image:"16.png"},
        {title:"binyang central cave with shakyamuni",period:"northern wei dynasty",country:"china",image:"17.png"},
        {title:"i dont know this one"},
        {title:"longmen caves at luoyang",period:"tang dynasty",country:"china",image:"18.png"},
        {title:"mahavairocana",period:"tang dynasty",country:"china",image:"19.png"},
        {title:"guardian figures",period:"tang dynasty",country:"china",image:"20.png"},
        {title:"horyuji",material:"stone foundation and wooden building",period:"asuka period",country:"japan",image:"21.png"},
        {title:"shaka triad",material:"bronze",period:"asuka period", country:"japan",image:"22.png"},
        {title:"parinirvana from horyuji", period:"nara period", country:"japan",image:"23.png"},
        {title:"daibutsu from todaji", period:"nara period", country:"japan",material:"bronze",image:"24.png"},
        {title:"phoenix hall at byodo-in",period:"heian period",country:"japan",image:"25.png"},
        {title:"amida",artist:"jocho",period:"heian period",country:"japan",material:"gilt wood",image:"26.png"},
        {title:"muchaku and seshin", artist:"unkei", period:"kamakura period",country:"japan",material:"wood",image:"27.png"},
        {title:"kashiwagi scene from tale of genji scroll", period:"heian period", material:"ink and color on paper", country:"japan",image:"28.png"},
        {title:"minori scene from tale of genji scroll", period:"heian period", material:"ink and color on paper", country:"japan",image:"29.png"},
        {title:"opening sequence from ban dainagon ekotobo",period:"heian period",material:"ink and color on paper",country:"japan",image:"30.png"},
        {title:"the makato household from ban dainagon ekotoba",period:"heian period",material:"ink and color on paper",country:"japan",image:"31.png"},
        {title:"the chase scene from choju giga",period:"heian period",material:"ink and color on paper",country:"japan",image:"32.jpg"},
        {title:"frog priest from choju giga",period:"heian period",material:"ink and color on paper",country:"japan",image:"33.jpg"},
        {title:"shiva as destroy of the three cities of the demons",period:"chola dynasty",material:"sandstone",country:"india",image:"34.png"},
        {title:"shiva nataraja",period:"chola dynasty",material:"bronze",country:"india",image:"35.png"},
        {title:"kandarya mahadeva temple",period:"chandella empire",material:"sandstone",country:"india",image:"36.png"},
        {title:"seokguram",period:"untied silla kingdom",material:"sandstone",country:"india",image:"37.png"},
        {title:"seated buddha",period:"saliendra dynasty",country:"indonesia",image:"38.png"},
        {title:"borobudur",period:"saliendra dynasty",country:"indonesia",image:"39.jpg"},
        {title:"angkor wat",period:"khmer empire",country:"cambodia",image:"40.jpg"},
        {title:"churning the sea of milk",period:"khmer empire",country:"cambodia",image:"41.jpg"},
        {title:"bayon temple",period:"khmer empire",country:"cambodia",image:"42.jpg"}
       ];

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

    });
