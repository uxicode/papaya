import {IUserMe} from '@/api/model/user.model';
import UserService from '@/api/service/UserService';
import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Btn from '@/components/button/Btn.vue';
import TxtField from '@/components/form/txtField.vue';
import WithRender from './ModifyMobile.html';

const Auth = namespace('Auth');

@WithRender
@Component({
    components:{
        Btn,
        TxtField,
    },
})

export default class ModifyMobile extends Vue {
    @Auth.Getter
    public readonly userInfo!: IUserMe;

    @Auth.Action
    public USER_ME_ACTION!: () => Promise<IUserMe>;

    private mobileNo: string = '';

    /**
     * 번호 수정
     * @param newMobile
     * @private
     */
    private modifyMobileNo(): void {
        UserService.setUserInfo(this.userInfo.user_id, {mobile_no: this.mobileNo})
          .then(() => {
              this.USER_ME_ACTION().then( ( me: IUserMe)=>{
                  console.log(me.mobile_no);
              });
          });
        this.gotoMyProfile();
    }

    private gotoMyProfile(): void {
        this.$router.push('/myProfile')
            .then(() => {
                this.$emit('updatePage', '');
            });
    }
}