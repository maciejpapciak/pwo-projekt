import { Middleware } from '@nuxt/types';

const hasCourse: Middleware = (context) => {
  console.log(
    context.store.state.boughtCourses,
    context.store.state.boughtCourses.includes(parseInt(context.params.id)),
  );
  if (
    !context.store.state.boughtCourses.includes(parseInt(context.params.id))
  ) {
    context.redirect('/');
  }
};

export default hasCourse;
