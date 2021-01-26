<template>
  <!-- start: header -->
  <header class="dark">
    <div class="header-container">
      <h1 class="logo"><a href="#"><img src="../../assets/images/logo-logotype-white.png" alt="papaya" /></a></h1>
      <nav id="gnb">
        <ul class="menu">
          <li><router-link to="/signup">회원가입</router-link></li>
        </ul>
      </nav>
    </div>
  </header>
  <!-- //end: header -->
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';

const Auth = namespace('Auth');

@Component
export default class SignInHeader extends Vue{

  @Auth.Getter
  private isAuth!:boolean;

  @Auth.Mutation
  private LOGOUT!:()=> void;

  private isLogout():void{
    this.LOGOUT();
    this.$router.push('/login');
  }

  private gotoSignUpPage():void {
    // this.HISTORY_PAGE({history:'signup'});
    // this.$router.push(RestApi.SIGN_UP_URL);
  }

  private gotoLoginPage():void{
    // this.HISTORY_PAGE({history:'login'});
    this.$router.push('/login');
  }
}
</script>

<style scoped>

</style>
