class mapCtrl {
    constructor($state, $timeout, $scope, ngDialog, zonesApi, svgHandler, paginatorService) {
        Object.assign(this, {
            $state, $timeout, $scope, ngDialog, zonesApi, svgHandler, paginatorService
        });


        this.areaId = ($scope.$parent && $scope.$parent.areaId) || 1;

        mapCtrl.defaultOption = {
            defaultAttr: {
                operableClass: 'operable',
                class: 'monitor-equipment operable',
                cursor: 'pointer',
            }
        }

        $timeout(() => {
            this.svgHandler.init(this, 'svg', $scope.zone, this.initAfterLoadedSvg, {}, $scope.facilities);
        })

    }


    initAfterLoadedSvg(self) {
        console.log('map is load', self);
    }
}

mapCtrl.$inject = ['$state', '$timeout', '$scope', 'ngDialog', 'zonesApi', 'svgHandler', 'paginatorService'];

export default mapCtrl;
