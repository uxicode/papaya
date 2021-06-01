<template>
  <section class="contents-left">
    <div class="class-home">
      <div class="class-home-info">
        <div class="info-img">
          <img :src="getProfileImg(myClassHomeModel.image_url)" alt="" class="circle">
<!--          <a href="" class="img-change"><img :src="require('@/assets/images/btn-round 2.png')" alt=""></a>-->

          <!-- start: profile image upload -->
          <form v-if="isOwner" class="file-form img-change" enctype="multipart/form-data" accept-charset="utf-8" novalidate>
            <!-- accept 종류 : image/*, .pdf, .xls, .xlsx, .ppt, .pptx, .doc, .docx-->
            <input class="input-file" type="file" name="files" id="fileInput" accept="image/*" @change="uploadProfileImg( $event.target.files )"/>
            <img :src="require('@/assets/images/btn-round2.png')" alt="">
          </form>
          <!-- end: profile image upload -->
        </div>
        <div class="info-txt">
          <p class="info-cn">{{myClassHomeModel.name}}</p>
          <span class="info-or">{{myClassHomeModel.g_name}}</span>
          <ul class="info-list">
            <li>{{ myClassHomeModel.startday }}</li>
            <li>{{ myClassHomeModel.is_private? '공개' : '비공개' }}</li>
            <li><button type="button" @click="gotoClassMemberPage">멤버 {{ myClassHomeModel.member_count }} &gt;</button></li>
          </ul>
          <p class="info-tag">{{getHashTag(myClassHomeModel.class_tags) }}</p>
        </div>
        <div class="class-bookmark">
          <a type="button" class="btn ico-btn ico-left active"><span class="icon heart"></span>즐겨찾기</a>
        </div>
      </div>
      <div class="class-menu">
        <ul class="menu-list">
          <li v-for="(item, index) in sideMenuModel" :key="`item-${index}`" v-if="visibleSettingMenus(index)">
            <a href="" :class="[`type${index+1}`, {'active': index===activeNum }]" @click.prevent="sideMenuClickHandler( index )">{{ item.title }}</a>
          </li>
<!--          <li><a href="" class="type2">알림</a></li>
          <li><a href="" class="type3">일정</a></li>
          <li><a href="" class="type4">파일함</a></li>
          <li><a href="" class="type5">교육과정</a></li>
          <li><a href="" class="type6">클래스 설정</a></li>-->
        </ul>
      </div>
    </div>
    <!-- start: 프로필 이미지 업로드 시 팝업 -->
    <transition name="modal">
      <modal v-if="isPopup">
        <div slot="header">
          <div class="popup-icon error"></div>
          <div class="popup-close" @click="closePopup">
            <button type="button" class="close"><img :src="require('@/assets/images/close.svg')" alt=""></button>
          </div>
        </div>
        <div slot="body" style="text-align:left;">
          <h3 class="popup-tit">클래스 프로필 이미지 편집</h3>
          <div class="msg-container popup-txt">프로필 이미지가 수정되었습니다.</div>
        </div>
        <div slot="footer">
          <div class="btn-group ct">
            <btn @btnClick="closePopup">확인</btn>
          </div>
        </div>
      </modal>
    </transition>
    <!-- end: 프로필 이미지 업로드 시 팝업 -->

  </section>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';
import {Utils} from '@/utils/utils';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import MyClassService from '@/api/service/MyClassService';
import {CLASS_BASE_URL} from '@/api/base';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';

interface ISideMenu{
  id: number;
  title: string;
  linkKey: string;
}

const MyClass = namespace('MyClass');

@Component({
  components:{
    Modal,
    Btn,
  }
})
export default class SideMenu extends Vue{

  @Prop(Number)
  private activeNum: number | null | undefined;

  @MyClass.Getter
  private classID!: string | number;

  @MyClass.Getter
  private myClassHomeModel!: IClassInfo;

  @MyClass.Getter
  private sideNumModel!: number;

  @MyClass.Action
  private MYCLASS_HOME!: ( id: string | number ) => Promise<any>;

  private sideMenuData: ISideMenu[]=[
    {id:0, title: '클래스 홈', linkKey:'' },
    {id:1, title: '알림', linkKey:'notification' },
    {id:2, title: '일정', linkKey:'schedule' },
    {id:3, title: '파일함', linkKey:'fileBox' },
    {id:4, title: '교육과정', linkKey:'curriculum' },
    {id:5, title: '클래스 설정', linkKey:'setting' },
  ];
  private isPopup: boolean=false;

  get isOwner(): boolean{
    return (this.myClassHomeModel.owner_id === this.myClassHomeModel.me?.user_id);
  }

  get sideMenuModel(): ISideMenu[]{
    return this.sideMenuData;
  }

  public created(){
    // console.log( '사이드 메뉴 시작점...')
    //화면 새로고침시에
    if (performance.navigation.type === 1) {
      this.sideMenuClickHandler(0);
    }
    /*window.onpageshow = function(event) {
      if ( event.persisted || (window.performance && window.performance.navigation.type === 1)) {
        // Back Forward Cache로 브라우저가 로딩될 경우 혹은 브라우저 뒤로가기 했을 경우
        console.log( event )
      }
    }*/

  }

  public getHashTag( items: any[] ): string | undefined {
    if( !items ){ return; }
    // console.log(' items=',  items)
    if( items.length === 0 ){ return; }
    const keywords= items.map(( prop ) => '#' + prop.keyword);
    return keywords.join(' ');
  }

  public getProfileImg( imgUrl: string | null | undefined ): string{
    // console.log(ImageSettingService.getProfileImg(randomImgItems, imgUrl) );
    return ImageSettingService.getProfileImg( imgUrl );
  }

  private sideMenuClickHandler(idx: number): void {
    this.$emit('sideClick', idx);
    const queryVal = (idx === 0) ? {} : {timestamp: `${new Date().getTime()}`};
    this.$router.push({path:`${CLASS_BASE_URL }/${this.classID}/${this.sideMenuData[idx].linkKey}`} )
        .catch((error) => {
          console.log('side-menu 에서 error', error);
          //에러 난 경우 새로고침
          // window.location.reload();
          Utils.getWindowReload();
        });
  }

  /**
   * 프로필 이미지 수정
   * @param files - input type=fileBox 의 onChange 이벤트로  $event.target.files 값
   * @private
   */
  private async uploadProfileImg( files: any ){
    const formData = new FormData();
    formData.append('file', files[0] );
    //클래스 대표 이미지 수정
    await MyClassService.setUploadProfileImg( this.classID, formData )
        .then((data) => {
          console.log(data);
        }).catch((error) => {
           console.log(error);
        });
    //클래스 대표 이미지 수정하여 업데이트 된 데이터를 화면에 반영한다.
    await this.MYCLASS_HOME( this.classID )
        .then( (data) => {
          console.log(data);
          // this.$emit('updateProfile', true);
          this.updateProfileImage( true );
        });
  }

  private updateProfileImage(isOpen: boolean) {
    this.isPopup=isOpen;
  }

  private closePopup(): void{
    this.isPopup=false;
  }

  private gotoClassMemberPage(): void{
    console.log('멤버보기 클릭=', this.classID);
    this.$router.push({path:`${CLASS_BASE_URL}/${this.classID}/member`});
  }

  private visibleSettingMenus(idx: number): boolean{
    if( idx === this.sideMenuModel.length-1 ){
      return (this.isOwner);
    }else{
      return true;
    }
  }
}

</script>

<style scoped>

</style>
