<template>
  <div class="bg-white p-5 w-96 border border-gray-300 shadow z-90">
    <img
      v-if="thumbnail"
      :src="thumbnail"
      alt="Course thumbnail"
      class="w-full mb-2"
    />
    <h3 class="font-bold leading-4">
      {{ title }}
    </h3>
    <h4 class="text-xs text-gray-700 my-1">
      {{ duration }} godz. | {{ advancementLevel }}
    </h4>
    <div class="flex">
      <div v-for="tag in tags" :key="tag" class="badge badge-accent font-bold">
        {{ tag }}
      </div>
    </div>
    <p class="my-5">
      {{ sanitized(description) }}
    </p>
    <div class="flex justify-around mt-5">
      <stripe-checkout
        ref="checkoutRef"
        mode="payment"
        :pk="stripePk"
        :line-items="lineItems"
        :success-url="successurl"
        :cancel-url="cancelurl"
        :customer-email="$accessor.email"
        :client-reference-id="`${$accessor.id}_${id}`"
      />
      <NuxtLink
        v-if="$accessor.boughtCourses.find((element) => element === id)"
        :to="`/course/${id}`"
        class="btn btn-primary w-full btn-md"
      >
        Oglądaj
      </NuxtLink>
      <button
        v-else-if="lineItems.length != 0 && authorId != $accessor.id"
        class="btn btn-primary w-full btn-md"
        @click="redirectToCheckout"
      >
        Kup teraz
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    duration: {
      type: Number,
      required: true,
    },
    advancementLevel: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: false,
      default: null,
    },
    stripePk: {
      type: String,
      required: false,
      default: '',
    },
    lineItems: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    successurl: {
      type: String,
      required: false,
      default: '',
    },
    cancelurl: {
      type: String,
      required: false,
      default: '',
    },
    authorId: {
      type: Number,
      required: true,
    },
  },
  methods: {
    sanitized(html) {
      return html.replace(/<(.|\n)*?>/g, '');
    },
    redirectToCheckout() {
      this.$refs.checkoutRef.redirectToCheckout();
    },
  },
});
</script>

<style scoped>
.flex > .badge:not(.badge:last-child) {
  margin-right: 1em;
}
</style>
