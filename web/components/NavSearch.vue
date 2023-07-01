<template>
  <div class="relative mr-3 hidden md:block">
    <input
      type="text"
      placeholder="Czego szukasz?"
      class="w-full pr-16 input input-sm input-primary input-bordered"
    />
    <button
      class="absolute right-0 top-0 rounded-l-none btn btn-primary btn-sm"
    >
      <fa :icon="['fas', 'search']" />
    </button>
  </div>
</template>
