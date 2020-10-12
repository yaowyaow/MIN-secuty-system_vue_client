<template>
    <div class="fillcontain">
        <div>
            <el-form :inline="true" ref="add_data" >
                <el-form-item label="根据时间筛选:">
                    <el-date-picker v-model="search_data.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>--
                    <el-date-picker v-model="search_data.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" icon="search" @click="onScreeoutMoney()">筛选</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
            v-if="tableData.length > 0"
            :data="tableData"
            max-height="450"
            border
            :default-sort="{prop: 'id', order: 'descending'}"
            style="width: 100%"
            >
                <el-table-column prop="time" label="监测时间" align="center" width="200" sortable>
                <template slot-scope="scope">
                    <el-icon name="time"></el-icon>
                    <span style="margin-left: 10px">{{ time(scope.row.time)}}</span>
                </template>
                </el-table-column>
                <el-table-column prop="Routing_IP_Address" label="IP地址" align="center" width="150"></el-table-column>
                <el-table-column prop="Routing_IP_Netmask" label="网络掩码" align="center" width="150"></el-table-column>
                <el-table-column prop="Routing_NIC_Name" label="网卡名称" align="center" width="100"></el-table-column>
                <el-table-column prop="Routing_NIC_MAC_Address" label="网卡MAC地址" align="center" width="170"></el-table-column>
                <el-table-column prop="Routing_Gateway" label="网关" align="center" width="150"></el-table-column>
                <el-table-column prop="Cpu_Utilization" label="CPU利用率" align="center" width="100">
                <template slot-scope="scope">
                     <span style="margin-left: 10px">{{ (scope.row.Cpu_Utilization)+'%'}}</span>
                </template>
                </el-table-column>
                <el-table-column prop="Disk_Utilization" label="磁盘利用率" align="center" width="100">
                <template slot-scope="scope">
                     <span style="margin-left: 10px">{{ (scope.row.Disk_Utilization).toFixed(1)+'%'}}</span>
                </template>
                </el-table-column>
                <el-table-column prop="Memory_Utilization" label="内存利用率" align="center" width="100">
                <template slot-scope="scope">
                     <span style="margin-left: 10px">{{ (scope.row.Memory_Utilization).toFixed(1)+'%'}}</span>
                </template>
                </el-table-column>
                <el-table-column prop="Boot_Time" label="开机时间" align="center" width="200">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ time(scope.row.Boot_Time)}}</span>
                </template>
                </el-table-column>
                <el-table-column prop="Run_Time" label="运行时间" align="center" width="170">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ SecondToDate(scope.row.Run_Time)}}</span>
                </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            
        </div>
        <div class="table_container">
            <el-table
            v-if="tableData.length > 0"
            :data="tableData"
            max-height="450"
            border
            :default-sort="{prop: 'id', order: 'descending'}"
            style="width: 100%"
            >
                <el-table-column prop="name" label="端口名称" align="center" width="150"></el-table-column>
                <el-table-column prop="eth_status" label="端口状态" align="center" width="150"></el-table-column>
                <el-table-column prop="bytes_sent" label="已发字节数" align="center" width="200">
                <template slot-scope="scope">
                     <span style="margin-left: 10px">{{ (scope.row.bytes_sent).toFixed(0)}}</span>
                </template>
                </el-table-column>
                <el-table-column prop="bytes_recv" label="已收字节数" align="center" width="200">
                <template slot-scope="scope">
                     <span style="margin-left: 10px">{{ (scope.row.bytes_recv).toFixed(0)}}</span>
                </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-row>
                <el-col :span="24">
                <div class="pagination">
                    <el-pagination
                    v-if="paginations.total > 0"
                    :page-sizes="paginations.page_sizes"
                    :page-size="paginations.page_size"
                    :layout="paginations.layout"
                    :total="paginations.total"
                    :current-page.sync="paginations.page_index"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    ></el-pagination>
                </div>
                </el-col>
            </el-row>
        </div>
    </div>

</template>
<script>

