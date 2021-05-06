<template>
  <!-- start: header -->
  <header class="dark">
    <div class="header-container">
      <h1 class="logo">
        <router-link :to="{path:'/'}"><img :src="require('@/assets/images/logo-logotype-white.png')" alt="papaya" /></router-link>
      </h1>
      <header-menu-view @search="onSearch"></header-menu-view>
    </div>
    <search v-if="isSearch"></search>
  </header>
  <!-- //end: header -->

</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import HeaderMenuView from '@/components/header/headerMenuView.vue';
import Search from '@/components/header/search.vue';
@Component({
  components:{
    HeaderMenuView,
    Search
  }
})
export default class AppHeader extends Vue {

  private isSearch: boolean=false;

  private onSearch( isClick: boolean ) {
    // console.log('isClick=' + isClick);
    this.isSearch=isClick;
  }
}
</script>

<style>
</style>
