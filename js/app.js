var app = angular.module("app", ["ngMaterial"]);

app.factory("menu", ['$rootScope', function ($rootScope) {
  var self;
  var filters = [{ filter: 'All', color: '#000' }, 
                 { filter: 'Vote', color: '#a48623' },
                 { filter: 'Running', color: '#458B74' },
                 { filter: 'Unstarted', color: '#D2D6DF' },
                 { filter: 'Completed', color: '#40505E' }];

  return self = {
    filters: filters,

    selectFilter: function(filter) {
      self.currentFilter = filter;
      if (filter.filter === "All") {
        $rootScope.pollFilter = undefined;
      } else if (filter.filter === "Running") {
        $rootScope.pollFilter = "started";
      } else if (filter.filter === "Completed") {
        $rootScope.pollFilter = "stopped";
      } else {
        $rootScope.pollFilter = filter.filter.toLowerCase();
      };
    },

    isFilterSelected: function (filter) {
      return self.currentFilter === filter;
    }
  };
}]);

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

app.controller("appCtrl",function ($scope, $materialSidenav, $materialDialog, menu, roleAll, roleDestroy, roleChange){

  $scope.menu = menu;
  $scope.roles = Cambrian.me.peers;

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
            role = roleCreate(roleName);
            $rootScope.$broadcast('roleAdded', {role: role});
            $hideDialog();
          };
        }]
    });
  };

  $scope.destroyRole = function (roleIndex) {
    if (roleDestroy(roleIndex)) {
      $scope.roles.splice(roleIndex, 1);
    }
  };

  $scope.$on('roleAdded', function (scope, args) {
    addNewRole(args.role);
  });

  $scope.addRoleDialog = function (e) {
    $materialDialog({
        templateUrl: 'partials/addRole.tmpl.html',
        targetEvent: e,
        controller: ['$scope', '$rootScope', '$hideDialog', 'roleCreate', function ($scope, $rootScope, $hideDialog, roleCreate) {
        
          $scope.close = function () {
            $hideDialog();
          };

          $scope.createRole = function (roleName) {
            role = roleCreate(roleName);
            $rootScope.$broadcast('roleAdded', {role: role});
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