
import angular from 'angular';

import './login.less'

appLoginRun.$inject = ['RouterHelper'];
function appLoginRun(RouterHelper) {
    RouterHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'login',
            config: {
                url: '/login?action',
                // parent: 'root.layout',
                templateProvider: ['$q', $q => $q(resolve => {
                    require.ensure([], () => {
                        resolve(require('./login.html'));
                    }, 'login');
                })],
                controller: 'loginController as vm',
                resolve: {
                    loadModule: ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => $q(resolve => {
                        require.ensure([], () => {
                            let module = require('./login.module');
                            $ocLazyLoad.inject({ name: module.default.name });
                            resolve(module);
                        }, 'login');
                    })]
                },
                data: {
                    title: '系统登录',
                    _class: 'login',
                    type: 0
                }
            }
        }
    ];
}

export default angular.module('app.routes.login', [])
    .run(appLoginRun);
