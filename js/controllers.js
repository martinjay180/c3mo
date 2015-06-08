angular.module('controllers', []).

  /* Toolbar controller */
  controller('toolbar', function($scope, impressAPIservice, impressMediaService) {

  }).

  /* Live controller */
  controller('live', function($scope, impressAPIservice, impressMediaService, $routeParams) {
    
    $scope.addNewNote = function(){
        var data = new Object();
        data.type = "6495c5dd-1903-4f2b-8484-081cc8b69951";
        data.Name = $scope.newNote
        data.Description = "This is my note!";
        data.ReferringItemId = $scope.meeting.Id;
        data.ReferringFieldId = 23100;
        console.log(data);
        impressAPIservice.InsertItem(data).success(function(response){
            console.log(response);
            $scope.newNote = "";
        });        
    }
    
    impressAPIservice.ItemById($routeParams.meeting_id).success(function (response) {
        $scope.meeting = response;
        console.log($scope.meeting);
    });
  }).

  /* Live controller */
  controller('meetings', function($scope, impressAPIservice, impressMediaService) {
    impressAPIservice.ItemsByType(12025).success(function (response) {
        $scope.meetings = Object.keys(response).map(function(k) { return response[k] });;
    });
  }).

  /* Dashboard controller */
  controller('dashboard', function($scope, impressAPIservice, impressMediaService, $routeParams, $timeout) {
    
    var notePromise;

    $scope.$on('$destroy', function(){
        $timeout.cancel(notePromise);
    });
    
    //get all the notes every few seconds
    $scope.getNotes = function(){
        impressAPIservice.ItemCollection($scope.meeting["Meeting Notes"]).success(function(response) {
            console.log(response);
            $scope.notes = Object.keys(response).map(function(k) { return response[k]; });   
            notePromise = $timeout($scope.getNotes, 2000);
        });
        
    }
    // Meeting
    impressAPIservice.ItemById($routeParams.meeting_id).success(function (response) {
        $scope.meeting = response;

        // Attendees
        impressAPIservice.ItemCollection($scope.meeting.Attendees).success(function(response) {
            $scope.attendees = Object.keys(response).map(function(k) { return response[k]; });
        });
        
        // Location
        impressAPIservice.ItemById($scope.meeting.Location).success(function(response) {
            $scope.location = response;    
        });
        
        // set interval for getting Notes
         notePromise = $timeout($scope.getNotes, 2000);
        
        
    });
  });