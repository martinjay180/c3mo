angular.module('impress.services', []).
  factory('impressAPIservice', function($http) {

    var impressAPI = {};
    
    impressAPI.InsertItem = function(formData){
        return $http({
            method: 'POST',
            data: $.param(formData),
            url: 'http://10.10.0.177:81/Item/Api.aspx?action=InsertItem&id=1',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        });
    }

    impressAPI.ItemById = function(id) {
      return $http({
        method: 'GET',
		  cache: false,
        url: 'http://impress.staging2.clevermethod.com/cm/cms/Item/Api.aspx?action=ItemById&id=' + id
      });
    }
	
    impressAPI.ItemsByType = function(id) {
      return $http({
        method: 'GET', 
		  cache: false,
        url: 'http://impress.staging2.clevermethod.com/cm/cms/Item/Api.aspx?action=ItemsByType&id=' + id
      });
    }
	
    impressAPI.ItemCollection = function(ids) {
      return $http({
        method: 'GET', 
        cache: false,
        url: 'http://impress.staging2.clevermethod.com/cm/cms/Item/Api.aspx?action=ItemCollection&id=' + ids
      });
    }		
	
    return impressAPI;
  }).
  factory('impressMediaService', function () {
        return {
            FirstImage: function (item) {
				for(var i = 0; i<=item.Media.length; i++){
					var media = item.Media[i];
					if(media.MediaTypeId == 1000){
						return media;
					}
				}
            }
        }
	});