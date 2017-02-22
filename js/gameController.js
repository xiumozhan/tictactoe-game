'use strict';

gameApp.controller('gameController', ['$scope', '$timeout', 'gameState', 'aiController', 'gameOverMessageService', function($scope, $timeout, gameState, aiController, gameOverMessageService) {
    $scope.chessType = {
        empty: " ",
        firstHandChess: "X",
        secondHandChess: "O"
    };
    $scope.nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    $scope.chessBoard = new Array(9).fill($scope.chessType.empty);
    var firstHand = 'firstHand';
    var secondHand = 'secondHand';
    $scope.position = {
        position: undefined
    };
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

    $scope.isHandSelected = false;

    var selectHand = function() {
        if(!$scope.isHandSelected) {
            if ($scope.selectedHand === firstHand) {
                if ($scope.gameMode.humanToHuman) {
                    $scope.firstHandPlayer.human = true;
                    $scope.firstHandPlayer.computer = false;
                    $scope.secondHandPlayer.human = true;
                    $scope.secondHandPlayer.computer = false;
                } else if ($scope.gameMode.humanToComputer) {
                    $scope.firstHandPlayer.human = true;
                    $scope.firstHandPlayer.computer = false;
                    $scope.secondHandPlayer.human = false;
                    $scope.secondHandPlayer.computer = true;
                }
            } else if ($scope.selectedHand === secondHand) {
                if ($scope.gameMode.humanToHuman) {
                    $scope.firstHandPlayer.human = true;
                    $scope.firstHandPlayer.computer = false;
                    $scope.secondHandPlayer.human = true;
                    $scope.secondHandPlayer.computer = false;
                } else if ($scope.gameMode.humanToComputer) {
                    $scope.firstHandPlayer.human = false;
                    $scope.firstHandPlayer.computer = true;
                    $scope.secondHandPlayer.human = true;
                    $scope.secondHandPlayer.computer = false;
                }
            }
            $scope.isHandSelected = true;
            $scope.turn = firstHand;
        }

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
    var humanPlaceChess = function() {
        if ($scope.turn === firstHand) {
            $scope.chessBoard[$scope.position.position] = $scope.chessType.firstHandChess;
            $scope.gameStatus = gameState.getState($scope.chessBoard, $scope.chessType, true);
            if (isGameOver()) {
                $scope.gameOver = true;
            } else {
                $scope.turn = secondHand;
            }
        } else if ($scope.turn === secondHand) {
            $scope.chessBoard[$scope.position.position] = $scope.chessType.secondHandChess;
            $scope.gameStatus = gameState.getState($scope.chessBoard, $scope.chessType, false);
            if (isGameOver()) {
                $scope.gameOver = true;
            } else {
                $scope.turn = firstHand;
            }
        }
        console.log('now the game status is: ', $scope.gameStatus);
    };

    $scope.$watch('position.position', function(newPosition, oldPosition) {
        if (newPosition !== undefined && newPosition !== oldPosition) {
            humanPlaceChess();
        }
    });

    var computerPlaceChess = function(move) {
        if ($scope.turn === firstHand) {
            $scope.chessBoard[move] = $scope.chessType.firstHandChess;
            $scope.gameStatus = gameState.getState($scope.chessBoard, $scope.chessType, true);
            $scope.turn = secondHand;
        } else if ($scope.turn === secondHand) {
            $scope.chessBoard[move] = $scope.chessType.secondHandChess;
            $scope.gameStatus = gameState.getState($scope.chessBoard, $scope.chessType, false);
            $scope.turn = firstHand;
        }

        console.log('now the game status is: ', $scope.gameStatus);
    };

    $scope.$watch('turn', function(currTurn, prevTurn) {
        if (currTurn === firstHand) {
            if ($scope.firstHandPlayer.computer) {
                var move = aiController.firstHandMove($scope.chessBoard, 6, $scope.chessType);
                computerPlaceChess(move);
                console.log(move);
            }
        } else if (currTurn === secondHand) {
            if ($scope.secondHandPlayer.computer) {
                var move = aiController.secondHandMove($scope.chessBoard, 6, $scope.chessType);
                computerPlaceChess(move);
                console.log(move);
            }
        }
    });

    $scope.$watch('gameOver', function(newValue, oldValue) {
        if (newValue && !oldValue) {
            if ($scope.gameStatus === gameState.resultMap.win) {
                if ($scope.gameMode.humanToHuman) {
                    $scope.message = 'Player 1 Won!';
                } else if ($scope.firstHandPlayer.computer) {
                    $scope.message = 'You Lost! My Algorithm Won!';
                } else {
                    $scope.message = "OK, You've Beaten My Stupid Algorithm";
                }
            } else if ($scope.gameStatus === gameState.resultMap.lose) {
                if ($scope.gameMode.humanToHuman) {
                    $scope.message = 'Player 2 Won!';
                } else if ($scope.firstHandPlayer.computer) {
                    $scope.message = "OK, You've Beaten My Stupid Algorithm";
                } else {
                    $scope.message = 'You Lost! My Algorithm Won!';
                }
            } else {
                $scope.message = 'It\'s A Draw';
            }

            var modalOptions = {
                actionButtonText: 'All Right',
                headerText: 'Whoops, Seems This Game Is Over',
                bodyText: $scope.message
            };

            $timeout(function() {
                gameOverMessageService.showModal({}, modalOptions);
            }, 1000);

            $timeout(function() {
                $scope.reset();
            }, 3000);
        }
    });

    $scope.$watch('gameStatus', function(newStatus, oldStatus) {
        if (isGameOver()) {
            $scope.gameOver = true;
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

        $scope.chessBoard = new Array(9).fill($scope.chessType.empty);
        $scope.turn = undefined;
        $scope.selectedHand = undefined;
        $scope.gameOver = false;
        $scope.gameStatus = gameState.resultMap.inProgress;
        $scope.isGameModeSelected = false;
        $scope.isHandSelected = false;
        $scope.position.position = undefined;
    };

}]);
