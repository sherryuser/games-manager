import { ref } from 'vue';

// Create a singleton state that persists across component instances
const activeMenuId = ref<number | null>(null);

export function useMenuState() {
  const setActiveMenu = (id: number | null) => {
    activeMenuId.value = id;
  };

  const isActiveMenu = (id: number) => {
    return activeMenuId.value === id;
  };

  return {
    activeMenuId,
    setActiveMenu,
    isActiveMenu
  };
}