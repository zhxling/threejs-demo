import angular from 'angular';

import './breadcrumb.less'

import breadcrumbCtrl from './breadcrumb.ctrl';
import breadcrumbHtml from './breadcrumb.html';

const breadcrumb = angular.module('app.components.breadcrumb', [])
    .controller('breadcrumbCtrl', breadcrumbCtrl);

export { breadcrumb, breadcrumbHtml, breadcrumbCtrl };
