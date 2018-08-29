class breadcrumbCtrl {
    constructor($state, $rootScope, RouterHelper) {
        Object.assign(this, { $state, $rootScope, RouterHelper });

        this._applyNewBreadcrumb(this.$state.current);
        this.$rootScope.$on(
            '$stateChangeSuccess',
            // (event, toState, toParams) => {
            (event, toState) => {
                this._applyNewBreadcrumb(toState);
            }
        );
    }

    _applyNewBreadcrumb(curState) {
        this.breadcrumbs = [];
        this.breadcrumbs.push({
            link: (curState.params ? `${curState.name}(${JSON.stringify(curState.params)})` : curState.name),
            text: curState.data.title,
            icon: curState.data.icon
        });
        const parentStates = this._getAncestorStates(curState);
        parentStates.forEach(state => {
            if (state.abstract) {
                return;
            }
            const breadcrumb = {
                link: (state.params ? `${state.name}(${JSON.stringify(state.params)})` : state.name),
                text: state.data.title,
                icon: state.data.icon
            };
            this.breadcrumbs.unshift(breadcrumb);
        });
    }

    _getAncestorStates(curState) {
        const ancestors = [];
        const allStates = this.RouterHelper.getStates();
        while (curState.parent && curState.parent !== 'root' && curState.parent !== 'root.layout') {
            for (let i = 1; i < allStates.length; i++) {
                if (allStates[i].name == curState.parent) {
                    ancestors.unshift(allStates[i]);
                    curState = allStates[i];
                    break;
                }
            }
        }
        return ancestors;
    }
}

breadcrumbCtrl.$inject = ['$state', '$rootScope', 'RouterHelper'];

export default breadcrumbCtrl;
