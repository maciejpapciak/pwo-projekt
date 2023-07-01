<template>
  <NuxtLink class="mb-2 block" :to="`/courses/${id}`">
    <div class="w-full flex">
      <img class="max-h-40" :src="image" alt="Course Thumbnail" />
      <div class="ml-5 w-full flex flex-col">
        <div class="flex flex-grow justify-between">
          <h3 class="font-bold">
            {{ title }}
          </h3>
          <span class="font-bold">{{ price }} zł</span>
        </div>
        <p>
          {{
            description.length > 100
              ? `${description.substring(0, 100)}...`
              : description
          }}
        </p>
        <h4 class="text-xs text-gray-700 my-2">
          autor: <strong>{{ author }}</strong>
        </h4>
        <StarRating v-if="rating" :amount="rating" />
        <div class="flex">
          <div
            v-for="tag in tags"
            :key="tag"
            class="badge badge-accent font-bold mr-2"
          >
            {{ tag }}
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
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
    image: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
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
  },
});
</script>
