import angular from 'angular';

import headerCtrl from './header.ctrl';
import headerHtml from './header.html';

import './header.less'


const header = angular.module('app.components.header', [])
    .controller('headerCtrl', headerCtrl);

export { header, headerHtml, headerCtrl };
