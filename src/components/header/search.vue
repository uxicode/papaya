<template>
  <div class="search-page" style="">
    <div class="search-top">
      <div class="search-inner">
        <div class="search-bar clearfix">
          <div class="tb-style full">
            <div class="tb-cell" style="width:80%;">
              <!--                          <input type="text" class="form-search" placeholder="검색어를 입력해 주세요." v-model="searchValue" @input="watchBySearchModel( $event.target.value )">-->
              <txt-field id="searchInput"
                         placeholder="검색어를 입력해 주세요."
                         add-class="form-search no-border"
                         v-model="searchValue"
                         @input="watchBySearchModel"
                         :key-enter="moveToSearchResult"></txt-field>
            </div>
            <div class="tb-cell rt"><button type="button" class="btn primary red" @click.prevent.stop="moveToSearchResult( searchValue )">검색</button></div>
          </div>
        </div>
      </div>

      <!-- autocomplete 부분 -->
      <div class="search-word" v-if="isSearch">
        <div class="search-inner">
          <ul class="search-word-list">
            <li v-for="(item, index) in searchItems" :key="`searchItems-${index}`">
              <a href="" class="result-link" @click.prevent.stop="moveToSearchResult( item.name )">
                <div class="tb-cell result-tit" v-html="boldSearchResult( item.name )"></div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>


    <!-- start: 검색 랜딩  -->
    <div class="search-cnt" v-if="isLandingPage">
      <div class="recommend">
        <p class="recommend-tit">#추천 키워드</p>
        <div class="keyword">
          <div class="search-inner">
            <transition-group class="keyword-list clearfix" tag="ul" name="slideY" @before-enter="beforeEnterKeywords" @after-enter="afterEnter">
              <li v-for="(recommandItem, index) in recommandItems" :key="`hashtag-${index}`" :data-index="index">
                <a href="">{{ recommandItem.keyword }}</a></li>
            </transition-group>
            <!--<ul class="keyword-list clearfix">
                <li v-for="recommandItem in recommandItems"><a href="">{{ recommandItem.keyword }}</a></li>
                &lt;!&ndash;<li><a href="">온라인스터디</a></li>
                <li><a href="">중국어조기교육</a></li>
                <li><a href="">코딩교육</a></li>
                <li><a href="">영어학원</a></li>
                <li><a href="">파파야</a></li>&ndash;&gt;
            </ul>-->
          </div>
        </div>
      </div>

      <div class="search-classes">
        <div class="search-inner">
          <div class="tb-cnt">
            <table class="tb tb-search">
              <colgroup>
                <col style="width:380px">
                <col style="width:180px">
                <col style="width:470px">
              </colgroup>
              <thead>
              <tr>
                <th><strong>TOP 5 인기 클래스</strong></th>
                <th>운영자</th>
                <th>태그</th>
              </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>

      <div class="search-classes bg-white">
        <div class="search-inner">
          <div class="tb-cnt">
            <table class="tb tb-search">
              <colgroup>
                <col style="width:380px">
                <col style="width:180px">
                <col style="width:470px">
              </colgroup>
              <transition-group tag="tbody" name="slideY" @before-enter="beforeEnterBestItem" @after-enter="afterEnter">
                <tr v-for="( bestItem, index ) in bestItems" :key="`cell-${index}`" :data-index="index">
                  <td>
                    <a href="#" @click.prevent.stop="gotoLink( bestItem )">
                      <div class="tb-style">
                        <div class="tb-cell wd-30">{{ bestItem.rank }}</div>
                        <div class="tb-cell">
                          <img :src="getProfileImg(  bestItem.class.image_url )" alt="" style="width:32px; height:32px;border-radius:50%;">
                        </div>
                        <div class="tb-cell pdl-10">
                          <span class="group-tit">{{ bestItem.class.g_name }}</span>
                          <p class="class-tit">{{ bestItem.class.name }}</p>
                        </div>
                      </div>
                    </a>
                  </td>
                  <td>
                    <p class="class-admin">{{ bestItem.class.owner.nickname }}</p>
                  </td>
                  <td>
                    <div class="class-tag">
                      <a href="#" @click.prevent.stop="gotoLink( bestItem )">
                        <p>{{ getHashTag(bestItem.class.class_tags) }}</p>
                        <span class="search-more"><img :src="require('@/assets/images/arrow-right.svg')" alt=""></span>
                      </a>
                    </div>
                  </td>
                </tr>
              </transition-group>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- end: 검색 랜딩  -->

  </div>
