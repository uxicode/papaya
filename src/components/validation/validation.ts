import {Vue} from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend} from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

extend('required', {
  ...required,
  message: '빈칸을 채워주세요.',
});

//아래 _field_  는 지정된 앨리먼트의 name 값을 의미한다.
extend('minmax', {
  // @ts-ignore
  validate(value:string, { min, max }:Record<number, []>) {
    return value.length >= min && value.length <= max;
  },
  params: [ 'min', 'max'],
  message:'글자 {_field_}는 최소 {min} 최대 {max}이여야 합니다.',
});


extend('confirmed', {
  params: ['target'],
  validate( value, { target }:Record<string | number, any>) {
    return value === target;
  },
  message: '비밀번호가 일치하지 않습니다.',
});
