'use strict';

gameApp.controller('gameController', ['$scope', 'gameState', 'aiController', function($scope, gameState, aiController) {
    $scope.nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    $scope.chessBoard = new Array(9).fill('empty');
    var firstHand = 'firstHand';
    var secondHand = 'secondHand';
    $scope.position = 0;
    $scope.turn;

    $scope.gameMode = {
        humanToComputer: false,
        humanToHuman: false
    };

    $scope.isGameModeSelected = false;

    $scope.firstHandPlayer = {
        human: false,
        computer: false
    };

    $scope.secondHandPlayer = {
        human: false,
        computer: false
    };

    $scope.onePlayer = function() {
        $scope.gameMode.humanToComputer = true;
        $scope.gameMode.humanToHuman = false;
        $scope.isGameModeSelected = true;
    };

    $scope.twoPlayer = function() {
        $scope.gameMode.humanToComputer = false;
        $scope.gameMode.humanToHuman = true;
        $scope.isGameModeSelected = true;
    };

    var selectHand = function() {
        if($scope.selectedHand === 'firstHand') {
            if($scope.gameMode.humanToHuman) {
                $scope.firstHandPlayer.human = true;
                $scope.firstHandPlayer.computer = false;
                $scope.secondHandPlayer.human = true;
                $scope.secondHandPlayer.computer = false;
            } else if($scope.gameMode.humanToComputer) {
                $scope.firstHandPlayer.human = true;
                $scope.firstHandPlayer.computer = false;
                $scope.secondHandPlayer.human = false;
                $scope.secondHandPlayer.computer = true;
            }
        } else if ($scope.selectedHand === 'secondHand') {
            if($scope.gameMode.humanToHuman) {
                $scope.firstHandPlayer.human = true;
                $scope.firstHandPlayer.computer = false;
                $scope.secondHandPlayer.human = true;
                $scope.secondHandPlayer.computer = false;
            } else if($scope.gameMode.humanToComputer) {
                $scope.firstHandPlayer.human = false;
                $scope.firstHandPlayer.computer = true;
                $scope.secondHandPlayer.human = true;
                $scope.secondHandPlayer.computer = false;
            }
        }
        $scope.turn = 'firstHand';
    };

    $scope.selectFirstHand = function() {
        $scope.selectedHand = firstHand;
        selectHand();
        console.log($scope);
    };

    $scope.selectSecondHand = function() {
        $scope.selectedHand = secondHand;
        selectHand();
        console.log($scope);
    };

    $scope.gameStatus = gameState.resultMap.inProgress;
    $scope.gameOver = false;

    var isGameOver = function() {
        return ($scope.gameStatus === gameState.resultMap.win ||
        $scope.gameStatus === gameState.resultMap.lose ||
        $scope.gameStatus === gameState.resultMap.draw);
    };

    //should be called only when it is human's turn
    $scope.humanPlaceChess = function() {
        if ($scope.turn === 'firstHand') {
            if ($scope.chessBoard[$scope.position] === 'empty') {
                $scope.chessBoard[$scope.position] = 'x';
                $scope.gameStatus = gameState.getState($scope.chessBoard);
                if(isGameOver()) {
                    $scope.gameOver = true;
                } else {
                    $scope.turn = 'secondHand';
                }
            }
        } else if ($scope.turn === 'secondHand') {
            if ($scope.chessBoard[$scope.position] === 'empty') {
                $scope.chessBoard[$scope.position] = 'o';
                $scope.gameStatus = gameState.getState($scope.chessBoard);
                if(isGameOver()) {
                    $scope.gameOver = true;
                } else {
                    $scope.turn = 'firstHand';
                }
            }
        }
    };

    var computerPlaceChess = function(move) {
        if ($scope.turn === 'firstHand') {
            $scope.chessBoard[move] = 'x';
            $scope.turn = 'secondHand';
        } else if ($scope.turn === 'secondHand') {
            $scope.chessBoard[move] = 'o';
            $scope.turn = 'firstHand';
        }
        $scope.gameStatus = gameState.getState($scope.chessBoard);
    };

    $scope.$watch('turn', function(currTurn, prevTurn) {
        if(currTurn === 'firstHand') {
            if($scope.firstHandPlayer.computer) {
                var move = aiController.firstHandMove($scope.chessBoard, 6);
                computerPlaceChess(move);
                console.log(move);
            }
        } else if(currTurn === 'secondHand') {
            if($scope.secondHandPlayer.computer) {
                var move = aiController.secondHandMove($scope.chessBoard, 6);
                computerPlaceChess(move);
                console.log(move);
            }
        }
    });

    $scope.$watch('gameOver', function(newValue, oldValue) {
        if(newValue && !oldValue) {
            $scope.reset();
        }
    });

    $scope.reset = function() {
        $scope.gameMode = {
            humanToComputer: false,
            humanToHuman: false
        };

        $scope.firstHandPlayer = {
            human: false,
            computer: false
        };

        $scope.secondHandPlayer = {
            human: false,
            computer: false
        };

        $scope.chessBoard = new Array(9).fill('empty');
        $scope.turn = undefined;
        $scope.selectedHand = undefined;
        $scope.gameOver = false;
        $scope.gameStatus = gameState.resultMap.inProgress;
        $scope.isGameModeSelected = false;
    };

}]);
