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

        <div style = "display:inline-block;" id="container" class="echarts" :style = " {width: '700px' ,height: '300px'} "></div>
        <div style = "display:inline-block;left:70px;" id = "container_2" :style = " {width: '700px' ,height: '300px'} " ></div>

        <div class="table_container">
            <el-table
            v-if="tableData.length > 0"
            :data="tableData"
            max-height="450"
            border
            :default-sort="{prop: '_id', order: '-1'}"
            style="width: 100%"
            >
                
                <el-table-column prop="srcIp" label="攻击源IP" align="center" width="200" sortable>
                
                </el-table-column>
                <el-table-column prop="srcName" label="攻击源地址" align="center" width="150"></el-table-column>
                <el-table-column prop="destIp" label="攻击目标IP" align="center" width="150"></el-table-column>
                <el-table-column prop="destName" label="攻击目标地址" align="center" width="300"></el-table-column>
                <el-table-column prop="type" label="攻击类型" align="center" ></el-table-column>
                <el-table-column prop="time" label="攻击时间" align="center" ></el-table-column>
                 <el-table-column prop="operation" align="center" label="操作" fixed="right" width="240">
                  <template slot-scope="scope">
                    <el-button type="warning" icon="edit" size="small"
                    @click="blockIp(scope.$index,scope.row)" v-text=scope.row.ip_block></el-button>
                    <el-button type="danger" icon="delete" size="small"
                    @click="cancelBlock(scope.$index,scope.row)">删除</el-button>
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

import io from 'socket.io-client'

import Highcharts from "highcharts/highstock";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsDrilldown from "highcharts/modules/drilldown";
import Highcharts3D from "highcharts/highcharts-3d";
import Highmaps from "highcharts/modules/map";
import echarts from 'echarts';
HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);
Highmaps(Highcharts);

