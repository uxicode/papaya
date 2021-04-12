import {Vue, Component, Prop} from 'vue-property-decorator';
import SideMenu from '@/components/sideMenu/sideMenu.vue';
import ClassSettingMain from '@/views/class/setting/classSettingMain/ClassSettingMain';
import ClassProfile from '@/views/class/setting/classProfile/ClassProfile';
import ClassMemberManage from '@/views/class/setting/classMemberManage/ClassMemberManage';
import ClassAdminDelegate from '@/views/class/setting/classAdminDelegate/ClassAdminDelegate';
import WithRender from './ClassSetting.html';

@WithRender
@Component({
  components: {
      SideMenu,
      ClassSettingMain,
      ClassProfile,
      ClassMemberManage,
      ClassAdminDelegate,
  }
})

export default class ClassSetting extends Vue {

}