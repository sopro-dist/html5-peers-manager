var app = angular.module("app", ["ngMaterial"]);

app.directive('ngReallyClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
}]);

app.controller("appCtrl",function ($scope, $mdSidenav, $mdDialog, $timeout ){

  $scope.view = "quilt";
  $scope.roles = Cambrian.me.peers;
  $scope.toastMessage = "";
  $scope.showToast = false;

  $scope.toastIt = function(message) {
    $scope.toastMessage = message;
    $scope.showToast = true;
    $timeout(function () {
      $scope.toastMessage = message;
      $scope.showToast = false;
    },2000);
  };

  $scope.toggleMenu = function () {
    $mdSidenav('left').toggle();
  };
  
  $scope.streamView = function(){
    $scope.view = "stream";
  };
  $scope.quiltView = function(){
    $scope.view = "quilt";
  };

  $scope.switchRole = function (e,k,role) {
    $mdDialog.show({
        templateUrl: 'partials/editPeer.tmpl.html',
        targetEvent: e,
        controller: ['$scope', '$rootScope', '$mdDialog', function ($scope, $rootScope, $mdDialog) {

          copyRole= angular.copy(role);
          $scope.role = role;

          $scope.close = function () {
            if (copyRole.recommend != role.recommend) {
              role.recommend = copyRole.recommend;
            }
            $mdDialog.hide();
          };

          $scope.editPeer = function () {
            $mdDialog.hide();
          };
        }]
    });
  };

  $scope.destroyRole = function (role) {
    role.destroy();
    $scope.roles = Cambrian.me.peers;
    $scope.toastIt(role.name + " Deleted!");
  };

  $scope.recommendPeer = function(peer) {
    peer.recommend = true;
    $scope.toastIt(peer.name + " Recommended!");
  };

  $scope.$on('roleAdded', function (scope, args) {
    $scope.toastIt(args + " Added!");
    $scope.roles = Cambrian.me.peers;
  });

  $scope.addRoleDialog = function (e) {
    $mdDialog.show({
        templateUrl: 'partials/addRole.tmpl.html',
        targetEvent: e,
        controller: ['$scope', '$rootScope', '$mdDialog', 'roleCreate', function ($scope, $rootScope, $mdDialog, roleCreate) {
        
          $scope.close = function () {
            $mdDialog.hide();
          };

          $scope.addPeer = function (roleName) {
            var uArray = roleName.split('@');
            if (uArray[uArray.length-1] == "xmpp.cambrian.org") {
              Cambrian.me.newPeer(roleName);
              $rootScope.$broadcast("roleAdded",roleName);
            } else {
              console.log("no server in username")
            }
            $mdDialog.hide();
          };
        }]
    });
  };

  $scope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
      if(fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

  function addNewRole (role) {
    $scope.roles.push(role);
  };

});