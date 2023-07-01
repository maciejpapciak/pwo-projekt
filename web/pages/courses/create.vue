<template>
  <div class="container mx-auto my-10">
    <ul class="w-full steps">
      <li class="step step-primary">Podstawowe informacje</li>
      <li class="step" :class="{ 'step-primary': currentStep >= 2 }">
        Struktura kursu
      </li>
      <li class="step" :class="{ 'step-primary': currentStep >= 3 }">
        Materiały video
      </li>
      <li class="step" :class="{ 'step-primary': currentStep >= 4 }">
        Podsumowanie
      </li>
    </ul>
    <div class="mt-5">
      <ValidationObserver v-slot="{ invalid, handleSubmit }">
        <form
          enctype="multipart/form-data"
          class="mx-auto lg:w-2/3"
          @submit.prevent="handleSubmit(onSubmit)"
        >
          <template v-if="currentStep === 1">
            <div class="flex justify-between">
              <div class="form-control flex-grow mr-5">
                <label class="label">
                  <span class="label-text">Tytuł</span>
                </label>
                <ValidationProvider
                  v-slot="v"
                  mode="eager"
                  class="relative"
                  name="Tytuł"
                  rules="required|min:4"
                >
                  <input
                    v-model="formData.course.title"
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
                  <span class="label-text">Cena</span>
                </label>
                <ValidationProvider
                  v-slot="v"
                  mode="eager"
                  class="relative"
                  name="Cena"
                  rules="required"
                >
                  <money
                    v-model="formData.course.price"
                    v-bind="money"
                    class="input input-bordered"
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

            <div class="form-control my-2">
              <label class="label">
                <span class="label-text">Opis</span>
              </label>
              <ValidationProvider
                v-slot="v"
                mode="eager"
                class="relative"
                name="Opis"
                rules="required|min:4"
              >
                <quill-editor
                  ref="myQuillEditor"
                  v-model="formData.course.description"
                  :options="quillOptions"
                />
                <span
                  class="absolute top-full left-0 w-full text-error text-sm"
                  >{{ v.errors[0] }}</span
                >
              </ValidationProvider>
            </div>

            <div class="flex justify-between">
              <div class="form-control my-2 w-1/2 mr-5">
                <label class="label">
                  <span class="label-text">Kategoria</span>
                </label>
                <multiselect
                  v-model="formData.course.category"
                  :show-labels="false"
                  :options="categories"
                  :limit="5"
                  track-by="name"
                  label="name"
                  placeholder=""
                  :allow-empty="false"
                  @select="hasCategory = true"
                >
                  <template slot="noResult">Brak wyników</template>
                </multiselect>
              </div>

              <div class="form-control my-2 w-1/2">
                <label class="label">
                  <span class="label-text">Poziom zaawansowania</span>
                </label>
                <multiselect
                  v-model="formData.course.advancementLevel"
                  :show-labels="false"
                  :options="advancementLevels"
                  track-by="name"
                  label="name"
                  placeholder=""
                  :allow-empty="false"
                  @select="hasAL = true"
                >
                  <template slot="noResult">Brak wyników</template>
                </multiselect>
              </div>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Tagi</span>
              </label>
              <multiselect
                v-if="tagOptions"
                v-model="formData.course.tags"
                :show-labels="false"
                :options="tagOptions"
                :limit="5"
                :multiple="true"
                track-by="name"
                label="name"
                placeholder=""
                :allow-empty="false"
                @select="hasTag = true"
              >
                <template slot="noResult">Brak wyników</template>
              </multiselect>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Miniatura kursu</span>
              </label>
              <div class="flex items-center justify-center w-full relative">
                <label
                  class="flex flex-col border-4 border-dashed w-full h-32 hover:bg-gray-100 hover:border-primary group cursor-pointer"
                  :class="{ 'border-primary': thumbnailFile }"
                >
                  <div class="flex flex-col items-center justify-center pt-7">
                    <svg
                      class="w-10 h-10 text-primary group-hover:text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <p
                      v-if="!thumbnailFile"
                      class="lowercase text-sm text-gray-400 group-hover:text-primary pt-1 tracking-wider"
                    >
                      Wybierz zdjęcie (max 2MB)
                    </p>
                    <p
                      v-else
                      class="lowercase text-sm text-gray-400 group-hover:text-primary pt-1 tracking-wider"
                    >
                      {{ thumbnailFile.fileInput.name }}
                    </p>
                  </div>
                  <input
                    ref="thumbnail"
                    type="file"
                    class="hidden"
                    accept=".jpg,.jpeg,.png"
                    @change="handleThumbnail"
                  />
                </label>
                <span
                  v-if="error"
                  class="absolute top-full left-0 w-full text-error text-sm"
                  >Zdjęcie musi ważyć maksymalnie 2MB oraz być formatu .jpg,
                  .jpeg lub .png</span
                >
              </div>
            </div>
          </template>

          <template v-if="currentStep === 2">
            <h2 class="text-lg mt-10">Podziel kurs na rozdziały</h2>
            <div
              v-for="(chapter, i) in chaptersAmount"
              :key="i"
              class="form-control"
            >
              <label class="label">
                <span class="label-text">Rozdział {{ i + 1 }}</span>
              </label>
              <ValidationProvider
                v-slot="v"
                mode="eager"
                class="relative flex"
                :name="`Rodział ${i + 1}`"
                rules="required|min:4"
              >
                <input
                  v-model="formData.chapter[i]"
                  type="text"
                  class="input input-bordered flex-grow mr-5"
                  :class="{
                    'input-error': v.errors[0],
                    'input-success': v.validated,
                  }"
                />
                <button
                  type="button"
                  class="btn btn-outline btn-square btn-primary"
                  :disabled="chaptersAmount === 1"
                  @click="deleteChapter(i)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    class="inline-block w-6 h-6 stroke-current"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
                <span
                  class="absolute top-full left-0 w-full text-error text-sm"
                  >{{ v.errors[0] }}</span
                >
              </ValidationProvider>
            </div>
          </template>

          <template v-if="currentStep === 3">
            <div class="form-control">
              <div class="flex items-center justify-center w-full relative">
                <label
                  class="flex flex-col border-4 border-dashed w-full h-32 hover:bg-gray-100 hover:border-primary group cursor-pointer"
                >
                  <div class="flex flex-col items-center justify-center pt-7">
                    <svg
                      class="w-10 h-10 text-primary group-hover:text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <p
                      class="lowercase text-sm text-gray-400 group-hover:text-primary pt-1 tracking-wider"
                    >
                      Wybierz pliki (.mp4)
                    </p>
                  </div>
                  <input
                    ref="videos"
                    type="file"
                    class="hidden"
                    accept=".mp4"
                    multiple
                    @change="addVideo"
                  />
                </label>
                <span
                  v-if="error"
                  class="absolute top-full left-0 w-full text-error text-sm"
                  >Zdjęcie musi ważyć maksymalnie 2MB oraz być formatu .jpg,
                  .jpeg lub .png</span
                >
              </div>
            </div>

            <div class="my-10">
              <div
                v-for="(file, i) in files"
                :key="i"
                class="flex my-5 items-end"
              >
                <div class="form-control w-1/2 mr-5">
                  <label class="label">
                    <span class="label-text">Tytuł</span>
                  </label>
                  <ValidationProvider
                    v-slot="v"
                    mode="eager"
                    class="relative flex"
                    :name="`Tytuł`"
                    rules="required|min:4"
                  >
                    <input
                      v-model="file.name"
                      type="text"
                      class="input input-bordered flex-grow w-full"
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

                <div class="form-control flex-grow mr-5">
                  <label class="label">
                    <span class="label-text">Rozdział</span>
                  </label>
                  <ValidationProvider
                    v-slot="v"
                    mode="eager"
                    class="relative"
                    name="Rozdział"
                    rules="required"
                  >
                    <select
                      v-model="files[i].chapter"
                      class="select select-bordered w-full"
                    >
                      <option
                        v-for="(chapter, j) in formData.chapter"
                        :key="j"
                        :value="chapter"
                      >
                        {{ chapter }}
                      </option>
                    </select>
                    <span
                      class="absolute top-full left-0 w-full text-error text-sm"
                      >{{ v.errors[0] }}</span
                    >
                  </ValidationProvider>
                </div>
                <button
                  type="button"
                  class="btn btn-outline btn-square btn-primary"
                  @click="deleteVideo(i)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    class="inline-block w-6 h-6 stroke-current"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </template>

          <template v-if="currentStep === 4">
            <div class="alert alert-warning my-10">
              <div class="flex-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="w-6 h-6 mx-2 stroke-current"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
                <label
                  >Nie wyłączaj przeglądarki dopóki wszystkie pliki nie skończą
                  się przesyłać! Po zakonczeniu przesyłania naciśnij
                  <strong>Dodaj kurs</strong></label
                >
              </div>
            </div>

            <UploadItem
              v-for="(item, i) in files"
              :key="i"
              :name="item.name"
              :loading="!item.uploaded"
            />
          </template>

          <div class="my-10 flex justify-between">
            <div>
              <button
                v-if="currentStep != 1"
                type="button"
                class="btn btn-primary mr-10"
                @click="goToPreviousStep"
              >
                Poprzedni krok
              </button>
            </div>

            <div>
              <button
                v-if="currentStep === 2"
                class="btn btn-primary mr-10 btn-outline"
                type="button"
                @click="addChapter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                Dodaj kolejny rozdział
              </button>
              <button
                v-if="currentStep != 4"
                :disabled="
                  invalid ||
                  error ||
                  thumbnailFile == undefined ||
                  !hasCategory ||
                  !hasTag ||
                  !hasAL
                "
                type="submit"
                class="btn btn-primary"
              >
                Następny krok
              </button>
              <button
                v-else
                :disabled="
                  invalid ||
                  error ||
                  thumbnailFile == undefined ||
                  !hasCategory ||
                  !hasTag ||
                  !hasAL
                "
                type="submit"
                class="btn btn-primary"
                :class="{
                  disabled:
                    invalid ||
                    error ||
                    thumbnailFile == undefined ||
                    !hasCategory ||
                    !hasTag ||
                    !hasAL,
                  loading: loading,
                }"
              >
                Dodaj kurs
              </button>
            </div>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import upload from '../../graphql/upload.gql';