</template>

<script lang="ts">

import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import TxtField from '@/components/form/txtField.vue';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import {
  resetSearchInput,
  searchKeyEventObservable,
  searchUserKeyValueObservable
} from '@/views/service/search/SearchService';
import {Log} from '@/decorators';
import {CLASS_BASE_URL} from '@/api/base';
import {SearchApiService} from '@/api/service/SearchApiService';
import {Utils} from '@/utils/utils';
import {MYCLASS_HOME} from '@/store/action-class-types';


const MyClass = namespace('MyClass');
const SearchStatus = namespace('SearchStatus');

const SEARCH_TYPE={
  HOME:'home',
  INPUT:'input',
  RESULT:'result'
};

@Component({
  components:{
    TxtField
  }
})
export default class Search extends Vue {

  public isLoading: boolean= false;
  private recommandItems: any[] = [];
  private bestItems: any[] = [];
  private searchValue: string = '';
  private searchItems: any[]=[];
  private searchType: string = 'home';

  @MyClass.Action
  private MYCLASS_HOME!: (id: string | number) => Promise<any>;


  @SearchStatus.Mutation
  private SEARCHING!: ( chk: boolean )=>void;

  @SearchStatus.Action
  private SEARCH_RESULT_ACTION!: ( payload: { keyword: string, page_no: number, count: number} )=>Promise<any>;

  get bestItemsModel() {
    return this.bestItems;
  }

  get isLandingPage() {
    return this.searchType === SEARCH_TYPE.HOME;
  }

  get isSearch() {
    return this.searchType === SEARCH_TYPE.INPUT;
  }

  get isSearchResult() {
    return this.searchType === SEARCH_TYPE.RESULT;
  }

  @Log('search')
   public value() {
    const test = 'test';
  }

  public created() {
    this.getSearchHome();
  }

  public mounted() {
    setTimeout(() => {
      const searchInput=document.querySelector('#searchInput') as HTMLInputElement;
      searchInput.focus();
    }, 1000);
  }

  private getSearchHome() {
    SearchApiService.getSearchHome()
        .then( (data)=>{
          // console.log(data);
          this.bestItems=data.best_classlist;
          this.recommandItems=data.recommended_keywords;

          console.log(this.bestItems );
        });
  }

  private getProfileImg(imgUrl: string | null | undefined ): string{
    return ImageSettingService.getProfileImg( imgUrl );
  }

  private getHashTag( items: string[] ): string | undefined {
    if( !items ){ return; }
    // console.log(' items=',  items)
    if( items.length === 0 ){ return; }
    const keywords= items.map( ( prop: any ) => '#' + prop.keyword) ;
    return keywords.join(' ');
  }

  private gotoLink( item: any ): void {
    console.log(item);
    this.searchType = SEARCH_TYPE.RESULT;

    // console.log('item.class.me=', item.class.me);

    // const shortcutURL = (item.class.me !== null) ? `${CLASS_BASE_URL}/${item.class_id}` : `${CLASS_BASE_URL}/${item.class_id}/enrollClass`;

    //클래스 멤버일때
    if (item.class.me !== null) {
      this.MYCLASS_HOME(item.class_id).then(()=>{
        this.$router.push({path: `${CLASS_BASE_URL}/${item.class_id}`})
            .then(( )=>{
              console.log(this.classID, ':: 해당 클래스 홈 이동');
            });
      });
    }else{
      this.$router.push({path: `${CLASS_BASE_URL}/${item.class_id}/enrollClass`});
    }

    this.SEARCHING(false);

  }

  // 트랜지션을 시작할 때 인덱스 * 100 ms 만큼의 딜레이를 적용합니다.
  private beforeEnterBestItem(el: HTMLElement): void {
    if(el.dataset.index !=='0'){
      // el.classList.add('skeleton-inner');
      // console.log(this.startNum, this.endNum);
      this.isLoading=true;
      el.style.transitionDelay =this.delayTime(150, String( el.dataset.index ), this.recommandItems.length);
    }
  }

