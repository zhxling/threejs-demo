import angular from 'angular';

// constant
import eventConstant from './event.constant';
import DATE_RANGES_TIMES from './date-range-picker.constant';

import variables from './variables.constant';

// services
import RouterHelperProvider from './router-helper.provider';
import authService from './authService';
import httpInterceptorService from './httpInterceptorService';
import identityService from './identityService';

// 操作反馈服务
import feedbackService from './feedback.service';

// 存储发送中的请求
import pendingRequests from './pending-requests.factory';

// 会被多个模块功用的一些API服务

const common = angular.module('app.common', []);

common
    .constant('eventConstant', eventConstant)
    .constant('DATE_RANGES_TIMES', DATE_RANGES_TIMES)
    .constant('variables', variables)
    .provider('RouterHelper', RouterHelperProvider)
    .service('authService', authService)
    .service('feedbackService', feedbackService)
    .service('pendingRequests', pendingRequests)
    .factory('httpInterceptorService', httpInterceptorService)
    .service('identityService', identityService)


export default common;
