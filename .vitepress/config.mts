import {defineConfig} from 'vitepress'
import {fileURLToPath, URL} from "node:url"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "BanZhuanTao",
  description: "Learn programming",
  srcDir: "./src",
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../src', import.meta.url))
      }
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: 'Home', link: '/'},
      {text: 'Examples', link: '/markdown-examples'}
    ],
    outline: {
      level: [2, 3],
      label: "本页目录"
    },
    search: {
      provider: 'local'
    },
    sidebar: {
      "/browser/": [
        {
          text: "开始",
          items: [
            {text: '简介', link: '/browser'},
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
      ],
      "/microservice/": [
        {
          text: "开始",
          items: [
            {text: '简介', link: '/microservice'},
          ]
        },
        {
          text: "前端",
          items: [
            {text: 'qiankun', link: '/microservice/qiankun'},
          ]
        },
      ]
    },

    socialLinks: [
      {icon: 'github', link: 'https://github.com/banzhuantao/banzhuantao.github.io'}
    ]
  },

})

