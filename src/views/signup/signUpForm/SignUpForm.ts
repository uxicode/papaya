import {Vue, Component, Watch} from 'vue-property-decorator';
import {ISignUpForm} from '@/views/model/member-form.model';
import TxtField from '@/components/form/txtField.vue';
import Btn from '@/components/button/Btn.vue';
import UserService from '@/api/service/UserService';
import WithRender from './SignUpForm.html';
import {Utils} from '@/utils/utils';

@WithRender
@Component({
    components: {
        TxtField,
        Btn,
    },
})
export default class SignUpForm extends Vue {

     private userIdMin: number=5;
     private userIdMax: number=20;
     private isDuplicateId: boolean = false;

    private formData: ISignUpForm ={
        user_id: '',
        user_password: '',
        fullname: '',
        mobile_no: '',
        email: '',
        agree_marketing:false,
        agree_email: false
    };

    get userIDState() {
        //정규표현식을 아래와 같이 변수를 연동하는 등의 동적 표현시엔 RegExp 생성자를 사용한다.
        const userIDRegx =Utils.getUserIdRegx(this.userIdMin, this.userIdMax);
        return userIDRegx.test(this.formData.user_id);
    }
    private idCheck(): void{
        // this.isIdChk=true; //클릭했는지 체크.
        if( !this.userIDState ){ return; }
        UserService.getIDCheck(this.formData.user_id)
          .then( (data) => {
              console.log( data );
              this.isDuplicateId=true;
              // this.formData.user_id=data.user_id;
          })
          .catch( (error) => {
              if( error.data.error_code === 40401 ){
                  this.isDuplicateId=false;
              }
          });
    }

    /**
     * 아이디 텍스트 필드 체크 - 중복확인 후 텍스트를 다시 제거시 이전 상태로 돌린다.
     * @param value
     * @param oldValue
     * @private
     */
    @Watch('formData.user_id')
    private onChangeIdCheck(value: string, oldValue: string) {
        if( this.isDuplicateId ){
            if( value !== oldValue ){
                this.isDuplicateId=false;
            }
        }
    }

    private gotoPrevPage(): void{
        this.$router.push('/signForm/verify');
        this.$emit('updateStep', 2);
    }

}
