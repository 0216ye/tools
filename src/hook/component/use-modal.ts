import { nextTick, ref } from 'vue';

interface Hooks {
  beforeOpen?: () => void;
  afterOpen?: () => void;
  beforeClose?: () => void;
  afterClose?: () => void;
}

export function useModal(handle?: () => void, hooks: Hooks = {}) {
  const visible = ref(false);
  const loading = ref(false);

  // 打开modal
  function open() {
    hooks.beforeOpen && hooks.beforeOpen();
    visible.value = true;
    hooks.afterOpen && nextTick(hooks.afterOpen);
  }

  // 关闭modal
  function close() {
    hooks.beforeClose && hooks.beforeClose();
    visible.value = false;
    hooks.afterClose && nextTick(hooks.afterClose);
  }

  async function confirm() {
    if (handle) {
      loading.value = true;
      try {
        await handle();
      } finally {
        loading.value = false;
      }
    }
  }

  return {
    visible,
    loading,
    open,
    close,
    confirm,
  };
}
