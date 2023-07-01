<template>
  <div
    class="w-60 p-1 relative min-w-min card-small flex flex-col justify-between"
    @mouseover="show = true"
    @mouseout="show = false"
  >
    <NuxtLink :to="`/courses/${id}`" class="flex flex-col">
      <div class="w-full">
        <img class="w-full" :src="image" alt="Course Thumbnail" />
      </div>
      <div class="flex flex-col pt-5 mt-auto">
        <h3 class="font-bold leading-4">
          {{ title }}
        </h3>
        <h4 class="text-xs text-gray-700 my-1">{{ author }}</h4>
        <div class="flex justify-between items-center">
          <StarRating v-if="rating" :amount="rating" />
        </div>
        <span class="font-bold mt-1">{{ price }} zł</span>
      </div>
    </NuxtLink>
    <!-- TOOLTIP -->
    <div class="absolute -top-5 card-info z-20" :class="{ hidden: !show }">
      <CourseCardSmallTooltip
        :id="id"
        :title="title"
        :description="description"
        :tags="tags"
        :duration="duration"
        :advancement-level="advancementLevel"
        :author-id="authorId"
      />
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
    authorId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      show: false,
    };
  },
});
</script>
