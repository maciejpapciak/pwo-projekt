<template>
  <div class="collapse collapse-arrow w-96 bg-base-200 my-2">
    <input type="checkbox" checked />
    <div class="collapse-title text-xl font-medium">{{ title }}</div>
    <div class="collapse-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true,
    },
  },
});
</script>
