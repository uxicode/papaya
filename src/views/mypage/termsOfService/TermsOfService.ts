import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IUserMe} from '@/api/model/user.model';
import {ICheckData, ITermData} from '@/views/model/terms.model';
import TermsService from '@/api/service/TermsService';
import Btn from '@/components/button/Btn.vue';
import WithRender from './TermsOfService.html';

const Auth = namespace('Auth');

@WithRender
@Component({
    components:{
        Btn
    },
})

export default class TermsOfService extends Vue {
    @Auth.Getter
    private userInfo!: IUserMe;

    private isUser: boolean = false;

    private termsItems: ITermData[]=[];
    private termsList: Array<Omit<ICheckData, 'idx'|'isChecked'>> = [
        {
            tit: '개인 정보 처리 방침',
            isActive: false,
            desc: ['test'],
            val:'private',
        },
        {
            tit: '마케팅 정보 수신 동의',
            isActive: false,
            desc: ['test'],
            val:'marketing',
        },
    ];

    get myInfo() {
        return this.userInfo;
    }

    public created() {
        this.checkUser();
        this.getTerms();
    }

    /**
     * 약관 내용 API 수신
     * @private
     */
    private getTerms(): any {
        const privateTerms = TermsService.getPrivateTerms();
        const marketTerms = TermsService.getMarketTerms();

        // axios.all 로 처리해도 됨.
        Promise.all( [privateTerms, marketTerms] )
          .then( (data: ITermData[] ) => {
              this.termsItems = data;
          })
          .then(() => {
              //Promise.all 로 처리하면 리턴값이 배열. 즉 별도 매칭이 필요.
              this.termsItems.map( ( item: any, idx: number ) => {
                  this.termsList[idx++].desc=item.terms_info.bodytext;
                  //console.log( item.terms_info.bodytext )
              });
          });
    }

    /**
     * 약관 내용 토글
     * @param idx
     * @private
     */
    private accordionToggle(idx: number): void {
        const btn = document.querySelectorAll('.bt-cnt');
        btn[idx].classList.toggle('collapsed');
        const accordion = document.querySelectorAll('.collapse');
        accordion[idx].classList.toggle('show');
    }

    /**
     * 로그인한 회원인지 아닌지 체크
     * @private
     */
    private checkUser(): void {
        this.isUser = !!(this.myInfo);
    }

}
