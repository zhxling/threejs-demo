import angular from 'angular';

import './nestable';
import './nestable.less';

const nestableTree = angular.module('nestable', [])
    .directive('nestableTree', () => ({
        restrict: 'A',
        scope: {
            nestableOption: '='
        },
        // templateUrl: 'tree.html',
        link(scope, element) {
            if (scope.nestableOption) {
                element.nestable(scope.nestableOption);
            }

            scope.$watch('nestableOption', () => {
                if (scope.nestableOption) {
                    element.nestable(scope.nestableOption);
                }

            });
        },
    }));

export default nestableTree;
