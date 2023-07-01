<template>
  <div class="shadow rounded-sm p-5 flex justify-between items-center">
    <p>{{ name }}</p>
    <div v-if="loading" class="flex items-center">
      <fa
        class="text-primary text-2xl mr-2 animate-spin"
        :icon="['fas', 'spinner']"
      />
      <span class="font-bold">Przesyłanie</span>
    </div>
    <div v-else class="flex items-center">
      <fa class="text-primary text-2xl mr-2" :icon="['fas', 'check']" />
      <span class="font-bold">Sukces</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
});
</script>
