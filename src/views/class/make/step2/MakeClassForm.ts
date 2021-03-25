import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';

import WithRender from './MakeClassForm.html';
import {IMakeClassInfo} from '@/views/model/my-class.model';

const MyClass = namespace('MyClass');

@WithRender
@Component
export default class MakeClassForm extends Vue{
  @MyClass.Getter
  private createdClassInfo!: IMakeClassInfo;

  public created() {
    console.log(this.createdClassInfo.g_name);
  }

  private prevStep(){
    this.$router.push('/make-class/step1');
    this.$emit('updateStep', 1);
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

