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
        lineNumbers: true 
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
        	{text: 'Java技术栈', link: '/Java技术栈/'},
			{text: '技术方案', link: '/技术方案/'},
			{text: '大数据', link: '/大数据/'},
			{text: '分布式', link: '/分布式/'},
			{text: '数据结构和算法', link: '/数据结构和算法/'},
			{text: '消息队列', link: '/消息队列/'},
			{text: 'DevOps', link: '/DevOps/'},
            {text: '博客', link: 'https://www.jianshu.com/u/af08f637aff8'}
        ],
        sidebarDepth: 5
    },
	markdown: {
		extendMarkdown: md => {
		  md.use(require("markdown-it-disable-url-encode"))
		}
	}
}