<template>
  <div>
    <FilterCollapse title="Rankingi">
      <input
        type="radio"
        name="rating"
        class="hidden"
        value="0"
        selected="selected"
      />
      <div class="form-control">
        <label class="cursor-pointer label">
          <div class="flex items-center">
            <span class="label-text mr-2">4,5 i wyższa</span>
            <StarRating :amount="4.5" :show-number="false" />
          </div>
          <input
            v-model="ranking"
            :value="4.5"
            type="radio"
            name="rating"
            class="radio radio-primary"
          />
        </label>
      </div>
      <div class="form-control">
        <label class="cursor-pointer label">
          <div class="flex items-center">
            <span class="label-text mr-2">4,0 i wyższa</span>
            <StarRating :amount="4" :show-number="false" />
          </div>
          <input
            v-model="ranking"
            :value="4.0"
            type="radio"
            name="rating"
            class="radio radio-primary"
          />
        </label>
      </div>
      <div class="form-control">
        <label class="cursor-pointer label">
          <div class="flex items-center">
            <span class="label-text mr-2">3,5 i wyższa</span>
            <StarRating :amount="3.5" :show-number="false" />
          </div>
          <input
            v-model="ranking"
            :value="3.5"
            type="radio"
            name="rating"
            class="radio radio-primary"
          />
        </label>
      </div>
      <div class="form-control">
        <label class="cursor-pointer label">
          <div class="flex items-center">
            <span class="label-text mr-2">3,0 i wyższa</span>
            <StarRating :amount="3.0" :show-number="false" />
          </div>
          <input
            v-model="ranking"
            :value="3.0"
            type="radio"
            name="rating"
            class="radio radio-primary"
          />
        </label>
      </div>
    </FilterCollapse>
    <FilterCollapse title="Czas trwania">
      <div class="form-control">
        <label class="cursor-pointer label">
          <div class="flex items-center">
            <span class="label-text mr-2">do 1 godziny</span>
          </div>
          <input
            v-model="duration"
            type="radio"
            name="duration"
            class="radio radio-primary"
            :value="1"
          />
        </label>
      </div>
      <div class="form-control">
        <label class="cursor-pointer label">
          <div class="flex items-center">
            <span class="label-text mr-2">do 3 godzin</span>
          </div>
          <input
            v-model="duration"
            type="radio"
            name="duration"
            class="radio radio-primary"
            :value="3"
          />
        </label>
      </div>
      <div class="form-control">
        <label class="cursor-pointer label">
          <div class="flex items-center">
            <span class="label-text mr-2">do 6 godzin</span>
          </div>
          <input
            v-model="duration"
            type="radio"
            name="duration"
            class="radio radio-primary"
            :value="6"
          />
        </label>
      </div>
    </FilterCollapse>
    <FilterCollapse title="Poziom zaawansowania">
      <div class="form-control">
        <label class="cursor-pointer label">
          <div class="flex items-center">
            <span class="label-text mr-2">Początkujący</span>
          </div>
          <input
            v-model="advancementLevel"
            type="radio"
            name="advancementLevel"
            class="radio radio-primary"
            :value="1"
          />
        </label>
      </div>
      <div class="form-control">
        <label class="cursor-pointer label">
          <div class="flex items-center">
            <span class="label-text mr-2">Średnio zaawansowany</span>
          </div>
          <input
            v-model="advancementLevel"
            type="radio"
            name="advancementLevel"
            class="radio radio-primary"
            :value="2"
          />
        </label>
      </div>
      <div class="form-control">
        <label class="cursor-pointer label">
          <div class="flex items-center">
            <span class="label-text mr-2">Ekspert</span>
          </div>
          <input
            v-model="advancementLevel"
            type="radio"
            name="advancementLevel"
            class="radio radio-primary"
            :value="3"
          />
        </label>
      </div>
    </FilterCollapse>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  computed: {
    ranking: {
      get() {
        return this.$accessor.ranking;
      },
      set(value) {
        this.$accessor.SET_RANKING(value);
      },
    },
    duration: {
      get() {
        return this.$accessor.duration;
      },
      set(value) {
        this.$accessor.SET_DURATION(value);
      },
    },
    advancementLevel: {
      get() {
        return this.$accessor.advancementLevel;
      },
      set(value) {
        this.$accessor.SET_ADVANCEMENTLEVEL(value);
      },
    },
  },
});
</script>
