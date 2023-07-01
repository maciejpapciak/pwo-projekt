<template>
  <div class="container mx-auto my-10">
    <h2 class="font-bold text-2xl mb-5">Twoje kursy</h2>
    <div v-if="courses.length != 0">
      <CourseCardLarge
        v-for="course in courses"
        :id="course.id"
        :key="course.id"
        :title="course.title"
        :description="sanitized(course.description)"
        :price="course.price"
        :image="course.thumbnail"
        :rating="course.average_rating"
        :tags="course.tags"
        :author="course.author_name"
        :duration="course.duration"
        :advancement-level="course.advancement_level"
      />
    </div>
    <p v-else>Nie masz zakupionych żadnych kursów</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import retrieveBoughtCourses from '../../graphql/retrieveBoughtCourses.gql';

export default Vue.extend({
  data() {
    return {
      courses: [
        {
          id: 0,
          title: '',
          description: '',
          price: 0,
          thumbnail: '',
          tags: [],
          author_name: '',
          advancement_level: '',
          category_name: '',
          duration: 0,
          average_rating: 0,
        },
      ],
    };
  },
  apollo: {
    courses: {
      query: retrieveBoughtCourses,
      update: (data) => data.retrieveBoughtCourses,
      variables() {
        return {
          id: parseInt(this.$accessor.id),
        };
      },
    },
  },
  methods: {
    sanitized(html) {
      return html.replace(/<(.|\n)*?>/g, '');
    },
  },
});
</script>
