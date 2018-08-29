class authService {
    constructor($rootScope, $state, identityService, $timeout, eventConstant) {
        Object.assign(this, {
            $rootScope, $state, identityService, $timeout, eventConstant
        });
    }

    authorize(event, toState, toParams) {
        if (!toState.url) {
            this.$state.go('login');
        }
        // this.identityService.identity()
        //     .then(() => {
        //         const isAuthenticated = this.identityService.isAuthenticated();

        //         if (isAuthenticated) {
                    
        //             if (!toState.url) {
        //                 this.$state.go('login');
        //             }
        //         } else {
        //             // 用户没登录，记录用户登录后想要跳转的路由
        //             this.$rootScope.returnToState = this.$rootScope.toState;
        //             this.$rootScope.returnToStateParams = this.$rootScope.toStateParams;

        //             // redirect to login state
        //             this.$state.go('login');
        //         }
        //     })
    }
}

authService.$inject = ['$rootScope', '$state', 'identityService', '$timeout', 'eventConstant'];

export default authService;
