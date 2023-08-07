### 说明

这是一个数据持久化插件，该 pinia 插件只是在 [pinia-plugin-persist](https://github.com/Seb-L/pinia-plugin-persist) 的基础上兼容了 uniapp。

### 安装

```shell
npm install @sdb/pinia-uniapp-persist -D
```

### 设置

```vue
import { createSSRApp } from 'vue';
import App from './App.vue';
import piniaPersist from '@sdb/pinia-uniapp-persist'

const pinia = createPinia();
pinia.use(piniaPersist);

export function createApp() {
  const app = createSSRApp(App);
  app.use(pinia);
  return {
    app,
	pinia
  };
}
```

### 基本用法

通过在存储上启用持久插件，默认情况下，整个状态将存储在会话存储中。

```typescript
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCounterStore = defineStore(
  'counter',
  () => {
    const counter = ref(0);

    function increment() {
      counter.value++;
    }

    function decrement() {
      counter.value--;
    }

    return {
      counter,
      increment,
      decrement
    };
  },
  {
    persist: {
      enabled: true
    }
  }
);
```

### 高级用法

#### 1. 策略

可以使用多种策略来保存商店数据。

```typescript
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCounterStore = defineStore(
  'counter',
  () => {
    const counter = ref(0);

    function increment() {
      counter.value++;
    }

    function decrement() {
      counter.value--;
    }

    return {
      counter,
      increment,
      decrement
    };
  },
  {
    persist: {
      enabled: true,
      strategies: [], // <- HERE
    }
  }
);
```

每个策略都是一个对象，如下所示：

```typescript
interface PersistStrategy {
  key?: string; // Storage key
  storage?: Storage; // 实现了Storage接口的对象 (default: uniappStorage)
  paths?: string[]; // list ok state keys you want to store in the storage
}
```

#### 2. 自定义存储关键字

您可以通过在每个策略中设置 key 来设置自定义存储关键字，在示例中，整个状态将存储在 localStorage 中的 count。

```typescript
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCounterStore = defineStore(
  'counter',
  () => {
    const counter = ref(0);

    function increment() {
      counter.value++;
    }

    function decrement() {
      counter.value--;
    }

    return {
      counter,
      increment,
      decrement
    };
  },
  {
    persist: {
      enabled: true,
      strategies: [{ key: 'count' }], // <- HERE
    }
  }
);
```

#### 3. 持久化部分状态

默认情况下，整个状态是持久的，但您可以通过在每个策略中设置 paths 来指定要持久化的状态键。

```typescript
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCounterStore = defineStore(
  'counter',
  () => {
    const counter = ref(0);

    function increment() {
      counter.value++;
    }

    function decrement() {
      counter.value--;
    }

    return {
      counter,
      increment,
      decrement
    };
  },
  {
    persist: {
      enabled: true,
      strategies: [{ key: 'count', paths: ['counter'] }], // <- HERE
    }
  }
);
```

#### 4. 自定义存储

默认情况下，存储设置为 uniappStorage（一个实现了 Storage 接口的对象），但您可以通过设置 storage 来指定要用于每个策略的存储，可以使用任何自定义存储对象，下面是为适配 uniapp 创建的存储对象（uniappStorage）。

```typescript
class UniappStorage {
  get length() {
    return uni.getStorageInfoSync().keys.length;
  }

  clear() {
    return uni.clearStorageSync();
  }

  getItem(key: string): string | null {
    return uni.getStorageSync(key) || null;
  }

  key(index: number): string | null {
    return uni.getStorageInfoSync().keys[index] || null;
  }

  removeItem(key: string) {
    return uni.removeStorageSync(key);
  }

  setItem(key: string, value: string) {
    return uni.setStorageSync(key, value);
  }
}

export const uniappStorage: Storage = new UniappStorage();

export default uniappStorage;
```

