'use strict';

gameApp.service('gameState', function() {
    var initialEvaluation = [
        3, 2, 3,
        2, 4, 2,
        3, 2, 3
    ];

    var winStatus = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    var results = {
        'inProgress': 1,
        'draw': 0,
        'win': Infinity,
        'lose': -Infinity,
        'gamePoint': 100,
    }

    var stateEvaluate = function(chessBoard, chessType, firstHand) {
        var empty = chessType.empty;
        var firstHandChess = chessType.firstHandChess;
        var secondHandChess = chessType.secondHandChess;
        var gameResult = results.inProgress;
        var isGameOver = true;
        var xCount = 0;
        var oCount = 0;
        var index = 0;

        // check if game is over, i.e chessBoard is full
        for(var i = 0; i < chessBoard.length; i++) {
            if(chessBoard[i] === empty) {
                isGameOver = false;
            } else if(chessBoard[i] === firstHandChess) {
                xCount++;
                index = i;
            } else {
                oCount++;
                index = i;
            }
        }

        // check if this is the initial status of the game
        if(xCount + oCount === 1) {
            if(xCount) {
                return initialEvaluation[index];
            } else {
                return -initialEvaluation[index];
            }
        }

        // check if 'x' win/lose
        for(var i = 0; i < winStatus.length; i++) {
            var checkingChess = chessBoard[winStatus[i][0]];
            if(checkingChess === empty) {
                continue;
            } else {
                for(var j = 1; j < winStatus[i].length; j++) {
                    if(checkingChess !== chessBoard[winStatus[i][j]]) {
                        break;
                    }
                }
                if(j === winStatus[i].length) {
                    if(checkingChess === firstHandChess) {
                        gameResult = results.win;
                    } else {
                        gameResult = results.lose;
                    }
                    break;
                }
            }
        }

        if(gameResult !== results.win && gameResult != results.lose) {
            if(isGameOver) {
                gameResult = results.draw;
            } else {
                //check if it gets to a game point
                var xGamePoint = false;
                var oGamePoint = false;
                for(var i = 0; i < winStatus.length; i++) {
                    var hasEmptySpace = false;
                    var checkingChess = empty;
                    var count = 0;
                    for(var j = 0; j < winStatus[i].length; j++) {
                        if(chessBoard[winStatus[i][j]] === empty) {
                            hasEmptySpace = true;
                        } else {
                            if (checkingChess === empty) {
                                checkingChess = chessBoard[winStatus[i][j]];
                            }
                            if (chessBoard[winStatus[i][j]] === checkingChess) {
                                count++;
                            }
                        }
                    }

                    if(hasEmptySpace && count > 1) {
                        if(checkingChess === firstHandChess) {
                            xGamePoint = true;
                        } else {
                            oGamePoint = true;
                        }
                    }
                }

            }
            if(xGamePoint || oGamePoint) {
                if(firstHand) {
                    if(xGamePoint && !oGamePoint) {
                        gameResult = results.gamePoint;
                    } else if(oGamePoint) {
                        gameResult = -results.gamePoint;
                    }
                } else {
                    if(!xGamePoint && oGamePoint) {
                        gameResult = -results.gamePoint;
                    } else if(xGamePoint) {
                        gameResult = results.gamePoint;
                    }
                }
            }

        }

        return gameResult;
    };

    return {
        getState: stateEvaluate,
        resultMap: results
    };
})
