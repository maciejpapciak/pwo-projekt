import { Middleware } from '@nuxt/types';

const authenticated: Middleware = (context) => {
  if (!context.store.state.isLoggedIn) {
    context.redirect('/login');
  }
};

export default authenticated;
