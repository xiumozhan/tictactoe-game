gameApp.controller('chessController', ['$scope', function($scope) {
    $scope.placeChess = function() {
        if($scope.currentChess === $scope.empty) {
            console.log($scope.$parent.position);
            console.log($scope.position);
            $scope.$parent.position.position = $scope.position;
        }
    };
}]);