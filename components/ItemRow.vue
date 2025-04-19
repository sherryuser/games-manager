<!-- components/ItemRow.vue -->
<template>
  <tr
    :class="[
      'item-row',
      'draggable',
      { 'child-item': isChild, 'parent-item': !isChild, 'dragging': isDragging, 'drag-over': isDragOver }
    ]"
    :draggable="true"
    @dragstart="onDragStart"
    @dragover="onDragOver"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @drop="onDrop"
    @dragend="onDragEnd"
  >
    <td>
      <div class="item-number">{{ item.displayNumber }}</div>
    </td>
    <td>
      <div class="item-name">
        <span class="drag-indicator">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="8" y1="6" x2="16" y2="6"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
            <line x1="8" y1="18" x2="16" y2="18"></line>
          </svg>
        </span>
        <span class="item-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
        </span>
        {{ item.name }}
      </div>
    </td>
    <td>{{ item.order }}</td>
    <td v-if="isChild || !hasChildren">
      <div v-if="item.subCategories && item.subCategories !== '-'" class="sub-categories-content">{{ item.subCategories }}</div>
      <div v-else>{{ item.subCategories || '-' }}</div>
    </td>
    <td v-else>
      <div class="sub-categories-content">{{ item.subCategories }}</div>
    </td>
    <td class="actions-cell">
      <div class="actions">
        <div v-if="hasChildren" class="item-count">{{ item.itemCount }}</div>
        <button v-if="hasChildren" class="collapse-btn" @click="toggleCollapse">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            :class="{ 'collapsed': item.collapsed }"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="menu-container">
          <button class="action-btn menu-toggle" @click.stop="toggleMenu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
          <div v-if="showMenu" class="context-menu">
            <div class="context-menu-item" @click="editItem">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              Edit
            </div>
            <div class="context-menu-item" @click="removeItem">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Remove
            </div>
          </div>
        </div>
      </div>
    </td>
  </tr>
  <!-- Render children if they exist and not collapsed -->
  <template v-if="hasChildren && !item.collapsed">
    <ItemRow
      v-for="child in item.children"
      :key="child.id"
      :item="child"
      :is-child="true"
      :parent-id="item.id"
    />
  </template>
</template>

<script setup lang="ts">
import type { Item } from '~/types';
import { useItemsStore } from '~/stores/items';

const props = defineProps<{
  item: Item;
  isChild?: boolean;
  parentId?: number | null;
}>();

const store = useItemsStore();
const isDragging = ref(false);
const isDragOver = ref(false);
const showMenu = ref(false);

// Check if item has children
const hasChildren = computed(() => {
  return props.item.children && props.item.children.length > 0;
});

// Toggle collapse state
const toggleCollapse = () => {
  store.toggleCollapse(props.item.id);
};

// Toggle context menu
const toggleMenu = (event: MouseEvent) => {
  event.stopPropagation(); // Prevent event bubbling
  showMenu.value = !showMenu.value;
};

// Close menu when clicking outside
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  
  // Create status message element
  if (!document.getElementById('drag-status-message')) {
    const statusEl = document.createElement('div');
    statusEl.id = 'drag-status-message';
    statusEl.className = 'drag-status-message';
    statusEl.innerHTML = `
      <div class="drag-status-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
        </svg>
      </div>
      <span id="drag-status-text">Dragging: Move to reorder</span>
    `;
    document.body.appendChild(statusEl);
  }
});

const handleClickOutside = () => {
  if (showMenu.value) {
    showMenu.value = false;
  }
};

// Show drag status message
const showDragStatusMessage = (text: string) => {
  const statusEl = document.getElementById('drag-status-message');
  const textEl = document.getElementById('drag-status-text');
  
  if (statusEl && textEl) {
    textEl.textContent = text;
    statusEl.classList.add('visible');
  }
};

// Hide drag status message
const hideDragStatusMessage = () => {
  const statusEl = document.getElementById('drag-status-message');
  
  if (statusEl) {
    statusEl.classList.remove('visible');
  }
};

// Edit item
const editItem = () => {
  showMenu.value = false;
  
  const newName = prompt('Edit item name:', props.item.name);
  if (newName && newName.trim() !== '' && newName !== props.item.name) {
    store.editItem(props.item.id, newName.trim());
  }
};

// Remove item
const removeItem = () => {
  showMenu.value = false;
  
  if (confirm(`Are you sure you want to remove "${props.item.name}"?`)) {
    store.removeItem(props.item.id, props.parentId);
  }
};

// Keep track of drag data
const draggedItem = ref<{id: number, parentId: number | null, name: string} | null>(null);

