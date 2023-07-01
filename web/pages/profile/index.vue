<template>
  <div class="container mx-auto my-10 grid grid-cols-6 auto-rows-min gap-4">
    <div
      class="card shadow-lg compact side bg-base-100"
      :class="{
        'col-span-6': $accessor.permissionLevel < 2,
        'col-span-2': $accessor.permissionLevel >= 2,
      }"
    >
      <div class="flex-row items-center space-x-4 card-body">
        <Avatar
          variant="beam"
          :colors="['#A3A948', '#EDB92E', '#F85931', '#CE1836', '#009989']"
          :name="$accessor.username"
        />
        <div class="w-full">
          <div class="flex items-center">
            <h2 class="card-title mr-2">{{ $accessor.username }}</h2>
            <div class="badge badge-primary badge-sm">
              {{ getUserType($accessor.permissionLevel) }}
            </div>
          </div>
          <p class="text-base-content text-opacity-40">
            {{ $accessor.firstName }} {{ $accessor.lastName }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="$accessor.permissionLevel >= 2"
      class="w-full stats col-span-4 shadow-lg"
    >
      <div class="stat place-items-center place-content-center bg-base-100">
        <div class="stat-title">Ilość kursów</div>
        <div class="stat-value">{{ UserStats[0].course_amount }}</div>
      </div>
      <div class="stat place-items-center place-content-center bg-base-100">
        <div class="stat-title">Ilość kursantów</div>
        <div class="stat-value text-success">
          {{ UserStats[0].number_of_students }}
        </div>
      </div>
      <div class="stat place-items-center place-content-center bg-base-100">
        <div class="stat-title">Średnia ocena</div>
        <div class="stat-value text-accent">
          {{ UserStats[0].average_rating.toFixed(2) }}
        </div>
      </div>
    </div>

    <ul
      class="
        menu
        col-span-3
        row-span-2
        lg:col-span-1
        md:col-span-2
        bg-base-100
        shadow-lg
        rounded-box
        pt-3
      "
    >
      <li class="menu-title">
        <span> Opcje </span>
      </li>
      <li>
        <NuxtLink to="/profile/edit">
          <fa class="mr-2 text-primary" :icon="['fas', 'user-cog']" /> Edytuj
          profil
        </NuxtLink>
        <NuxtLink v-if="$accessor.permissionLevel >= 2" to="/courses/create">
          <fa class="mr-2 text-primary" :icon="['fas', 'plus']" /> Stwórz nowy
          kurs
        </NuxtLink>
      </li>
    </ul>

    <div
      class="
        col-span-5
        row-4
        card
        shadow-lg
        bg-base-100
        p-10
        flex flex-col
        gap-4
      "
    >
      <h2 class="font-bold text-2xl">Twoje kursy</h2>
      <CourseTable v-if="courses.length > 0" :courses="courses" />
      <div v-else>
        <p class="text-lg">
          Nie masz kursów,
          <strong v-if="$accessor.permissionLevel === 1"
            >zostań nauczycielem</strong
          >
          <strong v-else>Dodaj kurs</strong>.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import retrieveCreatedCourses from '../../graphql/retrieveCreatedCourses.gql';
import UserStats from '../../graphql/userStats.gql';

export default Vue.extend({
  middleware: 'authenticated',
  data() {
    return {
      courses: [],
      UserStats: [
        {
          course_amount: 0,
          number_of_students: 0,
          average_rating: 0,
        },
      ],
    };
  },
  apollo: {
    courses: {
      query: retrieveCreatedCourses,
      variables() {
        return {
          id: parseInt(this.$accessor.id),
        };
      },
      update: (data) => data.retrieveCreatedCourses,
    },
    UserStats: {
      query: UserStats,
      update: (data) => data.userStats,
      variables() {
        return {
          id: parseInt(this.$accessor.id),
        };
      },
    },
  },
  methods: {
    getUserType(permissionLevel: Number): String {
      if (permissionLevel === 1) return 'Użytkownik';
      else if (permissionLevel === 2) return 'Nauczyciel';
      else if (permissionLevel === 3) return 'Admin';
      else return 'Nieznany';
    },
  },
});
</script>
