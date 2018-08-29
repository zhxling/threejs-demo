import config from '../../config'

const apiUrl = config.api;
const errorObject = {
    '-1': '请求超时，请稍后重试或联系管理员',
    400: '请求参数错误, 请修改数据后再重试',
    401: '无相关权限，请联系管理员进行相关授权',
    403: '服务器拒接请求',
    404: '找不到相关资源',
    408: '请求超时，请稍后重试',
}
/* eslint-disable */
function httpInterceptorService($q, $cookies, feedbackService, pendingRequests, $timeout) {
    return {
        request: (config)=>{

            // 这是错误中恢复的情况
            if(config.reload) {
                delete config.reload;
                return config;
            }


            if(!config.cached) {
                if(!config.mockBaseUrl) {
                    delete config.mockBaseUrl;
                    config.url = apiUrl.apiBaseUrl + config.url;
                }else {
                    config.url = apiUrl.baseUrl + config.url;
                }
    
            }
            
            const userInfo = $cookies.getObject('userInfo');
            if(config.needAuthHeaders && userInfo) {
                delete config.needAuthHeaders;
                config.headers = {
                    'Content-Type': 'application/json;',
                    Authorization: `Bearer ${userInfo.token}`
                };
            }
            
            //发送请求是否需要禁止页面操作
            if(config.lockPage) {
                feedbackService.loading('', false);
            }

            // 为了在切换功能页面时中断所有前面的http请求
            // 自动中断的canceller
            // 主动传入 `timeout` 不自动中断
            if(true) {
                let canceller;
                canceller = $q.defer();
                config.timeout = canceller.promise;
                config.canceller = canceller;
                pendingRequests.push(canceller);

                // 设置超时报错
                $timeout(() => {
                    if(!config.canceller.abort) {
                        config.canceller.resolve();
                    }
                }, 60000)
            }
            return config;
        },
    
        response(response) {
            // 请求已完成，从 pending 中移除
            pendingRequests.remove(response.config.canceller);
            // 如果存在 加载中弹窗，则关闭
            feedbackService.closeLoading();

            if(response.config.successModal) {
                feedbackService.toasterSuccess( typeof response.config.successModal === 'string' ? typeof response.config.successModal : '保存成功');
            }
            return response || $q.when(response); // 或者 $q.when(config);
        },

        /**
         * 请求发生了错误,如果能从错误中恢复,可以返回一个新的请求或promise
         * return rejection; // 或新的promise
         * 或者,可以通过返回一个rejection来阻止下一步
         */
        requestError: (rejection)=>{
            // 请求已完成，从 pending 中移除
            pendingRequests.remove(rejection.config.canceller);
            return $q.reject(rejection);
        },
        /**
         * 请求发生了错误,如果能从错误中恢复,可以返回一个新的响应或promise
         * return response; // 或新的promise
         * 或者,可以通过返回一个rejection来阻止下一步
         */
        responseError: (response) => {
            // 如果存在 加载中弹窗，则关闭
            feedbackService.closeLoading();
            // 请求已完成，从 pending 中移除
            pendingRequests.remove(response.config.canceller);
            // 因为这是在切换功能页面时中断所有前面的http请求，所以不报错
            if(response.config.canceller.abort) {
                return $q.reject(response);
            }

            // 当不需要拦截时，比如login接口
            if(response,config.ingoreErrorIntercept) {
                if(response.status === -1) {
                    feedbackService.error('', response.status, errorObject[response.status] || '操作失败');
                    return $q.reject(response); 
                } else {
                    return $q.reject(response); 
                }
            }

            switch (response.status) {
                // 请求超时
                case 408:
                    feedbackService.reTry(
                        (response.data ? response.data.code : '') || response.status,
                        (response.data ? response.data.message : '') || errorObject[response.status] || '操作失败',
                        response.config
                    );
                    // TODO 重试后的异步处理暂时不知道怎么做
                    return $q.reject(response); 
            
                default:
                    if (response.data) {
                        if (response.data.message) {
                            feedbackService.error('', response.data.code, response.data.message);
                        } else {
                            feedbackService.error('', response.status, errorObject[response.status] || '操作失败');
                        }
                    } else {
                        feedbackService.error('', response.status, errorObject[response.status] || '操作失败');
                    }
                    return $q.reject(response);
            }

             
        },
    
        getQueryParam: (queryFormParam, paginationOption) => {
            let paginationOptionString = '';
            for(let key in paginationOption) {
                if(paginationOption[key] === 0 || paginationOption[key]) {
                    paginationOptionString += (paginationOptionString ? '&' : '') + key + '=' + paginationOption[key];
                }
            }
            
            this.queryParams = queryFormParam ? (queryFormParam + '&' + paginationOptionString) : '?' + paginationOptionString;
            return queryFormParam ? (queryFormParam + '&' + paginationOptionString) : '?' + paginationOptionString;
        }
    }
}

httpInterceptorService.$inject = ['$q', '$cookies', 'feedbackService', 'pendingRequests', '$timeout'];

export default httpInterceptorService;