// Drag and drop functionality
const onDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    
    // Store drag data locally and in transfer
    const data = {
      id: props.item.id,
      parentId: props.parentId || null,
      name: props.item.name
    };
    
    // Stringify for dataTransfer
    event.dataTransfer.setData('text/plain', JSON.stringify(data));
    
    // Also store locally for browsers that restrict reading dataTransfer during dragover
    draggedItem.value = data;
    
    // Add dragging class
    const element = event.currentTarget as HTMLElement;
    if (element) {
      element.classList.add('dragging');
    }
    
    isDragging.value = true;
    showDragStatusMessage(`Dragging: ${props.item.name}`);
  }
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  
  // Use locally stored drag data
  if (draggedItem.value) {
    const draggedItemParentId = draggedItem.value.parentId;
    
    if (draggedItemParentId === (props.parentId || null)) {
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
      showDragStatusMessage(`Release to place ${draggedItem.value.name} here`);
    } else {
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'none';
      }
      const element = event.currentTarget as HTMLElement;
      if (element) {
        element.classList.add('drop-not-allowed');
      }
      
      // More specific message based on the context
      if (isChild && draggedItem.value.parentId === null) {
        showDragStatusMessage(`Cannot move main category into a subcategory`);
      } else if (!isChild && draggedItem.value.parentId !== null) {
        showDragStatusMessage(`Cannot move subcategory to main level`);
      } else {
        showDragStatusMessage(`Items can only be reordered within their parent category`);
      }
    }
  }
};

const onDragEnter = (event: DragEvent) => {
  event.preventDefault();
  const element = event.currentTarget as HTMLElement;
  
  // Only show drop indicator if same parent
  if (draggedItem.value && draggedItem.value.parentId === (props.parentId || null)) {
    if (element && !element.classList.contains('dragging')) {
      element.classList.add('drag-over');
      isDragOver.value = true;
    }
  }
};

const onDragLeave = (event: DragEvent) => {
  const element = event.currentTarget as HTMLElement;
  if (element) {
    element.classList.remove('drag-over');
    element.classList.remove('drop-not-allowed');
    isDragOver.value = false;
  }
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();
  
  // Remove status classes
  const element = event.currentTarget as HTMLElement;
  if (element) {
    element.classList.remove('drag-over');
    element.classList.remove('drop-not-allowed');
  }
  
  isDragOver.value = false;
  
  // Try to get data from dataTransfer, fallback to local data
  let data;
  if (event.dataTransfer) {
    try {
      const dataStr = event.dataTransfer.getData('text/plain');
      if (dataStr) {
        data = JSON.parse(dataStr);
      } else if (draggedItem.value) {
        data = draggedItem.value;
      }
      
      if (data) {
        const draggedItemId = data.id;
        const draggedItemParentId = data.parentId;
        
        // Only allow reordering within the same parent
        if (draggedItemParentId === (props.parentId || null)) {
          // Find all siblings of the target item
          let siblings: Item[] = [];
          
          if (props.parentId) {
            // Find the parent item and get its children
            const findParentWithChildren = (items: Item[]): Item[] | null => {
              for (const item of items) {
                if (item.id === props.parentId && item.children) {
                  return item.children;
                }
                if (item.children && item.children.length > 0) {
                  const found = findParentWithChildren(item.children);
                  if (found) return found;
                }
              }
              return null;
            };
            
            siblings = findParentWithChildren(store.items) || [];
          } else {
            // If no parent, these are root items
            siblings = store.items.filter(item => !item.parentId);
          }
          
          // Find the positions in the siblings array
          const draggedIndex = siblings.findIndex(item => item.id === draggedItemId);
          const targetIndex = siblings.findIndex(item => item.id === props.item.id);
          
          if (draggedIndex !== -1 && targetIndex !== -1) {
            // Move the item to the new position
            store.moveItem(draggedItemId, targetIndex, props.parentId || null);
            
            // Show success message
            showDragStatusMessage(`Successfully moved ${data.name || 'item'}`);
            setTimeout(hideDragStatusMessage, 1500);
          }
        }
      }
    } catch (e) {
      console.error('Error during drop handling:', e);
    }
  }
  
  // Clear drag data
  draggedItem.value = null;
};

const onDragEnd = () => {
  isDragging.value = false;
  
  // Clear drag data
  draggedItem.value = null;
  
  // Remove all drag-related classes
  document.querySelectorAll('.dragging, .drag-over, .drop-not-allowed').forEach(el => {
    el.classList.remove('dragging');
    el.classList.remove('drag-over');
    el.classList.remove('drop-not-allowed');
  });
  
  // Hide status message after a delay
  setTimeout(hideDragStatusMessage, 1500);
};

// Cleanup event listeners
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>