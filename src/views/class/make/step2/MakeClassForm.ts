import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Btn from '@/components/button/Btn.vue';
import TxtField from '@/components/form/txtField.vue';
import SelectBox from '@/components/selectbox/SelectBox.vue';
import RadioButton from '@/components/radio/RadioButton.vue';

import {IMakeClassInfo, IMakeClassInfoBase} from '@/views/model/my-class.model';
import {Utils} from '@/utils/utils';
import WithRender from './MakeClassForm.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
  components:{
    Btn,
    TxtField,
    SelectBox,
    RadioButton
  }
})
export default class MakeClassForm extends Vue{
  @MyClass.Getter
  private createdClassInfo!: IMakeClassInfo;

  @MyClass.Action
  private MAKE_CLASS!: ( info: IMakeClassInfoBase ) => Promise<IMakeClassInfo>;

  private classFormData: IMakeClassInfoBase={
    name: '',
    is_private: true,
    image_url:'',
    startday: 0
  };

  private currentFullYear=Utils.getTodayFullValue( new Date() );

  get startYears(): string[] | number[] {
    const resultYears = [];
    for (let i: number = 0; i < 5; i++) {
      resultYears.push( this.currentFullYear[0] - i );
    }
    return resultYears;
  }

  get selectDataModel(): Date | string | number | undefined{
    return this.classFormData.startday;
  }

  get isValidation(): boolean{
    return !!this.classFormData.name  &&  !!this.classFormData.startday;
  }

  public created() {
    this.classFormData.startday=this.currentFullYear[0];
    // console.log(this.createdClassInfo.g_name, this.startYears);
  }

  private prevStep(){
    this.$router.push('/make-class/step1');
    this.$emit('updateStep', 1);
  }

  private updateYears( value: string | number ): void{
    this.classFormData.startday=value;
  }


  private privateOptionChange( value: string | boolean, checked: boolean ): void{
    // console.log(value, checked, !!this.classFormData.name && !!this.classFormData.is_private &&  !!this.classFormData.startday );
    this.classFormData.is_private=(value === 'yes');
    // console.log(this.classFormData.is_private);
  }

  private submit(): void{
    const randomNum = Utils.getRandomNum(0, 6);
    this.classFormData.image_url=randomNum+'';

    // console.log(this.classFormData);

    this.MAKE_CLASS( this.classFormData )
      .then( (data: any )=>{
        this.$router.push('/make-class/step3');
        this.$emit('updateStep', 3);
      });

  }


  //만들고 난 후 받는 데이터
/* 전송데이터
{
  "name": "클래스A",
  "g_type": 1,
  "g_name": "파파야 초등학교",
  "is_private": false,
  "startday" : 20191212
}
*/
  /*"classinfo": {
    "contents_updatedAt": "2021-03-24 11:04:29",
    "createdAt": "2021-03-24 11:04:29",
    "updatedAt": "2021-03-24 11:04:29",
    "board_id": 164,
    "is_private": false,
    "endday": "99991231",
    "member_count": 1,
    "question_showYN": true,
    "deletedYN": false,
    "contents_updated_type": 0,
    "id": 740,
    "name": "클래스A",
    "code": "3b7711dzbkmmt08og",
    "owner_id": 45,
    "g_type": 1,
    "g_name": "파파야 초등학교",
    "startday": 20191212,
    "owner_member_id": 821
  }*/
}

