class PendingRequests {
    constructor(toaster, $timeout, $injector, $rootScope) {
        Object.assign(this, { toaster, $timeout, $injector, $rootScope });

        this.list = [];

        $rootScope.$on('$stateChangeStart', () => {
            this.clear();
        });
    }

    push(canceller) {
        this.list.push(canceller);
    }
    remove(canceller) {
        let index = this.list.indexOf(canceller);
        if (index > -1) {
            this.list.splice(index, 1);
        }
    }
    clear() {
        this.list.forEach(item => {
            item.abort = true;
            item.resolve();
        });
        this.list = [];
    }
}
PendingRequests.$inject = ['toaster', '$timeout', '$injector', '$rootScope'];

export default PendingRequests;
