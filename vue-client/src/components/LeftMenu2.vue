<template>
    <el-row class="menu_page">
         <el-col>
             <el-menu mode="vertical" background-color="#324057" text-color="#fff" active-text-color="#409eff" 
                class="el-menu-vertical-demo">
                <router-link to="/home">
                    <el-menu-item index="0">
                        <i class="fas fa-margin fa-backward"></i>
                        <span slot="title">返回</span>
                    </el-menu-item>
                </router-link>
                <template  v-for="item in items" >
                    <el-submenu v-if="item.children" :index="item.path" :key="item.path">
                        <template slot="title">
                            <i :class="'fas fa-margin '+item.icon"></i>
                            <span slot="title">{{item.name}}</span>
                        </template>
                        <router-link v-for="(citem,cindex) in item.children" 
                            :to="{ path: citem.path, query: { id: id }}" :key="cindex">
                            <el-menu-item 
                                :index='citem.path'>
                                <span slot="title">{{citem.name}}</span>
                            </el-menu-item> 
                        </router-link>
                    </el-submenu>
                    
                </template>
             </el-menu>
         </el-col>
    </el-row>
</template>
<script>
export default {
  name: "leftmenu",
  data() {
    return {
      id: Number,
      items: [
        {
          icon: "fa-exclamation-circle",
          name: "流量检测",
          path: "fund",
            children: [{ path: "invasionList1", name: "流量日志" }, {path: "invasionList2", name: "恶意流量报警日志"}, {path: "invasionList3", name: "用户访问检测"}, {path: "invasionMapOf", name: "态势展示"}, {path: "invasionList5Of", name: "态势威胁值曲线"}, {path:"firewallOf", name: "防火墙"}]
        },
        {
          icon: "fa-exclamation-triangle",
          name: "主机检测",
          path: "invasion",
          children: [{ path: "fundList", name: "警告列表" },{ path: "HostInfo", name: "主机信息"},{path: "AssetCenter", name: "资产中心"}]
        },
        {
          icon: "fa-asterisk",
          name: "信息管理",
          path: "info",
          children: [{ path: "infoshow", name: "个人信息" }, {path: "ueba", name: "UEBA"}]
        }
      ]
    };
  },
  created(){
    this.id = this.$route.query.id;
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
