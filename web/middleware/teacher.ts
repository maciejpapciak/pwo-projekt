import { Middleware } from '@nuxt/types';

const teacher: Middleware = (context) => {
  if (context.store.state.permissionLevel < 2) {
    context.redirect('/');
  }
};

export default teacher;
