/**
 * Created by fanqifeng on 17-11-2.
 */
import Promise from 'es6-promise';
Promise.polyfill();

// 加载第三方依赖(安装的依赖包如果不能直接require进来，就需要写完全路径去加载进来)
// 当路径不以./或../开头时，webpack会自动从node_modules里面去加载依赖包
// 加载依赖包时，第三方文件放前面，再放./开头路径的具体文件，再是js其他语句（如window.moment= moment）；
import angular from 'angular';
import 'angular-cookies';
import 'angular-sanitize';
import 'angular-animate';
import 'angular-ui-router';
import 'angular-messages';
import 'angular-resource';
import 'angular-loading-bar';
import 'ng-dialog';
import 'angular-file-upload';
import 'angular-ui-bootstrap';
import 'angular-wizard';
import 'ui-select';
import 'paginator';
import 'nestable';
import 'highcharts-ng';
import 'angular-datepicker';
import 'daterangepicker';
import 'snapsvg';
import 'snap.svg.zpd';
import 'snap.svg.ele.zpdr';
import 'steps'
import 'jquery';
import 'bootstrap/dist/js/bootstrap.min';
import 'metismenu/dist/metisMenu.min';
import 'angular-md5/angular-md5.min';
import 'angular-file-upload';
import 'angularjs-toaster';
// require('bootstrap-datetime-picker');
// require.ensure([], function () {
//     require('bootstrap-datetime-picker/js/locales/bootstrap-datetimepicker.zh-CN');
// });
// import 'bootstrap-daterangepicker';
// import 'angular-daterangepicker';
// swal
import swal from 'sweetalert';
window.swal = swal;
//moment
import 'moment/locale/zh-cn';
import moment from 'moment';
window.moment = moment;
//
import 'select2';
import 'footable';

// 404
// import {
//     config
// } from './app/config/config.module'

//加载样式文件
import 'css-import';
// 引入一些公共的服务，指令，过滤器，还有layout
import commonService from './app/services';
import directives from './app/directives';
import filters from './app/filters';
import layout from './app/components/layout';

let ngDepModules = [
    require('oclazyload'),
    require('angular-cookies'),
    require('angular-sanitize'),
    require('angular-animate'),
    require('angular-ui-router'),
    require('angular-messages'),
    require('angular-loading-bar'),
    require('angular-resource'),
    require('angular-ui-bootstrap'),
    require('angular-md5'),
    require('ng-dialog'),
    'highcharts-ng',
    'nestable',
    'paginator',
    'angularFileUpload',
    'toaster',
    'ngDialog',
    'mgo-angular-wizard',
    commonService.name,
    directives.name,
    filters.name,
    layout.name,
]

// 功能模块
const Routers = require.context('./app/modules', true, /\.route.*\.js$/);

Routers.keys().forEach(key => {
    ngDepModules.push(Routers(key).default.name);
});

// 打包images
require.context('./app/assets/images', true, /\.(svg|jpeg|jpg|png|FBX)$/);

angular.module('webApp', ngDepModules)
    .run(['$rootScope', '$state', 'authService', '$interval', 'feedbackService',
        ($rootScope, $state, authService, $interval, feedbackService) => {
            $rootScope.systemTitle = 'threejs-demo';
            $rootScope.$state = $state;

            /*
            * 时间处理
            */
            let weeks = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
            $interval(() => {
                $rootScope.systemTime = moment().format('HH : mm');
                $rootScope.systemWeek = weeks[moment().format('e')];
                $rootScope.systemDate = moment().format('YYYY-MM-DD');
            }, 1000)

            $rootScope.$on('$stateChangeStart', (event, toState, toParams) => {

                $rootScope.toState = toState;
                $rootScope.toStateParams = toParams;

                // 如果离开页面需要提示时，只需要在进入该页面时设置localStorage.setItem('leaveModal',true));
                if (localStorage.getItem('leaveModal')) {
                    event.preventDefault();
                    feedbackService.warn('页面还未保存，确定要离开吗？', () => {
                        localStorage.removeItem('leaveModal');
                        $state.go(toState, toParams)
                    });
                }

                authService.authorize(event, toState, toParams);
            });
        }
    ]);

// 初始化APP
angular.element(document).ready(() => {
    angular.bootstrap(document, ['webApp']);
});