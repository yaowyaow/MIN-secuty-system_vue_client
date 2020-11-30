<template>
    <div class="fillcontain">
        
        <h1><i :class="form_data.asset_type === 'server'?'fa fa-server':'fa fa-database'"></i> {{form_data.asset_name}}
            <div class="ass-secur" :style="{backgroundColor: secur_color}">
                <i :class="securClass"></i>{{form_data.asset_security}}
            </div>
        </h1>
        
        <div class="main">
            <div class="row">
                <div class="content-item">
                    <div class="key">
                        ID
                    </div>
                    <div class="node">
                        {{form_data.asset_id}}
                    </div>
                </div>
                <div class="content-item">
                    <div class="key">
                        资产类型
                    </div>
                    <div class="node">
                        {{form_data.asset_type}}
                    </div>
                </div>     
            </div>
            <div class="row">
                <div class="content-item">
                    <div class="key">
                        地域
                    </div>
                    <div class="node">
                        {{form_data.asset_location}}
                    </div>
                </div>
                <div class="content-item">
                    <div class="key">
                        标签
                    </div>
                    <div class="node">
                        {{form_data.asset_tag==''?'数据暂缺':form_data.asset_tag}}
                    </div>
                </div>                
            </div>
            <div class="row" v-if="form_data.asset_type === 'database'">
                <div class="content-item">
                    <div class="key">
                        端口
                    </div>
                    <div class="node">
                        {{form_data.asset_databases.port}}
                    </div>
                </div>                
            </div>
        </div>
        
        <div v-if="form_data.asset_type === 'server'">
            <div class="main">
                <div class="row">
                    <div class="content-item">
                        <div class="key">
                            私网IP
                        </div>
                        <div class="node">
                            {{form_data.asset_server.net.private_ip===''?'数据暂缺':form_data.asset_server.net.private_ip}}
                        </div>
                    </div>
                    <div class="content-item">
                        <div class="key">
                            公网IP
                        </div>
                        <div class="node">
                            {{form_data.asset_server.net.public_ip}}
                        </div>
                    </div>     
                </div>
                <div class="row">
                    <div class="content-item">
                        <div class="key">
                            MAC地址
                        </div>
                        <div class="node">
                            {{form_data.asset_server.net.mac}}
                        </div>
                    </div>    
                </div>
            </div>
            
            <div class="row">
                <div class="content-item">
                    <div class="key">
                        操作系统
                    </div>
                    <div class="node">
                        {{form_data.asset_server.system}}
                    </div>
                </div>
                <div class="content-item">
                    <div class="key">
                        内核版本
                    </div>
                    <div class="node">
                        {{form_data.asset_server.kernel}}
                    </div>
                </div>     
            </div>
            <div class="row">
                <div class="content-item">
                    <div class="key">
                        CPU
                    </div>
                    <div class="node">
                        {{form_data.asset_server.cpu}}
                    </div>
                </div>
                <div class="content-item">
                    <div class="key">
                        内存
                    </div>
                    <div class="node">
                        {{form_data.asset_server.memory}}
                    </div>
                </div>     
            </div>
            <div class="row">                
                <div class="content-item">
                    <div class="key">
                        硬盘
                    </div>
                    <div class="node">
                        已使用{{form_data.asset_server.disk.used}}/共{{form_data.asset_server.disk.total}}
                        <el-progress :text-inside="true" :stroke-width="26" :percentage="disk_usage.toFixed(1)"></el-progress>
                    </div>
                </div>     
            </div>
        </div>

    <!--    <el-form label-position="left" >
        <div class="demo-table-expand">
            <el-form-item label="ID">
                <span>{{form_data.asset_id}}</span>
            </el-form-item>
            <el-form-item label="资产类型">
                <span>{{form_data.asset_type === "server"?"服务器":"数据库"}}</span>
            </el-form-item>
            
            <el-form-item label="标签信息">
                <span>{{form_data.asset_tag}}</span>
            </el-form-item>
        </div> 
        <div v-if="form_data.asset_type === 'server'">       
            <div class="demo-table-expand">
                <el-form-item label="私网IP">
                    <span>{{form_data.asset_server.net.private_ip}}</span>
                </el-form-item>
                <el-form-item label="公网IP">
                    <span>{{form_data.asset_server.net.public_ip}}</span>
                </el-form-item>
                <el-form-item label="MAC地址">
                    <span>{{form_data.asset_server.net.mac}}</span>
                </el-form-item>
            </div>        
            <div class="demo-table-expand">
                <el-form-item label="区域">
                    <span>{{form_data.asset_server.location}}</span>
                </el-form-item>
                <el-form-item label="操作系统">
                    <span>{{form_data.asset_server.system}}</span>
                </el-form-item>
                <el-form-item label="CPU">
                    <span>{{form_data.asset_server.cpu}}</span>
                </el-form-item>
                <el-form-item label="内存">
                    <span>{{form_data.asset_server.memory}}</span>
                </el-form-item>
                <el-form-item label="内核版本">
                    <span>{{form_data.asset_server.kernel}}</span>
                </el-form-item>
                <el-form-item label="硬盘">
                    <span>
                    已使用{{form_data.asset_server.disk.used}}/共{{form_data.asset_server.disk.total}}
                    <el-progress :text-inside="true" :stroke-width="26" :percentage="disk_usage.toFixed(1)"></el-progress>
                    </span>
                </el-form-item>
            </div>
        </div>  -->

        <div v-else class="database-detail">
            <el-row>
                <el-col :span="12">
                    <el-table
                    v-if="form_data.asset_databases.databases.length > 0"
                    :data="form_data.asset_databases.databases"
                    border
                    :default-sort="{prop: 'id', order: 'descending'}"
                    style="width: 100%"
                    >
                        <el-table-column prop="name" label="数据库名称" align="center" width="150"></el-table-column>
                        <el-table-column prop="size" label="数据库大小" align="center" width="150"></el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="12">
                    <el-table
                    v-if="form_data.asset_databases.users.length > 0"
                    :data="form_data.asset_databases.users"
                    border
                    :default-sort="{prop: 'id', order: 'descending'}"
                    style="width: 100%"
                    >
                        <el-table-column prop="name" label="用户名" align="center" width="150"></el-table-column>
                        <el-table-column prop="dbs" label="数据库" align="center" width="150"></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
        <!--</el-form>-->
    </div>
