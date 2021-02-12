<template>
  <!-- start: header -->
  <header class="dark">
    <div class="header-container">
      <h1 class="logo"><a href="#"><img src="../../assets/images/logo-logotype-white.png" alt="papaya" /></a></h1>

      <nav id="gnb" class="pd-desc">
        <ul class="menu">
          <li><a href="">홈</a></li>
          <li><a href="">모든 알림</a></li>
          <li><a href="">모든 일정</a></li>
          <li><a href="">자료실</a></li>
        </ul>
      </nav>

      <ul class="sub-menu">
        <li><a href="#"><img src="../../assets/images/search-white.svg" alt="" /></a></li>
        <li><a href="#"><img src="../../assets/images/icn-32-alert-white-on.svg" alt="" /></a></li>
        <li><a href="#"><img src="../../assets/images/mypage-white.svg" alt="" /></a></li>
        <li><a href="#" class="arrow-down"><img src="../../assets/images/a-down.png" alt="" /></a></li>
      </ul>

    </div>
  </header>
  <!-- //end: header -->

</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';

const Auth = namespace('Auth');

@Component
export default class AppHeader extends Vue {

  @Auth.Getter
  private isAuth!: boolean;

  @Auth.Mutation
  private LOGOUT!: () => void;

  private isLogout(): void {
    this.LOGOUT();
    this.$router.push('/login');
  }

  private gotoSignUpPage(): void {
    // this.HISTORY_PAGE({history:'signup'});
    // this.$router.push(RestApi.SIGN_UP_URL);
  }

  private gotoLoginPage(): void {
    // this.HISTORY_PAGE({history:'login'});
    this.$router.push('/login');
  }
}
</script>

<style>
</style>
