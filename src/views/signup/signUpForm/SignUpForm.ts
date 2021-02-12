import {required} from 'vee-validate/dist/rules';
import {Vue, Component} from 'vue-property-decorator';
import {extend} from 'vee-validate';
import WithRender from './SignUpForm.html';

interface IFormData {
    name: string;
    id: string;
    pwd: string;
    rePwd: string;
}

interface IHints {
    id: string;
    pw: string;
}

interface IMessages {
    name: string;
    id: string;
    idMin: string;
    warnId: string;
    pw: string;
    pwMin: string;
    warnPw: string;
    pwRe: string;
    equal: string;
    mobile: string;
    mobileReq: string;
    notMobile: string;
    warnNum: string;
    verify: string;
    email: string;
    notEmail: string;
    error: string;
}

@WithRender
@Component
export default class SignUpForm extends Vue {
    public messages: IMessages = {
        name: '이름을 입력해 주세요.',
        id: '아이디를 입력해 주세요.',
        idMin: '최소 5글자 이상 입력해 주세요.',
        warnId: '20자 이하, 특수문자 불가능, 영문, 숫자만 기입 가능',
        pw: '비밀번호를 입력해 주세요.',
        pwMin: '최소 8글자 이상 입력해 주세요.',
        warnPw: '16자 이하 / 특수문자 가능/ 영문, 숫자 혼합 필수',
        pwRe: '비밀번호를 다시 입력해 주세요.',
        equal: '값이 일치하지 않습니다.',
        mobile: '모바일 번호 "-" 없이 입력해 주세요.',
        mobileReq: '모바일 번호를 입력해 주세요',
        notMobile: '유효하지 않은 번호입니다.',
        warnNum: '인증번호가 일치하지 않습니다.',
        verify: '인증번호를 입력해 주세요.',
        email: '이메일 주소를 입력해 주세요',
        notEmail: '유효하지 않은 이메일입니다.',
        error: '',
    };

    public hints: IHints = {
        id: '5자 이상 20자 이하, 특수문자 불가능, 영문, 숫자만 기입 가능',
        pw: '8자 이상 16자 이하, 특수문자 가능, 영문, 숫자 혼합 필수',
    };

    public userIdMin: number = 5;
    public userIdMax: number = 20;
    public userPwMin: number = 8;
    public userPwMax: number = 16;

    private formData: IFormData = {
        name: '',
        id: '',
        pwd: '',
        rePwd: '',
    };
}

const signUpForm = new SignUpForm();

extend('requiredName', {
    ...required,
    message: signUpForm.messages.name,
});

extend('requiredId', {
    ...required,
    message: signUpForm.messages.id,
});

extend('warnId', {
    params: ['target'],
    validate() {
        const userIDRegx = new RegExp( `^(?=.*[a-zA-Z])(?!.*[^a-zA-Z0-9_])+[a-zA-Z0-9]{${signUpForm.userIdMin},${signUpForm.userIdMax}}$`);
        return userIDRegx.test(signUpForm.messages.id);
    },
    message: signUpForm.messages.warnId,
});

extend('requiredPw', {
    ...required,
    message: signUpForm.messages.pw,
});

extend('confirmedPw', {
    params: ['target'],
    validate(value: string | number, {target}: Record<string | number, any>) {
        return value === target;
    },
    message: signUpForm.messages.equal,
});