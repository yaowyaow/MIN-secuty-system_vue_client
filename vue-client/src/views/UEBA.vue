<style>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.el-container{
  margin-top: 20px;
}
.el-table .warning-row {
  background: sandybrown;
}

.el-table .success-row {
  background: #5cb85c;
}

.el-table .error-row {
  background: orangered;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}
</style>
<template>
<div>
  <div class="el-container">
    <el-row>
      <el-col :span="21" :offset="3">
        <el-card class="ueba-card">
          <div slot="header" class="clearfix">
            <span>UEBA用户实体行为分析</span>
          </div>
          <div class="block">
            <span class="demonstration">按时间查看</span>
            &nbsp;
            <el-date-picker
                v-model="value2"
                align="right"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions1">
            </el-date-picker>
            &nbsp;
            <el-button type="primary" @click="getUEBADataByClick">查询</el-button>
          </div>
          <br/>
          <br/>
          <el-table
              :data="tableData"
              border
              :row-class-name="tableRowClassName">
            <el-table-column
                prop="username"
                label="用户名"
                width="150"
                align="center">
            </el-table-column>
            <el-table-column
                prop="ip_count"
                label="使用ip数"
                width="150"
                sortable
                align="center">
            </el-table-column>
            <el-table-column
                prop="new_ip_count"
                label="异地登录ip数"
                width="150"
                sortable
                align="center">
            </el-table-column>
            <el-table-column
                prop="mac_count"
                label="设备使用数"
                width="150"
                sortable
                align="center">
            </el-table-column>
            <el-table-column
                prop="time_count"
                label="异常登录次数"
                width="150"
                sortable
                align="center">
            </el-table-column>
            <el-table-column
                prop="url_count"
                label="异常访问次数"
                width="150"
                sortable
                align="center">
            </el-table-column>
            <el-table-column
                prop="file_count"
                label="文件操作次数"
                width="150"
                sortable
                align="center">
            </el-table-column>
            <el-table-column
                prop="abnormal_flow"
                label="异常流量使用"
                width="150"
                sortable
                align="center">
            </el-table-column>
            <el-table-column
                prop="score"
                label="行为评估得分"
                width="150"
                sortable
                align="center">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small" style="color: purple">查看用户趋势</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
        title="用户行为趋势"
        :visible.sync="dialogVisible"
        width="40%">
      <div id="myChart" :style="{width: '500px', height: '500px', margin: '0 auto'}"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  <br/>
  <br/>
  <div class="el-container">
    <el-row>
      <el-col :span="21" :offset="3">
        <el-card class="ueba-card" style="width: 1350px">
          <div slot="header" class="clearfix">
            <span>用户行为数据统计</span>
          </div>
          <el-carousel trigger="click" height="500px" :autoplay="false" @change="draw">
            <el-carousel-item v-for="item in 4" :key="item">
              <div :id="'mychart' + item" :style="{width: '1000px', height: '500px', margin: '0 auto'}"></div>
            </el-carousel-item>
          </el-carousel>
        </el-card>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<script>
const dayjs = require('dayjs');

export default {
name: "ueba",
  data(){
    return {
      tableData:[

      ],
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      value2: '',
      scores:[],
      dialogVisible: false,
      loginTime:[],
      loginP:[],
      flowTime: [],
      flowUsage: [],
      userNames: [],
      ipCounts: []
    }
  },
  methods:{
    getUEBADataByDate(date){
      this.$axios.put('/api/ids_log/ueba_data',{params:{
          time:date,
        }}).then(res => {
        console.log(res);
        this.tableData = res.data;
      }).catch(err => console.log(err));
    },
    async getLoginTime(){
      let res = await this.$axios.get('/api/ids_log/login_time');
      this.loginTime = res.data[0].time
      console.log(this.loginTime)
      this.loginP = res.data[0].data
    },
    async getFlowUsage(){
      let res = await this.$axios.get('/api/ids_log/flow_usage');
      let flow_dict = res.data[0];
      let flow_arr = [];
      let time_arr = [];
      for(let i = 0; i < 24; i++){
        time_arr.push(i + '');
        flow_arr.push(flow_dict[i]);
      }
      this.flowTime = time_arr;
      this.flowUsage = flow_arr;
    },
    async getUEBADataByName(name){
      let res = await this.$axios.put('/api/ids_log/ueba_user_data',{params:{
          username:name,
        }});
      this.scores = res.data;
      console.log(res);
    },
    tableRowClassName({row, rowIndex}) {
      if (row['score'] >= 85) {
        return 'success-row';
      } else if (row['score'] >= 60 && row['score'] < 85) {
        return 'warning-row';
      } else
        return 'error-row';
    },
    getUEBADataByClick(){
      let date;
      if(this.value2 === '')
        date = '2020-08-13';
      else
        date = dayjs(this.value2).format('YYYY-MM-DD');
      this.getUEBADataByDate(date)
    },
    async handleClick(row){
      await this.getUEBADataByName(row['username']);
      this.renderModal();
    },
    renderModal(){
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.drawLine();
      });
    },
    drawLine(){
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      console.log(myChart);
      // 绘制图表
      myChart.setOption({
        tooltip: {},
        xAxis: {
          type: 'category',
          data: ['08-07','08-08','08-09','08-10','08-11','08-12','08-13']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: 'UEBA得分',
          type: 'line',
          data: this.scores
        }]
      });
    },
    drawLGChart(){
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('mychart1'))
      console.log(this.loginTime);
      // 绘制图表
      myChart.setOption({
        title: {
          text: '0807-0813 用户登录时间分布'
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: this.loginTime
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          type: 'line',
          data: this.loginP
        }]
      });
    },
    drawFLChart(){
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('mychart2'));
      // 绘制图表
      myChart.setOption({
        title: {
          text: '0807-0813 用户流量使用分布'
        },
        xAxis: {
          type: 'category',
          data: this.flowTime
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '流量使用',
          data: this.flowUsage,
          type: 'line',
          smooth: true
        }]
      });
    },
    drawIPChart(){
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('mychart3'));
      let userData = this.tableData;
      let names = [];
      let ips = [];
      for(let i in userData){
        console.log(i);
        names.push(userData[i]['username']);
        ips.push(userData[i]['ip_count'] + 1);
      }
      // 绘制图表
      myChart.setOption({
        title: {
          text: '系统用户IP使用情况'
        },
        xAxis: {
          type: 'category',
          data: names
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: ips,
          type: 'bar'
        }]
      });
    },
    async draw(index){
      console.log(index);
      if(index === 1){
        await this.getFlowUsage();
        this.$nextTick(() => {
          this.drawFLChart();
        });
      }else if(index === 0){
        await this.getLoginTime();
        this.$nextTick(() => {
          this.drawLGChart();
        });
      }else if(index === 2){
        this.$nextTick(() => {
          this.drawIPChart();
        });
      }
    }
  },
  mounted() {
    this.getUEBADataByDate("2020-08-13")
  }
}
</script>

