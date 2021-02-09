import {Vue} from 'vue-property-decorator';
import {ValidationProvider, ValidationObserver, extend} from 'vee-validate';
import {required} from 'vee-validate/dist/rules';

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

extend('required', {
  ...required,
  //placeholder 는 object 이며  _field_ , _rule_, _value_ 등을 가지고 있다.
  message: ( fieldName: string, placeholder: Record<string, any>) => {
    return `${fieldName}를 채워 주세요~`;
  }
});
// validate(value, { min, max } 에서 {min,max}는
//<ValidationProvider> 태그에서 속성  rules="minmax:3,8" 의 전달인자인 3,8 부분이다.
//아래 _field_  는 지정된 앨리먼트의 name 값을 의미한다.
extend('minmax', {
  // @ts-ignore
  validate(value: string, {min, max}: Record<number, []>) {
    return value.length >= min && value.length <= max;
  },
  params: ['min', 'max'],
  message: '글자 {_field_}는 최소 {min} 최대 {max}이여야 합니다.',
});

extend('confirmed', {
  //해당 부분은 html 에서 @name 을 의미 / 즉 name=first 이면 @first 를 의미.
  params: ['target'],
  validate( value: string | number, {target}: Record<string | number, any>) {
    return value === target;
  },
  message: '비밀번호가 일치하지 않습니다.',
});

/*
기본 custom
extend('positive', value => {
  if (value >= 0) {
    return true;
  }
  return 'This field must be a positive number';
});


전달인자 무한으로 받기
아래 코드처럼 2번째 매개변수부분에 리턴 arrow 함수로 대입하면된다.
extend('one_of', (value, values) => {
  return values.indexOf(value) !== -1;
});

//html
<ValidationProvider rules="one_of:1,2,3,4,5,6,7,8,9" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
*/
