<template>
    <div class="fillcontain">
        
        <h1><i class="fa fa-database"></i> {{formData.name}}</h1>
        <hr>
        <el-form label-position="left" >
        <div class="demo-table-expand">
            <el-form-item label="ID">
                <span>{{formData.id}}</span>
            </el-form-item>
            <el-form-item label="资产类型">
                <span>{{formData.asset_type}}</span>
            </el-form-item>
            <el-form-item label="区域">
                <span>{{formData.location}}</span>
            </el-form-item>
            <el-form-item label="标签信息">
                <span>{{formData.label}}</span>
            </el-form-item>
        </div>
        <el-divider></el-divider>
        <div class="demo-table-expand">
            <el-form-item label="私网IP">
                <span>{{formData.prinvate_ip_address}}</span>
            </el-form-item>
            <el-form-item label="公网IP">
                <span>{{formData.public_ip_address}}</span>
            </el-form-item>
            <el-form-item label="MAC地址">
                <span>{{getMacAddress(formData.mac_address)}}</span>
            </el-form-item>
        </div>
        <el-divider></el-divider>
        <div class="demo-table-expand">
            <el-form-item label="操作系统">
                <span>{{formData.os}}</span>
            </el-form-item>
            <el-form-item label="CPU">
                <span>{{formData.cpu}}</span>
            </el-form-item>
            <el-form-item label="内存大小">
                <span>{{formData.memory}}</span>
            </el-form-item>
            <el-form-item label="内核版本">
                <span>{{formData.kernel_version}}</span>
            </el-form-item>
            <el-form-item label="硬盘空间使用量">
                <span>
                {{formData.disk_usage*100}}%
                <el-progress :text-inside="true" :stroke-width="26" :percentage="formData.disk_usage*100"></el-progress>
                </span>
            </el-form-item>
        </div>
        </el-form>
    </div>
</template>

<script>
export default {
    name:"AssetDetail",
    data(){
        return{
            formData:{
                id: "",
                name: "",
                asset_type: "",
                label: "",
                prinvate_ip_address: "",
                public_ip_address: "",
                mac_adress: [],
                location: "",
                os: "",
                cpu: "",
                memory: "",
                kernel_version: "",
                disk_usage: ""
            }
        };
    },
    created(){
        this.formData={
            id: "SERVER-01",
            name: "gdcni18",
            asset_type:"服务器",
            label: "标签",
            prinvate_ip_address: "10.0.0.18",
            public_ip_address: "121.15.171.90",
            mac_adress: ["28:7b:09:cb:21:94", "28:7b:09:cb:21:96", "b4:96:91:4a:52:10", "b4:96:91:4a:52:11"],
            location: "北大深研院",
            os: "Ubuntu 16.04.6 LTS",
            cpu: "Intel(R) Xeon(R) Silver 4114 CPU @ 2.20GHz",
            memory: "131640744 kB",
            kernel_version: "Linux 4.15.0-115-generic",
            disk_usage: "0.1"
        }
    },
    methods:{
        getMacAddress(){
            return this.formData.mac_adress.join(", ");
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
.demo-table-expand{
    
    column-count: 2;
}
i.fa{
    color:#47BEDD;
}
</style>