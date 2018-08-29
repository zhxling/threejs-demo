import angular from 'angular';

import html from './map.html';
import mapCtrl from './map.ctrl';
import './map.less';


export default angular.module('app.modules.mapTemplate', [])
    .controller('mapCtrl', mapCtrl)
    .run(['$templateCache', $templateCache => {
        $templateCache.put('map.html', html)
    }]);

