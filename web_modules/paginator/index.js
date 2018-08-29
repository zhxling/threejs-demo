import angular from 'angular';
import './ds-paginator';
import './ds-pagination.less';
import paginatorService from './ds-paginator.service';

export default angular.module('paginator', [])
    .service('paginatorService', paginatorService)
