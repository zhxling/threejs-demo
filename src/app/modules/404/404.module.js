import angular from 'angular'

import './404.less'
import NotFoundCtrl from './404.ctrl';  

export default angular.module('app.modules.404', [])
    .controller('NotFoundCtrl', NotFoundCtrl);
