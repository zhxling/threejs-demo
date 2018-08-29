class feedbackService {
    constructor($timeout, $injector) {
        Object.assign(this, { $timeout, $injector });
    }

    // 成功toaster
    toasterSuccess(content) {
        let div = $(`
            <div class='toaster-success'>
                <h5><i class='icon-info'></i>${content || '提交成功'}</h5>
                <i class='icon-close swal-close'></i>
            </div>
        `);

        div.find('.icon-close').click(() => {
            div.remove();
        })

        $('body').append(div);
        // this.$timeout(() => {
        //     div.remove();
        // }, 3000);
    }

    // 成功弹窗
    success(content) {
        const cnt = $(`
            <div class='swal-info swal-success'>
                <i class='icon-info'></i>${content || '提交成功'}
            </div>
        `);
        swal({
            content: cnt[0],
            button: {
                text: '确定',
                className: 'btn-primary'
            }
        });
    }

    // 一般危险操作弹窗
    warn(content, callback) {
        const cnt = $(`
        <div class="swal-before">
            <div class="swal-info">
                <i class="icon-error warning"></i>
                <div>${content || '这是一个危险操作，请检查好信息再提交'}</div>
            </div> 
        </div>`
        );
        swal({
            content: cnt[0],
            buttons: {

                cancel: {
                    text: '取消',
                    className: 'btn-secondary',
                    visible: true,
                    closeModal: true,
                },
                confirm: {
                    text: '确定',
                    className: 'btn-primary',
                    closeModal: true
                },
            },
        }).then(confirm => {
            if (confirm) {
                callback && callback();
            }
        });
    }

    // 非常危险操作弹窗
    danger(content, callback) {
        const cnt = $(`
        <div class="swal-before">
            <div class="swal-info">
                <i class="icon-error danger"></i>
                <div>${content || '这是一个危险操作，请检查好信息再提交'}</div>
            </div> 
        </div>`
        );
        swal({
            content: cnt[0],
            buttons: {
                cancel: {
                    text: '取消',
                    className: 'btn-secondary',
                    visible: true,
                    closeModal: true,
                },
                confirm: {
                    text: '确定',
                    className: 'btn-primary',
                    closeModal: true
                }
            },
        }).then(confirm => {
            if (confirm) {
                callback && callback();
            }
        });
    }

    // 错误弹窗
    error(title, errCode, errContent) {
        const cnt = $(`
        <div>
            <h5 ><i class="icon-error"></i>${title || '后台服务错误'}</h5>
            <div class="swal-info">
                ${errCode ? `<div class="error-code">错误码：${errCode}</div>` : ''}
                ${errContent || '操作失败'}
            </div> 
        </div>`
        );
        swal({
            content: cnt[0],
            button: {
                text: '确定',
                className: 'btn-primary'
            }
        });
    }

    // 后端服务错误，重试弹窗
    reTry(errCode, errContent, httpCofig) {
        const cnt = $(`
        <div>
            <h5 ><i class="icon-error"></i>操作失败</h5>
            <div class="swal-info">
                <div class="error-code">错误码：${errCode}</div>
                ${errContent || '操作失败'}
            </div> 
        </div>`
        );
        swal({
            content: cnt[0],
            buttons: {
                cancel: {
                    text: '取消',
                    className: 'btn-secondary',
                    visible: true,
                    closeModal: true,
                },
                confirm: {
                    text: '重试',
                    className: 'btn-primary',
                    closeModal: true
                }
            },
        }).then(confirm => {
            if (confirm) {
                httpCofig.reload = true;
                this.loading('', false);
                this.$injector.get('$http')(httpCofig);
            }
        });
    }

    // 加载中弹窗
    loading(content, closeBtn, callback) {
        closeBtn = closeBtn === undefined ? true : closeBtn;
        const div = $(`
            <div class='swal-overlay swal-overlay--show-modal swal-loading'>
                <div class="swal-modal">
                    <div class="swal-content">
                        <div class='swal-info swal-success swal-loading'>
                            <i class='icon-loading rotate'></i>${content || '拼命加载中，请耐心等候<dot> . . .</dot>'}
                         </div>
                    </div>
                    ${closeBtn ? `<div class="swal-footer">
                        <div class="swal-button-container">
                            <button class="swal-button swal-button--confirm btn-danger">中止</button>
                        </div>
                    </div>` : ''}
                </div>
            </div>
        `);
        div.find('.btn-danger').click(() => {
            callback && callback();
            div.remove();
        })

        $('body').append(div);
    }

    // 关闭加载中弹窗
    closeLoading() {
        $('.swal-loading').remove();
    }
}
feedbackService.$inject = ['$timeout', '$injector'];

export default feedbackService;
