<template>
  <div>
    <div class="bg-base-200 py-10">
      <div class="container mx-auto relative">
        <h1 class="font-bold text-3xl my-5 max-w-screen-md">
          {{ course[0].title }}
        </h1>
        <p class="max-w-prose text-large" v-html="course[0].description"></p>
        <h4 class="text-xs my-3">
          Autor kursu:
          <NuxtLink :to="`/profile/${course[0].author_id}`" class="link">{{
            course[0].username
          }}</NuxtLink>
        </h4>
        <div
          v-if="course[0].average_rating"
          class="flex items-center max-w-screen-sm"
        >
          <StarRating :amount="course[0].average_rating" />
        </div>
        <div v-else><p>Ten kurs nie został jeszcze oceniony</p></div>
        <CourseCardSmallTooltip
          :id="parseInt(id)"
          class="absolute top-0 right-0 z-90 text-neutral"
          :title="course[0].title"
          :thumbnail="course[0].thumbnail"
          :author="course[0].author_id"
          :description="course[0].description"
          :tags="course[0].tags"
          :duration="course[0].duration"
          :advancement-level="advancementLevel"
          :stripe-pk="stripePk"
          :line-items="lineItems"
          :successurl="successURL"
          :cancelurl="cancelURL"
          :author-id="course[0].author_id"
        />
      </div>
    </div>
    <div class="container mx-auto my-10">
      <div class="max-w-screen-md">
        <h2 class="font-bold text-2xl mb-5">Treść kursu</h2>
        <div
          v-for="chapter in content"
          :key="chapter.chaptername"
          class="collapse w-full rounded-box border border-base-300 collapse-arrow my-2"
        >
          <input type="checkbox" />
          <div class="collapse-title text-large">
            {{ chapter.chaptername }}
          </div>
          <div class="collapse-content">
            <ul>
              <li
                v-for="video in chapter.library"
                :key="video[1]"
                class="flex justify-between p-2 mb-2 items-center border-b border-gray-300"
              >
                <div class="flex items-center">
                  <fa :icon="['fas', 'play']" />
                  <p class="ml-2">{{ video[1] }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import retrieveCourseById from '../../graphql/retrieveCourseById.gql';
import retrieveCourseContent from '../../graphql/retrieveCourseContent.gql';

export default Vue.extend({
  asyncData({ params, $config: { stripePk } }) {
    const id = params.id;
    return { id, stripePk };
  },
  data() {
    return {
      course: [
        {
          title: '',
          description: '',
          author_id: 0,
          average_rating: 0,
          thumbnail: '',
          duration: 0,
          stripe_id: '',
        },
      ],
      content: [
        {
          chapterId: 0,
          chapterName: '',
          library: [],
        },
      ],
      successURL: 'http://localhost:3000/profile/orders',
      cancelURL: 'http://localhost:3000/profile/orders',
    };
  },
  computed: {
    advancementLevel() {
      if (this.course[0].advancementLevel_id === 1) return 'Początkujący';
      else if (this.course[0].advancementLevel_id === 2)
        return 'Średnio zaawansowany';
      else return 'Ekspert';
    },
    lineItems() {
      const lineItem = [
        {
          price: this.course[0].stripe_id,
          quantity: 1,
        },
      ];
      return lineItem;
    },
  },
  apollo: {
    course: {
      query: retrieveCourseById,
      update: (data) => data.retrieveCourseById,
      variables() {
        return {
          id: parseInt(this.id),
        };
      },
    },
    content: {
      query: retrieveCourseContent,
      update: (data) => data.retrieveCourseContent,
      variables() {
        return {
          id: parseInt(this.id),
        };
      },
    },
  },
});
</script>
