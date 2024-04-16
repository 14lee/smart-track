# Smart Track 前端监控SDK

前端监控SDK，可用来收集并上报：代码报错、性能数据、页面录屏、用户行为、白屏检测等个性化指标数据

## 功能

* [✅] ✈️ 错误捕获：代码报错、资源加载报错、接口请求报错
* [✅] ✈️ 性能数据：FP、FCP、LCP、CLS、TTFB、FID
* [✅] ✈️ 用户行为：页面点击、路由跳转、接口调用、资源加载
* [✅] ✈️ 个性化指标：Long Task、Memory 页面内存、首屏加载时间
* [✅] ✈️ 白屏检测：检测页面打开后是否一直白屏
* [✅] ✈️ 错误去重：开启缓存队列，存储报错信息，重复的错误只上报一次
* [✅] 🚀 手动上报错误
* [✅] 🚀 支持多种配置：自定义 hook 与选项
* [✅] 🚀 支持的 Web 框架：vue2、vue3、React

---

## 安装

```code
// 安装核心模块
pnpm install @smart-track/core

// 安装性能检测插件
$ pnpm install @smart-track/performance

// 安装页面录屏插件
$ pnpm install @smart-track/recordscreen
```
