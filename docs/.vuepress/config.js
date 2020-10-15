module.exports = {
    title: 'PYY在线笔记文档',
    description: 'PYY在线笔记文档',
    head: [ // 注入到当前页面的 HTML <head> 中的标签
        ['link', {rel: 'icon', href: '/img/logo.png'}], // 增加一个自定义的 favicon(网页标签的图标)
    ],
	// 这是部署到github相关的配置
    base: '/study/',
    markdown: {
		// 代码块显示行号
        lineNumbers: false 
    },
    plugins: [
	"reading-progress",
    "rpurl",
    "@vuepress/back-to-top",
	'permalink-pinyin', ['autobar', {'pinyinNav': true}]],
    themeConfig: {
        logo: '/img/logo.png',
		// 导航栏配置
        nav: [
			{text: '分布式', link: '/分布式/'},
			{text: 'DevOps', link: '/DevOps/'},
			{text: '大数据', link: '/大数据/'},
            {text: '博客', link: 'https://www.jianshu.com/u/af08f637aff8'}
        ],
        sidebarDepth: 5
    }
}