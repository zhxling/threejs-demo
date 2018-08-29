window.showResult = data => {
    headerCtrl.showResult(data);
}

class headerCtrl {
    constructor($rootScope, $timeout, $interval, $state, $scope, eventConstant) {
        Object.assign(this, { $rootScope, $timeout, $interval, $state, $scope, eventConstant });

        this.$rootScope.$on(this.eventConstant.loginSuccess, this.updateHeader.bind(this));
        this.$rootScope.$on(this.eventConstant.logoutSuccess, this.updateHeader.bind(this));
        headerCtrl.this = this;

        this.navs = [
            { state: 'home', name: '系统首页' }
        ];
    }

    updateHeader(e, userInfo) {
        if (userInfo) {
            this.isLoggedIn = true;
            this.userInfo = userInfo;
        } else {
            this.isLoggedIn = false;
            this.userInfo = null;
        }
    }

    search(keyword) {
        if (!keyword || keyword.trim() === '') {
            return;
        }

        let s = document.createElement('script');
        s.className = 'searchBaidu';
        s.src = `http://unionsug.baidu.com/su?wd=${encodeURI(keyword.trim())}&p=true&cb=showResult`;
        document.body.appendChild(s);
    }

    static showResult(data) {
        headerCtrl.this.searchResult = data.s;
        let s = document.querySelector('.searchBaidu');
        headerCtrl.this.$scope.$apply()
        document.body.removeChild(s);

        document.onclick = () => {
            headerCtrl.this.searchResult = [];
            headerCtrl.this.$scope.$apply()
        }
    }

    toggleMenu() {
        angular.element('body').toggleClass('mini-navbar');
        if (!angular.element('body').hasClass('mini-navbar') || angular.element('body').hasClass('body-small')) {
            // Hide menu in order to smoothly turn on when maximize menu
            angular.element('#side-menu').hide();
            // For smoothly turn on menu
            this.$timeout(() => {
                angular.element('#side-menu').fadeIn(500);
            }, 100);
        } else {
            // Remove all inline style from jquery fadeIn function to reset menu state
            angular.element('#side-menu').removeAttr('style');
        }
    }
}

headerCtrl.$inject = ['$rootScope', '$timeout', '$interval', '$state', '$scope', 'eventConstant'];

export default headerCtrl;
