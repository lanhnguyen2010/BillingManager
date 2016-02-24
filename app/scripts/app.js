'use strict';

var _templateBase = './scripts';

var app = angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate',
        'ngTable'
    ])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: _templateBase + '/goods/goods.html',
            controller: 'goodsController',
            controllerAs: '_ctrl'
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }]);

app.directive("editGoodsDirective", function() {
    return {
        templateUrl: _templateBase + '/edit/edit.html',
        controller: 'editController',
        controllerAs: '_editCtrl'
    };
});
