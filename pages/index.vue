<!-- pages/index.vue -->
<template>
  <div class="container">
    <div class="page-header">
      <div class="page-title">
        <h1>Games List</h1>
        <span class="found-badge">Found: {{ store.mainItemsCount }}</span>
      </div>
      
      <div class="header-actions">
        <button 
          class="action-btn" 
          :disabled="!store.canUndo"
          @click="undo"
          title="Undo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 14 4 9l5-5"/>
            <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/>
          </svg>
        </button>
        
        <button 
          class="action-btn" 
          :disabled="!store.canRedo"
          @click="redo"
          title="Redo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 14 5-5-5-5"/>
            <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/>
          </svg>
        </button>
      </div>
    </div>
    
    <ClientOnly>
      <ItemsList />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useItemsStore } from '~/stores/items';

const store = useItemsStore();

// Methods
const undo = () => {
  store.undo();
};

const redo = () => {
  store.redo();
};
</script>

<style>
h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}
</style>