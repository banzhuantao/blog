# qiankun

[qiankun 官网](https://qiankun.umijs.org/zh)

## qiankun 的核心原理是什么？

qiankun 基于 single-spa 封装，核心原理包括：

- **HTML Entry**：加载子应用的 HTML 作为入口，解析 JS、CSS
- **JS 沙箱**：通过快照沙箱 / 代理沙箱隔离 JS 环境
- **CSS 隔离**：样式前缀改写，防止子应用样式污染
- **应用生命周期**：bootstrap、mount、unmount、update
- **父子应用通信**：全局状态共享
