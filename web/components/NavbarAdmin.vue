<template>
  <div class="px-2 mt-2">
    <div
      class="navbar mb-2 shadow-lg bg-primary text-primary-content rounded-box"
    >
      <div class="flex-1 px-2 mx-2">
        <span class="text-lg font-bold"> ELEARNR Admin </span>
      </div>
      <div class="flex-none hidden px-2 mx-2 lg:flex">
        <div class="flex items-stretch">
          <NavItem href="/" text="Strona główna" color="text-primary-content" />
          <NavItem
            href="/admin/users"
            :icon="['fas', 'user']"
            text="Użytkownicy"
            color="text-primary-content"
          />
          <NavItem
            :icon="['fas', 'book-open']"
            text="Kursy"
            color="text-primary-content"
          />
          <NavItem text="Kategorie" color="text-primary-content" />
          <NavItem text="Tagi" color="text-primary-content" />
        </div>
      </div>
    </div>
  </div>
</template>
