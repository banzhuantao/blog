# 从输入 URL 开始到浏览器解析过程

---

整体分成 7 大阶段：

- URL 解析 & 缓存判断
- DNS 域名解析
- TCP 三次握手 + HTTPS TLS 协商
- HTTP 请求发送 & 响应接收
- 浏览器解析 HTML / CSS / JS 构建渲染树
- 布局 Layout → 绘制 Paint → 合成 Composite
- JS 执行、事件绑定、页面交互就绪

## 一、浏览器输入 URL，先做本地预处理

### 1. URL 语法解析

浏览器先拆解 URL 各部分：

协议 `http/https`、域名、端口、路径、参数、哈希 `#`

### 2. 浏览器缓存优先级判断

### 3. HSTS / 预解析

顺序：

Memory Cache → Disk Cache → 强制缓存 → 协商缓存

## 二、DNS 域名解析（域名 → IP）

## 三、TCP 三次握手 + HTTPS TLS 握手

## 四、发起 HTTP 请求 & 接收响应

## 五、浏览器解析 HTML，构建 DOM 树

## 六、解析 CSS，生成 CSSOM 树 + 渲染树

## 七、页面渲染三大流程

## 八、JS 执行、DOMContentLoaded、Load 事件

## 九、前端工程师视角：整条链路对应我们的工作

## 十、极简汇总
