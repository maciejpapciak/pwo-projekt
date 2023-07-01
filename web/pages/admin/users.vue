<template>
  <div class="container mx-auto my-10">
    <UserTable :users="users" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import users from '../../graphql/users.gql';

export default Vue.extend({
  layout: 'admin',
  apollo: {
    users: {
      query: users,
    },
  },
});
</script>
