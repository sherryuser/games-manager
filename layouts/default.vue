<!-- layouts/default.vue -->
<template>
    <div class="app-layout">
      <header class="app-header">
        <div class="container">
          <div class="header-content">
            <div class="logo">
              Games Manager
            </div>
          </div>
        </div>
      </header>
      
      <main class="app-main">
        <slot />
      </main>
    </div>
  </template>
  
  <style scoped>
  .app-header {
    background-color: var(--secondary-bg);
    border-bottom: 1px solid var(--border-color);
    padding: 1rem 0;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--text-color);
  }
  
  .app-main {
    min-height: calc(100vh - 4rem);
  }
  </style>