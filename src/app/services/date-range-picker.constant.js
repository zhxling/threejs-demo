const DATE_RANGES_TIMES = {
    locale: {
        applyClass: 'btn-green',
        applyLabel: '确定',
        cancelLabel: '取消',
        fromLabel: '开始',
        format: 'YYYY-MM-DD',
        toLabel: '到',
        customRangeLabel: '自定义时间区间',
        daysOfWeek: ['六', '日', '一', '二', '三', '四', '五'],
        firstDay: 1,
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月',
            '十月', '十一月', '十二月',
        ],
    },
    maxDate: moment(), // 最大值今天
    minDate: moment().subtract(90, 'days'), // 最长允许选择90天
    ranges: {
        今天: [
            moment(),
            moment()
        ],
        昨天: [
            moment().subtract(1, 'days'),
            moment().subtract(1, 'days'),
        ],
        过去7天: [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
        过去30天: [moment().subtract(30, 'days'), moment().subtract(1, 'days')]
    },
}

export default DATE_RANGES_TIMES
