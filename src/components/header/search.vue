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
                         :key-enter="schoolNameSearchKeyEnter"></txt-field>
            </div>
            <div class="tb-cell rt"><button type="button" class="btn primary red">검색</button></div>
          </div>
        </div>
      </div>

      <!-- autocomplete 부분 -->
      <div class="search-word" v-if="isSearch">
        <div class="search-inner">
          <ul class="search-word-list">
            <li v-for="(item, index) in searchItems" :key="`searchItems-${index}`">
              <a href="" class="result-link" @click.prevent.stop="applySearchResult">
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
                    <a href="" @click.prevent="gotoLink( bestItem )">
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
                      <a href="" @click.prevent="gotoLink( bestItem )">
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
import TxtField from '@/components/form/txtField.vue';
import MyClassService from '@/api/service/MyClassService';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import {
  resetSearchInput,
  searchKeyEventObservable,
  searchUserKeyValueObservable
} from '@/views/service/search/SearchService';
import {Log} from '@/decorators';
import {CLASS_BASE_URL} from '@/api/base';


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



  get bestItemsModel() {
    return this.bestItems;
  }

  get recommandItemsModel() {
    return this.recommandItems;
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
    MyClassService.getSearchHome()
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

    let shortcutURL=( item.me !==null )? `${CLASS_BASE_URL}/${item.id}` :
    if( item.me === null ){

    }else{

    }
    this.$router.push(`${CLASS_BASE_URL}/${item.id}`).then(() => {
      console.log(item, '으로 이동');
    });
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

  private schoolNameSearchKeyEnter() {
    // console.log(this.searchSchoolValue);
    // this.openPopupStatus=true;

    // this.search();
    //classlist
    //total  ??
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

      const userInter$ =searchUserKeyValueObservable( key$, this.changeLoaded, { fn: MyClassService.getSearchResult, args: null}, this.isLoading);
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

  private applySearchResult( name: string): void {
    // this.closeSchoolSearchPopup();
    // this.searchSchoolValue=name;
    // this.changeSchoolNameValue(this.searchSchoolValue);
    // this.getSchoolNameInput('searchSchool');
    this.searchType=SEARCH_TYPE.RESULT;
  }


  private changeLoaded(): void{
    this.isLoading=!this.isLoading;
  }


}
</script>

<style scoped>

</style>
