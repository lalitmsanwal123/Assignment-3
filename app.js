(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService',MenuSearchService)

    //Injecting Service to ToBuyController controller
    NarrowItDownController.$inject = ['MenuSearchService','$filter'];
    function NarrowItDownController(MenuSearchService,$filter) {
      var NIDCtrl = this;
      NIDCtrl.SearchList =[];
      NIDCtrl.RemoveItem = function (index) {
        NIDCtrl.SearchList.splice(index, 1);
      }

      NIDCtrl.FindItem = function (searchTerm) {
        var promise = MenuSearchService.getMatchedMenuItems();
        promise.then(function (response) {
          NIDCtrl.SearchList = response.data.menu_items;
          var filteredlist = $filter('filter')(NIDCtrl.SearchList, { description: searchTerm });
          NIDCtrl.SearchList = filteredlist;
        })
        .catch(function (error) {
          // catch block code
        })
      }
    }

    ///ShoppingListService service
    MenuSearchService.$inject=['$http'];
    function MenuSearchService($http) {
      var service = this;
      //method adds item to array
      service.getMatchedMenuItems =function () {
        //Service will make ajax call using http
        var response = $http({
          method: "GET",
          url   : ('https://davids-restaurant.herokuapp.com/menu_items.json')
        });

        return response;
     };
    }


})();
