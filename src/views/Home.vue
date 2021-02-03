<template>
  <div class="home">
    <p style="text-align:left">로그인 상태 : {{ isAuth  }}</p>
    <p style="text-align:left">token : {{ tokenStatus }}</p>

    <p><button type="button" @click="logout">로그아웃</button></p>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {LOGOUT} from '@/store/mutation-auth-types';

const Auth = namespace('Auth');

@Component
export default class Home extends Vue {


  @Auth.Getter
  private isAuth!:boolean;

  @Auth.Getter
  private tokenStatus!:string | null;

  @Auth.Mutation
  private LOGOUT!:()=>void;

  private logout():void{
    this.LOGOUT();
    // console.log( this.$router.currentRoute.path )
    this.$router.push( this.$router.currentRoute.path );
  }
}
</script>
