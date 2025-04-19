<!-- components/Pagination.vue -->
<template>
  <div class="pagination">
    <div class="pagination-info">
      Showing {{ mainItemsCount }} of {{ mainItemsCount }}
    </div>
    
    <div class="pagination-controls">
      <button 
        class="pagination-button" 
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      
      <div class="pagination-page-number">{{ currentPage }}</div>
      
      <button 
        class="pagination-button" 
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useItemsStore } from '~/stores/items';

const props = defineProps<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
}>();

const emit = defineEmits<{
  (e: 'pageChange', page: number): void;
}>();

const store = useItemsStore();
const mainItemsCount = computed(() => store.mainItemsCount);

// Change page handler
const changePage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('pageChange', page);
  }
};
</script>