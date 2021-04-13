import MyClassService from '@/api/service/MyClassService';
import ClassSettingMain from '@/views/class/setting/classSettingMain/ClassSettingMain';
import {IClassInfo} from '@/views/model/my-class.model';
import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import WithRender from './ClassBasicInfo.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components: {
        Btn,
        Modal
    }
})

export default class ClassBasicInfo extends Vue {
    private classInfo: IClassInfo[] = [];

    @MyClass.Getter
    private classID!: number;

    get info(): IClassInfo[] {
        return this.classInfo;
    }

    public created() {
        this.getClassInfo();
    }

    private getClassInfo(): void {
        MyClassService.getClassInfoById(this.classID)
          .then((data) => {
              this.classInfo = data.classinfo;
              console.log(this.classInfo);
          });
    }

    private goBack(): void {
        this.$router.push('./')
          .then();
    }
}