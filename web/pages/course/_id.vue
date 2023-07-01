<template>
  <div class="flex justify-between items-stretch h-full">
    <div class="library flex flex-col border-r min-w-1/4">
      <ul>
        <li
          v-for="chapter in course"
          :key="chapter.chapterid"
          class="py-5 px-10 border-b"
        >
          <span class="font-bold">{{ chapter.chaptername }}</span>
          <ol class="ml-2">
            <li v-for="video in chapter.library" :key="video[0]">
              <span
                @click="setVideo(video[2])"
                class="block p-5 cursor-pointer hover:bg-base-200"
              >
                <fa :icon="['fas', 'play']" /> {{ video[1] }}</span
              >
            </li>
          </ol>
        </li>
      </ul>
    </div>
    <div class="player w-full flex justify-center">
      <div
        v-video-player:myVideoPlayer="playerOptions"
        class="video-player-box"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import retrieveCourseContent from '../../graphql/retrieveCourseContent.gql';

export default Vue.extend({
  middleware: ['authenticated', 'hasCourse'],
  asyncData({ params }) {
    const id = params.id;
    return { id };
  },
  data() {
    return {
      currentVideo: '',
      course: [
        {
          chapterid: 0,
          chaptername: '',
          library: [
            {
              0: 0,
              1: '',
              2: '',
            },
          ],
        },
      ],
    };
  },
  apollo: {
    course: {
      query: retrieveCourseContent,
      update: (data) => data.retrieveCourseContent,
      variables() {
        return {
          id: parseInt(this.id),
        };
      },
    },
  },
  computed: {
    playerOptions: {
      get() {
        return {
          muted: false,
          autoplay: false,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [
            {
              type: 'video/mp4',
              src: this.currentVideo
                ? this.currentVideo
                : this.course[0].library[0][2],
            },
          ],
        };
      },
    },
  },
  methods: {
    setVideo(video) {
      this.currentVideo = video;
    },
  },
});
</script>

<style scoped>
.video-player-box > div {
  width: 100%;
}
</style>
