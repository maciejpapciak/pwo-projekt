<template>
  <div v-if="dropdown" class="dropdown dropdown-end">
    <div
      tabindex="0"
      class="btn btn-ghost btn-sm rounded-btn normal-case font-normal text-base"
    >
      <fa v-if="icon" class="text-primary md:mr-2" :icon="icon" />
      <span class="hidden md:block">{{ text }}</span>
    </div>
    <div class="shadow dropdown-content bg-base-100 rounded-box w-max mt-5">
      <slot></slot>
    </div>
  </div>
  <NuxtLink
    v-else
    :to="href"
    class="
      btn btn-ghost btn-sm
      rounded-btn
      mr-3
      normal-case
      font-normal
      text-base
    "
  >
    <fa v-if="icon" class="md:mr-2" :class="color" :icon="icon" />
    <span class="hidden md:block">{{ text }}</span>
  </NuxtLink>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    text: {
      type: String,
      required: true,
    },
    icon: {
      type: Array,
      required: false,
      default: null,
    },
    dropdown: {
      type: Boolean,
      required: false,
      default: false,
    },
    color: {
      type: String,
      required: false,
      default: 'text-primary',
    },
    href: {
      type: String,
      required: false,
      default: '#',
    },
  },
});
</script>
