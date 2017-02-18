'use strict';

const ai = require('aiController');
const gameState = require('gameState');

gameApp.controller('gameController', [$scope, function($scope) {
    $scope.chessBoard = new Array(9).fill('empty');
    $scope.position = 0;
    $scope.turn = 'firstHand';
    $scope.gameMode = {
        
    };
    $scope.selectedMode;

    $scope.placeChess = function() {
        if($scope.turn === 'firstHand') {
            if($scope.chessBoard[$scope.position] === 'empty') {
                $scope.chessBoard[$scope.position] = 'x';
                $scope.turn = 'secondHand';
            }
        } else if($scope.turn === 'secondHand') {
            if($scope.chessBoard[$scope.position] === 'empty') {
                $scope.chessBoard[$scope.position] = 'o';
                $scope.turn = 'firstHand';
            }
        }
    };

}]);
