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
import {getAllPromise} from '@/types/types';
// import {SEARCH_DATA_SAVED} from '@/store/mutation-search-types';
import {IClassTag} from '@/views/model/my-class.model';
// import {SEARCH_OPTION_CHANGE_ACTION} from '@/store/action-search-types';
import WithRender from './SearchResultPage.html';

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

  @SearchStatus.Mutation
  public SEARCH_DATA_SAVED!: (data: ISearchModel[] | IClassTag[]) => void;

  @SearchStatus.Action
  private SEARCH_RESULT_ACTION!: ( payload: { keyword: string, page_no: number, count: number } )=>Promise<any>;

  @SearchStatus.Action
  private SEARCH_OPTION_CHANGE_ACTION!: ( payload: { option: string, keyword: string})=>void;

  @MyClass.Action
  private MYCLASS_HOME!: (id: string | number) => Promise<any>;

  @Auth.Getter
  private userInfo!: IUserMe;

  @SearchStatus.Getter
  private keyword!: string;

  @SearchStatus.Getter
  private searchTotal!: number;

  @SearchStatus.Getter
  private searchResultData!: ISearchModel[];

  @SearchStatus.Getter
  private searchOptionData!: ISearchModel[];

  private radioValue: string = 'all';
  private currentPageNum: number=1;
  private numOfPage: number=10;
  private pageSize: number=5;
  private searchResults: any[]=[];
  private ownerItems: any[] = [];
  private radioItems: any[] = [
    { idx:0, name:'??????', value:'all'},
    { idx:1, name:'????????????', value:'union'},
    { idx:2, name:'?????????', value:'class'},
    { idx:3, name:'??????', value:'tag'}
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
    return ( this.searchOptionData.length>0 )? this.searchOptionData : this.searchResultData;
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

  /*public changeResultByOption() {
    //SearchApiService.getSearchResult ??? ( ?????????/ ???????????? / ?????? ????????? ?????? ) 3????????? ?????? ?????? ?????? ???????????? ?????? ?????????.
    switch (this.radioValue) {
      case 'union' :
        this.searchResults=[...this.searchResultData.filter( (item: any )=> item.g_name.match( this.keyword )!==null ) ];
        break;
      case 'class' :
        this.searchResults=[...this.searchResultData.filter( (item: any )=> item.name.match( this.keyword )!==null) ];
        break;
      case 'tag':
        this.searchResults=[...this.searchResultData.filter( (item: any )=> {
          return ( item.class_tags!==undefined) && ( item.class_tags.filter((target: any) =>target.keyword.match(this.keyword) !== null) );
        }) ];
        break;
      default:
        this.searchResults = [...this.searchResultData];
        break;
    }
    this.SEARCH_DATA_SAVED(this.searchResults);
  }*/

  public getResultList() {
    // console.log('????????????=', this.searchResultData );
    //?????? ?????? ????????? ????????? ??????.
    if (this.searchResultData.length <= 0) {return;}

    // console.log('????????????=', this.searchResultData );

   // ????????? browser next prev ???????????? ????????? ????????? ?????? ?????? ??????..
    /*this.getClassOwnerName(  this.searchResultData )
      .then( ( data: any )=>{
        console.log('owner ????????? ??????', data );
        /!*this.ownerItems=data.map((item: any) => {

          console.log(item.classinfo.owner);

          return {
            id: item.classinfo.id,
            nickname:item.classinfo.owner.nickname
          };
        });*!/
      });*/
  }

  private async getClassOwnerName(items: any[]) {
    // console.log('search getClassOwnerName=', items);

    //class_id ??? ?????? ??? id ??? ?????? // owner ??? member_id -> owner_member_id / owner_id ??? ?????? ??????????????? ???????????? ?????? index ?????????( user_id ??? ?????? ).
    //owner ????????? null ???????????? ??????.
    const ownerPromiseItems = items.map( (item: any)=>{
      const idx=(item.class_id)? item.class_id : item.id;
      return MyClassService.getClassInfoById( idx );
    });
    // console.log(ownerPromiseItems);
    return await getAllPromise(ownerPromiseItems)
      .then((info: any) => {
        console.log('info=', info);
        return Promise.resolve(info);
      }).catch((error) => {
        return Promise.reject('owner data find fail');
      });
  }

  private getOwnerName(index: number) {
    // console.log('this.searchResultsModel[index]=', this.searchResultsModel[index] );

    // return ( this.ownerItems[index] ) ? this.ownerItems[index].nickname : '';
    return  '';
  }






  private pageChange(num: number): void{
    this.currentPageNum=num;
    //
    // console.log('currentPageNum', this.currentPageNum);
    //, page_no:this.currentPageNum, count:this.numOfPage
    this.SEARCH_RESULT_ACTION({keyword:this.keyword, page_no:this.currentPageNum, count:this.numOfPage})
      .then((data) => {
        //????????? ?????? ?????? ???.
        console.log(this.searchResultsModel);
        }).catch((error)=>{
          console.log(error);
        });
  }

  private prevPage(num: number): void{
    this.pageChange(num);
  }

  private nextPage(num: number): void{
    console.log('num', num);
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


  private gotoLink(item: any): void {
    console.log('item', item, this.userInfo,  item.class_id , item.id );
    const idx=( item.class_id!==null)? item.class_id : item.id;

    if (idx === null) {
      console.log('???????????? ?????? idx', idx);
      return;
    }

    MyClassService.getMyInfoInThisClass(idx)
      .then((data) => {
        console.log(data.result);
        //?????? ????????? ????????????
        this.gotoClassPage({result: data.result, idx: `${idx}`});
      }).catch((error) => {

      console.log('search error', error, idx);

      if (idx) {
        MyClassService.getMyInfoInThisClass(idx)
          .then( (retry)=>{
            console.log(retry.result);
            this.gotoClassPage({result: retry.result, idx: `${idx}`});
        });

      }

      //?????? ????????? ???????????? ????????????.
      // this.$router.push({path: '/'});
    });
  }

  private gotoClassPage( payload: {result: any, idx: string } ) {
    const {result, idx}=payload;

    if (result!== null) {
      //class home data ????????????.
      this.MYCLASS_HOME(idx).then(() => {
        //?????? ????????? ????????? ??????
        this.$router.push({path: `${CLASS_BASE_URL}/${idx}`});
      });
      // console.log('????????? ??????', data.result);
    } else {
      // console.log('????????? ?????? ??????', data.result);
      //?????? ????????? ???????????? ????????? ?????? ???????????? ??????.
      this.$router.push({path: `${CLASS_BASE_URL}/enrollClass`, query: { classIdx: idx}});
    }
  }


  // ??????????????? ????????? ??? ????????? * 100 ms ????????? ???????????? ???????????????.
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

    this.SEARCH_OPTION_CHANGE_ACTION( {option:this.radioValue, keyword: this.keyword});

    // this.getResultList();
  }

  private gotoMakeClassPage() {
    this.$router.push({path: '/make-class/step1'});
  }

}
