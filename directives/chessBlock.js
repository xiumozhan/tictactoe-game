gameApp.directive('chessBlock', function() {
    return {
        restrict: 'E',
        templateUrl: 'directives/chessBlock.html',
        replace: true,
        scope: {
            position: '=',
        }
    }
});
