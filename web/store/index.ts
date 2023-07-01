import {
  getAccessorType,
  mutationTree,
  getterTree,
  actionTree,
} from 'typed-vuex';
import { Context } from '@nuxt/types';

import isMe from '../graphql/isMe.gql';
import retrieveOrders from '../graphql/retrieveOrders.gql';

export const state = () => ({
  isLoggedIn: false,
  id: 0,
  username: '',
  email: '',
  permissionLevel: 0,
  boughtCourses: [],
  // browse
  category: 0,
  ranking: 0,
  duration: 0,
  advancementLevel: 0,
});

export const getters = getterTree(state, {
  isAdmin: (state) => state.permissionLevel === 3,
  isTeacher: (state) => state.permissionLevel === 2,
  isUser: (state) => state.permissionLevel === 1,
});

export const mutations = mutationTree(state, {
  SET_LOGIN_STATE(state, { id, username, email, permissionLevel }) {
    state.isLoggedIn = true;
    state.id = id;
    state.username = username;
    state.email = email;
    state.permissionLevel = permissionLevel;
  },

  LOGOUT(state) {
    state.isLoggedIn = false;
    state.id = 0;
    state.username = '';
    state.email = '';
    state.permissionLevel = 0;
  },

  SET_BOUGHT_COURSES(state, payload) {
    state.boughtCourses = payload;
  },

  SET_CATEGORY(state, payload) {
    state.category = payload;
  },

  SET_RANKING(state, payload) {
    state.ranking = payload;
  },

  SET_DURATION(state, payload) {
    state.duration = payload;
  },

  SET_ADVANCEMENTLEVEL(state, payload) {
    state.advancementLevel = payload;
  },

  SET_FILTERS(state, { category, ranking, duration, advancementLevel }) {
    state.category = category;
    state.ranking = ranking;
    state.duration = duration;
    state.advancementLevel = advancementLevel;
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    async nuxtServerInit(_vuexContext, nuxtContext: Context) {
      console.log(nuxtContext.req.headers.cookie);
      if (nuxtContext.req.headers.cookie) {
        const client = this.app.apolloProvider?.defaultClient;
        const res = await client?.mutate({ mutation: isMe });
        if (res?.data.isMe == null) {
          console.error('Ciasteczko bad!');
        } else {
          _vuexContext.commit('SET_LOGIN_STATE', res.data.isMe);
        }

        const orders = await client?.mutate({ mutation: retrieveOrders });
        _vuexContext.commit(
          'SET_BOUGHT_COURSES',
          orders.data.retrieveOrders.map((item) => item.courseId),
        );
      } else {
        console.log('NIE JESTEŚ ZALOGOWANY');
      }
    },
  },
);

export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
});
