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

app.controller("appCtrl",function ($scope, $materialSidenav, $materialDialog, $timeout ){

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
    $materialSidenav('left').toggle();
  };
  
  $scope.overflowToggle = function (role) {
  	role.of = !role.of;
  };

  $scope.switchRole = function (e,k,role) {
    $materialDialog({
        templateUrl: 'partials/editPeer.tmpl.html',
        targetEvent: e,
        controller: ['$scope', '$rootScope', '$hideDialog', function ($scope, $rootScope, $hideDialog) {
          
          $scope.role = role;

          $scope.close = function () {
            $hideDialog();
          };

          $scope.createRole = function (roleName) {
            $hideDialog();
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
    $materialDialog({
        templateUrl: 'partials/addRole.tmpl.html',
        targetEvent: e,
        controller: ['$scope', '$rootScope', '$hideDialog', 'roleCreate', function ($scope, $rootScope, $hideDialog, roleCreate) {
        
          $scope.close = function () {
            $hideDialog();
          };

          $scope.addPeer = function (roleName) {
            var uArray = roleName.split('@');
            if (uArray[uArray.length-1] == "xmpp.cambrian.org") {
              Cambrian.me.newPeer(roleName);
              $rootScope.$broadcast("roleAdded",roleName);
            } else {
              console.log("no server in username")
            }
            $hideDialog();
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