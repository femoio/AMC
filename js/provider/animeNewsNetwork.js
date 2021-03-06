var fs = require('fs');
var parseString = require('xml2js').parseString;
app.factory('AnimeNewsNetworkFactory',function($q,$http){

    var animelist = loadAnimeList();

    function loadAnimeList() {
        var defer = $q.defer();

        $http({
            method: 'GET',
            url: 'https://www.animenewsnetwork.com/encyclopedia/reports.xml',
            params: {
                id:155,
                type:"anime"
            },
            cache:true
        }).success(function(data){
            //console.log(data);
            parseString(data, function (err, result) {
                logger.info("Parse successfull!");
                //console.log(JSON.stringify(result["report"]["item"]));
                defer.resolve(result["report"]["item"]);
                //console.log(JSON.stringify(result));
                db('anime').push(result);
            });
        }).error(function(){
            logger.error("error");
        });

        return defer.promise;
    }

    return{
        getAllAnime:function(){
            return animelist;
        },
        getSingleAnime:function(id){
            //console.log(id);
            var defer = $q.defer();

             $http({
                    method: 'GET',
                    url: ' http://cdn.animenewsnetwork.com/encyclopedia/api.xml',
                    params: {
                        anime:id
                    },
                    cache:true
                }).success(function(data){
                    //console.log(data);
                    parseString(data, function (err, result) {
                        logger.info("Parse successfull!");
                        //console.log(JSON.stringify(result["ann"]["anime"][0]));
                        defer.resolve({
                            id : id,
                            name : result["ann"]["anime"][0]["$"]["name"],
                            img : result["ann"]["anime"][0]["info"][0]["$"]["src"]
                        });
                    });
                }).error(function(err){
                 logger.error("Error!");
                });
            return defer.promise;
        }
    }
});