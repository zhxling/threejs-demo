function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link(scope, element) {
            // Call metsi to build when user signup
            scope.$watch('authentication.user', function () {
                $timeout(function () {
                    element.metisMenu();
                });
            });


            // Colapse menu in mobile mode after click on element
            let menuElement = angular.element('#side-menu a:not([href$="\\#"])');
            menuElement.click(function () {
                if (angular.element(window).width() < 769) {
                    angular.element('body').toggleClass('mini-navbar');
                }
            });

            // Enable initial fixed sidebar
            if (angular.element('body').hasClass('fixed-sidebar')) {
                let sidebar = element.parent();
                sidebar.slimScroll({
                    height: '100%',
                    railOpacity: 0.9
                });
            }

        }
    };
}

sideNavigation.$inject = ['$timeout'];

export { sideNavigation };
