import angular from 'angular';

appRun.$inject = ['RouterHelper'];
function appRun(RouterHelper) {
    const otherwise = '/404';
    RouterHelper.configureStates(getStates(), otherwise);
}

function getStates() {
    return [
        {
            state: 'notAuth',
            config: {
                url: '/notAuth',
                parent: 'root.layout',
                views: {
                    'main@root': {
                        templateProvider: ['$q', $q => $q(resolve => {
                            require.ensure([], () => {
                                resolve(require('./notAuth.html'));
                            }, 'notAuth');
                        })]
                    },
                    'sidebar@root': {}
                },
                data: {
                    title: 'notAuth',
                    _class: 'notAuth'
                },
                resolve: {
                    loadModule: ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => $q(resolve => {
                        require.ensure([], () => {
                            let module = require('./notAuth.module');
                            $ocLazyLoad.inject({ name: module.default.name });
                            resolve(module);
                        }, 'notAuth');
                    })]
                }
            }
        }
    ];
}

export default angular.module('app.routes.notAuth', [])
    .run(appRun);
