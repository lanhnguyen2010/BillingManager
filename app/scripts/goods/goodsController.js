(function() {
    'use strict';
    var util = require("gulp-util");

    util.log("sadsda");
    angular.module('app')
        .controller('goodsController', ['goodsService', '$q','$scope', '$mdDialog','ngTableParams', GoodsController]);

    function GoodsController(goodsService, $q, $mdDialog,$scope, ngTableParams) {

        var self = this;

        self.goods = [];
        self.viewAll = viewAll;
        self.isViewAllClicked = false;
        self.edit = edit;
        self.isEdit = false;
        self.goodsID = null;
        self.addItem = addItem;
        self.soldGoods = [];
        self.total = 0;
        self.quality = null;
        self.removeRow = removeRow;

        getAllGoods();

        function getAllGoods() {
            goodsService.getGoods().then(function(goods) {
                self.goods = [].concat(goods);
            });
        }

        function viewAll() {
            self.isViewAllClicked = true;
        }

        function edit() {
            self.isViewAllClicked = false;
        }

        function addItem() {
            goodsService.getById(self.goodsID).then(function(goods) {
                goods[0].quality = self.quality;
                goods[0].cost = parseInt(goods[0].price) * self.quality;
                self.soldGoods = self.soldGoods.concat(goods);
                self.total += goods[0].cost;
                util.log(self.total);
                self.tableParams.reload();

            });

        }

        self.tableParams = new ngTableParams({
            count:10
        },{
            counts:[],
            getData: function($defer){
                util.log("reload");
                $defer.resolve(self.soldGoods);
            }
        });

        function removeRow(index){
            util.log(index);
            self.total -= self.soldGoods[index].cost;
            self.soldGoods.splice(index,1);
            util.log("lent"+self.soldGoods.length);
            self.tableParams.reload();

        }

    };

})();