<template>
  <!-- start: header -->
  <header class="dark">
    <div class="header-container">
      <h1 class="logo"><router-link :to="{path:'/'}"><img src="../../assets/images/logo-logotype-white.png" alt="papaya" /></router-link></h1>

      <nav id="gnb" class="pd-desc">
        <ul class="menu">
          <li><router-link :to="{path:'/'}">홈</router-link></li>
          <li><router-link :to="{path:'/class/notify'}">모든 알림</router-link></li>
          <li><router-link :to="{path:'/class/schedule'}">모든 일정</router-link></li>
          <li><a href="">자료실</a></li>
        </ul>
      </nav>

      <ul class="sub-menu">
        <li><a href="#"><img src="../../assets/images/search-white.svg" alt="" /></a></li>
        <li><a href="#"><img src="../../assets/images/icn-32-alert-white-on.svg" alt="" /></a></li>
        <li><a href="#"><img src="../../assets/images/mypage-white.svg" alt="" /></a></li>
        <li>
          <a v-click-outside="onClickOutside"
             href="#" class="arrow-down"
             :class="{'active': isActive}"
             @click.stop.prevent="subMenuToggle"><img src="../../assets/images/a-down.png" alt="" /></a>
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
      </ul>

    </div>
  </header>
  <!-- //end: header -->

</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';

const Auth = namespace('Auth');
const MyClass = namespace('MyClass');

@Component
export default class AppHeader extends Vue {
  private isActive: boolean = false;

  @Auth.Getter
  private isAuth!: boolean;

  @Auth.Mutation
  private LOGOUT!: () => void;

  @MyClass.Mutation
  private REMOVE_CLASS_DATA!: () => void;


  private isLogout(): void {
    this.LOGOUT();
    this.REMOVE_CLASS_DATA();
    this.$router.push('/login');
  }

  private gotoSignUpPage(): void {
    // this.HISTORY_PAGE({history:'enroll'});
    // this.$router.push(RestApi.SIGN_UP_URL);
  }

  private gotoLoginPage(): void {
    // this.HISTORY_PAGE({history:'login'});
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
    this.isActive = false;
  }
}
</script>

<style>
</style>
