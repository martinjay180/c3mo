angular.module('controllers', []).

  /* Toolbar controller */
  controller('toolbar', function($scope, impressAPIservice, impressMediaService) {

  }).

  /* Live controller */
  controller('live', function($scope, impressAPIservice, impressMediaService) {

  }).

  /* Dashboard controller */
  controller('dashboard', function($scope, impressAPIservice, impressMediaService) {
    $scope.nameFilter = null;
    //$scope.items = [];
    $scope.searchFilter = function (item) {
        var re = new RegExp($scope.nameFilter, 'i');
        return !$scope.nameFilter || re.test(item.Title) || re.test(item.TagList);
    };
	
	$scope.FirstImage = function(item) {
		return impressMediaService.FirstImage(item);
	     }

    impressAPIservice.ItemsByType(6).success(function (response) {
        $scope.items = Object.keys(response).map(function(k) { return response[k] });;
    });
  });
