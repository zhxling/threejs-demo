import angular from 'angular';

import SidebarCtrl from './sidebar.ctrl';
import sidebarHtml from './sidebar.html';
import { sideNavigation } from './sidebar.directives';

require('./sidebar.less')

const sidebar = angular.module('app.components.sidebar', [])
    .controller('sidebarCtrl', SidebarCtrl)
    .directive('sideNavigation', sideNavigation);

export { sidebar, sidebarHtml, SidebarCtrl };
