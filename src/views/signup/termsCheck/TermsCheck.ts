import {Vue, Component, Prop} from 'vue-property-decorator';
import Btn from '@/components/button/Btn.vue';
import CheckButton from '@/components/check/CheckButton.vue';
import WithRender from './TermsCheck.html';
import TermsService from '@/api/service/TermsService';
import {ITermData, ICheckData} from '@/views/model/terms.model';

@WithRender
@Component({
    components:{
        Btn,
        CheckButton
    }
})
export default class TermsCheck extends Vue {
    public allCheckValue: string = 'all';
    private step: number = 1;
    private stepTotal: number = 3;
    private pageTitle: string = '일반 회원가입';
    private allChecked: boolean = true;
    private termsItems: ITermData[]=[];
    private termsCheckData: string[] = [];
    private termsList: ICheckData[] = [
        {
            idx: 1,
            tit: '서비스 이용약관(필수)',
            isActive: false,
            isChecked: true,
            desc: ['test'],
            val:'service',
        },
        {
            idx: 2,
            tit: '개인정보 처리방침(필수)',
            isActive: false,
            isChecked: true,
            desc: ['test'],
            val:'private',
        },
        {
            idx: 3,
            tit: '마케팅 정보 수집 동의(선택)',
            isActive: false,
            isChecked: true,
            desc: ['test'],
            val:'marketing',
        },
    ];

    get isNextStep(): boolean{
        return (this.termsList[0].isChecked && this.termsList[1].isChecked) || this.allChecked;
    }
    get checkData(): string[] {
        return this.termsCheckData;
    }
    public created() {
        this.getTerms();
        this.termsCheckData=this.updateCheckValues();
    }

    /**
     * 화살표 버튼 클릭시 약관 내용 토글
     * @public
     */
    public accordionToggle(item: any): void {
        item.isActive = !item.isActive;
    }

    public updateCheck( value: string | boolean, checked: boolean ): void{
        if( value === this.allCheckValue ){
            this.allCheck(checked);
        }else{
            this.itemCheck( String( value ), checked);
        }
    }

    /**
     * 개별 체크
     * @param value
     * @param checked
     * @private
     */
    private itemCheck(value: string, checked: boolean) {
        // 선택한 checkbox value 값 termsList 에서 index 찾기
        const itemIndex=this.termsList.findIndex( ( item: ICheckData ) =>item.val === value );
        // console.log( itemIndex );
        if (checked) {
            this.termsCheckData.push(value);
            if (itemIndex !== -1) {
                this.termsList[itemIndex].isChecked=true;
            }
            //만약 체크된 개수가 termsList 와 같을 때 모두 체크됨으로 간주 -> 전체동의 체크
            this.allChecked = this.termsCheckData.length === this.termsList.length;
        }else{
            this.termsCheckData.splice(this.termsCheckData.indexOf(value), 1);
            if (itemIndex !== -1) {
                this.termsList[itemIndex].isChecked=false;
            }
            this.allChecked=false;
        }

        // console.log( this.termsCheckData );
    }

    /**
     * 약관 전체 동의/해제
     * @private
     */
    private allCheck( checked: boolean ): void {

        this.allChecked = checked;
        /*for (let idx = 0; idx < chkList.length; idx++) {
            chkList[idx].isChecked = this.allChecked;
            //console.log(chkList[idx].isChecked);
        }*/
        if( this.allChecked ){
            this.termsCheckData=this.updateCheckValues();
            this.termsList.forEach((item: ICheckData) => item.isChecked = true);
        }else{
            this.termsCheckData=[];
            this.termsList.forEach((item: ICheckData) => item.isChecked = false);
        }

        console.log( this.termsCheckData );
    }

    private updateCheckValues(): string[]{
        return this.termsList.map( (item: ICheckData) => item.val );
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
     * 약관 내용 API 수신
     * @private
     */
    private getTerms(): any {
        const serviceTerms = TermsService.getServiceTerms();
        const privateTerms = TermsService.getPrivateTerms();
        const marketTerms = TermsService.getMarketTerms();

        // axios.all 로 처리해도 됨.
        Promise.all( [serviceTerms, privateTerms, marketTerms] )
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

    private gotoVerify(): void {
        /*const chk1 = this.termsList[0].isChecked;
        const chk2 = this.termsList[1].isChecked;

        console.log( chk1, chk2 )
        if (chk1 && chk2) {
            this.$router.push('verify');
        }*/
        //get isNextStep() ---> 필수 요소 선택 및 전부 체크시 true 반환
        if( this.isNextStep ){
            this.$router.push('/signForm/verify');
            this.$emit('updateStep', 2);
        }
    }
}
