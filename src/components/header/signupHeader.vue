<template>
  <header>
    <div class="header-container">
      <h1 class="logo"><a href="#"><img src="../../assets/images/logo-logotype-black.png" alt="papaya" /></a></h1>

      <nav id="gnb">
        <ul class="menu">
          <li><a href="">회원가입</a></li>
          <li><a href="">로그인</a></li>
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
export default class SignUpHeader extends Vue {
}
</script>

<style scoped>

</style>
