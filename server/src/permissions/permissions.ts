import { shield, or } from 'graphql-shield';
import { isAdmin, isAuthenticated, isTeacher } from '../rules/rules';

export const permissions = shield(
  {
    Query: {
      retrieveLibraries: or(isAdmin, isTeacher, isAuthenticated),
    },

    Mutation: {
      createAdvancementLevel: isAdmin,
      updateAdvancementLevel: isAdmin,
      deleteAdvancementLevel: isAdmin,

      createCategory: isAdmin,
      updateCategory: isAdmin,
      deleteCategory: isAdmin,

      createTag: or(isAdmin, isTeacher),
      updateTag: isAdmin,
      deleteTag: isAdmin,

      logout: or(isAuthenticated, isAdmin, isTeacher),
      changePassword: or(isAuthenticated, isAdmin, isTeacher),

      createChapter: or(isAdmin, isTeacher),
      updateChapter: or(isAdmin, isTeacher),
      deleteChapter: or(isAdmin, isTeacher),

      createFollow: or(isAuthenticated, isAdmin, isTeacher),
      updateFollow: or(isAuthenticated, isAdmin, isTeacher),
      deleteFollow: or(isAuthenticated, isAdmin, isTeacher),

      createRating: or(isAuthenticated, isAdmin, isTeacher),
      updateRating: or(isAuthenticated, isAdmin, isTeacher),
      deleteRating: or(isAuthenticated, isAdmin, isTeacher),

      createLibrary: or(isAdmin, isTeacher),
      updateLibrary: or(isAdmin, isTeacher),
      deleteLibrary: or(isAdmin, isTeacher),

      createCourse: or(isAdmin, isTeacher),
      updateCourse: or(isAdmin, isTeacher),
      deleteCourse: or(isAdmin, isTeacher),
    },
  },
  { allowExternalErrors: true },
);
