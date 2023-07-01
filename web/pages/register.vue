<template>
  <div class="container mx-auto mt-10 flex items-center justify-around">
    <div class="hidden lg:block flex-basis-33">
      <img
        :src="require('~/static/img/undraw_Resume_re_hkth.svg')"
        alt="Registration form"
        class="w-10/12 mx-auto"
      />
    </div>
    <div class="flex-1">
      <h1
        class="text-4xl font-semibold text-center text-gray-700 dark:text-white"
      >
        Rejestracja
      </h1>
      <ValidationObserver v-slot="{ invalid, handleSubmit }">
        <form
          class="px-20 py-10 mx-auto lg:w-2/3"
          @submit.prevent="handleSubmit(onSubmit)"
        >
          <div class="flex justify-between mb-5">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Imię</span>
              </label>
              <ValidationProvider
                v-slot="v"
                mode="eager"
                class="relative"
                name="Imię"
                rules="required|alpha_num|min:3"
              >
                <input
                  v-model="credentials.firstName"
                  type="text"
                  class="input input-bordered w-full"
                  :class="{
                    'input-error': v.errors[0],
                    'input-success': v.validated,
                  }"
                />
                <span
                  class="absolute top-full left-0 w-full text-error text-sm"
                  >{{ v.errors[0] }}</span
                >
              </ValidationProvider>
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Nazwisko</span>
              </label>
              <ValidationProvider
                v-slot="v"
                mode="eager"
                class="relative"
                name="Nazwisko"
                rules="required|alpha_num|min:4"
              >
                <input
                  v-model="credentials.lastName"
                  type="text"
                  class="input input-bordered w-full"
                  :class="{
                    'input-error': v.errors[0],
                    'input-success': v.validated,
                  }"
                />
                <span
                  class="absolute top-full left-0 w-full text-error text-sm"
                  >{{ v.errors[0] }}</span
                >
              </ValidationProvider>
            </div>
          </div>
          <div class="form-control mb-5">
            <label class="label">
              <span class="label-text">Nazwa użytkownika</span>
            </label>
            <ValidationProvider
              v-slot="v"
              mode="eager"
              class="relative"
              name="Nazwa użytkownika"
              rules="required|alpha_num|min:4"
            >
              <input
                v-model="credentials.username"
                type="text"
                class="input input-bordered w-full"
                :class="{
                  'input-error': v.errors[0],
                  'input-success': v.validated,
                }"
              />
              <span
                class="absolute top-full left-0 w-full text-error text-sm"
                >{{ v.errors[0] }}</span
              >
            </ValidationProvider>
          </div>
          <div class="form-control mb-5">
            <label class="label">
              <span class="label-text">Adres email</span>
            </label>
            <ValidationProvider
              v-slot="v"
              mode="eager"
              class="relative"
              name="Email"
              rules="required|email"
            >
              <input
                v-model="credentials.email"
                type="text"
                class="input input-bordered w-full"
                :class="{
                  'input-error': v.errors[0],
                  'input-success': v.validated,
                }"
              />
              <span
                class="absolute top-full left-0 w-full text-error text-sm"
                >{{ v.errors[0] }}</span
              >
            </ValidationProvider>
          </div>
          <div class="mt-5">
            <div class="form-control mb-5">
              <div class="flex items-center">
                <label class="label">
                  <span class="label-text mr-1">Hasło</span>
                </label>
                <div
                  data-tip="Hasło musi składać się z conajmniej 8 znaków, conajmniej jednej wielkiej litery i znaku specjalnego."
                  class="tooltip tooltip-right text-primary"
                >
                  <fa :icon="['fas', 'question-circle']" />
                </div>
              </div>
              <!-- na razie ustawione na min 6 znaków i tyle -->
              <ValidationProvider
                v-slot="v"
                mode="eager"
                class="relative"
                name="Hasło"
                rules="required|min:6"
              >
                <input
                  v-model="credentials.password"
                  type="password"
                  class="input input-bordered w-full"
                  :class="{
                    'input-error': v.errors[0],
                    'input-success': v.validated,
                  }"
                />
                <span
                  class="absolute top-full left-0 w-full text-error text-sm"
                  >{{ v.errors[0] }}</span
                >
              </ValidationProvider>
            </div>
            <div class="form-control mb-5">
              <label class="label">
                <span class="label-text">Powtórz hasło</span>
              </label>
              <ValidationProvider
                v-slot="v"
                mode="eager"
                class="relative"
                name="Powtórz hasło"
                rules="required|confirmed:Hasło"
              >
                <input
                  v-model="credentials.repeatPassword"
                  type="password"
                  class="input input-bordered w-full"
                  :class="{
                    'input-error': v.errors[0],
                    'input-success': v.validated,
                  }"
                />
                <span
                  class="absolute top-full left-0 w-full text-error text-sm"
                  >{{ v.errors[0] }}</span
                >
              </ValidationProvider>
            </div>
          </div>
          <div class="relative">
            <button
              v-show="!isLoading"
              type="submit"
              :disabled="invalid"
              class="btn btn-primary btn-block mt-10"
            >
              Zarejestruj się
            </button>
            <button
              v-show="isLoading"
              type="submit"
              :disabled="invalid"
              class="btn btn-primary btn-block mt-10 loading"
            ></button>
            <p
              v-if="invalid"
              class="
                text-xs
                font-light
                text-center text-gray-400
                absolute
                top-full
                left-0
                right-0
              "
            >
              Wypełnij wszystkie pola, upewnij się że nie zawierają błędów
            </p>
          </div>
        </form>
      </ValidationObserver>
      <p class="my-2 text-xs font-light text-center text-gray-400">
        Masz już konto?
        <NuxtLink
          to="/login"
          class="font-medium text-gray-800 dark:text-gray-200 hover:underline"
          >Zaloguj się</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import register from '../graphql/register.gql';

export default Vue.extend({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  middleware: 'guest',
  data() {
    return {
      isLoading: false,
      credentials: {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        repeatPassword: '',
      },
    };
  },
  methods: {
    async onSubmit() {
      this.isLoading = true;
      try {
        await this.$apollo.mutate({
          mutation: register,
          variables: this.credentials,
        });
        this.$toast.success(
          'Rejestracja przebiegła pomyślnie, sprawdź skrzynkę email.',
          {
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
          },
        );

        this.$router.push('/login');

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
        this.isLoading = false;
      }
    },
  },
});
</script>

<style>
.flex-basis-33 {
  flex-basis: 33%;
}

.tooltip::before {
  z-index: 99;
}
</style>
