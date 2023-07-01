<template>
  <div class="overflow-x-auto">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Imię i Nazwisko</th>
          <th>Nazwa użytkownika</th>
          <th>Email</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="hover:bg-base-200">
          <td>
            <div class="flex items-center space-x-3">
              <div>
                <div class="font-bold">
                  {{ user.firstName }} {{ user.lastName }}
                </div>
              </div>
            </div>
          </td>
          <td>
            {{ user.username }}
            <br />
            <span class="badge badge-primary badge-sm">{{
              getUserType(user.permissionLevel)
            }}</span>
          </td>
          <td>{{ user.email }}</td>
          <th>
            <NuxtLink :to="`#${user.id}`" class="btn btn-ghost btn-sm"
              >Szczegóły</NuxtLink
            >
            <UserEditModal :user="user" />
          </th>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th>Imię i Nazwisko</th>
          <th>Nazwa użytkownika</th>
          <th>Email</th>
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
    users: {
      type: Array,
      required: true,
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
