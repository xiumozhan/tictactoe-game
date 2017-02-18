'use strict';

gameApp.service('aiController', ['gameState', function(gameState) {
    //when the computer is 'x', decide what best possible result it can get in the current situation
    var maximizeScore = function(chessBoard, depth, alpha, beta) {
        var gameResult = gameState.getState(chessBoard);
        var isGameOver = (gameResult === gameState.resultMap.win) || (gameResult === gameState.resultMap.lose) || (gameResult === gameState.resultMap.draw);
        //beta cut off
        if(beta <= alpha) {
            return gameResult;
        }
        if(depth === 0 || isGameOver) {
            return gameResult;
        }
        var bestPossibleScore = -Infinity;
        for(var i = 0; i < chessBoard.length; i++) {
            if(chessBoard[i] === 'empty') {
                chessBoard[i] = 'x';
                //the more 'o' can get, the happier 'x' becomes
                bestPossibleScore = Math.max(bestPossibleScore, minimizeScore(chessBoard, depth - 1, Math.max(bestPossibleScore, alpha), beta));
                chessBoard[i] = 'empty';
            }
        }
        return bestPossibleScore;
    };

    //when the computer is 'o', decide what best possible result it can get in the current situation
    var minimizeScore = function(chessBoard, depth, alpha, beta) {
        var gameResult = gameState.getState(chessBoard);
        var isGameOver = (gameResult === gameState.resultMap.win) || (gameResult === gameState.resultMap.lose) || (gameResult === gameState.resultMap.draw);
        //alpha cut off
        if(beta <= alpha) {
            return gameResult;
        }
        if(depth === 0 || isGameOver) {
            return gameResult;
        }
        var bestPossibleScore = Infinity;
        for(var i = 0; i < chessBoard.length; i++) {
            if(chessBoard[i] === 'empty') {
                chessBoard[i] = 'o';
                //the less 'x' can get, the happier 'o' becomes
                bestPossibleScore = Math.min(bestPossibleScore, maximizeScore(chessBoard, depth - 1, alpha, Math.min(bestPossibleScore, beta)));
                chessBoard[i] = 'empty';
            }
        }
        return bestPossibleScore;
    };

    // when computer is chosen to be 'x', how should it make its best next move
    var xMiniMax = function(chessBoard, depth) {
        var bestMoves = new Array(chessBoard.length);
        var index = 0;
        var bestPossibleScore = -Infinity;
        for(var i = 0; i < chessBoard.length; i++) {
            if(chessBoard[i] === 'empty') {
                chessBoard[i] = 'x';
                var possibleScore = minimizeScore(chessBoard, depth, -Infinity, Infinity);
                if(possibleScore > bestPossibleScore) {
                    bestPossibleScore = possibleScore;
                    index = 0;
                    bestMoves[index] = i;
                } else if (possibleScore === bestPossibleScore) {
                    index++;
                    bestMoves[index] = i;
                }
                chessBoard[i] = 'empty';
            }
        }
        if(index > 1) {
            index = Math.floor(Math.random() * index) + 1;
        }
        return bestMoves[index];
    };

    // when computer is chosen to be 'o', how should it make its best next move
    var oMiniMax = function(chessBoard, depth) {
        var bestMoves = new Array(chessBoard.length);
        var index = 0;
        var bestPossibleScore = Infinity;
        for(var i = 0; i < chessBoard.length; i++) {
            if(chessBoard[i] === 'empty') {
                chessBoard[i] = 'o';
                var possibleScore = maximizeScore(chessBoard, depth, -Infinity, Infinity);
                if(possibleScore < bestPossibleScore) {
                    bestPossibleScore = possibleScore;
                    index = 0;
                    bestMoves[index] = i;
                } else if (possibleScore === bestPossibleScore) {
                    index++;
                    bestMoves[index] = i;
                }
                chessBoard[i] = 'empty';
            }
        }
        if(index > 1) {
            index = Math.floor(Math.random() * index) + 1;
        }
        return bestMoves[index];
    };

    return {
        firstHandMove: xMiniMax;
        secondHandMove: oMiniMax;
    }
}]);