export default {
    name:'invasionList1',
    data(){
        return{
            SA_value:[],
            SA_host_value:[],
            tableData:[], 
            alltableData:[],
            filterTableData: [],  
            button_flag: true,
            btnText: "加入黑名单",

            char_x:[],
            char_y:[],
            chart_data:[],
            predict_char_x:[],
            predict_char_y:[],
            predict_chart_data:[],
      
            attack_ip: {},
            attack_nums: [],

            form:{
                "_id": "",
                "username": "",
                request:"",
                packet_type: "",
                Time:""
            },
            centerDialogVisible: false,
            //需要给分页组件传的信息
            paginations: {
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 5, // 1页显示多少条
                page_sizes: [5,10 , 15, 20, 25], //每页显示多少条
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
      console.log("***************************\nactivated tes\n");
        this.$socket.emit("request", "request");
        this.$socket.open();
        console.log(this);
      this.sockets.listener.subscribe('data', (res) =>{
            //读取数据，将数据转化为x轴与y轴的列表
            var list_x = [];
            
            var result = res;
            //var result = res.reverse();
            if(result!=undefined){
                
                result.forEach(function(key, v) {
                    if(key){                           
                            if(v!=null){                      
                                    list_x.push(key.time);
                            }else{                                   
                                    console.log("error");                                 
                            }
                    }
                })
                
            }
            
            this.char_x = list_x;
            var list_y = [];    
            if(result!=undefined){
                
                result.forEach(function(key, v) {
                    if(key){                           
                            if(v!=null){                      
                                    list_y.push(key.value);
                            }else{                                   
                                    console.log("OK");                                 
                            }
                    }
                })   
            }
            this.char_y = list_y;
            console.log(this.char_x,"||||||||||",this.char_y);
            this.moreChart();
            
        });
        this.getAlert();

         
    },
    sockets: {
        //查看socket是否渲染成功
            connect: function () {// socket的connect事件
            console.log('socket connected from Page')
        },
        STREAM_STATUS(data) {// 后端按主题名推送的消息数据
            console.log('Page：' + data)
        },
        //客户端接收后台传输的socket事件
        message(data) {
            console.log(data);
        this.$notify({
            title: '新消息',
            message: data,
            type: 'warning',
            duration:10000
        });
        console.log("data", data);//接收的消息
        }
    },
    methods:{

        getAlert(){
            this.$axios.get('/api/ids_log/SA_event').then(res => {
            console.log("res:",res,this);   
            var result = res.data;
            var attack_ip = {};
            if(result!=undefined){              
                result.forEach(function(key, v) {
                    if(key){                                  
                            if(v!=null){
                                    if(key['srcIp'] in attack_ip){
                                      attack_ip[key['srcIp']] += 1;
                                    }else{
                                      attack_ip[key['srcIp']] = 1;
                                    }                      
                                    //key["opt"] = "加入黑名单";
                                    //console.log(key,"|||||||||||||",v); 
                            }else{                                   
                                    console.log("OK");                                 
                            }
                    }
                })
            }
            console.log("***********",attack_ip,this.tableData,this.attack_ip);
            //console.log("||||||||||",res.data);
            this.attack_ip = attack_ip;
            this.tableData = res.data;
            this.allTableData = res.data;
            this.filterTableData = res.data;
            // // 设置分页数据
            this.setPaginations();
            this.moreChart_2();
            }).catch(err => console.log(err));
            
        },        
        //删除信息函数  目前服务器未实现

       
        blockIp(index,row){
            
            console.log("_____________________________________",row,"|");
            if(row.ip_block == "加入黑名单"){
              this.$axios.put(`/api/ids_log/SA_event_block`,{params:{srcIp:row.srcIp}});
              row.ip_block = "取消黑名单";
            }else if(row.ip_block == "取消黑名单"){
              this.$axios.put(`/api/ids_log/SA_event_block_cancel`,{params:{srcIp:row.srcIp}});
              
              row.ip_block = "加入黑名单";
            }
            return 1;          
        },

        cancelBlock(index,row){
            // 删除
            this.$axios.put(`/api/ids_log/SA_event_del`,{params:{_id:row._id}});
            console.log("shanchu:",scope)
            this.$message("删除成功");
            this.getAlert();
        },

      

        getChartOption(){
            var option = {
                title: {
                    text: '攻击来源统计',
                    x:'center',
                    textAlign:'left',
                    top:'3%'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '1%',
                    right: '1%',
                    top: '15%',
                    bottom:'10%',
                    containLabel: true
                },
                backgroundColor:'#fff',
                xAxis: {
                    type: 'category',
                    data: Object.keys(this.attack_ip),
                    axisLine:{
                        lineStyle:{
                            color:'#9a9a9a'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine:{
                        lineStyle:{
                            color:'#9a9a9a'
                        }
                    }
                },
                series: [{
                    data: Object.values(this.attack_ip),
                    type: 'bar',
                    itemStyle:{
                        normal:{
                            color:'#427aff'
                        }
                    }
                }]
            };
            return option;
        },

        moreChart() {
            if (this.chart) {
                //this.chart.destroy();
            }
            // 初始化 Highcharts 图表
            var c_data = [];
            var y = this.char_y;
            Highcharts.each(this.char_x, function(xData, i){
                c_data.push([xData, y[i]])
            });

          
            
            this.chart = new Highcharts.Chart("container", {
                title: {
                    text: "网络安全态势威胁值",
                    style:{
                        color:"#000",
                        fontWeight:"bold"
                        }
                },

                yAxis: {
                    title: {
                        text: "威胁值"
                    }
                },

                xAxis:{
                    //横坐标
                    min:0,
                    max:540,
                    tickInterval:60,
                    labels:{
                        formatter:function(){
                            var arr = [];
                            arr[0]   = c_data[0][0];
                            arr[60]  = c_data[60][0];
                            arr[120] = c_data[120][0];
                            arr[180] = c_data[180][0];
                            arr[240] = c_data[240][0];
                            arr[300] = c_data[300][0];
                            arr[360] = c_data[360][0];
                            arr[420] = c_data[420][0];
                            arr[480] = c_data[480][0];
                            arr[540] = c_data[539][0];
                            return arr[this.value];
                        }
                    },

                    title:{
                        text:"Time"
                    },                    
                },

                legend: {
                    layout: "vertical",
                    align: "right",
                    verticalAlign: "middle"
                },
                
                series: [
                    {
                        name: "网络态势威胁值",
                        data: c_data
                    }
                ],

                //去掉版权标签
                credits: {
                    enabled: false
                },

                responsive: {
                    rules: [
                        {
                        condition: {
                            maxWidth: 100
                        },
                        chartOptions: {
                            legend: {
                            layout: "horizontal",
                            align: "center",
                            verticalAlign: "bottom"
                            }
                        }
                        }
                    ]
                }
            });
        },

        moreChart_2(){
                  var ele=document.getElementById('container_2');
                  var myChart = echarts.init(ele);
                  var option=this.getChartOption();
                  myChart.setOption(option);
                  window.onresize = myChart.resize;
        },
        setPaginations() {
            // 总页数属性
            this.paginations.total = this.allTableData.length;
            this.paginations.page_index = 1;
            this.paginations.page_size = 5;
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
                this.getAlert();
                return;
            }
            var stime = this.search_data.startTime;
            var etime = this.search_data.endTime;
           
            console.log("moment test");
            stime = this.time(stime);
            etime = this.time(etime);
            
            this.$axios.put('/api/ids_log/event_log_time',{params:{
                time_s:stime,
                time_e:etime
            }}).then(res => {
            console.log(res);
            this.tableData = res.data;
            this.allTableData = res.data;
            this.filterTableData = res.data;
            // // 设置分页数据
            this.setPaginations();
            }).catch(err => console.log(err));


            /*
            this.allTableData = this.filterTableData.filter(item => {
                let date = new Date(item.timestamp*1000);
                let time = date.getTime() + "";
                return time >= stime && time <= etime;
            });
            // 分页数据
            this.setPaginations(); */
        },
        //时间戳转日期
        time(date) {
        
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 <= 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate()+1 <= 10 ? '0'+(date.getDate()) : date.getDate())+' ' ;
        var h = (date.getHours()+1 <= 10 ? '0'+(date.getHours() ) : date.getHours())+ ':';
        var m = (date.getMinutes()+1 <= 10 ? '0'+(date.getMinutes() ) : date.getMinutes() )+ ':';
        var s = (date.getSeconds()+1 <= 10 ? '0'+(date.getSeconds() ) : date.getSeconds());
        return Y+M+D+h+m+s;

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