export default {
    name:'HostInfo',
    data(){
        return{
            tableData:[],
            alltableData:[],
            filterTableData: [],
            form:{
                time:"",
                Routing_NIC_Name: "",
                Run_Time: "",
                Disk_Utilization: "",
                Routing_NIC_MAC_Address: "",
                Cpu_Utilization: "",
                Routing_Gateway: "",
                Routing_IP_Netmask: "",
                Memory_Utilization: "",
                Routing_IP_Address: "",
                name:"",
                eth_status:"",
                bytes_sent:"",
                bytes_recv:"",
            },
            centerDialogVisible: false,
            //需要给分页组件传的信息
            paginations: {
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 10, // 1页显示多少条
                page_sizes: [10 , 15, 20, 25], //每页显示多少条
                layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
            },
            //筛选
            search_data: {
                startTime: "",
                endTime: ""
            }
        };
    },
    computed:{
        user() {
          return this.$store.getters.user;
    }
    },
    created(){
        this.getHostInfo();
        this.getEthInfo();
    },
    methods:{
        getHostInfo(){
            this.$axios.get('/api/host_info/hostinfo').then(res => {
            this.tableData = res.data;
            this.allTableData = res.data;
            this.filterTableData = res.data;
            // // 设置分页数据
            this.setPaginations();
            }).catch(err => console.log(err));
        },
        getEthInfo(){
            this.$axios.get('/api/eth_info/ethinfo').then(res => {
            this.tableData = res.data;
            this.allTableData = res.data;
            this.filterTableData = res.data;
              // // 设置分页数据
            this.setPaginations();
            }).catch(err => console.log(err));
        },
        setPaginations() {
            // 总页数属性
            this.paginations.total = this.allTableData.length;
            this.paginations.page_index = 1;
            this.paginations.page_size = 10;
            // 设置默认分页数据
            this.tableData = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        handleSizeChange(page_size) {
            // 切换size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.tableData = this.allTableData.filter((item, index) => {
                return index < page_size;
            });
        },
        //
        handleCurrentChange(page) {
            // 获取当前页
            let sortnum = this.paginations.page_size * (page - 1);
            // 数据
            let table = this.allTableData.filter((item, index) => {
                return index >= sortnum;
            });
            // 设置默认分页数据
            this.tableData = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
                // 筛选
        onScreeoutMoney() {
            // 筛选
            if (!this.search_data.startTime || !this.search_data.endTime) {
                this.$message({
                    type: "warning",
                    message: "请选择时间区间"
                });
                this.getEthInfo();
                this.getHostInfo();
                return;
            }
            const stime = this.search_data.startTime.getTime();
            const etime = this.search_data.endTime.getTime();
            this.allTableData = this.filterTableData.filter(item => {
                let date = new Date(item.timestamp*1000);
                let time = date.getTime();
                return time >= stime && time <= etime;
            });
            // 分页数据
            this.setPaginations();
        },
        //时间戳转日期
        time(timestamp) {
        var  date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 <= 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate()+1 <= 10 ? '0'+(date.getDate()) : date.getDate())+' ' ;
        var h = (date.getHours()+1 <= 10 ? '0'+(date.getHours() ) : date.getHours())+ ':';
        var m = (date.getMinutes()+1 <= 10 ? '0'+(date.getMinutes() ) : date.getMinutes() )+ ':';
        var s = (date.getSeconds()+1 <= 10 ? '0'+(date.getSeconds() ) : date.getSeconds());
        return Y+M+D+h+m+s;
        },
        SecondToDate(msd) {
            var time =msd
            if (null != time && "" != time) {
                if (time > 60 && time < 60 * 60) {
                    time = parseInt(time / 60.0) + "分钟" + parseInt((parseFloat(time / 60.0) -
                        parseInt(time / 60.0)) * 60) + "秒";
                }
                else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                    time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
                        parseInt(time / 3600.0)) * 60) + "分钟" +
                        parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
                } else if (time >= 60 * 60 * 24) {
                    time = parseInt(time / 3600.0/24) + "天" +parseInt((parseFloat(time / 3600.0/24)-
                        parseInt(time / 3600.0/24))*24) + "小时" + parseInt((parseFloat(time / 3600.0) -
                        parseInt(time / 3600.0)) * 60) + "分钟" +
                        parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
                }
                else {
                    time = parseInt(time) + "秒";
                }
            }
            return time;
        }
    },
};
</script>

<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>