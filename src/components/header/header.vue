<template>
  <!-- start: header -->
  <header class="dark">
    <div class="header-container">
      <h1 class="logo">
        <router-link :to="{path:'/'}"><img :src="require('@/assets/images/logo-logotype-white.png')" alt="papaya" /></router-link>
      </h1>

      <header-menu-view></header-menu-view>

    </div>
  </header>
  <!-- //end: header -->

</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import HeaderMenuView from '@/components/header/headerMenuView.vue';


@Component({
  components:{
    HeaderMenuView
  }
})
export default class AppHeader extends Vue {}
</script>

<style>
</style>
