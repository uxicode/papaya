import {Vue, Component, Prop} from 'vue-property-decorator';
import WithRender from './TermsCheck.html';
import TermsService from '@/api/service/TermsService';
import any = jasmine.any;
import It = jest.It;

interface ITermsData {
    name: string;
    type: string;
    bodytext: string;
}

@WithRender
@Component
export default class TermsCheck extends Vue {
    private step: number = 1;
    private stepTotal: number = 3;
    private pageTitle: string = '일반 회원가입';
    private termsItems: ITermsData[] = [];
    private termsList: any = [
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
    private accordionToggle(item: any): void {
        item.isActive = !item.isActive;
    }
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
                    this.termsList[idx].desc=item.terms_info.bodytext;
                    //console.log( item.terms_info.bodytext )
                });
            });
    }
}
