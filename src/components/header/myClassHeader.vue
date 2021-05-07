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

      <header-menu-view></header-menu-view>
    </div>
    <search v-if="isSearchChk"></search>
  </header>
  <!-- //end: header -->

</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import HeaderMenuView from '@/components/header/headerMenuView.vue';
import Search from '@/components/header/search.vue';

const SearchStatus = namespace('SearchStatus');

@Component({
  components:{
    HeaderMenuView,
    Search
  }
})
export default class MyClassHeader extends Vue {
  @SearchStatus.Getter
  private isSearchChk!: boolean;
}
</script>

<style>
</style>
