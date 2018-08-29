import * as THREE from "three";
window.THREE = THREE;
require('three/examples/js/controls/OrbitControls')

class FireworksCtrl {
    constructor($rootScope, $scope, $state, eventConstant, identityService, $http, md5, variables) {
        Object.assign(this, { $rootScope, $scope, $state, eventConstant, identityService, $http, md5, variables });

    }
}

FireworksCtrl.$inject = ['$rootScope', '$scope', '$state', 'eventConstant', 'identityService', '$http', 'md5', 'variables'];

export default FireworksCtrl
