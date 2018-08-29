import angular from 'angular';

import './layout.less';
import appLayoutRun from './layout.route';
import { header } from './header';
import { footer } from './footer';
import { sidebar } from './sidebar';
import { breadcrumb } from './breadcrumb';
// import { historyTab } from './historyTab';

export default angular.module('app.layout', [
    header.name,
    footer.name,
    sidebar.name,
    breadcrumb.name,
    // historyTab.name
]).run(appLayoutRun);
