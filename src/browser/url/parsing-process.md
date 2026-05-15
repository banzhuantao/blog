# 从输入 URL 开始到浏览器解析过程

---

**整体分成 7 大阶段：**

- URL 解析 & 缓存判断
- DNS 域名解析
- TCP 三次握手 + HTTPS TLS 协商
- HTTP 请求发送 & 响应接收
- 浏览器解析 HTML / CSS / JS 构建渲染树
- 布局 Layout → 绘制 Paint → 合成 Composite
- JS 执行、事件绑定、页面交互就绪

## 浏览器输入 URL，先做本地预处理

### URL 语法解析

浏览器先拆解 URL 各部分：

协议 `http/https`、域名、端口、路径、参数、哈希 `#`

### 浏览器缓存优先级判断

顺序：

Memory Cache → Disk Cache → 强制缓存 → 协商缓存

- 先看内存缓存：当前 tab 内存里有没有，有直接拿
- 再看硬盘缓存：本地有没有过期缓存
- 没缓存才走网络请求

> 前端关联：
> 静态资源缓存策略、Cache-Control、ETag、Last-Modified 都是在这一步生效。

### HSTS / 预解析

浏览器自带 HSTS 列表，强制跳转 HTTPS；

同时触发 DNS 预解析 `<link rel="dns-prefetch">`。

## DNS 域名解析（域名 → IP）

浏览器不知道域名在哪，必须翻译成服务器 IP。

**递归查询流程**

浏览器缓存 → 系统缓存 → 路由器缓存 → 运营商 DNS → 根域名服务器 → 顶级域名服务器 → 目标域名服务器

**前端关联点**

- 页面多域名请求多，DNS 耗时高
- 优化：`<link rel="dns-prefetch" href="https://xxx.com">` 预解析
- 域名收敛：减少页面跨域名数量，减少 DNS 开销

## TCP 三次握手 + HTTPS TLS 握手

### TCP 三次握手

建立可靠连接，保证数据不丢、不乱序。

### HTTPS TLS 协商（4 次握手）

- 证书校验（域名匹配、是否过期、是否可信）
- 协商加密算法、生成会话密钥
- 之后所有数据加密传输

> 有些网站首次打开慢，就是 TLS 证书校验、握手耗时；
> 优化：**HTTPS 会话复用、HTTP/2、HTTP/3**。

## 发起 HTTP 请求 & 接收响应

### 构建请求报文

请求行、请求头、请求体。

- 请求头 `User-Agent`、`Cookie`、`Referer`、`Origin`
- 跨域就是浏览器在这一步做同源策略拦截

### 服务器处理 & 返回响应

响应行、响应头、响应体（HTML 源码）

### 前端关键知识点

- 跨域 CORS、预检 OPTIONS 请求
- 状态码 200/301/302/304/404/502
- 响应头控制缓存、跨域、内容类型

## 浏览器解析 HTML，构建 DOM 树

**字节流 → 词法解析 → 语法解析 → DOM 树**

浏览器一边下载 HTML、一边流式解析，不用等全部下载完。

**关键规则**

- 遇到 `<link>` 外链 CSS：并行下载，不阻塞 HTML 解析，但阻塞渲染
- 遇到 `<script>` 外链 JS：阻塞 HTML 解析、阻塞渲染
  - 没有 `defer/async` 时，页面会卡在这
- `defer`：后台下载，顺序执行，等 HTML 解析完再跑
- `async`：后台下载，下载完立刻乱序执行

> JS 放底部、defer/async、动态 import 按需加载，都是为了不阻塞 HTML 解析。

## 解析 CSS，生成 CSSOM 树 + 渲染树

- 浏览器解析 CSS → 生成 CSSOM 样式规则树
- DOM + CSSOM 合并 → 渲染树 Render Tree
  - 只包含需要显示的节点
  - `display: none` 不会进入渲染树
  - `visibility: hidden` 会进渲染树，占空间

## 页面渲染三大流程

### Layout 布局（重排）

根据渲染树，计算每个元素精确宽高、位置、几何坐标。

**触发重排场景：**

- 改变宽高、边距、定位、字体大小
- 获取 offsetTop /offsetLeft/clientWidth 等布局属性

> 循环频繁读写布局属性，导致强制同步布局、大量重排卡顿。

### Paint 绘制（重绘）

按照布局结果，填充像素：

颜色、背景、阴影、文字、图片。

只改颜色、背景 → 只重绘，不重排，性能更好。

### Composite 图层合成

浏览器把页面分成多个合成图层，交给 GPU 合成。

**开启独立图层条件**

- `transform: translateZ(0)`
- `will-change`
- 3D transform、video、canvas

> 能用 transform/opacity 做动画，绝不改 top/left
> 因为 transform 只走 合成层，不触发重排、重绘，GPU 加速丝滑。

## JS 执行、DOMContentLoaded、Load 事件

### JS 执行

JS 可以操作 DOM/CSS，会重新触发渲染树、重排重绘。

### DOMContentLoaded

HTML 解析完、DOM 构建完成，不用等图片、样式、视频

→ 前端适合在这里初始化业务逻辑、挂载 Vue/React 根实例

### window.onload

所有资源（图片、字体、视频、样式）全部加载完才触发

→ 适合做页面统计、加载完成弹窗

## 整条链路对应 前端工程师 的工作

| 阶段       | 	前端日常工作 & 优化点                  |
|----------|--------------------------------|
| 缓存	      | 配置 Cache-Control、静态资源缓存、哈希命名   | 
| DNS	     | dns-prefetch、减少多域名             |
| 网络	      | 启用 HTTP2、CDN、压缩 gzip           |
| 请求	      | 跨域处理、接口超时、请求头配置                |
| HTML 解析	 | JS 放底部、defer/async、避免阻塞        |
| 渲染树	     | 合理使用 display:none 减少渲染节点       |
| 重排重绘	    | 避免频繁操作 DOM、批量修改样式              |
| 动画	      | 用 transform/opacity 做动画，GPU 加速 |
| 事件	      | 利用 DOMContentLoaded 合理时机初始化代码  |

## 简述

URL 解析查缓存 → DNS 域名解析 → TCP 握手 + HTTPS 加密
→ HTTP 请求响应 → 解析 HTML 建 DOM
→ 解析 CSS 建 CSSOM 合成渲染树 → 布局重排
→ 绘制重绘 → 图层合成 → JS 执行页面就绪。
