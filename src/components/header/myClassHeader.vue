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
export default class MyClassHeader extends Vue { }
</script>

<style>
</style>
