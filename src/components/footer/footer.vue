<template>
  <!-- start: footer -->
  <footer :class="{'dark':isLogInRoute}">
    <div class="footer-inner clearfix">
      <div class="footer-logo"></div>

      <ul class="footer-address">
        <li class="items">
          <p class="item-txt-w">(주)이니션 대표이사 : 류동석<br />서울시 강남구 삼성로100길 24-1<br />오트리스빌딩 A동 2층</p>
        </li>
        <li class="items">
          <address class="item-txt-w">
            A-2F, 24-1, Samseong-ro 100-gil,<br />
            Gangnam-gu, Seoul, Republic of Korea
          </address>
        </li>
      </ul>

      <ul class="footer-menu">
        <li><a href="#" class="item-txt-w">공지사항</a></li>
        <li><a href="#" class="item-txt-w">고객센터</a></li>
        <li><a href="#" class="item-txt-w">이용약관</a></li>
      </ul>
    </div>
  </footer>
  <!-- //end: footer -->
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component
export default class AppFooter extends Vue{

  public created() {
    // this.currRouteName=this.$route.name;
    console.log(this.$route.name);
  }
}

</script>

<style scoped>

</style>
