(function (){
    'use strict';
    var pg = require('pg');
    var util = require("gulp-util");
    var connectionString = "postgres://sonar:sonar@localhost/sonar";
    //var connection = pg.connect(connectionString);

    angular.module('app')
        .service('goodsService', ['$q', GoodsService]);

    function GoodsService($q){
        return{
            getGoods: getGoods,
            getById: getGoodsById
//            getByName: getGoodsByName,
//            create: createGoods,
//            destroy: deleteGoods,
//            update: updateGoods
        };

        function getGoods(){
            var deferred = $q.defer();
            var result = [];
            var queryAll = "SELECT * FROM goods ORDER BY id ASC";
            pg.connect(connectionString, function(err, client, done){
                if(err) {
                    done();
                    deferred.reject(err);
                }
                var query = client.query(queryAll);
                query.on('row', function(row){
                    result.push(row);

                });

                query.on("end", function(){
                    done();
                    deferred.resolve(result);
                    util.log(result);

                })

            });
            return deferred.promise;
        }

        function getGoodsById(ID){
            var deferred = $q.defer();
            var result = [];
            var queryOne = 'SELECT * FROM goods WHERE id=($1)';

            pg.connect(connectionString, function(err, client, done){
                if(err) {
                    done();
                    deferred.reject(err);
                }
                var query = client.query(queryOne,[ID]);
                query.on('row', function(row){
                    result.push(row);

                });

                query.on("end", function(){
                    done();
                    deferred.resolve(result);
                    util.log(result);

                })

            });
            return deferred.promise;

        }
//
//        function getGoodsByName(name){
//            var deferred = $q.defer();
//            var query = 'SELECT * FROM goods WHERE name=($1)';
//
//            connection.query(query, [name], function(err, rows){
//                if(err){
//                    deferred.reject(err);
//                }
//                deferred.resolve(rows);
//
//            });
//            return deferred.promise;
//
//        }
//
//        function createGoods(goods){
//            var deferred = $q.defer();
//            var query = "INSERT INTO goods SET ?";
//            connection.query(query, goods, function(err, res){
//                if(err){
//                    deferred.reject(err);
//                }
//                deferred.resolve(res.insertId);
//            });
//            return deferred.promise;
//
//        }
//
//        function deleteGoods(id) {
//            var deferred = $q.defer();
//            var query = "DELETE FROM goods WHERE id = ?";
//            connection.query(query, [id], function (err, res) {
//                if (err) deferred.reject(err);
//                deferred.resolve(res.affectedRows);
//            });
//            return deferred.promise;
//        }
//
//        function updateGoods(data) {
//            var deferred = $q.defer();
//            var query = "UPDATE goods SET name=($1), producer=($2), unit=($4), weight=($5) WHERE id=($6)";
//            connection.query(query, [data.name, data.producer, data.unit, data.weight, data.price, data.id], function (err, res) {
//                if (err) deferred.reject(err);
//                deferred.resolve(res);
//            });
//            return deferred.promise;
//        }

    }
})();