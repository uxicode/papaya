import {IUserMe} from '@/api/model/user.model';
import UserService from '@/api/service/UserService';
import {namespace} from 'vuex-class';
import {Vue, Component, Prop} from 'vue-property-decorator';
import Btn from '@/components/button/Btn.vue';
import TxtField from '@/components/form/txtField.vue';
import Modal from '@/components/modal/modal.vue';
import WithRender from './MyProfileMain.html';

const Auth = namespace('Auth');

@WithRender
@Component({
    components:{
        Btn,
        Modal,
        TxtField,
    },
})

export default class MyProfileMain extends Vue {
    @Auth.Getter
    public readonly userInfo!: IUserMe;

    @Auth.Action
    public USER_ME_ACTION!: () => Promise<IUserMe>;

    get myInfo(): object {
        // console.log( 'this.userInfo=', this.userInfo );
        return this.userInfo;
    }

    /* 팝업 및 페이지 변경 상태 값 */
    private isModifyNameModal: boolean = false;
    private isModifyGender: boolean = false;
    private isModifyEmailModal: boolean = false;

    private tempData: any = '';

    /**
     * 정보변경 modal 혹은 dropdown 열기
     * @param key
     * @private
     */
    public openModify(key: string): void {
        switch(key) {
            case 'name':
                this.isModifyNameModal = !this.isModifyNameModal;
                break;
            case 'gender':
                this.isModifyGender = !this.isModifyGender;
                break;
            case 'email':
                this.isModifyEmailModal = !this.isModifyEmailModal;
                break;
        }
    }

    /**
     * 페이지 이동
     * @param pageKey
     * @private
     */
    public gotoLink(pageKey: string): void {
        this.$router.push(`myProfile/${pageKey}`)
          .then(() => {
              console.log(`${pageKey}로 이동`);
              this.$emit('updatePage', pageKey); // pageKey 값을 이용하여 상단 타이틀을 갱신
          });
    }

    /**
     * 변경할 정보를 임시로 담을 함수
     * @param event
     * @private
     */
    private valueChange(event: any): void {
        this.tempData = event.target.value;
    }

    /**
     * 이름 수정
     * @param newName
     * @private
     */
    private modifyName(newName: string): void {
        UserService.setUserInfo(this.userInfo.user_id, {fullname: this.tempData})
            .then(() => {
                this.USER_ME_ACTION().then( ( me: IUserMe)=>{
                    console.log(me.fullname);
                });
            });
        this.isModifyNameModal = !this.isModifyNameModal;
    }

    /**
     * 성별 변경
     * @param event
     * @param newGender
     * @private
     */
    private modifyGender( event: Event, newGender: number ): void {
        // console.log('target=', event.target+':::'+event.target.value);
        UserService.setUserInfo(this.userInfo.user_id, {gender: newGender})
            .then(()=>{
                // console.log(data);
                this.USER_ME_ACTION().then( ( me: IUserMe)=>{
                    console.log(me.gender);
                });
            });
        this.isModifyGender = !this.isModifyGender;
    }

    /**
     * 이메일 주소 변경
     * @param newEmail
     * @private
     */
    private modifyEmail(newEmail: string): void {
        UserService.setUserInfo(this.userInfo.user_id, {email: newEmail})
            .then(() => {
                this.USER_ME_ACTION().then( ( me: IUserMe)=>{
                    console.log(me.email);
                });
            });
        this.isModifyEmailModal = !this.isModifyEmailModal;
    }
}

