const variables = {
    cats: [
        { code: 1, name: '火警' },
        { code: 2, name: '爆炸' },
        { code: 3, name: '水灾' }
    ],
    levels: [
        { code: 1, name: '严重' },
        { code: 2, name: '普通' },
        { code: 3, name: '正常' },
        { code: 4, name: '离线' }
    ],
    emgTypes: [
        { code: 1, name: '普通报警' },
        { code: 2, name: '应急' },
    ],
    emgLevels: [
        { code: 0, name: '一般' },
        { code: 1, name: '严重' },
    ],
    emgRuleStates: [
        { code: 0, name: '未生效' },
        { code: 1, name: '已生效' },
        { code: 9, name: '已删除' },
    ],
    alarmstates: [
        { code: 0, name: '未处理' },
        { code: 1, name: '处理中' },
        { code: 2, name: '已处理' }
    ],
    alarmResults: [
        { code: 1, name: '设备维护' },
        { code: 2, name: '误报' },
        { code: 3, name: '设备故障' },
        { code: 4, name: '真实报警' }
    ],
    certificats: [
        { code: 'wx1223vg', name: '电气值班员职业资格证' },
        { code: 'sd7nhy6c', name: '电工进网作业许可证' },
        { code: 'sd23nhy6c', name: '三级电工等级证' }
    ],
    facilitiesTypes: [
        { code: 101, name: '生产设备' },
        { code: 1021, name: '枪机摄像头' },
        { code: 1022, name: '球机摄像头' },
        { code: 1023, name: '半球摄像头' },
        { code: 1031, name: '单向门禁' },
        { code: 1032, name: '双向门禁' },
        { code: 104, name: '消防设备' },
        { code: 105, name: '危化品' },
        { code: 106, name: '定位基站' },
        { code: 107, name: '巡检点' },
        { code: 201, name: '一卡通移动设备' },
        { code: 202, name: '人员定位移动设备' },
        { code: 203, name: '移动终端移动设备' }
    ],
    facilitiesImages: {
        1021: 'assets/images/mark-camera-gun.png',
        1022: 'assets/images/mark-camera-ball.png',
        1023: 'assets/images/mark-camera-dome.png',
        1031: 'assets/images/mark-door-locked.png',
        1032: 'assets/images/mark-door-open.png',
    },
    facilitiesRunningState: [
        { code: 0, value: '正常' },
        { code: 1, value: '离线' },
        { code: 2, value: '报警' }
    ],
    facilitiesState: [
        // { code: -1, value: '未配置' },
        { code: 0, value: '正常' },
        { code: 1, value: '维修中' },
        { code: 9, value: '已损坏' }
    ],
    userGender: [
        { code: 0, value: '男' },
        { code: 1, value: '女' }

    ],
    visitorsState: [
        { code: 0, value: '超时' },
        { code: 1, value: '未离厂' }
    ],
    visitorsState: [
        { code: 0, value: '超时' },
        { code: 1, value: '未离厂' }
    ],
    highchartcolor: {
        serious: 'red',
        normal: 'green',
        line: '#45454d',
        general: '#1a9beb'
        
    }
    
}

export default variables;