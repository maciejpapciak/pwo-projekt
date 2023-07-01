<template>
  <div class="md:w-1/2 mx-auto my-10">
    <div v-if="isVerified">
      <p class="text-center">Konto zostało aktywowane, możesz się zalogować.</p>
      <LoginForm />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import verify from '../../graphql/verify.gql';

export default Vue.extend({
  middleware: 'guest',
  asyncData({ params }) {
    const token = params.token;
    return { token };
  },
  data() {
    return {
      isVerified: false,
    };
  },
  async created() {
    try {
      const res = await this.$apollo.mutate({
        mutation: verify,
        variables: { token: this.token },
      });
      console.log(res);
      if (res.data.verify === true) this.isVerified = true;
    } catch (error) {
      console.log(' ', error);
    }
  },
});
</script>