  // 트랜지션을 시작할 때 인덱스 * 100 ms 만큼의 딜레이를 적용합니다.
  private beforeEnterKeywords(el: HTMLElement): void {
    if(el.dataset.index !=='0'){
      // el.classList.add('skeleton-inner');
      // console.log(this.startNum, this.endNum);
      // this.isLoading=true;
      el.style.transitionDelay = this.delayTime(120, String( el.dataset.index ), this.recommandItems.length);
    }
  }

  private afterEnter(el: HTMLElement): void {
    this.isLoading=false;
    el.style.transitionDelay = '';
  }

  private delayTime(speed: number, idx: string | number, len: number): string {
    const delay = (typeof idx === 'string') ? parseInt(idx as string, 10) : idx;
    return speed * (delay % len) + 'ms';
  }

  private watchBySearchModel(val: string) {
    this.searchValue = val;

    this.searchType = (this.searchValue !== '') ? SEARCH_TYPE.INPUT : SEARCH_TYPE.HOME;
    if (this.searchType === SEARCH_TYPE.INPUT) {
      this.search();
    }

  }


  private search(){
    // this.searchSchoolValue=( value!=='' )? value : '';
    console.log(this.searchValue);
    this.searchItems=[];

    //$nextTick - 해당하는 엘리먼트가 화면에 렌더링이 되고 난 후
    this.$nextTick( ()=>{

      const searchClassInput= document.querySelector('#searchInput') as HTMLInputElement;
      // console.log(searchSchool);
      searchClassInput.focus();

      // console.log( searchSchool.value )
      //키가 눌렸을 때 체크 Observable
      // targetInputSelector: string
      const key$ = searchKeyEventObservable('#searchInput');

      const userInter$ =searchUserKeyValueObservable( key$, this.changeLoaded, { fn: SearchApiService.getSearchResult, args: null}, this.isLoading);
      userInter$.subscribe({
        next:( data: any ) =>{
          // console.log( data.classlist );
          this.searchItems= data.classlist
              .map( ( item: any )=> item )
              .filter( (item: any )=> {
                // console.log(item.g_name.match( this.searchValue ), item.name.match( this.searchValue ), this.searchValue );
                return item.name.match( this.searchValue )!==null;
              });
        },
      });

      //검색어 없을 시 리셋 Observable
      //obv$: Observable<any>, reset: ()=>void
      const reset$ = resetSearchInput( key$, ()=>{
        this.isLoading=false;
        this.searchItems = [];
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
    const startIndex=word.indexOf(this.searchValue);
    const endIndex=startIndex+this.searchValue.length;
    const searchResultWord=word.substr(startIndex, this.searchValue.length);
    return [word.slice(0, startIndex), `<strong>${searchResultWord}</strong>`, word.slice(endIndex, word.length)].join('');
  }

  private moveToSearchResult( keyword: string='' ): void {

    this.searchType=SEARCH_TYPE.RESULT;
    this.SEARCHING(false);
    const schKeyword = (keyword === '') ? this.searchValue : keyword;
    //item ==='' 상태이면 입력후 enter 키나 검색 버튼을 누른 상태 ~
    console.log('schKeyword=', schKeyword, this.searchValue , keyword);
    this.SEARCH_RESULT_ACTION({keyword:schKeyword, page_no:1, count:10})
        .then((data) => {
          console.log(data);
          // console.log(this.$router.currentRoute); /////==='/search/result'
          // this.$router.go(this.$router.currentRoute);
          // , query: { timeStamp: `${new Date().getTime()}` } 처럼 query 값을 같이 주는 이유는 새로고침 후
          // 검색결과  router 주소값이 매번 /search/result 와 같이 똑같은 url 값으로 라우터 이동이 이루어지기 때문에
          //주소값을 매번 검색시 갱신해 줄 필요가 있다.

          this.$router.push({ path: '/search/result', query: { q: `${new Date().getTime()}` } }).then(() => {
            console.log(`SearchResultPage` + '으로 이동');
            // Utils.getWindowReload();
          }).catch((error)=>{
            console.log(error);
          });
        });
  }


  private changeLoaded(): void{
    this.isLoading=!this.isLoading;
  }


}
</script>

<style scoped>

</style>
