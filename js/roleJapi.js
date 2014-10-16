app.factory("roleAll", function($filter) {
  return function () {
    console.log("roleAll called");
    var qtRoles = Cambrian.capi.roles.list();
    var roles = [];
    for (var i=0; i < qtRoles.length; i++) {
      roles.push(angular.copy(qtRoles[i]));
    }
    return roles;
  };
});

app.factory("roleCreate", function () {
  return function (roleName) {
    console.log("creating role");
    var qtRole = Cambrian.capi.roles.create(roleName);
    var role = angular.copy(qtRole);
    return role;
  }
});

app.factory("roleDestroy", function () {
  return function (roleIndex) {
    console.log("deleting role");
    var qtRole = Cambrian.capi.roles.list()[roleIndex];
    if (qtRole) {
      qtRole.destroy();
      return true;
    } else {
      return false;
    }
    
  }
});

app.factory("roleChange", function () {
  return function (roleIndex) {
    console.log("changing role");
    var qtRole = Cambrian.capi.roles.list()[roleIndex];
    if (qtRole) {
      Cambrian.capi.roles.current = qtRole;
      return true;
    } else {
      return false;
    }

  };
});