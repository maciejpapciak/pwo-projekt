<template>
  <div>
    <!-- HERO1 -->
    <div
      class="
        container
        mx-auto
        flex flex-col
        lg:flex-row
        justify-between
        my-20
        px-5
        items-center
      "
    >
      <div class="md:mr-5 flex-basis-50">
        <p class="text-6xl lg:text-8xl font-bold mb-5">Ucz się bez limitów</p>
        <p>
          Zdobywaj umiejętności dzięki kursom tworzonym przez społeczność. Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Amet id recusandae
          sunt quae nihil, eligendi mollitia libero cum dolorem magnam!
        </p>
        <div class="flex mt-10 flex-col md:flex-row">
          <NuxtLink
            to="/register"
            class="btn btn-primary btn-md md:btn-lg md:mr-5 mb-5 lg:mb-0"
          >
            Dołącz do nas
          </NuxtLink>
          <NuxtLink to="#" class="btn btn-primary btn-outline btn-md md:btn-lg">
            Przeglądaj kursy
          </NuxtLink>
        </div>
      </div>
      <div
        class="
          mt-10
          lg:mt-0
          h-16
          lg:h-auto
          flex
          justify-center
          hidden
          lg:inline
        "
      >
        <img
          :src="require('~/static/img/undraw_Youtube_tutorial_re_69qc 1.svg')"
          alt="Person taking an online course"
        />
      </div>
    </div>

    <!-- SLIDER -->
    <CourseSliderSmall />

    <!-- HERO2 -->
    <div
      class="
        container
        mx-auto
        flex flex-col
        lg:flex-row
        justify-between
        my-20
        px-5
        items-center
      "
    >
      <div
        class="
          md:mr-10
          mt-10
          lg:mt-0
          h-16
          lg:h-auto
          flex
          justify-center
          hidden
          lg:inline
        "
      >
        <img
          :src="require('~/static/img/undraw_lightbulb_moment_re_ulyo 1.svg')"
          alt="Person looking at a lightbulb XD"
        />
      </div>
      <div class="flex-basis-50">
        <p class="text-6xl lg:text-8xl font-bold mb-5">Zostań instruktorem</p>
        <p>
          Instruktorzy z całego świata nauczają miliony uczestników w Elearnr.
          Dajemy ci dostęp do narzędzi i umiejętności, dzięki którym będziesz
          robić to, co kochasz.
        </p>
        <div class="flex mt-10 flex-col md:flex-row">
          <button class="btn btn-primary btn-md md:btn-lg mb-5 lg:mb-0">
            Zacznij uczyć
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  overflow-x: hidden;
}
.flex-basis-50 {
  flex-basis: 50%;
}
.flex > .card-small .card-info {
  left: 100%;
}

.flex > .card-small:last-child .card-info {
  left: -160%;
}
</style>
