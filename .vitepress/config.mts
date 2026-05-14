import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "BanZhuanTao",
  description: "Learn programming",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: 'Home', link: '/'},
      {text: 'Examples', link: '/markdown-examples'}
    ],
    sidebar: {
      "/browser/": [
        {
          text: "开始",
          items: [
            {text: '简介', link: '/browser'},
            {text: 'Markdown Examples', link: '/browser/markdown-examples'},
            {text: 'Runtime API Examples', link: '/browser/api-examples'}
          ]
        },
        {
          text: "URL",
          items: [
            {text: '解析过程', link: '/browser/url/parsing-process'},
          ]
        }
      ],
      "/vue/": [
        {
          text: "开始",
          items: [
            {text: '简介', link: '/vue'},
          ]
        },
      ],
      "/react/": [
        {
          text: "开始",
          items: [
            {text: '简介', link: '/react'},
          ]
        },
      ]
    },

    socialLinks: [
      {icon: 'github', link: 'https://github.com/banzhuantao/banzhuantao.github.io'}
    ]
  },
  srcDir: "./src",
})

