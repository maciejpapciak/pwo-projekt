<template>
  <ul class="menu py-3 shadow-lg bg-base-100 rounded-box">
    <li class="menu-title">
      <span> Witaj {{ $accessor.username }} </span>
    </li>
    <li>
      <NuxtLink to="/profile">
        <fa class="mr-2 text-primary" :icon="['fas', 'user']" />
        Twój profil
      </NuxtLink>
    </li>
    <li>
      <NuxtLink to="/profile/orders">
        <fa class="mr-2 text-primary" :icon="['fas', 'book-open']" />
        Twoje kursy
      </NuxtLink>
      <NuxtLink v-if="$accessor.isAdmin" to="/admin">
        <fa class="mr-2 text-primary" :icon="['fas', 'user-shield']" />
        Admin panel
      </NuxtLink>
      <button
        class="px-5 py-3 flex justify-start items-center hover:bg-base-200"
        @click="handleLogout"
      >
        <fa class="mr-2 text-primary" :icon="['fas', 'sign-out-alt']" />
        Wyloguj się
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import logout from '../graphql/logout.gql';

export default Vue.extend({
  methods: {
    async handleLogout() {
      try {
        await this.$apollo.mutate({ mutation: logout });
        this.$accessor.LOGOUT();

        this.$router.push('/');

        this.$toast.success('Wylogowano pomyślnie', {
          timeout: 5000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: true,
          hideProgressBar: false,
          closeButton: 'button',
          icon: true,
          rtl: false,
        });
      } catch (error) {
        console.error(' ', error);
        this.$toast.error('Wystąpił błąd', {
          timeout: 5000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: true,
          hideProgressBar: false,
          closeButton: 'button',
          icon: true,
          rtl: false,
        });
      }
    },
  },
});
</script>

<style scoped>
.menu ul {
  padding-left: 0;
}
</style>
