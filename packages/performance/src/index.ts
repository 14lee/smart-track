import { SdkBase, BasePlugin } from '@smart-track/types';
import { EVENT_TYPES, STATUS_CODE } from '@smart-track/common';
import { getTimestamp, _global, on } from '@smart-track/utils';
import { getWebVitals, getResource } from './core/performance';

export default class WebPerformance extends BasePlugin {
  type: string;

  constructor() {
    super(EVENT_TYPES.PERFORMANCE);
    this.type = EVENT_TYPES.PERFORMANCE;
  }

  bindOptions() {}

  core({ transportData }: SdkBase) {
    // 获取FCP、LCP、TTFB、FID等指标
    getWebVitals((res: any) => {
      // name指标名称、rating 评级、value数值
      const { name, rating, value } = res;
      transportData.send({
        type: EVENT_TYPES.PERFORMANCE,
        status: STATUS_CODE.OK,
        time: getTimestamp(),
        name,
        rating,
        value,
      });
    });

    const observer = new PerformanceObserver(list => {
      for (const long of list.getEntries()) {
        // 上报长任务详情
        transportData.send({
          type: EVENT_TYPES.PERFORMANCE,
          name: 'longTask',
          longTask: long,
          time: getTimestamp(),
          status: STATUS_CODE.OK,
        });
      }
    });
    observer.observe({ entryTypes: ['longtask'] });

    on(_global, 'load', () => {
      // 上报资源列表
      transportData.send({
        type: EVENT_TYPES.PERFORMANCE,
        name: 'resourceList',
        time: getTimestamp(),
        status: STATUS_CODE.OK,
        resourceList: getResource(),
      });

      // 上报内存情况, safari、firefox不支持该属性
      if (performance.memory) {
        transportData.send({
          type: EVENT_TYPES.PERFORMANCE,
          name: 'memory',
          time: getTimestamp(),
          status: STATUS_CODE.OK,
          memory: {
            jsHeapSizeLimit: performance.memory && performance.memory.jsHeapSizeLimit,
            totalJSHeapSize: performance.memory && performance.memory.totalJSHeapSize,
            usedJSHeapSize: performance.memory && performance.memory.usedJSHeapSize,
          },
        });
      }
    });
  }

  transform() {}
}
