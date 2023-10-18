<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style scoped>
  .main {
    min-width: 1200px;
    font-size: 13px;
  }

  /* 滚动条样式 */
  /* width */
  ::-webkit-scrollbar { 
    width: 4px;
    height: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #ccc;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 1);
    width: 8px;
  }
</style>

