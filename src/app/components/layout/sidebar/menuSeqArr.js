// data: {
//     title: '首页', // 用于展示选项卡上的名称
//     description: '', // 页面功能描述
//     _class: 'home', // 页面功能描述
//     requireLogin: true, // 需要加上的特殊的类
//     roles: ['user'], // 赋予菜单权限的用户角色组
//     icon: 'icon-home', // 菜单图标类名
//     type: 2 // 菜单类型（0,1,2,3）
//     // 0: 表示像登录页这种不需要在侧边栏和历史选项卡中显示的菜单
//     // 1: 表示目录
//     // 2: 表示具体在侧边栏显示的菜单项
//     // 3: 表示需要在历史选项卡中显示，但不需要在侧边栏菜单中显示的类型
// },
const menus = [
    { title: '系统首页', type: 2, state: 'home', icon: 'icon-home' },
    { title: '安防管理',
        type: 1,
        state: 'safety',
        icon: 'icon-safety',
        children: [
            { title: '电子地图', type: 2, state: 'zones', icon: 'icon-zones', },
            { title: '临时布防', type: 2, state: 'boundaries', icon: 'icon-boundaries' }
        ]
    },
    { title: '报警管理',
        type: 1,
        state: 'alarmsManage',
        icon: 'icon-alarms',
        children: [
            { title: '报警处置', type: 2, state: 'alarms', icon: 'icon-alarms' },
            { title: '报警规则', type: 2, state: 'rules', icon: 'icon-rules' }
        ]
    },
    { title: '工单管理',
        type: 1,
        state: 'ticketsManage',
        icon: 'icon-workOrders',
        children: [
            { title: '两票联动', type: 2, state: 'tickets', icon: 'icon-tickets' },
            { title: '报警规则', type: 2, state: 'rules', icon: 'icon-rules' }
        ]
    },
    { title: '应急管理',
        type: 1,
        state: 'emg',
        icon: 'icon-emg',
        children: [
            { title: '预案管理', type: 2, state: 'plans', icon: 'icon-plans' },
            { title: '应急指挥', type: 2, state: 'command', icon: 'icon-command' }
        ]
    },
    { title: '人员管理',
        type: 1,
        state: 'peopleManage',
        icon: 'icon-peopleManage',
        children: [
            { title: '人员信息', type: 2, state: 'employees', icon: 'icon-people' },
            { title: '临时授权', type: 2, state: 'assignments', icon: 'icon-cards' }
        ]
    },
    { title: '集成管理',
        type: 1,
        state: 'integration',
        icon: 'icon-integration',
        children: [
            { title: '电子地图', type: 2, state: 'maps', icon: 'icon-maps' },
            { title: '点位管理', type: 2, state: 'positions', icon: 'icon-positions' },
            { title: '设备管理', type: 2, state: 'devices', icon: 'icon-devices' },
            { title: '系统集成', type: 2, state: 'integrations', icon: 'icon-integrations' }
        ]
    },
    { title: '系统管理',
        type: 1,
        state: 'system',
        icon: 'icon-system',
        children: [
            { title: '权限管理', type: 2, state: 'security', icon: 'icon-security' },
            { title: '日志查询', type: 2, state: 'logs', icon: 'icon-logs' },
        ]
    }
]

export default menus;
