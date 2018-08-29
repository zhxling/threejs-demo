class historyTabCtrl {
    constructor($state, $rootScope, RouterHelper, $scope) {
        Object.assign(this, {
            $state, $rootScope, RouterHelper, $scope
        });
        this.navs = [];
        const self = this;
        self._applyNewBreadcrumb(this.$state.current);

        // this.$rootScope.$on('$stateChangeSuccess', (event, toState, toParams) => {
        self.$rootScope.$on('$stateChangeSuccess', (event, toState) => {
            // let navsLength = self.navs.length;
            this._applyNewBreadcrumb(toState);
            // if (self.navs.length !== navsLength) {

            // }
        });
    }

    _applyNewBreadcrumb(curState) {
        if (!curState.abstract && curState.data.requireLogin && curState.parent && curState.parent != 'root') {

            for (let i = 0; i < this.navs.length; i++) {
                if (this.navs[i].name == curState.name) {
                    return;
                }
            }
            this.navs.push({
                link: (curState.params ? `${curState.name}(${JSON.stringify(curState.params)})` : curState.name),
                text: curState.data.title,
                name: curState.name,
                icon: curState.data.icon
            })
        }
    }

    deleteItem(event, index) {
        event.preventDefault();
        this.navs.splice(index, 1);
    }
}

historyTabCtrl.$inject = ['$state', '$rootScope', 'RouterHelper', '$scope'];

export default historyTabCtrl;
