import {Vue, Component, Prop} from 'vue-property-decorator';
import ClassSettingMain from '@/views/class/setting/classSettingMain/ClassSettingMain';
import ClassBasicInfo from '@/views/class/setting/classBasicInfo/ClassBasicInfo';
import ClassMemberManage from '@/views/class/setting/classMemberManage/ClassMemberManage';
import ClassAdminDelegate from '@/views/class/setting/classAdminDelegate/ClassAdminDelegate';
import WithRender from './ClassSetting.html';

@WithRender
@Component({
  components: {
      ClassSettingMain,
      ClassBasicInfo,
      ClassMemberManage,
      ClassAdminDelegate,
  }
})

export default class ClassSetting extends Vue {

}