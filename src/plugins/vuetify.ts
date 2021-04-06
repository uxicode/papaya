import Vue from 'vue';
import Vuetify, {
  VSheet,
  VBtn,
  VBtnToggle,
  VContent,
  VOverflowBtn,
  VCalendar,
  VCalendarDaily,
  VCalendarMonthly,
  VCalendarWeekly,
  VCalendarCategory
} from 'vuetify/lib';
import { VuetifyPreset } from 'vuetify/types';
import 'vuetify/dist/vuetify.min.css';


const opts = {};
Vue.use( Vuetify, {
  components: {
    VSheet,
    VBtn,
    VBtnToggle,
    VContent,
    VCalendar,
    VCalendarDaily,
    VCalendarMonthly,
    VCalendarWeekly,
    VCalendarCategory
  }
});
export default new Vuetify();
