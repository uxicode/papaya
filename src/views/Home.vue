<template>
  <div class="home">
    <p style="text-align:left">로그인 상태 : {{ isAuth  }}</p>
    <p style="text-align:left">token : {{ tokenStatus }}</p>

  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import {Vue, Component, Prop} from 'vue-property-decorator';
import {namespace} from 'vuex-class';

const Auth = namespace('Auth');

@Component
export default class Home extends Vue {


  @Auth.Getter
  private isAuth!:boolean;

  @Auth.Getter
  private tokenStatus!:string | null;


}
</script>
