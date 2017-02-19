gameApp.directive('chessBlock', function() {
    return {
        restrict: 'E',
        templateUrl: 'directives/chessBlock.html',
        replace: true,
        controller: 'chessController',
        scope: {
            position: '=',
            empty: '=',
            currentChess: '='
        }
    }
});
