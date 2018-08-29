import angular from 'angular';

import homeCtrl from './home.ctrl';
import homeService from './home.service';


export default angular.module('app.modules.home', [])
    .service('homeService', homeService)
    .controller('homeCtrl', homeCtrl)
