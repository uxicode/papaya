import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo, ISearchSchool} from '@/views/model/my-class.model';
import {
    resetSearchInput,
    searchKeyEventObservable,
    searchUserKeyValueObservable
} from '@/views/service/search/SearchService';
import MyClassService from '@/api/service/MyClassService';
import Btn from '@/components/button/Btn.vue';
import Modal from '@/components/modal/modal.vue';
import TxtField from '@/components/form/txtField.vue';
import WithRender from './ClassBasicInfo.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components: {
        TxtField,
        Btn,
        Modal
    }
})

export default class ClassBasicInfo extends Vue {
    @MyClass.Getter
    private classID!: number;

    private classInfo: IClassInfo[] = [];

    private openPopupStatus: boolean = false;
    private searchSchoolValue: string = '';
    private classNameValue: string = '';
    private isLoading: boolean= false;
    private isManualClick: boolean=false;
    private manualInputField: string = '';
    private searchResultItems: ISearchSchool[]=[];
    private isPrivate: boolean = false;

    get searchResultValue(): string{
        return this.searchSchoolValue;
    }

    get searchResults(): ISearchSchool[] {
        return this.searchResultItems;
    }

    get info(): any {
        return this.classInfo;
    }

    get isOpenPopup(): boolean{
        return this.openPopupStatus;
    }

    get manualChk(): boolean{
        return this.isManualClick;
    }

    get loadingModel() {
        return this.isLoading;
    }

    public created() {
        this.getClassInfo();
    }

    public getSchoolNameInput( selector: string ): HTMLInputElement{
        return document.getElementById( selector ) as HTMLInputElement;
    }

    /**
     * 현재 클래스의 정보 가져온다.
     * @private
     */
    private getClassInfo(): void {
        MyClassService.getClassInfoById(this.classID)
          .then((data) => {
              this.classInfo = data.classinfo;
              this.classNameValue = data.classinfo.name;
              this.isPrivate = data.classinfo.is_private;
              console.log(this.classInfo);
          });
    }

    private search( value: string=''){
        this.searchSchoolValue=( value!=='' )? value : '';
        this.searchResultItems=[];

        //$nextTick - 해당하는 엘리먼트가 화면에 렌더링이 되고 난 후
        this.$nextTick( ()=>{

            const searchSchool = document.querySelector('#searchSchool') as HTMLInputElement;
            // console.log(searchSchool);
            searchSchool.focus();

            // console.log( searchSchool.value )

            if (searchSchool.value !== '') {
                this.checkLoading();
                // const valueToSearch$=fromEvent(searchSchool, 'input');
                MyClassService.getSearchSchool(this.searchSchoolValue)
                  .then((data: any) => {
                      this.checkLoading();
                      this.searchResultItems = data.results.map((item: any) => item);
                  });
            }
            //키가 눌렸을 때 체크 Observable
            // targetInputSelector: string
            const keyup$ = searchKeyEventObservable('#searchSchool');

            //사용자가 입력한 값 처리 Observable
            //obv$: Observable<any>, loadChk: ()=>void, promiseFunc: Promise<any>, isLoading: boolean
            const userInter$ = searchUserKeyValueObservable(keyup$, this.checkLoading, { fn: MyClassService.getSearchSchool, args: null }, this.isLoading );
            userInter$.subscribe({
                next:( searchData: any ) =>{
                    console.log(searchData);
                    /*
                      message: "리스트 ....."
                      result_count: 2
                      results: (2) [{…}, {…}]
                      total: 2
                    */
                    this.searchResultItems=searchData.results.map( ( item: any )=> item );
                },
            });

            //검색어 없을 시 리셋 Observable
            //obv$: Observable<any>, reset: ()=>void
            const reset$ = resetSearchInput(keyup$, ()=>{
                this.isLoading=false;
                this.searchResultItems = [];
            });
            reset$.subscribe();
        });
    }

    /**
     * 검색어와 매칭되는 키워드만 볼드 처리
     * @param word
     * @private
     */
    private boldSearchResult( word: string): string{
        const startIndex=word.indexOf(this.searchResultValue);
        const endIndex=startIndex+this.searchResultValue.length;
        const searchResultWord=word.substr(startIndex, this.searchResultValue.length);
        return [word.slice(0, startIndex), `<strong>${searchResultWord}</strong>`, word.slice(endIndex, word.length)].join('');
    }

    /**
     * 로딩바 체크 toggle
     * @private
     */
    private checkLoading(): void{
        this.isLoading=!this.isLoading;
    }

    private watchBySearchSchoolModel(val: string) {
        this.searchSchoolValue=val;
    }

    private schoolNameSearchKeyEnter() {
        // console.log(this.searchSchoolValue);
        this.openPopupStatus=true;

        this.search( this.searchSchoolValue );

    }

    /**
     * 팝업 열기
     * @param status
     * @private
     */
    private openSchoolSearchPopup(): void{
        this.openPopupStatus=true;
        this.search();
        // this.currentStatus = status;
    }

    /**
     * 팝업 닫기
     * @private
     */
    private closeSchoolSearchPopup(): void{
        this.openPopupStatus=false;
        this.isManualClick=false;
    }

    private manualInputClickHandler(): void{
        this.isManualClick=true;
    }

    /**
     * 직접입력 -> 확인 버튼 클릭시
     * @private
     */
    private applyManualValClickHandler(): void{
        this.changeSchoolNameValue(this.manualInputField);
        this.closeSchoolSearchPopup();
    }

    /**
     * autocomplete 로 검색된 리스트 중 하나를 클릭했을때 실행 -> 해당 클릭한 키워드값으로
     * @param name
     * @private
     */
    private applySearchResult( name: string): void {
        this.closeSchoolSearchPopup();
        this.searchSchoolValue=name;
        this.changeSchoolNameValue(this.searchSchoolValue);
        this.getSchoolNameInput('#searchSchool');
    }

    private onSchSchoolValChangeHandler(val: string) {
        this.searchSchoolValue=val;
        console.log(val);
    }

    /**
     * 학교 이름 input value 변경
     * @param val
     * @private
     */
    private changeSchoolNameValue(val: string) {
        //const schoolNameField=this.getSchoolNameInput('#schoolName');
        this.searchSchoolValue = val;
    }

    /**
     * 변경 내용 저장
     * @private
     */
    private changeInfoSave(): void {
        // 학교 이름을 검색결과 중에서 선택하거나 직접입력으로 입력하지 않았을때는 수정되지 않도록 한다.
        if (this.searchResultValue === '') {
            MyClassService.setClassInfoById(this.classID, {
                name: this.classNameValue,
                is_private: this.isPrivate
            }).then((data) => {
                console.log(`클래스 이름 : ${data.name} / 공개 여부 : ${data.is_private} 로 수정완료`);
                this.goBack();
            });
        } else {
            MyClassService.setClassInfoById(this.classID, {
                g_name: this.searchResultValue,
                name: this.classNameValue,
                is_private: this.isPrivate
            }).then((data) => {
                console.log(`학교 이름 : ${data.g_name} / 클래스 이름 : ${data.name} / 공개 여부 : ${data.is_private} 로 수정완료`);
                this.goBack();
            });
        }
    }

    private goBack(): void {
        this.$router.push('./')
          .then();
    }
}