import retrieveTags from '../../graphql/retrieveTags.gql';
import retrieveSubcategories from '../../graphql/retrieveSubcategories.gql';
import retrieveAdvancementLevels from '../../graphql/retrieveAdvancementLevels.gql';
import createCourse from '../../graphql/createCourse.gql';
import createCourseTag from '../../graphql/createCourseTag.gql';
import createChapter from '../../graphql/createChapter.gql';
import createLibrary from '../../graphql/createLibrary.gql';

export default Vue.extend({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  middleware: ['authenticated', 'teacher'],
  data() {
    return {
      loading: false,
      tagOptions: ['HTML'],
      categories: ['Tworzenie stron internetowych'],
      advencementLevels: [],
      error: false,
      hasCategory: false,
      hasAL: false,
      hasTag: false,
      money: {
        decimal: ',',
        thousands: ' ',
        prefix: '',
        suffix: ' PLN',
        precision: 2,
        masked: false,
      },
      quillOptions: {
        placeholder: 'Wprowadź opis Twojego kursu...',
        modules: {
          toolbar: [['bold', 'italic', 'underline', 'strike']],
        },
      },
      currentStep: 1,
      chaptersAmount: 1,
      response: {
        courseId: null,
        chapters: [],
        success: false,
        library: [],
      },
      formData: {
        course: {
          title: '',
          description: '',
          price: 0,
          category: 0,
          advancementLevel: 0,
          thumbnail: undefined,
          tags: null,
        },
        chapter: [],
        library: [],
      },
      files: [],
      thumbnailFile: undefined,
    };
  },
  methods: {
    timeout(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    handleThumbnail() {
      if (
        this.$refs.thumbnail.files[0].size < 2000000 &&
        (this.$refs.thumbnail.files[0].type === 'image/jpg' ||
          this.$refs.thumbnail.files[0].type === 'image/jpeg' ||
          this.$refs.thumbnail.files[0].type === 'image/png')
      ) {
        this.error = false;
        this.thumbnailFile = {
          fileInput: this.$refs.thumbnail.files[0],
          uploaded: false,
        };
      } else {
        this.error = true;
        this.formData.course.thumbnail = null;
      }
    },
    addVideo() {
      try {
        for (let i = 0; i < this.$refs.videos.files.length; i++) {
          this.files.push({
            name: this.$refs.videos.files[i].name,
            chapter: '',
            fileInput: this.$refs.videos.files[i],
            uploaded: false,
            duration: 0,
          });
        }
      } catch (error) {
        console.error(error);
      }
      console.log(this.files);
    },
    async handleFileUpload(file) {
      try {
        const res = await this.$apollo.mutate({
          mutation: upload,
          variables: {
            path: `${this.formData.course.title
              .toLowerCase()
              .split(' ')
              .join('-')}`,
            file,
          },
        });
        return res.data.uploadFile;
      } catch (error) {
        console.log(error);
      }
    },
    async onSubmit() {
      if (this.currentStep === 3) {
        this.currentStep++;
        // 0. THUMBNAIL UPLOAD
        try {
          await this.handleFileUpload(this.thumbnailFile.fileInput);
          this.thumbnailFile.uploaded = true;
          this.formData.course.thumbnail = `https://elearnr.blob.core.windows.net/container-${
            this.$accessor.id
          }/${this.formData.course.title.toLowerCase().split(' ').join('-')}/${
            this.thumbnailFile.fileInput.name
          }`;
        } catch (error) {}

        // 1. VIDEOS UPLOAD
        try {
          this.files.forEach(async (file) => {
            await this.handleFileUpload(file.fileInput);
            file.uploaded = true;
            file.duration = 1;
            await this.timeout(1000);
          });
        } catch (error) {
          console.log(error);
        }
        this.response.success = true;
      } else if (this.currentStep === 4) {
        // 2. CREATE COURSE
        try {
          this.loading = true;
          const res = await this.$apollo.mutate({
            mutation: createCourse,
            variables: {
              title: this.formData.course.title,
              description: this.formData.course.description,
              price: this.formData.course.price,
              thumbnail: this.formData.course.thumbnail,
              categoryId: this.formData.course.category.id,
              advancementLevelId: this.formData.course.advancementLevel.id,
            },
          });

          this.response.courseId = res.data.createCourse.id;
          if (!this.response.courseId) {
            throw new Error('Nie utworzono kursu');
          } else {
            console.log('Utworzono kurs');
          }
          await this.timeout(1000);
          // 3. CREATE COURSE TAG
          this.formData.course.tags.forEach(async (tag) => {
            const res = await this.$apollo.mutate({
              mutation: createCourseTag,
              variables: { courseId: this.response.courseId, tagId: tag.id },
            });
            if (this.response.courseId !== res.data.createCourseTag.courseId) {
              throw new Error('Nie utworzono łączenia między kursem a tagami');
            } else {
              console.log('Utworzono łączenie między kursem a tagami');
            }
          });
          await this.timeout(1000);
          // 4. CREATE CHAPTER
          this.formData.chapter.forEach(async (item, index) => {
            const res = await this.$apollo.mutate({
              mutation: createChapter,
              variables: {
                courseId: this.response.courseId,
                name: item,
                index,
              },
            });

            this.response.chapters.push({
              id: res.data.createChapter.id,
              name: item,
            });
          });
          console.log('Utworzono chaptery');
          await this.timeout(1000);

          // 5. CREATE LIBRARY
          this.files.forEach(async (file) => {
            const res = await this.$apollo.mutate({
              mutation: createLibrary,
              variables: {
                title: file.name,
                chapterId: this.response.chapters.filter(
                  (item) => item.name === file.chapter,
                )[0].id,
                duration: 1,
                path: `https://elearnr.blob.core.windows.net/container-${
                  this.$accessor.id
                }/${this.formData.course.title
                  .toLowerCase()
                  .split(' ')
                  .join('-')}/${file.fileInput.name}`,
              },
            });
            this.response.library.push(res.data.createLibrary.id);
          });
          await this.timeout(2000);
          if (!this.response.library) {
            throw new Error('Nie dodano do library');
          } else {
            console.log('dodano do library');
            this.$toast.success('Dodano kurs pomyślnie', {
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
            this.loading = false;
            this.$router.push('/profile');
          }
        } catch (error) {
          console.log(error);
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
          this.loading = false;
        }
      } else {
        this.currentStep++;
      }
    },
    goToPreviousStep() {
      this.currentStep--;
    },
    addChapter() {
      this.chaptersAmount++;
    },
    deleteChapter(i: number) {
      this.formData.chapter.splice(i, 1);
      this.chaptersAmount--;
    },
    deleteVideo(i: number) {
      this.files.splice(i, 1);
    },
  },
  apollo: {
    tagOptions: {
      query: retrieveTags,
      update: (data) => data.RetrieveTags,
    },
    categories: {
      query: retrieveSubcategories,
      update: (data) => data.retrieveSubcategories,
    },
    advancementLevels: {
      query: retrieveAdvancementLevels,
      update: (data) => data.retrieveAdvancementLevels,
    },
  },
});
</script>

<style>
.multiselect > .multiselect__tags {
  border-radius: 0.5rem;
  border-color: #d2d4d7;
}

.multiselect__select::before {
  border-color: #000 transparent transparent;
}

.multiselect__option--highlight,
.multiselect__option--highlight:after {
  @apply bg-primary;
}
</style>
