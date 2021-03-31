import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Btn from '@/components/button/Btn.vue';
import WithRender from './MakeClassComplete.html';
import {IMakeClassInfo} from '@/views/model/my-class.model';

const MyClass = namespace('MyClass');

@WithRender
@Component({
  components:{
    Btn
  }
})
export default class MakeClassComplete extends Vue{

  @MyClass.Getter
  private createdClassInfo!: IMakeClassInfo;

  get className(): string{
    return this.createdClassInfo.name as string;
  }

  private gotoClassHome(): void{
    this.$router.push('/');
  }

}
