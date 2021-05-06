<template>
  <!-- start: header -->
  <header class="white">
    <div class="header-container">

      <h1 class="logo">
        <router-link :to="{path:'/'}"><img :src="require('@/assets/images/logo-logotype-red.png')" alt="papaya" /></router-link>
      </h1>


      <!--  :items="startYears" @change="updateYears" :selected-value="selectDataModel" -->
      <!--<div class="class-select">
         <select-box id="startYear" size="390" ></select-box>
      </div>-->
      <div class="class-select">
        <select class="form-select">
          <option value="" selected>꿈꾸는 5학년 1반</option>
          <option value="">꿈꾸는 5학년 1반</option>
          <option value="">꿈꾸는 5학년 1반</option>
          <option value="">꿈꾸는 5학년 1반</option>
        </select>
      </div>

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
export default class MyClassHeader extends Vue {
  private isSearch: boolean=false;

  private onSearch( isClick: boolean ) {
    // console.log('isClick=' + isClick);
    this.isSearch=isClick;
  }
}
</script>

<style>
</style>
