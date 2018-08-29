import menuSeqArr from './menuSeqArr';

class SidebarCtrl {
    constructor(RouterHelper, $scope, $state, $rootScope) {
        Object.assign(this, { RouterHelper, $scope, $state, $rootScope });

        // generate sidebar nav menus
        const self = this;
        self.navs = this._getNavMenus();

        // tell others we have sidebar
        this.$rootScope.hasSidebar = true;
        this.$scope.$on('$destroy', () => {
            this.$rootScope.hasSidebar = false;
        });

        this.systems = [
            { title: '粒子系统',
                state: 'safety',
                bgClass: 'bg-safety',
                subSystems: [
                    { title: '烟花效果', state: 'fireworks', icon: 'icon-menu-video-monitor' },
                    { title: '粒子转场', state: 'point-turnarounds', icon: 'icon-menu-access-control' },
                ]
            }
        ]
    }

    hideSidebar() {
        this.$rootScope.showSidebar = false;
    }

    _getNavMenus() {
        const allStates = this.RouterHelper.getStates();

        const navs = SidebarCtrl.formatMenu(allStates);
        return navs;
    }


    static formatMenu(rawData) {
        let data = $.extend([], rawData);
        let i;
        let j;

        for (i = 0; i < menuSeqArr.length; i++) {
            let flag = true;
            if (menuSeqArr[i].type === 2) {
                for (j = 0; j < data.length; j++) {
                    if (data[j].name === menuSeqArr[i].state) {
                        flag = false;
                        menuSeqArr[i].data = data[j].data
                        menuSeqArr[i].parent = data[j].parent
                        menuSeqArr[i].params = data[j].params
                        break;
                    }
                }

                if (flag) {
                    menuSeqArr.splice(i, 1);
                    i--;
                    continue;
                }
            } else if (menuSeqArr[i].type === 1) {
                for (j = 0; j < menuSeqArr[i].children.length; j++) {
                    flag = true
                    for (let k = 0; k < data.length; k++) {
                        if (data[k].name === menuSeqArr[i].children[j].state) {
                            flag = false;
                            menuSeqArr[i].children[j].data = data[j].data
                            menuSeqArr[i].children[j].parent = data[j].parent
                            menuSeqArr[i].children[j].params = data[j].params
                            break;
                        }
                    }

                    if (flag) {
                        menuSeqArr[i].children.splice(j, 1);
                        j--;
                        continue;
                    }
                }

                if (!menuSeqArr[i].children.length) {
                    menuSeqArr.splice(i, 1);
                    i--;
                    continue;
                }
            }

        }

        return menuSeqArr;

    }
}

SidebarCtrl.$inject = ['RouterHelper', '$scope', '$state', '$rootScope'];

export default SidebarCtrl;
