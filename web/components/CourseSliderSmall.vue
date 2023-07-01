<template>
  <div class="container mx-auto">
    <h2 class="font-bold text-center text-4xl mb-10">Popularne kursy</h2>
    <div class="flex">
      <CourseCardSmall
        v-for="course in courses"
        :id="course.id"
        :key="course.id"
        :title="course.title"
        :image="course.thumbnail"
        :author="course.author_name"
        :rating="course.average_rating"
        :price="course.price"
        :description="course.description"
        :tags="course.tags"
        :duration="course.duration"
        :advancement-level="course.advancement_level"
        :author-id="course.author_id"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import popularCourses from '../graphql/popularCourses.gql';

export default Vue.extend({
  data() {
    return {
      courses: [],
    };
  },
  apollo: {
    courses: {
      query: popularCourses,
      update: (data) => data.mostPopularCourses,
    },
  },
});
</script>
