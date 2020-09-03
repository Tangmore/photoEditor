<template>
  <div id="app"> 
    <!--页面返回不刷新-->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
  
<script>
export default {
  name: "App",
  mounted() { 
  }
};
</script>

<style>
html {
  height: 100%;
}

body {
  width: 100%;
  height: 100%; 
  background: #050426;
  background-image: radial-gradient(circle closest-side,#041e43,#040f1c);
  padding: 0;
  max-width: 750px;
  margin: 0 auto;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
  max-width: 750px;
  margin: 0 auto;
  overflow: hidden;
}
ul,
li {
  padding: 0;
  margin: 0;
} 
</style>
