(function() {
    'use strict';
    var pg = require('pg');
    var util = require("gulp-util");
    var connectionString = "postgres://billing:billing@localhost/billing";
    //var connection = pg.connect(connectionString);

    angular.module('app')
        .service('goodsService', ['$q', GoodsService]);

    function GoodsService($q) {
        return {
            getGoods: getGoods,
            getById: getGoodsById,
            getByName: getGoodsByName,
            createGoods: createGoods,
            searchGoods: searchGoods,
            delete: deleteGoods,
            update: updateGoods
        };

        function getGoods() {
            var deferred = $q.defer();
            var result = [];
            var queryAll = "SELECT * FROM goods ORDER BY id ASC";
            doQuery(deferred, queryAll, null);
            return deferred.promise;
        }

        function getGoodsById(ID) {
            var deferred = $q.defer();

            var queryOne = 'SELECT * FROM goods WHERE id=($1)';
            doQuery(deferred, queryOne, [ID])
            return deferred.promise;

        }

        function getGoodsByName(name) {
            var deferred = $q.defer();
            var queryName = 'SELECT * FROM goods WHERE name=($1)';

            doQuery(deferred, queryName, [name]);
            return deferred.promise;

        }

        function doQuery(deferred, queryString, params) {
            var result = [];
            pg.connect(connectionString, function(err, client, done) {
                if (err) {
                    done();
                    deferred.reject(err);
                }
                var query = client.query(queryString, params);
                query.on('row', function(row) {
                    result.push(row);

                });

                query.on("end", function() {
                    done();
                    deferred.resolve(result);
                })

            });
        }


        function createGoods(goods) {
            var sub = this;

            var deferred = $q.defer();
            sub.search = [];
            sub.insertGoods = goods;
            getGoodsById(goods.id).then(function(goods) {
                sub.search = [].concat(goods);
                if (sub.search.length <= 0) {
                    var queryCreate = "INSERT INTO goods(id, name, producer, unit, weight, price) values($1, $2, $3, $4, $5, $6)";
                    doQuery(deferred, queryCreate, [sub.insertGoods.id,
                        sub.insertGoods.name,
                        sub.insertGoods.producer,
                        sub.insertGoods.unit,
                        sub.insertGoods.weight,
                        sub.insertGoods.price
                    ]);

                } else {
                    deferred.reject("Duplicate Goods ID");
                }

            });

            return deferred.promise;

        }

        function searchGoods(criteria) {
            var deferred = $q.defer();
            var queryLike;
            if (criteria.id != '') {
                queryLike = 'SELECT * FROM goods WHERE id = $1';
                doQuery(deferred, queryLike, [criteria.id]);


            } else if (criteria.price != '') {
                queryLike = 'SELECT * FROM goods WHERE (name LIKE $1 ) AND (producer LIKE $2) AND (price = $3)';
                doQuery(deferred, queryLike, [criteria.name + '%', criteria.producer + '%', criteria.price]);
            } else {
                console.log('all');
                queryLike = 'SELECT * FROM goods WHERE (name LIKE $1) AND (producer LIKE $2)';
                doQuery(deferred, queryLike, [criteria.name + '%', criteria.producer + '%']);

            }
            return deferred.promise;

        }

        function deleteGoods(id) {
            var deferred = $q.defer();
            var queryDelete = "DELETE FROM goods WHERE id = $1";
            doQuery(deferred, queryDelete, [id]);
            return deferred.promise;
        }

        function updateGoods(goods) {
            var deferred = $q.defer();
            var queryUpdate = "UPDATE goods SET name=($2), producer=($3), unit=($4), weight=($5), price = ($6) WHERE id=($1)";
            doQuery(deferred, queryUpdate, [goods.id, goods.name, goods.producer, goods.unit, goods.weight, goods.price]);
            return deferred.promise;
        }

    }
})();
