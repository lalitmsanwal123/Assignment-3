(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.controller('FoundItemsDirectiveController', FoundItemsDirectiveController)
.directive('foundItems', MenuFindDirective);


function MenuFindDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      found: '<',
      onRemove: '&'
    },
    controller: 'FoundItemsDirectiveController as list',
    bindToController: true
  };

  return ddo;
}

//Directive controller
function FoundItemsDirectiveController() {
    var list = this;

    list.isEmpty = function() {
      return list.found != undefined && list.found.length === 0;
    }
  }

//Parent controller
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
    var narrowCtrl = this;
    narrowCtrl.searchTerm = "";

    //search method
    narrowCtrl.search = function (){
      if(narrowCtrl.searchTerm === ""){
        narrowCtrl.found = [];
        return;
      }
      var promise = MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm);
      promise.then(function (response){
        narrowCtrl.found = response;
      });
    }

    //remove method
    narrowCtrl.removeItem = function(index){
      narrowCtrl.found.splice(index,1);
    };
}


//Menu Search Service
MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function(searchTerm){
  return $http({
    method: "GET",
    url: (ApiBasePath + "/menu_items.json")
  }).then(function (response){
    var allItems = response.data.menu_items;
    var foundItems = [];
    for(var i = 0; i < allItems.length; i++){
      if(allItems[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1){
        foundItems.push(allItems[i]);
      }
    }
    return foundItems;
  }).catch(function (error) {
      console.log(error);
      return [];
  });
}
}


})();
