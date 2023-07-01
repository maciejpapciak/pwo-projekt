import { Middleware } from '@nuxt/types';

const admin: Middleware = (context) => {
  if (context.store.state.permissionLevel < 3) {
    context.redirect('/');
  }
};

export default admin;
