<template>
  <div class="p-5">
    <h1
      class="text-3xl font-semibold text-center text-gray-700 dark:text-white"
    >
      Twoje konto
    </h1>

    <form class="mt-6" @submit.prevent="onLogin">
      <div>
        <label
          for="username"
          class="block text-sm text-gray-800 dark:text-gray-200"
          >Email</label
        >
        <input
          v-model="credentials.email"
          type="text"
          class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
        />
      </div>

      <div class="mt-4">
        <div class="flex items-center justify-between">
          <label
            for="password"
            class="block text-sm text-gray-800 dark:text-gray-200"
            >Hasło</label
          >
          <NuxtLink
            to="#"
            class="text-xs text-gray-600 dark:text-gray-400 hover:underline"
            >Zapomniałeś hasło?</NuxtLink
          >
        </div>

        <input
          v-model="credentials.password"
          type="password"
          class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
        />
      </div>

      <div class="mt-6">
        <button
          class="w-full px-4 py-2 btn btn-primary btn-wide"
          :class="{ loading: isLoading }"
        >
          Zaloguj się
        </button>
      </div>
    </form>

    <p class="mt-8 text-xs font-light text-center text-gray-400">
      Nie masz konta?
      <NuxtLink
        to="/register"
        class="font-medium text-gray-800 dark:text-gray-200 hover:underline"
        >Zarejestruj się</NuxtLink
      >
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import login from '../graphql/login.gql';

export default Vue.extend({
  data() {
    return {
      isLoading: false,
      credentials: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    loginGithub() {
      window.location.href = `${this.$config.backendUrl}/auth/github`;

      this.$toast.success('Zalogowałeś się pomyślnie', {
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
    },
    loginGoogle() {
      window.location.href = `${this.$config.backendUrl}/auth/google`;

      this.$toast.success('Zalogowałeś się pomyślnie', {
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
    },
    async onLogin() {
      this.isLoading = true;
      try {
        const res = await this.$apollo.mutate({
          mutation: login,
          variables: this.credentials,
        });

        if (res.data.login.errors == null) {
          this.$accessor.SET_LOGIN_STATE(res.data.login.user);

          this.$toast.success('Zalogowałeś się pomyślnie', {
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

          this.$router.push('/profile');
        }
        this.isLoading = false;
      } catch (error) {
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
        console.log(' ', error);
        this.isLoading = false;
      }
    },
  },
});
</script>
