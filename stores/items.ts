// stores/items.ts
import { defineStore } from 'pinia';
import type { Item, PaginationMeta, HistoryState } from '~/types';

export const useItemsStore = defineStore('items', () => {
  // State
  const items = ref<Item[]>([]);
  const loading = ref(false);
  const pagination = ref<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  
  // History for undo/redo
  const history = ref<HistoryState[]>([]);
  const historyIndex = ref(-1);
  const MAX_HISTORY = 20;
  
  // Get flattened items for easier manipulation
  const flattenedItems = computed(() => {
    const flat: Item[] = [];
    
    function flatten(items: Item[], level = 0, parentId: number | null = null) {
      items.forEach(item => {
        const flatItem = { ...item, level, parentId };
        flat.push(flatItem);
        
        if (item.children && item.children.length > 0) {
          flatten(item.children, level + 1, item.id);
        }
      });
    }
    
    flatten(items.value);
    return flat;
  });
  
  // Getters
  const totalItems = computed(() => pagination.value.totalItems);
  const currentPage = computed(() => pagination.value.currentPage);
  const totalPages = computed(() => pagination.value.totalPages);
  
  // Count only main level items
  const mainItemsCount = computed(() => {
    return items.value.length;
  });
  
  // Check if undo is available
  const canUndo = computed(() => historyIndex.value > 0);
  
  // Check if redo is available
  const canRedo = computed(() => historyIndex.value < history.value.length - 1);
  
  // Methods
  
  // Save current state to history
  function saveToHistory() {
    // Create a deep copy of the current state
    const currentState: HistoryState = {
      itemsState: JSON.parse(JSON.stringify(items.value)),
      timestamp: Date.now()
    };
    
    // If we're not at the end of the history, remove future states
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1);
    }
    
    // Add current state to history
    history.value.push(currentState);
    historyIndex.value = history.value.length - 1;
    
    // Limit history size
    if (history.value.length > MAX_HISTORY) {
      history.value = history.value.slice(history.value.length - MAX_HISTORY);
      historyIndex.value = history.value.length - 1;
    }
    
    // Save history to localStorage
    saveHistoryToStorage();
  }
  
  // Save history to localStorage
  function saveHistoryToStorage() {
    if (process.client) {
      localStorage.setItem('itemsHistory', JSON.stringify(history.value));
      localStorage.setItem('historyIndex', historyIndex.value.toString());
    }
  }
  
  // Load history from localStorage
  function loadHistoryFromStorage() {
    if (process.client) {
      const savedHistory = localStorage.getItem('itemsHistory');
      const savedIndex = localStorage.getItem('historyIndex');
      
      if (savedHistory) {
        history.value = JSON.parse(savedHistory);
      }
      
      if (savedIndex) {
        historyIndex.value = parseInt(savedIndex);
      }
    }
  }
  
  // Update display numbers for all items
  function updateDisplayNumbers(itemsToUpdate = items.value, parentNumber = '') {
    itemsToUpdate.forEach((item, index) => {
      const currentNumber = parentNumber ? `${parentNumber}.${index + 1}` : `${index + 1}`;
      item.displayNumber = currentNumber;
      
      if (item.children && item.children.length > 0) {
        updateDisplayNumbers(item.children, currentNumber);
      }
    });
  }
  
  // Find an item by ID (helper function)
  function findItemById(items: Item[], id: number): Item | null {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      
      if (item.children && item.children.length > 0) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    
    return null;
  }
  
  // Fetch items from the API
  async function fetchItems(page: number = 1) {
    loading.value = true;
    try {
      const response = await $fetch<{data: Item[], meta: PaginationMeta}>('/api/items', {
        params: { page, limit: pagination.value.itemsPerPage }
      });
      
      // Add collapsed property to each item and set it to true by default
      const processItems = (items: Item[]) => {
        return items.map(item => {
          const newItem = { 
            ...item, 
            collapsed: true // Set to true to make menus collapsed by default
          };
          
          if (newItem.children && newItem.children.length > 0) {
            newItem.children = processItems(newItem.children);
          }
          
          return newItem;
        });
      };
      
      items.value = processItems(response.data);
      pagination.value = response.meta;
      
      // Initialize history if it's empty
      if (history.value.length === 0) {
        saveToHistory();
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      loading.value = false;
    }
  }
  
  // Add subcategory to an item
  function addSubcategory(itemId: number, subcategoryName: string) {
    const findAndAdd = (items: Item[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === itemId) {
          // Create subcategory item
          const newId = Date.now(); // Simple ID generation for example
          const newOrder = items[i].children ? items[i].children.length + 1 : 1;
          
          if (!items[i].children) {
            items[i].children = [];
          }
          
          const newSubcategory: Item = {
            id: newId,
            name: subcategoryName,
            order: newOrder,
            displayNumber: `${items[i].displayNumber}.${newOrder}`,
            subCategories: '',
            children: []
          };
          
          items[i].children.push(newSubcategory);
          
          // Update subcategories text
          const subcats = items[i].children.map(child => child.name);
          items[i].subCategories = subcats.join(' / ');
          items[i].itemCount = items[i].children.length;
          
          saveToHistory();
          return true;
        }
        
        if (items[i].children && items[i].children.length > 0) {
          if (findAndAdd(items[i].children)) {
            return true;
          }
        }
      }
      
      return false;
    };
    
    findAndAdd(items.value);
  }
  
  // Edit an item's name
  function editItem(itemId: number, newName: string) {
    const editInItems = (items: Item[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === itemId) {
          items[i].name = newName;
          
          // If it's a child item, update the parent's subcategories text
          if (items[i].parentId) {
            const parent = findItemById(items, items[i].parentId);
            if (parent && parent.children) {
              parent.subCategories = parent.children.map(child => child.name).join(' / ');
            }
          }
          
          saveToHistory();
          return true;
        }
        
        if (items[i].children && items[i].children.length > 0) {
          if (editInItems(items[i].children)) {
            return true;
          }
        }
      }
      
      return false;
    };
    
    editInItems(items.value);
  }
  
  // Remove an item
  function removeItem(itemId: number, parentId: number | null = null) {
    if (parentId) {
      // Remove a child item
      const parent = findItemById(items.value, parentId);
      if (parent && parent.children) {
        const index = parent.children.findIndex(child => child.id === itemId);
        if (index !== -1) {
          parent.children.splice(index, 1);
          
          // Update the parent's subcategories and count
          parent.subCategories = parent.children.map(child => child.name).join(' / ');
          parent.itemCount = parent.children.length;
          
          // Update order of remaining children
          parent.children.forEach((child, idx) => {
            child.order = idx + 1;
            child.displayNumber = `${parent.displayNumber}.${idx + 1}`;
          });
          
          saveToHistory();
        }
      }
    } else {
      // Remove a parent item
      const index = items.value.findIndex(item => item.id === itemId);
      if (index !== -1) {
        items.value.splice(index, 1);
        
        // Update order and display numbers of all items
        items.value.forEach((item, idx) => {
          item.order = idx + 1;
          item.displayNumber = `${idx + 1}`;
          
          // Update children display numbers if any
          if (item.children && item.children.length > 0) {
            updateDisplayNumbers(item.children, item.displayNumber);
          }
        });
        
        saveToHistory();
      }
    }
  }
  
  // Toggle collapse state for an item
  function toggleCollapse(itemId: number) {
    const findAndToggle = (items: Item[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === itemId) {
          items[i].collapsed = !items[i].collapsed;
          return true;
        }
        
        if (items[i].children && items[i].children.length > 0) {
          if (findAndToggle(items[i].children)) {
            return true;
          }
        }
      }
      
      return false;
    };
    
    findAndToggle(items.value);
  }
  
  // Move an item within its parent
  function moveItem(itemId: number, targetIndex: number, parentId: number | null = null) {
    // Find the items array to modify (root or children of a parent)
    let itemsToModify: Item[] = items.value;
    
    if (parentId !== null) {
      // Find the parent item
      const parent = findItemById(items.value, parentId);
      if (!parent || !parent.children) return;
      
      itemsToModify = parent.children;
    }
    
    // Find the item to move
    const itemIndex = itemsToModify.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    
    // Remove the item from its current position
    const [movedItem] = itemsToModify.splice(itemIndex, 1);
    
    // Insert the item at the target position
    itemsToModify.splice(targetIndex, 0, movedItem);
    
    // Update order properties
    itemsToModify.forEach((item, index) => {
      item.order = index + 1;
    });
    
    // If this is a child item, update the parent's subcategories
    if (parentId !== null) {
      const parent = findItemById(items.value, parentId);
      if (parent && parent.children) {
        const subcats = parent.children.map(child => child.name);
        parent.subCategories = subcats.join(' / ');
      }
    }
    
    // Update display numbers
    updateDisplayNumbers();
    
    // Save this change to history
    saveToHistory();
  }
  
  // Undo the last action
  function undo() {
    if (!canUndo.value) return;
    
    historyIndex.value--;
    items.value = JSON.parse(JSON.stringify(history.value[historyIndex.value].itemsState));
    saveHistoryToStorage();
  }
  
  // Redo the last undone action
  function redo() {
    if (!canRedo.value) return;
    
    historyIndex.value++;
    items.value = JSON.parse(JSON.stringify(history.value[historyIndex.value].itemsState));
    saveHistoryToStorage();
  }
  
  // Change page
  function changePage(page: number) {
    if (page < 1 || page > pagination.value.totalPages) return;
    fetchItems(page);
  }
  
  // Initialize
  function init() {
    loadHistoryFromStorage();
    fetchItems(pagination.value.currentPage);
  }
  
  return {
    items,
    loading,
    pagination,
    flattenedItems,
    totalItems,
    currentPage,
    totalPages,
    canUndo,
    canRedo,
    mainItemsCount,
    fetchItems,
    moveItem,
    undo,
    redo,
    changePage,
    init,
    toggleCollapse,
    addSubcategory,
    updateDisplayNumbers,
    editItem,
    removeItem
  };
});