import angular from 'angular'
import demo from './demoDirective';

export default angular.module('app.directives', [])
    .directive('copyright', demo)