var gameApp = angular.module('gameApp');

gameApp.service('gameHubService', ['$rootScope', function ($rootScope) {

    var initialize = function () {
        connection = $.hubConnection();
        var gameHub = connection.createHubProxy('gameHub');
        connection.start();

        gameHub.on('receiveChat', function (name, message) {
            $rootScope.$emit("receiveChat", name, message);
        });
    };
    return {
        initialize: initialize
    };
}]);