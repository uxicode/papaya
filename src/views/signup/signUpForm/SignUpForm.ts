import {Vue, Component, Prop} from 'vue-property-decorator';
import WithRender from './SignUpForm.html';

@WithRender
@Component
export default class SignUpForm extends Vue {
    private hints: object = {
        id:'5자 이상 20자 이하, 특수문자 불가능, 영문, 숫자만 기입 가능',
        pw:'8자 이상 16자 이하, 특수문자 가능, 영문, 숫자 혼합 필수',
    };
    private messages: object = {
        name:'이름을 입력해 주세요.',
        id:'아이디를 입력해 주세요.',
        idMin:'최소 5글자 이상 입력해 주세요.',
        warnId:'20자 이하, 특수문자 불가능, 영문, 숫자만 기입 가능',
        pw:'비밀번호를 입력해 주세요.',
        pwMin:'최소 8글자 이상 입력해 주세요.',
        warnPw:'16자 이하 / 특수문자 가능/ 영문, 숫자 혼합 필수',
        pwRe:'비밀번호를 다시 입력해 주세요.',
        equal:'값이 일치하지 않습니다.',
        mobile:'모바일 번호 "-" 없이 입력해 주세요.',
        mobileReq:'모바일 번호를 입력해 주세요',
        notMobile:'유효하지 않은 번호입니다.',
        warnNum:'인증번호가 일치하지 않습니다.',
        verify:'인증번호를 입력해 주세요.',
        email:'이메일 주소를 입력해 주세요',
        notEmail:'유효하지 않은 이메일입니다.',
        error:'',
    };
    private userIdMin: number = 5;
    private userIdMax: number = 20;
    private userPwMin: number = 8;
    private userPwMax: number = 16;

}
