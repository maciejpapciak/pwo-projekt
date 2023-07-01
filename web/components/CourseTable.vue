<template>
  <div class="overflow-x-auto">
    <table class="table w-full table-compact">
      <thead>
        <tr>
          <th></th>
          <th>Tytuł</th>
          <th>Opis</th>
          <th>Cena</th>
          <th>Kategoria</th>
          <th>Ocena</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(course, i) in courses" :key="course.id">
          <th>{{ i + 1 }}</th>
          <td class="max-w-xs truncate">{{ course.title }}</td>
          <td class="max-w-xs truncate">{{ sanitized(course.description) }}</td>
          <td>{{ course.price }} zł</td>
          <td>{{ course.category_name }}</td>
          <td class="font-bold text-accent">
            <fa class="mr-2" :icon="['fas', 'star']" />{{
              course.average_rating.toFixed(2)
            }}
          </td>
          <td>
            <div class="flex justify-between items-center mx-2 text-xl">
              <NuxtLink :to="`/courses/${course.id}`">
                <fa
                  class="hover:text-primary cursor-pointer"
                  :icon="['fas', 'eye']"
                />
              </NuxtLink>
              <fa
                class="hover:text-primary cursor-pointer"
                :icon="['fas', 'trash-alt']"
              />
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th></th>
          <th>Tytuł</th>
          <th>Opis</th>
          <th>Cena</th>
          <th>Kategoria</th>
          <th>Ocena</th>
          <th></th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    courses: {
      type: Array,
      required: true,
    },
  },
  methods: {
    sanitized(html) {
      return html.replace(/<(.|\n)*?>/g, '');
    },
  },
});
</script>
