<template>
  <nav class="wrapper-header">
    <h1 class="logo"><a href="#"><span class="blind">papaya 로고</span></a></h1>
    <template v-if="!this.isAuth">
<!--      <button class="membership" @click.stop.prevent="gotoSignUpPage" v-if="this.getHistoryPage!=='signup'">회원가입</button>-->
<!--      v-else -->
      <button class="membership" @click.stop.prevent="gotoLoginPage" >로그인</button>
    </template>
    <button class="membership" @click.stop.prevent="isLogout" v-else>로그아웃</button>
  </nav>

</template>

<script lang="ts">
  import { Vue, Component} from 'vue-property-decorator';
  import {namespace} from 'vuex-class';

  const Auth = namespace('Auth');

  @Component
  export default class AppHeader extends Vue{

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

<style>
</style>
