<template>
  <div class="container mx-auto my-10">
    <div class="flex justify-between">
      <div>
        <CourseFilter />
        <div class="flex justify-between mt-5">
          <button class="btn btn-primary btn-outline" @click="resetFilters">
            Resetuj filtry
          </button>
          <button class="btn btn-primary" @click="filterCourses">
            Filtruj
          </button>
        </div>
      </div>
      <div class="border-l border-gray-200 w-full ml-10 pl-10 flex flex-col">
        <h2 class="text-2xl mb-5">{{ categoryName }}</h2>
        <div v-if="courses.length !== 0" :key="category">
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
        <div v-else>
          <h3>Brak kursów spełniających kryteria</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import filteredCourses from '../../graphql/filteredCourses.gql';
import retrieveSubcategories from '../../graphql/retrieveSubcategories.gql';

export default Vue.extend({
  asyncData({ query }) {
    const category = query.category;
    return { category };
  },
  data() {
    return {
      courses: [
        {
          id: 0,
          title: '',
          description: '',
          price: 0,
          thumbnail: '',
          tags: '',
        },
      ],
      subcategories: [],
    };
  },
  computed: {
    categoryName() {
      return this.subcategories.find(
        (item) => item.id === parseInt(this.category),
      ).name;
    },
  },
  mounted() {
    this.$accessor.SET_CATEGORY(this.category);
  },
  apollo: {
    courses: {
      query: filteredCourses,
      update: (data) => data.filteredCourses,
      variables() {
        return {
          categoryId: parseInt(this.category),
          duration: this.$accessor.duration,
          rating: this.$accessor.ranking,
          advancementLevel: this.$accessor.advancementLevel,
        };
      },
    },
    subcategories: {
      query: retrieveSubcategories,
      update: (data) => data.retrieveSubcategories,
    },
  },
  methods: {
    sanitized(html) {
      return html.replace(/<(.|\n)*?>/g, '');
    },
    filterCourses() {
      this.$apollo.queries.courses.refetch();
    },
    resetFilters() {
      this.$accessor.SET_RANKING(0);
      this.$accessor.SET_DURATION(0);
      this.$accessor.SET_ADVANCEMENTLEVEL(0);
      this.$apollo.queries.courses.refetch();
    },
  },
});
</script>
