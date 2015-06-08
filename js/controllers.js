angular.module('controllers', []).

  /* Toolbar controller */
  controller('toolbar', function($scope, impressAPIservice, impressMediaService) {

  }).

  /* Live controller */
  controller('live', function($scope, impressAPIservice, impressMediaService, $routeParams) {
    
    $scope.addingNote = false;
    $scope.addingQuestion = false;
    
    $scope.addNewNote = function(){
        var data = new Object();
        data.type = "6495c5dd-1903-4f2b-8484-081cc8b69951";
        data.Name = $scope.newNote
        data.Description = "This is my note!";
        data.ReferringItemId = $scope.meeting.Id;
        data.ReferringFieldId = 23100;
        console.log(data);
        $scope.addingNote = true;
        impressAPIservice.InsertItem(data).success(function(response){
            $scope.addingNote = false;
            console.log(response);
            $scope.newNote = "";
        });        
    }
    
    $scope.addNewQuestion = function(){
        var data = new Object();
        data.type = "6F78342F-F38D-4A0D-AE45-0700398B8FA9";
        data.Name = $scope.newQuestion
        data.Description = "This is my question!";
        data.ReferringItemId = $scope.meeting.Id;
        data.ReferringFieldId = 23102;
        console.log(data);
        $scope.addingQuestion = true;
        impressAPIservice.InsertItem(data).success(function(response){
            console.log(response);
            $scope.newQuestion = "";
            $scope.addingQuestion = false;
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
    
    var notePromise, meetingPromise, questionPromise;

    $scope.$on('$destroy', function(){
        $timeout.cancel(notePromise);
        $timeout.cancel(meetingPromise);
        $timeout.cancel(questionPromise);
    });
    
    //get all the notes every few seconds
    $scope.getNotes = function(){
        impressAPIservice.ItemCollection($scope.meeting["Meeting Notes"]).success(function(response) {
            console.log(response);
            $scope.notes = Object.keys(response).map(function(k) { return response[k]; });   
            notePromise = $timeout($scope.getNotes, 2000);
        });
        
    }
    
    $scope.getQuestions = function(){
        impressAPIservice.ItemCollection($scope.meeting["Meeting Questions"]).success(function(response) {
            console.log(response);
            $scope.questions = Object.keys(response).map(function(k) { return response[k]; });   
            questionPromise = $timeout($scope.getQuestions, 2000);
        });
        
    }
    
    $scope.getMeeting = function(){
        impressAPIservice.ItemById($routeParams.meeting_id).success(function (response) {
            $scope.meeting = response;
            meetingPromise = $timeout($scope.getMeeting, 2000);
        });
    }
    
    // Meeting
    impressAPIservice.ItemById($routeParams.meeting_id).success(function (response) {
        $scope.meeting = response;
        
        // Elapsed time
        var elapsedTimePromise;
        var meetingStart = moment();
        var countdown = function() {
            var diff = moment.duration(moment().diff(meetingStart));
            $scope.elapsedTime = s.lpad(diff.hours(), 2, '0') + ':' + s.lpad(diff.minutes(), 2, '0') + ':' + s.lpad(diff.seconds(), 2, '0');
            elapsedTimePromise = $timeout(countdown, 1000); 
        };
        countdown();
        // Scope destroy cleanup

        // Attendees
        impressAPIservice.ItemCollection($scope.meeting.Attendees).success(function(response) {
            $scope.attendees = Object.keys(response).map(function(k, index) { 
                var responseAttendee = response[k];
                return new function() {
                    this.firstName = responseAttendee['First Name'];
                    this.lastName = responseAttendee['Last Name'];
                    this.fullName = this.firstName + ' ' + this.lastName;
                    this.email = responseAttendee['Email'];
                    this.icon = 'http://lorempixel.com/50/50/people?' + index;
                };
            });
        });
        
        // Location
        impressAPIservice.ItemById($scope.meeting.Location).success(function(response) {
            $scope.location = response;    
        });
        
        // set interval for getting Notes
        meetingPromise = $timeout($scope.getMeeting, 2000);
        notePromise = $timeout($scope.getNotes, 2000);
        questionPromise = $timeout($scope.getQuestions, 2000);
        
        
    });
  });