angular.module('controllers', []).

  /* Toolbar controller */
  controller('toolbar', function($scope, impressAPIservice, impressMediaService) {

  }).

  /* Live controller */
  controller('live', function($scope, impressAPIservice, impressMediaService, $routeParams) {
    impressAPIservice.ItemById($routeParams.meeting_id).success(function (response) {
        $scope.meeting = response;
        console.log($scope.meeting);
    });
  }).

  /* Live controller */
  controller('meetings', function($scope, impressAPIservice, impressMediaService) {
    impressAPIservice.ItemsByType(12025).success(function (response) {
        console.log(response);
        $scope.meetings = Object.keys(response).map(function(k) { return response[k] });;
    });
  }).

  /* Dashboard controller */
  controller('dashboard', function($scope, impressAPIservice, impressMediaService, $routeParams) {
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
    });
  });