import { Middleware } from '@nuxt/types';

const guest: Middleware = (context) => {
  if (context.store.state.isLoggedIn) {
    context.redirect('/');
  }
};

export default guest;
