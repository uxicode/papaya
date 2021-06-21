import {Vue, Component, Watch} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {CLASS_BASE_URL} from '@/api/base';
import {ISearchModel} from '@/views/model/search.model';
import {IUserMe} from '@/api/model/user.model';
import MyClassService from '@/api/service/MyClassService';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import RadioButton from '@/components/radio/RadioButton.vue';
import Pagination from '@/components/pagination/pagination.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './SearchResultPage.html';
import {getAllPromise} from '@/views/model/types';

const Auth = namespace('Auth');
const MyClass = namespace('MyClass');
const SearchStatus = namespace('SearchStatus');


@WithRender
@Component({
  components:{
    RadioButton,
    Pagination,
    Btn
  }
})
export default class SearchResultPage extends Vue {

  @Auth.Getter
  private userInfo!: IUserMe;

  @SearchStatus.Getter
  private keyword!: string;

  @SearchStatus.Getter
  private searchTotal!: number;

  @SearchStatus.Getter
  private searchResultData!: ISearchModel[];

  @MyClass.Action
  private MYCLASS_HOME!: (id: string | number) => Promise<any>;

  @SearchStatus.Action
  private SEARCH_RESULT_ACTION!: ( payload: { keyword: string, page_no: number, count: number} )=>Promise<any>;

  private radioValue: string = 'all';
  private currentPageNum: number=1;
  private numOfPage: number=10;
  private pageSize: number=5;
  private searchResults: any[]=[];
  private ownerItems: any[] = [];
  private radioItems: any[] = [
    { idx:0, name:'전체', value:'all'},
    { idx:1, name:'소속기관', value:'union'},
    { idx:2, name:'클래스', value:'class'},
    { idx:3, name:'태그', value:'tag'}
  ];


  get searchTotalModel(): number{
    return this.searchTotal;
  }

  get isResultNone(): boolean{
    return this.searchTotal>0;
  }

  get currentTotal(): number{
    return ( this.radioValue ==='all')? this.searchTotal : this.searchResults.length;
  }

  get searchResultsModel(): any[]{
    return this.searchResults;
  }

  public created() {
    this.getResultList();
  }

  @Watch('searchResultData')
  public changeData(value: any[], old: any[]) {
    if (value !== old) {
      // console.log('watch =' , value );
      this.getResultList();
    }
  }

  public getResultList() {
    if( this.radioValue ==='union'){
      this.searchResults=[...this.searchResultData.filter( (item: any )=> item.g_name.match( this.keyword )!==null ) ];
    }else if( this.radioValue ==='class'){
      this.searchResults=[...this.searchResultData.filter( (item: any )=> item.name.match( this.keyword )!==null) ];
    }else if( this.radioValue==='tag'){
      this.searchResults=[...this.searchResultData.filter( (item: any )=> {
        return ( item.class_tags!==undefined) && ( item.class_tags.filter((target: any) =>target.keyword.match(this.keyword) !== null) );
      }) ];
    }else{
      this.searchResults = [...this.searchResultData];
    }
    this.getClassOwnerName(  this.searchResults )
      .then( ( data: any )=>{
        // console.log('owner 데이터 완료', data );
        this.ownerItems=data.map((item: any) => {
          return {
            id: item.classinfo.id,
            nickname:item.classinfo.owner.nickname
          };
        });
      });
  }



  private getOwnerName(index: number) {
    return (this.ownerItems[index] !== undefined) ? this.ownerItems[index].nickname : '';
  }


  private async getClassOwnerName(items: any[]) {
    const ownerPromiseItems = await this.getClassInfoBySearchResultClassId(items);
    return await getAllPromise( ownerPromiseItems ).then(( info: any )=>{
      // console.log('info=', info);
      return Promise.resolve(info);
    }).catch((error)=>{
      console.log(error);
      return Promise.reject('owner data find fail');
    });
  }


  //class/:classId 조회가 안되는 --> 67, 70, 597, 598, 599, 600
  private getClassInfoBySearchResultClassId( items: any[] ): any[] {
    const promiseItems: any[] = [];
    items.forEach( ( item: any ) => {
      promiseItems.push( MyClassService.getClassInfoById( 724 ) );
    });
    return promiseItems;
  }


  private pageChange(num: number): void{
    this.currentPageNum=num;
    this.SEARCH_RESULT_ACTION({keyword:this.keyword, page_no:this.currentPageNum, count:this.numOfPage})
      .then((data) => {
        //로딩바 설정 해야 함.
        console.log(this.searchResultsModel);
        }).catch((error)=>{
          console.log(error);
        });
  }

  private prevPage(num: number): void{
    this.pageChange(num);
  }

  private nextPage(num: number): void{
    this.pageChange(num);
  }

  private getProfileImg(imgUrl: string | null | undefined ): string{
    return ImageSettingService.getProfileImg( imgUrl );
  }

  private getHashTag( items: string[] ): string | undefined {
    if( !items ){ return; }
    // console.log(' items=',  items)
    // if( items.length === 0 ){ return; }
    const keywords= items.map( ( prop: any ) => '#' + prop.keyword) ;
    return keywords.join(' ');
  }

  private async myClassCheck( id: number ){
    return await MyClassService.getMyInfoInThisClass( id );
  }

  private gotoLink(item: any): void {
    // console.log('item', item, this.userInfo,  item.class_id , item.id );
    const idx=( item.class_id!==null)? item.class_id : item.id;


    this.myClassCheck(idx)
      .then(( data )=>{
        console.log(data.result);
        //이미 가입된 멤버일때
        if( data.result!==null ){
          //class home data 갱신시킴.
         this.MYCLASS_HOME(idx).then(()=>{
           //해당 클래스 홈으로 이동
           this.$router.push({path: `${CLASS_BASE_URL}/${idx}`});
         });
         console.log('가입된 멤버', data.result);
        }else{
          console.log('가입된 멤버 아님', data.result);
          //가입 멤버가 아니기에 클래스 가입 페이지로 이동.
          this.$router.push({path: `${CLASS_BASE_URL}/enrollClass`, query:{ classIdx:idx }});
        }
      }).catch((error)=>{
        //오류 발생시 메인으로 이동시킴.
         this.$router.push({path: '/'});
    });
  }


  // 트랜지션을 시작할 때 인덱스 * 100 ms 만큼의 딜레이를 적용합니다.
  private beforeEnter(el: HTMLElement): void {
    if(el.dataset.index !=='0'){
      // el.classList.add('skeleton-inner');
      // console.log(this.startNum, this.endNum);
      // this.isLoading=true;
      el.style.transitionDelay = this.delayTime(120, String( el.dataset.index ), this.searchResults.length);
    }
  }

  private afterEnter(el: HTMLElement): void {

    // this.isLoading=false;
    el.style.transitionDelay = '';
  }

  private delayTime(speed: number, idx: string | number, len: number): string {
    const delay = (typeof idx === 'string') ? parseInt(idx as string, 10) : idx;
    return speed * (delay % len) + 'ms';
  }

  private optionChange( value: string, checked: boolean ): void{
    // console.log(value, checked);
    this.radioValue=value;

    this.pageChange(1);
    this.getResultList();
  }

  private gotoMakeClassPage() {
    this.$router.push({path: '/make-class/step1'});
  }

}
