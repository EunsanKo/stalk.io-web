'use strict';

describe('Controller: ScriptCtrl', function () {

  // load the controller's module
  beforeEach(module('stalkioWebApp'));

  var ScriptCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ScriptCtrl = $controller('ScriptCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
