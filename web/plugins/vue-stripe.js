import Vue from 'vue';
import { StripePlugin, StripeCheckout } from '@vue-stripe/vue-stripe';

export default () => {
  Vue.component('StripeCheckout', StripeCheckout);
  Vue.use(StripePlugin, {
    pk: 'pk_test_51JMpzzHe99RvaLOJewQ6Mj8aUgVvYewp9TUiv7AaGog1LZPYecpqyMSRScoL6HNzzyBdP8392eCk5F7icdUNas2B00EWTgCVNy',
  });
};
