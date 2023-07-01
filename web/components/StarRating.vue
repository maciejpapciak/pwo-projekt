<template>
  <div class="flex text-accent items-center">
    <span v-if="showNumber" class="font-bold mr-1 mt-0.5">
      {{ amount }}
    </span>
    <div class="flex items-center">
      <fa
        v-for="star in Math.floor(amount)"
        :key="star"
        :icon="['fas', 'star']"
      />
      <fa
        v-if="
          amount - Math.floor(amount) >= 0.5 &&
          amount - Math.floor(amount) <= 0.85 &&
          amount - Math.floor(amount) != 0
        "
        :icon="['fas', 'star-half-alt']"
      />
      <fa
        v-else-if="
          Math.ceil(amount) - amount <= 0.15 && amount - Math.floor(amount) != 0
        "
        :icon="['fas', 'star']"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    amount: {
      type: Number,
      required: true,
    },
    showNumber: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
});
</script>
