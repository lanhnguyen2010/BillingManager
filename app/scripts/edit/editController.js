'use strict';

angular.module('app')
    .controller('editController', ['goodsService', '$q', '$mdDialog', 'ngTableParams',
        function(goodsService, $q, $mdDialog, ngTableParams) {
            var self = this;
            self.searchClicked = false;
            self.searchItem = searchItem;
            self.showDialog = showDialog;
            self.showAddDialog = showAddDialog;
            self.delete = deleteGoods;
            self.criteria = {
                id: '',
                name: '',
                producer: '',
                price: ''
            }
            self.searchResult = [];
            self.updateGoods;
            self.tableParams = new ngTableParams({
                count: 10
            }, {
                counts: [],
                getData: function($defer) {
                    $defer.resolve(self.searchResult);
                }
            });

            function searchItem() {

                goodsService.searchGoods(self.criteria).then(function(goods) {
                    self.searchResult = [].concat(goods);
                    self.tableParams.reload();
                    self.searchClicked = true;
                });


                console.log("result" + self.searchResult)

            }

            function deleteGoods(goods, index) {
            	var name = goods.name;
                if (confirm("Are you sure to delete " + goods.name)) {
                    goodsService.delete(goods.id).then(function(id) {
                        self.searchResult.splice(index, 1);

                        alert('Deleted ' + goods.name);
                        self.tableParams.reload();
                    })


                }
            }

            function showDialog($event, goods) {
                self.updateGoods = goods;
                var parentEl = angular.element(document.body);
                $mdDialog.show({
                    parent: parentEl,
                    targetEvent: $event,
                    templateUrl: './scripts/edit/update.html',
                    controller: DialogController,
                    locals: {
                        updateGoods: self.updateGoods,
                        isUpdate: true
                    }
                });


            }

            function DialogController($scope, $mdDialog, updateGoods, isUpdate) {
                $scope.updateGoods = updateGoods;
                $scope.isUpdate = isUpdate;
                $scope.update = function() {
                    goodsService.update($scope.updateGoods).then(function(goods) {
                        $mdDialog.hide(alert, "finished");
                    });
                }
            }

            function showAddDialog($event) {
                var parentEl = angular.element(document.body);
                $mdDialog.show({
                    parent: parentEl,
                    targetEvent: $event,
                    templateUrl: './scripts/edit/update.html',
                    controller: AddController,
                    locals: {
                        isUpdate: false
                    }
                });


            }

            function AddController($scope, $mdDialog, isUpdate) {
                $scope.isUpdate = isUpdate;
                $scope.updateGoods = {
                    id: '',
                    name: '',
                    producer: '',
                    unit: '',
                    weight: '',
                    price: ''

                }
                $scope.update = function() {
                    if ($scope.updateGoods.id != '') {
                        console.log("insertID " + $scope.updateGoods.id)
                        goodsService.createGoods($scope.updateGoods).then(function(goods) {
                            $mdDialog.hide(alert, "finished");

                        }, function(error) {
                            alert(error);
                        });

                    } else {
                        alert("Goods ID is empty");
                    }
                }

            }



        }
    ]);
