import {Vue, Component} from 'vue-property-decorator';
import Btn from '@/components/button/Btn.vue';
import TermsService from '@/api/service/TermsService';
import WithRender from './TermsCheck.html';

interface ITermsData {
    name: string;
    type: string;
    bodytext: string;
}

interface ITermsList {
    idx: number;
    tit: string;
    isActive: boolean;
    isChecked: boolean;
    desc: string[];
}

@WithRender
@Component({
  components: {
      Btn,
  }
})
export default class TermsCheck extends Vue {
    private step: number = 1;
    private stepTotal: number = 3;
    private pageTitle: string = '일반 회원가입';
    private allChecked: boolean = false;
    private termsItems: ITermsData[] = [];
    private termsList: ITermsList[] = [
        {
            idx: 1,
            tit: '서비스 이용약관(필수)',
            isActive: false,
            isChecked: false,
            desc: ['test'],
        },
        {
            idx: 2,
            tit: '개인정보 처리방침(필수)',
            isActive: false,
            isChecked: false,
            desc: ['test'],
        },
        {
            idx: 3,
            tit: '마케팅 정보 수집 동의(선택)',
            isActive: false,
            isChecked: false,
            desc: ['test'],
        },
    ];
    public created() {
        this.getTerms();
    }

    /**
     * 화살표 버튼 클릭시 약관 내용 토글
     * @public
     */
    public accordionToggle(item: any): void {
        item.isActive = !item.isActive;
    }

    /**
     * 회원가입 단계별 타이틀
     * @private
     */
    private currentTitle(): string {
        let result;
        switch (this.step) {
            case 1:
                result = '약관 동의';
                break;
            case 2:
                result = '본인 인증';
                break;
            default:
                result = '개인 정보 입력';
                break;
        }
        return result;
    }

    /**
     * 약관 전체 동의/해제
     * @private
     */
    private allCheck(checked: boolean): void {
        this.allChecked = checked;
        const chkList = this.termsList;
        // tslint:disable-next-line:prefer-for-of
        for (let idx = 0; idx < chkList.length; idx++) {
            chkList[idx].isChecked = this.allChecked;
            //console.log(chkList[idx].isChecked);
        }
    }

    /**
     * 약관 내용 API 수신
     * @private
     */
    private getTerms(): any {
        const serviceTerms = TermsService.getServiceTerms();
        const privateTerms = TermsService.getPrivateTerms();
        const marketTerms = TermsService.getMarketTerms();

        // axios.all 로 처리해도 됨.
        Promise.all( [serviceTerms, privateTerms, marketTerms] )
            .then( (data) => {
                this.termsItems=data;
            })
            .then(() => {
                //Promise.all 로 처리하면 리턴값이 배열. 즉 별도 매칭이 필요.
                this.termsItems.map( ( item: any, idx: number ) => {
                    this.termsList[idx++].desc=item.terms_info.bodytext;
                    //console.log( item.terms_info.bodytext )
                });
            });
    }

    private gotoVerify(): void {
        const chk1 = this.termsList[0].isChecked;
        const chk2 = this.termsList[1].isChecked;
        if (chk1 && chk2) {
            this.$router.push('verify');
        }
    }
}
