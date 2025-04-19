<!-- components/ItemsList.vue -->
<template>
  <div class="items-list">
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th width="50">№</th>
            <th width="200">Name</th>
            <th width="80">Order</th>
            <th>Sub categories</th>
            <th width="80"></th>
          </tr>
        </thead>
        <tbody>
          <ItemRow
            v-for="item in items"
            :key="item.id"
            :item="item"
            :is-child="false"
            :parent-id="null"
          />
        </tbody>
      </table>
    </div>
    
    <Pagination 
      :current-page="pagination.currentPage"
      :total-pages="pagination.totalPages"
      :total-items="pagination.totalItems"
      @page-change="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { useItemsStore } from '~/stores/items';
import type { PaginationMeta } from '~/types';

const store = useItemsStore();

// Initialize store on component mount
onMounted(() => {
  store.init();
});

// Computed properties
const items = computed(() => store.items);
const pagination = computed(() => store.pagination);

// Methods
const onPageChange = (page: number) => {
  store.changePage(page);
};
</script>