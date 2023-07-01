<template>
  <div class="navbar shadow-sm">
    <div class="container mx-auto flex justify-between">
      <div class="flex px-2 mx-2">
        <NuxtLink class="hidden md:block" to="/">
          <img :src="require('~/static/img/logo.svg')" alt="Elearnr" />
        </NuxtLink>
        <NuxtLink class="md:hidden" to="/">
          <img :src="require('~/static/img/logo_small.svg')" alt="Elearnr" />
        </NuxtLink>
      </div>
      <div class="flex px-2 mx-2">
        <NavItem text="Kategorie" :dropdown="true" class="mr-3">
          <div class="flex">
            <ul class="pl-0 category-menu">
              <li v-for="category in categories" :key="category.id">
                <span
                  class="
                    py-2
                    px-5
                    hover:bg-primary hover:text-primary-content
                    block
                    w-full
                    h-full
                  "
                  :class="{ 'text-primary': category.id === currentCategory }"
                  to="#"
                  @mouseover="setParentCategory(category.id)"
                  >{{ category.name }}
                </span>
              </li>
            </ul>
            <ul class="pl-0 bg-base-200 category-menu">
              <li v-for="category in showSubcategories" :key="category.id">
                <a
                  class="
                    py-2
                    px-5
                    hover:bg-primary hover:text-primary-content
                    block
                    w-full
                    h-full
                  "
                  :href="`/courses?category=${category.id}`"
                  >{{ category.name }}
                </a>
              </li>
            </ul>
          </div>
        </NavItem>
        <NavSearch />
        <NavItem
          class="md:hidden"
          text="Szukaj"
          :icon="['fas', 'search']"
          :dropdown="true"
        >
          <div class="relative mr-3">
            <input
              type="text"
              placeholder="Czego szukasz?"
              class="w-full pr-16 input input-sm input-primary input-bordered"
            />
            <button
              class="
                absolute
                right-0
                top-0
                rounded-l-none
                btn btn-primary btn-sm
              "
            >
              <fa :icon="['fas', 'search']" />
            </button>
          </div>
        </NavItem>
        <NavItem text="Konto" :icon="['fas', 'user']" :dropdown="true">
          <LoginForm v-if="!$accessor.isLoggedIn" />
          <ProfileMenu v-else-if="$accessor.isLoggedIn" />
        </NavItem>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import retrieveCategories from '../graphql/retrieveCategories.gql';
import retrieveSubcategories from '../graphql/retrieveSubcategories.gql';

export default Vue.extend({
  data() {
    return {
      categories: [],
      subcategories: [],
      currentCategory: 0,
    };
  },
  apollo: {
    categories: {
      query: retrieveCategories,
      update: (data) => data.retrieveCategories,
    },
    subcategories: {
      query: retrieveSubcategories,
      update: (data) => data.retrieveSubcategories,
    },
  },
  computed: {
    showSubcategories() {
      if (this.currentCategory !== 0) {
        return this.subcategories.filter(
          (item) => item.parentCategoryId === this.currentCategory,
        );
      } else
        return this.subcategories.filter(
          (item) => item.parentCategoryId === this.categories[0].id,
        );
    },
  },
  methods: {
    setParentCategory(id) {
      this.currentCategory = id;
    },
  },
});
</script>

<style scoped>
.category-menu {
  min-width: 350px;
  min-height: 300px;
}
</style>
