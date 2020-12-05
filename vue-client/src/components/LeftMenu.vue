<template>
    <el-row class="menu_page">
         <el-col>
             <el-menu mode="vertical" background-color="#324057" text-color="#fff" active-text-color="#409eff" 
                class="el-menu-vertical-demo">
                <router-link to="/home">
                    <el-menu-item index="0">
                        <i class="fas fa-margin fa-home"></i>
                        <span slot="title">首页</span>
                    </el-menu-item>
                </router-link>
                <router-link to="/invasionList5">
                    <el-menu-item index="1">
                        <i class="fas fa-margin fa-chart-line"></i>
                        <span slot="title">态势威胁值曲线</span>
                    </el-menu-item>
                </router-link>
                <router-link to="/invasionMap">
                    <el-menu-item index="2">
                        <i class="fas fa-margin fa-map"></i>
                        <span slot="title">态势展示</span>
                    </el-menu-item>
                </router-link>
                <router-link to="/firewall">
                    <el-menu-item index="3">
                        <i class="fas fa-margin fa-shield-alt"></i>
                        <span slot="title">防火墙</span>
                    </el-menu-item>
                </router-link>
                <router-link to="/VisNetwork">
                    <el-menu-item index="4">
                        <i class="fas fa-margin fa-project-diagram"></i>
                        <span slot="title">网络拓扑</span>
                    </el-menu-item>
                </router-link>
             </el-menu>
         </el-col>
    </el-row>
</template>
<script>
export default {
  name: "leftmenu",
  data() {
    return {
      
    };
  }
};
</script>
<style scoped>
.menu_page {
  position: fixed;
  top: 71px;
  left: 0;
  min-height: 100%;
  background-color: #324057;
  z-index: 99;
}
.el-menu {
  border: none;
}
.fa-margin {
  margin-right: 5px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  width: 35px;
}
.el-submenu .el-menu-item {
  min-width: 180px;
}

.hiddenDropdown,
.hiddenDropname {
  display: none;
}
a {
  text-decoration: none;
}
</style>
