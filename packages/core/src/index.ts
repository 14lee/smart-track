import { _global, getFlag, setFlag, nativeTryCatch } from '@smart-track/utils';
import { SDK_VERSION, SDK_NAME, EVENT_TYPES } from '@smart-track/common';
import { InitOptions, VueInstance, ViewModel } from '@smart-track/types';
import {
  subscribeEvent,
  notify,
  transportData,
  breadcrumb,
  options,
  handleOptions,
  log,
  setupReplace,
  HandleEvents,
} from './core/index';

function init(options: InitOptions) {
  if (!options.dsn || !options.apikey) {
    return console.error(`smart-track 缺少必须配置项：${!options.dsn ? 'dsn' : 'apikey'} `);
  }
  if (!('fetch' in _global) || options.disabled) return;
  // 初始化配置
  handleOptions(options);
  setupReplace();
}

function install(Vue: VueInstance, options: InitOptions) {
  if (getFlag(EVENT_TYPES.VUE)) return;
  setFlag(EVENT_TYPES.VUE, true);
  const handler = Vue.config.errorHandler;
  // vue项目在Vue.config.errorHandler中上报错误
  Vue.config.errorHandler = function (err: Error, vm: ViewModel, info: string): void {
    HandleEvents.handleError(err);
    if (handler) handler.apply(null, [err, vm, info]);
  };
  init(options);
}

// react项目在ErrorBoundary中上报错误
function errorBoundary(err: Error): void {
  if (getFlag(EVENT_TYPES.REACT)) return;
  setFlag(EVENT_TYPES.REACT, true);
  HandleEvents.handleError(err);
}

function use(Plugin: any, option?: any) {
  const instance = new Plugin(option);
  if (
    !subscribeEvent({
      callback: (data: any) => {
        instance.transform(data);
      },
      type: instance.type,
    })
  ) {
    return;
  }

  nativeTryCatch(() => {
    instance.core({ transportData, breadcrumb, options, notify });
  });
}

export default {
  SDK_VERSION,
  SDK_NAME,
  init,
  install,
  errorBoundary,
  use,
  log,
};
