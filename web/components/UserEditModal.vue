<template>
  <div :id="user.id" class="modal">
    <div class="modal-box">
      <ValidationObserver v-slot="{ invalid, handleSubmit }">
        <form
          class="px-20 py-10 mx-auto"
          @submit.prevent="handleSubmit(onSubmit)"
        >
          <div class="flex justify-between mb-5">
            <div class="form-control mr-2">
              <label class="label">
                <span class="label-text">Imię</span>
              </label>
              <ValidationProvider
                v-slot="v"
                mode="eager"
                class="relative"
                name="Imię"
                rules="required|alpha"
              >
                <input
                  v-model="userData.firstName"
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
                rules="required|alpha"
              >
                <input
                  v-model="userData.lastName"
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
          <div class="form-control">
            <label class="label">
              <span class="label-text">Nazwa użytkownika</span>
            </label>
            <ValidationProvider
              v-slot="v"
              mode="eager"
              class="relative"
              name="Nazwa użytkownika"
              rules="required|alpha_num"
            >
              <input
                v-model="userData.username"
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
              <span class="label-text">email</span>
            </label>
            <ValidationProvider
              v-slot="v"
              mode="eager"
              class="relative"
              name="email"
              rules="required|email"
            >
              <input
                v-model="userData.email"
                type="email"
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
          <ValidationProvider
            v-slot="v"
            mode="eager"
            class="relative"
            name="Rola"
            rules="required"
          >
            <div class="form-control">
              <label class="label"
                ><span class="label-text">Typ użytkownika</span></label
              >
              <select
                v-model="userData.permissionLevel"
                class="select select-bordered w-full max-w-xs"
              >
                <option value="1">Użytkownik</option>
                <option value="2">Nauczyciel</option>
                <option value="3">Admin</option>
              </select>
            </div>
          </ValidationProvider>
          <div class="relative">
            <button
              v-show="!isLoading"
              type="submit"
              :disabled="invalid"
              class="btn btn-primary btn-block mt-10"
            >
              Zapisz
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
      <div class="modal-action">
        <NuxtLink to="#" class="btn">Close</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';

export default Vue.extend({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      userData: Object.assign({}, this.user),
    };
  },
});
</script>
