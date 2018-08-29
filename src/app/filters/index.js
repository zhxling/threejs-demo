import angular from 'angular'

import formatDate from './formatDateFilter';

export default angular.module('app.filters', [])
    .filter('formatDate', formatDate)
