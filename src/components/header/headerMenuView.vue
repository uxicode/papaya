<template>
 <div>
   <nav id="gnb" class="pd-desc">
     <ul class="menu">
       <li><router-link :to="{path:'/'}">홈</router-link></li>
       <li><router-link :to="{path:'/class/notify'}">모든 알림</router-link></li>
       <li><router-link :to="{path:'/class/schedule'}">모든 일정</router-link></li>
       <li><a href="">자료실</a></li>
       <li><router-link :to="{path:'/class/search'}" class="top-search" @click="onSearch"></router-link></li>
       <li><a href="#" class="top-alert"></a></li>
       <li>
         <div class="list-popup" v-click-outside="onClickOutside">
           <!-- sub-menu-btn 에 active 추가 시 arrow 버튼 활성화 -->
           <button type="button" class="list-popup-btn sub-menu-btn" :class="{'active': isActive}" @click.stop.prevent="subMenuToggle">
             <!--           <img :src="replaceUserMenuImg()? require('@/assets/images/mypage-white.svg' ) : require('@/assets/images/mypage.svg' )" alt="" />-->
           </button>
           <div class="list-popup-menu depth-2" :class="{'active': isActive}">
             <router-link :to="{path:'/myProfile'}" class="list-popup-item"  @click.native="onClickOutside">MY프로필</router-link>
             <router-link :to="{path:'/bookmark'}" class="list-popup-item"  @click.native="onClickOutside">보관함</router-link>
             <a href="" class="list-popup-item">활동내역</a>
             <div class="line"></div>
             <a href="" class="list-popup-item">공지사항</a>
             <a href="" class="list-popup-item">고객센터</a>
             <a href="" class="list-popup-item">이용약관</a>
             <div class="line"></div>
             <a href="" class="list-popup-item" @click="isLogout">로그아웃</a>
           </div>
         </div>
       </li>
     </ul>
   </nav>

   <!--  <ul class="sub-menu">

   <li><a href="#"><img src="../../assets/images/mypage-white.svg" alt="" /></a></li>-->
     <!--<li>
       <a v-click-outside="onClickOutside"
          href="#" class="arrow-down"
          :class="{'active': isActive}"
          @click.stop.prevent="subMenuToggle">
         <img src="../../assets/images/a-down.png" alt="" />
       </a>
       <ul class="depth-2" :class="{'active': isActive}">
         <li><router-link :to="{path:'/myProfile'}">MY프로필</router-link></li>
         <li><router-link :to="{path:'/bookmark'}">보관함</router-link></li>
         <li class="bd-btm"><a href="#">활동내역</a></li>
         <li><a href="#">공지사항</a></li>
         <li><a href="#">고객센터</a></li>
         <li class="bd-btm"><a href="#">이용약관</a></li>
         <li><a href="#" @click="isLogout">로그아웃</a></li>
       </ul>
     </li>
   </ul>-->
 </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
const Auth = namespace('Auth');
const MyClass = namespace('MyClass');

@Component
export default class HeaderMenuView extends Vue {
  private isActive: boolean = false;

  @Auth.Mutation
  private LOGOUT!: () => void;

  @MyClass.Mutation
  private REMOVE_CLASS_DATA!: () => void;

/*nk :to="{path:'/'}">홈</router-link></li>
nk :to="{path:'/class/notify'}">모든 알림</router-
nk :to="{path:'/class/schedule'}">모든 일정</route
>자료실</a></li>*/
  /*private menuInfos: ( string[] )=[
    {gnb:[], lnb:[] }
  ]*/
  private isLogout(): void {
    this.LOGOUT();
    this.REMOVE_CLASS_DATA();
    this.$router.push('/login');
  }

  /**
   * 우측 화살표 버튼 클릭시 하위 메뉴 노출
   * @private
   */
  private subMenuToggle(): void {
    this.isActive = !this.isActive;
  }

  /**
   * v-click-outside 속성 이용하여
   * 바깥쪽 영역 클릭시 subMenuToggle 닫음
   * @private
   */
  private onClickOutside(): void {
    console.log('라우터 클릭');
    this.isActive = false;
  }

  private onSearch(): void {
    console.log('search 클릭');
  }
}
</script>

<style>
</style>
