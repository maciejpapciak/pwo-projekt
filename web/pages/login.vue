<template>
  <div
    class="
      w-full
      max-w-sm
      p-6
      m-auto
      bg-white
      rounded-md
      shadow-md
      dark:bg-gray-800
    "
  >
    <LoginForm />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  middleware: 'guest',
});
</script>
