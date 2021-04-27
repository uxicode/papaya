import Vue from 'vue';
import Vuetify, {
  VApp,
  VCalendar,
  VMenu,
  VList,
  VListItem,
  VListItemTitle,
  VBtn,
  VIcon,
  VToolbar,
  VToolbarTitle,
  VSheet,
  VSpacer,
  VTextField,
  VSelect,
  VDatePicker
} from 'vuetify/lib';
import {Ripple} from 'vuetify/lib/directives';
import '@mdi/font/css/materialdesignicons.css';
// import { VuetifyPreset } from 'vuetify/types';
import 'vuetify/dist/vuetify.min.css';

Vue.use( Vuetify, {
  components:{
    VApp,
    VCalendar,
    VMenu,
    VList,
    VListItem,
    VListItemTitle,
    VBtn,
    VIcon,
    VToolbar,
    VToolbarTitle,
    VSheet,
    VSpacer,
    VTextField,
    VSelect,
    VDatePicker
  },
  directives: {
    Ripple,
  },
});
export default new Vuetify({
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
});