</template>

<script>
export default {
    name:"AssetDetail",
    data(){
        return{
            form_data:{
                asset_id: "",
                asset_type: "",
                asset_tag: "",
                asset_name: "",
                asset_security: "",
                asset_location: "",
                asset_server :{
                    system: "",
                    cpu: "",
                    kernel: "",
                    memory: "",
                    disk: {
                        used: "",
                        total: ""
                    },
                    net: {
                        public_ip: "",
                        private_ip: "",
                        mac: ""
                    }
                },
                asset_databases: {
                    databases:[
                        {
                            name: "",
                            size: ""
                        }
                    ],
                    users: [
                        {
                            name: "",
                            dbs: ""
                        }
                    ],
                    port: ""
                }
            }
        };
    },
    computed:{
        disk_usage: function(){
            let disk_used = parseFloat(this.form_data.asset_server.disk.used);
            let disk_total = parseFloat(this.form_data.asset_server.disk.total);
            return (disk_used/disk_total)*100;
        },
        secur_color: function(){
            if(this.form_data.asset_security === "保护中")
                return "#67C23A";
            else if(this.form_data.asset_security === "存在风险")
                return "#F56C6C";
            return "#909399";
        },
        securClass: function(){
            return {
                "el-icon-circle-check": this.form_data.asset_security === "保护中",
                "el-icon-circle-close": this.form_data.asset_security === "存在风险",
                "el-icon-remove-outline": this.form_data.asset_security === "未受保护"
            };
        }
    },
    created(){
        let id = this.$route.query.id;
        this.$axios.get(`/api/asset_info/${id}`).then(res => {
            this.form_data = res.data;
            console.log(this.form_data.asset_tag);
        }).catch(err => console.log(err));
        
    },
    methods:{
        getMacAddress(){
            return this.form_data.asset_server.net.mac.join(", ");
        }
    }
};
</script>

<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
h1{
    padding-bottom: 17px;
    border-bottom: 1.5px solid #ccc;
}

.demo-table-expand{
    column-count: 2;
}
.demo-table-expand:nth-child(-n+2){
    border-bottom: 1px dashed #ccc;
}
i.fa{
    color:#47BEDD;
}
.ass-secur{
    width: 76px;
    height: 21px;
    text-align: center;
    font-size: 14px;
    float: right;
    
    color: white;
    padding: 12px 13px 8px;
    border-radius: 2rem;
}
.database-detail{
    padding-top: 10px;
}
.row{
    padding: 10px;
}
.content-item{
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 8px;
    margin-top: 2px;
    width: 50%;
    font:15px sans-serif;
}
.key{
    position: absolute;
    width: 100px;
    left: 0;
    color: #888;
    padding-right: 10px;
}
.node{
    padding-left: 100px;
    word-break: break-all;
}
.main{
    border-bottom: 1px dashed #c9c9c9;
}
</style>
