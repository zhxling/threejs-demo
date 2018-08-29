class paginatorService {
    constructor($timeout) {
        Object.assign(this, {
            $timeout
        });

        this.limit = 10;
    }
    getOptions() {
        return {
            bootstrapMajorVersion: 3,
            size: 'small',
            currentPage: 1,
            numberOfPages: 5,
            totalPages: 1,
            shouldShowPage: true,
            pageSize: this.limit,
            itemContainerClass(type, page, current) {
                if (type !== 'page' && page === current) {
                    return 'disabled';
                }
                if (type === 'page' && page === current) {
                    return 'active';
                }
                return undefined;
            },
            itemTexts(type, page) {
                switch (type) {
                case 'first':
                    return '<i class="icon-first"></i>';
                case 'prev':
                    return '<i class="icon-prev"></i>';
                case 'next':
                    return '<i class="icon-next"></i>';
                case 'last':
                    return '<i class="icon-last"></i>';
                case 'page':
                    return page;
                }
            }
        }
    }

    /**
     * options {
     *      currentPage: 当前页，
     *      offset: 偏移页数,
     *      totalCount: 结果总数量
     * }
     */

    setPaginator(elementId, options, callBack) {
        // fix 当没有记录的时候
        options.totalCount = options.totalCount || 1;
        let _ownOption = this.getOptions();

        let _totalPages = Math.ceil(options.totalCount / _ownOption.pageSize);
        Object.assign(_ownOption, {
            currentPage: options.currentPage,
            numberOfPages: _totalPages <= 5 ? _totalPages : 5,
            totalPages: _totalPages,
            onPageClicked: (event, originalEvent, type, page) => {
                if (page !== options.currentPage) {
                    options.currentPage = page;
                    options.offset = (page - 1) * _ownOption.pageSize;

                    const currentPage = page;
                    const offset = (page - 1) * _ownOption.pageSize;

                    callBack && callBack(currentPage, offset, false);
                }
            }
        });

        this.$timeout(() => {
            $("[data-toggle='tooltip']").tooltip();
            let element = $(`.${elementId}`);
            element.bootstrapPaginator(_ownOption, element);
        });
    }
}
paginatorService.$inject = ['$timeout'];

export default paginatorService;
