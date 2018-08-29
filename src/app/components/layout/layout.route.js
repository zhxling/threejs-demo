import layoutHtml from './layout.html';
import { headerHtml } from './header';
import { footerHtml } from './footer';
import { sidebarHtml } from './sidebar';
// import { breadcrumbHtml } from './breadcrumb';
// import { historyTabHtml } from './historyTab';

function appLayoutRun(RouterHelper, $rootScope) {
    RouterHelper.configureStates(getStates());
    $rootScope.$on('$stateChangeStart', (event, toState) => {
        // 控制当前菜单不隶属于左侧菜单时是否隐藏左侧菜单
        // if (toState.hideSidebar
        // || (toState.views && toState.views['sidebar@root'] && toState.views['sidebar@root'].hide)) {
        //     $('body').addClass('hide-sidebar');
        // } else {
        //     $('body').removeClass('hide-sidebar');
        // }
    });
}

appLayoutRun.$inject = ['RouterHelper', '$rootScope'];

function getStates() {
    return [
        {
            state: 'root',
            config: {
                abstract: true,
                url: '',
                template: layoutHtml
            }
        },
        {
            state: 'root.layout',
            config: {
                abstract: true,
                url: '',
                views: {
                    sidebar: {
                        template: sidebarHtml,
                        controller: 'sidebarCtrl as vm'
                    },
                    header: {
                        template: headerHtml,
                        controller: 'headerCtrl as vm'
                    },
                    // breadcrumb: {
                    //     template: breadcrumbHtml,
                    //     controller: 'breadcrumbCtrl as vm'
                    // },
                    // historyTab: {
                    //     template: historyTabHtml,
                    //     controller: 'historyTabCtrl as vm'
                    // },
                    footer: {
                        template: footerHtml,
                        controller: 'footerCtrl as vm'
                    },
                }
            }
        }
    ];
}

export default appLayoutRun;
