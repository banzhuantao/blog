# qiankun

[qiankun 官网](https://qiankun.umijs.org/zh)

## 核心原理

qiankun 基于 single-spa 封装，核心原理包括：

- **HTML Entry**：加载子应用的 HTML 作为入口，解析 JS、CSS
- **JS 沙箱**：通过快照沙箱 / 代理沙箱隔离 JS 环境
- **CSS 隔离**：样式前缀改写，防止子应用样式污染
- **应用生命周期**：bootstrap、mount、unmount、update
- **父子应用通信**：全局状态共享

## 常见的问题及解决方案

- **样式污染**：开启严格样式隔离，组件使用 ConfigProvider 前缀
- **公共依赖重复加载**：通过 webpack externals 抽离 Vue / React 等
- **JS 全局污染**：使用 Proxy 沙箱隔离
- **打包体积大**：拆包、按需加载、公共依赖复用
- **子应用切换卡顿**：预加载、缓存实例
- **登录状态共享**：统一 token、cookie domain 设置

## 相比 iframe 有哪些优势？

- 路由同域，体验更流畅
- 无通信限制，可共享依赖
- 样式、JS 隔离可控
- 性能更好，支持预加载
- 易于工程化、自动化部署

## 如何实现公共依赖（Vue、React、组件库）抽离分享

- 父应用通过 `externals` 把公共库打包为全局变量
- 子应用同样配置 `externals`
- 通过 `systemjs` 或 `umd` 方式加载
- 减少重复打包、提升加载速度、降低整体体积

# 预加载机制有什么用？如何配置？

预加载会在浏览器空闲时加载子应用资源，使切换秒开。

配置：

```js
prefetch: true; // 智能预加载
```

或指定预加载列表：

```js
prefetch: ["app1", "app2"];
```

## 路由的核心设计原则

- 统一使用 history 模式（hash 模式兼容性差）
- 主应用管控路由分发，子应用设置独立 base
- activeRule 严格匹配子应用路由前缀
- 子应用切换时，路由自动隔离，不互相干扰
- 主子应用路由跳转互相可控，可通信

## 主应用路由怎么配置

主应用路由只做一件事：配置子应用激活规则

```js
// 主应用注册子应用
registerMicroApps([
  {
    name: "aaa", // aaa子应用
    entry: "http://localhost:8081",
    container: "#container",
    activeRule: "/aaa", // 路由前缀
  },
  {
    name: "bbb", // bbb子应用
    entry: "http://localhost:8082",
    container: "#container",
    activeRule: "/bbb",
  },
]);
```

## 子应用路由如何配置？

子应用必须配置 base，值 = 主应用的 activeRule

**Vue3 子应用**

```js
const router = createRouter({
  history: createWebHistory("aaa"), // 必须写 base
  routes,
});
```

**React 子应用**

```js
<BrowserRouter basename="aaa">
  <App/>
</BrowserRouter>
```

## 主子应用之间如何切换？

- 主应用 跳转 子应用

```js
history.pushState({}, null, "/aaa/list");
```

- 子应用 跳转 主应用

```js
window.history.pushState({}, null, "/dashboard");
```

- 子应用 跳转 另一子应用

```js
window.history.pushState({}, null, "/bbb/map");
```

## 为什么不能用 hash 路由

- hash 路由只有一个 `#`
- 多个子应用无法共用 `#` 区分
- 会导致激活规则失效
- 跳转混乱、无法支持多子应用

## 子应用如何获取主应用的路由信息

### 方案一：Props 传递

**适用场景**

- 子应用只需要挂载时获取一次主应用路由
- 不需要实时监听主应用路由变化
- 快速验证、简单项目

#### 主应用：注册子应用时传递路由信息

```ts
// 主应用 main.ts（Vue/React 通用）
import {registerMicroApps, start} from 'qiankun';
import router from './router'; // 主应用路由实例

registerMicroApps([
  {
    name: 'sub-app',
    entry: '//localhost:3001',
    container: '#subapp-container',
    activeRule: '/sub-app',
    // 关键：通过 props 传递主应用路由信息
    props: {
      // 传递当前路由对象
      mainRoute: router.currentRoute.value, // Vue3
      // mainRoute: router.currentRoute, // Vue2
      // mainRoute: window.location, // 原生/React 最简方式
      // 传递路由实例（可选，不推荐，耦合度高）
      // mainRouter: router
    }
  }
]);

start();
```

#### 子应用：在 mount 生命周期接收

```ts
// 子应用 main.ts（Vue3 示例）
let mainRoute = null;

export async function mount(props) {
  // 接收主应用传递的路由信息
  mainRoute = props.mainRoute;
  console.log('主应用当前路由：', mainRoute);

  // 挂载子应用
  app.mount('#app');
}
```

**缺点**

- 无法实时同步：主应用路由变化后，子应用获取的还是挂载时的旧路由
- 只能在 mount 时获取一次，后续变化无法感知

### 方案二：全局状态管理

这是 qiankun 官方推荐的标准方案，跨框架通用，支持实时监听主应用路由变化，是绝大多数项目的最佳选择。

**核心原理**

利用 qiankun 内置的 initGlobalState 全局状态管理，主应用把路由信息存入全局状态，子应用订阅状态变化，实现路由实时同步。

#### 主应用：初始化全局状态并监听路由变化

```ts
// 主应用 src/store/globalState.ts
import {initGlobalState} from 'qiankun';
import router from '../router';

// 初始化全局状态
const initialState = {
  // 初始路由信息
  mainRoute: router.currentRoute.value,
  // 其他全局状态...
};

const {onGlobalStateChange, setGlobalState} = initGlobalState(initialState);

// 关键：监听主应用路由变化，实时更新全局状态
router.afterEach((to) => {
  setGlobalState({
    mainRoute: to
  });
});

export {onGlobalStateChange, setGlobalState};
```

#### 主应用：注册子应用时传递全局状态方法

```ts
// 主应用 main.ts
import {registerMicroApps, start} from 'qiankun';
import {onGlobalStateChange, setGlobalState} from './store/globalState';

registerMicroApps([
  {
    name: 'sub-app',
    entry: '//localhost:3001',
    container: '#subapp-container',
    activeRule: '/sub-app',
    props: {
      // 传递全局状态方法给子应用
      onGlobalStateChange,
      setGlobalState
    }
  }
]);

start();
```

#### 子应用：订阅全局状态，实时获取路由

```ts
// 子应用 main.ts（Vue3/React 通用）
let mainRoute = null;
let unsubscribe = null;

export async function mount(props) {
  // 1. 立即获取当前主应用路由
  mainRoute = props.mainRoute;
  console.log('挂载时主应用路由：', mainRoute);

  // 2. 订阅全局状态变化，实时更新路由
  unsubscribe = props.onGlobalStateChange((state) => {
    mainRoute = state.mainRoute;
    console.log('主应用路由更新：', mainRoute);
    
    // 在这里可以更新子应用的状态、触发重渲染等
    // 比如 Vue 中可以把 mainRoute 存入 pinia/vuex
    // React 中可以存入 context/useState
  }, true); // true 表示立即执行一次，获取初始状态

  // 挂载子应用
  app.mount('#app');
}

// 关键：子应用卸载时取消订阅，防止内存泄漏
export async function unmount() {
  unsubscribe?.();
  app.unmount();
}
```

**优点**

- **实时同步**：主应用路由变化，子应用立即收到通知
- **跨框架通用**：Vue/React/Angular/ 原生 JS 都能用
- **解耦**：主应用和子应用不直接依赖对方的路由实例
- **可扩展**：可以同时传递其他全局状态（用户信息、权限等）
