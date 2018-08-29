import angular from 'angular';

import historyTabCtrl from './historyTab.ctrl';
import historyTabHtml from './historyTab.html';

import './historyTab.less'

const historyTab = angular.module('app.components.historyTab', [])
    .controller('historyTabCtrl', historyTabCtrl);

export { historyTab, historyTabHtml, historyTabCtrl };
