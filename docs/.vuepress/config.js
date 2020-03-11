module.exports = {
    title: 'PYY-ADMIN在线文档',
    description: 'PYY-ADMIN在线文档',
    head: [ // 注入到当前页面的 HTML <head> 中的标签
        ['link', {rel: 'icon', href: '/img/logo.png'}], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    base: '/', // 这是部署到github相关的配置
    markdown: {
        lineNumbers: false // 代码块显示行号
    },
    plugins: ['permalink-pinyin', ['autobar', {'pinyinNav': true}]],
    themeConfig: {
        logo: '/img/logo.png',
        nav: [ // 导航栏配置
            {text: '指南', link: '/指南/'},
            {text: 'v1.0', link: '/v1.0/'},
            {text: '博客', link: 'https://www.jianshu.com/u/af08f637aff8'},
            {text: 'Github', link: 'https://github.com/pyy-admin-x'},

        ],
        sidebarDepth: 1, // 侧边栏显示2级
    }
};