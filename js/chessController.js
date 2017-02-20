'use strict';

gameApp.controller('chessController', ['$scope', function($scope) {
    $scope.placeChess = function() {
        if($scope.$parent.isGameModeSelected && $scope.$parent.isHandSelected) {
            if($scope.currentChess === $scope.empty) {
                $scope.$parent.position.position = $scope.position;
            }
        }
    };
}]);
