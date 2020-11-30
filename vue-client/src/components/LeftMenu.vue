<template>
    <el-row class="menu_page">
         <el-col>
             <el-menu mode="vertical" background-color="#324057" text-color="#fff" active-text-color="#409eff" 
                class="el-menu-vertical-demo">
                <router-link to="/home">
                    <el-menu-item index="0">
                        
                        <span slot="title">首页</span>
                    </el-menu-item>
                </router-link>
                <router-link to="/invasionList5">
                    <el-menu-item index="1">
                        
                        <span slot="title">态势威胁值曲线</span>
                    </el-menu-item>
                </router-link>
                <router-link to="/invasionMap">
                    <el-menu-item index="2">
                        
                        <span slot="title">态势展示</span>
                    </el-menu-item>
                </router-link>
                <router-link to="/firewall">
                    <el-menu-item index="3">
                        
                        <span slot="title">防火墙</span>
                    </el-menu-item>
                </router-link>
                <router-link to="/VisNetwork">
                    <el-menu-item index="4">
                        
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
      items: [
        {
          icon: "fa-exclamation-circle",
          name: "流量检测",
          path: "fund",
            children: [{ path: "invasionList1", name: "流量日志" }, {path: "invasionList2", name: "恶意流量报警日志"}, {path: "invasionList3", name: "用户访问检测"}, {path: "invasionMap", name: "态势展示"}, {path: "invasionList5", name: "态势威胁值曲线"}, {path:"firewall", name: "防火墙"}]
        },
        {
          icon: "fa-exclamation-triangle",
          name: "主机检测",
          path: "invasion",
          children: [{ path: "fundList", name: "警告列表" },{ path: "HostInfo", name: "主机信息"},{ path: "VisNetwork", name: "网络拓扑" },{path: "AssetCenter", name: "资产中心"}]
        },
        {
          icon: "fa-asterisk",
          name: "信息管理",
          path: "info",
          children: [{ path: "infoshow", name: "个人信息" }, {path: "ueba", name: "UEBA"}]
        }
      ]
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
