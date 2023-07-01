export default {
  publicRuntimeConfig: {
    backendUrl: process.env.BACKEND_URL || 'http://localhost:4000',
    stripePk: process.env.STRIPE_PK,
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'elearnr',
    htmlAttrs: {
      lang: 'pl',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap',
      },
    ],
    script: [{ src: 'https://js.stripe.com/v3' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'quill/dist/quill.core.css',
    'quill/dist/quill.snow.css',
    'vue-multiselect/dist/vue-multiselect.min.css',
    'video.js/dist/video-js.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/veevalidate.js',
    { src: '~/plugins/boringavatars.js', mode: 'client' },
    { src: '~/plugins/quill.js', mode: 'client' },
    { src: '~/plugins/vmoney.js', mode: 'client' },
    { src: '~/plugins/multiselect.js', mode: 'client' },
    { src: '~/plugins/vue-stripe.js', ssr: false },
    { src: '~plugins/video-player.js', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/fontawesome',
    'nuxt-typed-vuex',
  ],

  fontawesome: {
    component: 'fa',
    suffix: false,
    icons: {
      solid: [
        'faShoppingCart',
        'faUser',
        'faUserPlus',
        'faSearch',
        'faHeart',
        'faAngleLeft',
        'faAngleRight',
        'faAngleDown',
        'faBars',
        'faStar',
        'faStarHalfAlt',
        'faQuestionCircle',
        'faPlay',
        'faBookOpen',
        'faSignOutAlt',
        'faUserShield',
        'faUserCog',
        'faPlus',
        'faEye',
        'faEdit',
        'faTrashAlt',
        'faImage',
        'faSpinner',
        'faCheck',
      ],
      regular: ['faHeart'],
      brands: ['faGithub'],
    },
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['vue-toastification/nuxt', '@nuxtjs/apollo'],

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: 'http://localhost:4000/graphql',
        httpLinkOptions: {
          credentials: 'include',
          headers: {
            'access-control-allow-origin': 'https://elearnr.rocks',
          },
        },
      },
    },
  },

  toast: {
    transition: 'Vue-Toastification__bounce',
    maxToasts: 20,
    newestOnTop: true,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vee-validate/dist/rules'],
  },

  tailwindcss: {
    config: {
      plugins: [require('daisyui')],
      theme: {
        fontFamily: {
          body: ['Montserrat', 'sans-serif'],
          sans: ['Montserrat', 'sans-serif'],
        },
        minWidth: {
          0: '0',
          '1/4': '25%',
          '1/2': '50%',
          '3/4': '75%',
          full: '100%',
          50: '50rem',
        },
      },
      daisyui: {
        themes: [
          {
            elearnr: {
              primary: '#53A9AD',
              'primary-focus': '#3F8D90',
              'primary-content': '#ffffff',
              secondary: '#377CFBX',
              'secondary-focus': '#055BFA',
              'secondary-content': '#ffffff',
              accent: '#EEAF3A',
              'accent-focus': '#E19914',
              'accent-content': '#ffffff',
              neutral: '#333C4D',
              'neutral-focus': '#1F242E',
              'neutral-content': '#ffffff',
              'base-100': '#ffffff',
              'base-200': '#f9fafb',
              'base-300': '#d1d5db',
              'base-content': '#1f2937',
              info: '#2094f3',
              success: '#009485',
              warning: '#ff9900',
              error: '#ff5724',
            },
          },
        ],
      },
    },
  },
};
