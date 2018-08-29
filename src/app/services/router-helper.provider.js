import angular from 'angular';

const [handlingStateChangeError, hasOtherwise, stateCounts] = [
    'handlingStateChangeError', 'hasOtherwise', 'stateCounts'
];

class RouterHelper {
    constructor(
        config, $stateProvider, $urlRouterProvider,
        $rootScope, $state
    ) {
        Object.assign(this, {
            config,
            $stateProvider,
            $urlRouterProvider,
            $rootScope,
            $state
        });
        // private variable
        this[handlingStateChangeError] = false;
        this[hasOtherwise] = false;
        this[stateCounts] = {
            errors: 0,
            changes: 0
        };

        this.handleRoutingErrors();
        this.updateDocTitle();
    }

    configureStates(states) {

        states.forEach(state => {
            let data = {};

            state.config.data = $.extend({}, state.config.data || {}, data);
            this.$stateProvider.state(state.state, state.config);
        });

        this.$urlRouterProvider.otherwise($injector => {
            if (localStorage.getItem('userInfo')) {
                $injector.get('$state').go('home');
            } else {
                $injector.get('$state').go('login');
            }
        });
    }

    handleRoutingErrors() {
        // Route cancellation:
        // On routing error, go to the dashboard.
        // Provide an exit clause if it tries to do it twice.
        this.$rootScope.$on(
            '$stateChangeError',
            (event, toState, toParams, fromState, fromParams, error) => {

                if (this[handlingStateChangeError]) {
                    return;
                }
                this[stateCounts].errors += 1;
                this[handlingStateChangeError] = true;

                if (error === 'requireLogin') {
                    this.$state.prev = {
                        state: toState.name,
                        params: toParams
                    };
                    this.$state.go('login');
                } else {
                    this.$state.go('home');
                }
            }
        );

        this.$rootScope.$on(
            '$stateNotFound',
            () => {
                this.$state.go('notfound');
            }
        )
    }

    getStates() {
        return this.$state.get();
    }

    updateDocTitle() {

        this.$rootScope.$on('$stateChangeSuccess', (event, toState) => {
            // fix在ie9时切换路由会存在两个路由页面有短时间内同时存在bug
            if (toState.views && toState.views['main@root']) {
                $('.main-view').eq(0).html('');
            }

            // 更新title
            $('head title')[0].firstChild.nodeValue = `${toState.data.title} - 智慧电厂综合安防平台`;
        });
    }
}

// Help configure the state-base ui.router
class RouterHelperProvider {
    constructor($locationProvider, $stateProvider, $urlRouterProvider) {
        Object.assign(this, { $locationProvider, $stateProvider, $urlRouterProvider });
    }

    configure(cfg) {
        angular.extend(this.config, cfg);
    }

    $get($rootScope, $state) {
        return new RouterHelper(
            this.config, this.$stateProvider, this.$urlRouterProvider,
            $rootScope, $state
        );
    }
}

RouterHelperProvider.prototype.$get.$inject = [
    '$rootScope', '$state',
];

RouterHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];

export default RouterHelperProvider;
