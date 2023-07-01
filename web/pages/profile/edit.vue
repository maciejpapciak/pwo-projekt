<template>
  <div class="container mx-auto my-10">
    <h1
      class="text-4xl font-semibold text-center text-gray-700 dark:text-white"
    >
      Edytuj profil
    </h1>
    <ValidationObserver v-slot="{ invalid, handleSubmit }">
      <form
        class="px-20 py-10 mx-auto lg:w-1/2"
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
              rules="required|alpha_num|min:4"
            >
              <input
                v-model="user.firstName"
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
                v-model="user.lastName"
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
              v-model="user.username"
              type="text"
              class="input input-bordered w-full"
              :class="{
                'input-error': v.errors[0],
                'input-success': v.validated,
              }"
            />
            <span class="absolute top-full left-0 w-full text-error text-sm">{{
              v.errors[0]
            }}</span>
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
              v-model="user.email"
              type="text"
              class="input input-bordered w-full"
              :class="{
                'input-error': v.errors[0],
                'input-success': v.validated,
              }"
            />
            <span class="absolute top-full left-0 w-full text-error text-sm">{{
              v.errors[0]
            }}</span>
          </ValidationProvider>
        </div>
        <div class="relative">
          <button
            v-show="!isLoading"
            type="submit"
            :disabled="invalid"
            class="btn btn-primary btn-block mt-10"
          >
            Zapisz zmiany
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import user from '../../graphql/user.gql';

export default Vue.extend({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  middleware: 'authenticated',
  data() {
    return {
      credentials: {
        password: '',
        repeatPassword: '',
      },
      user: {
        username: '',
        firstName: '',
        lastName: '',
        email: '',
      },
    };
  },
  apollo: {
    user: {
      query: user,
      variables() {
        return {
          id: parseInt(this.$accessor.id),
        };
      },
      update: (data) => data.userById,
    },
  },
  methods: {
    onSubmit() {
      this.$toast.success('Dane zostały zapisane', {
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
    },
  },
});
</script>
