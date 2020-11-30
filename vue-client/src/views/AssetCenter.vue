<template>
    <div class="fillcontain">
        <div style = "display:inline-block; POSITION:absolute;top:8px;width:50%;height:300px" id="container" class="echarts" ></div>
        <div style = "display:inline-block; POSITION:absolute;top:8px;width:50%;height:300px" id = "container_2"  ></div>
        
        <el-button class="addButton" :inline="true" type="primary" icon="view" @click="dialogServerVisible = true">添加资产</el-button>
        <el-dialog title="添加资产" :visible.sync="dialogServerVisible">
          <el-form :model="form">
            <el-form-item label="资产名字" label-width="120px">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="资产类型" label-width="120px">
              <el-select v-model="form.type" placeholder="请选择资产类型">
                <el-option label="服务器" value="server"></el-option>
                <el-option label="数据库" value="database"></el-option>
              </el-select>
            </el-form-item>
            
            <div v-if="form.type === 'server'">
              <el-form-item label="服务器ip" label-width="120px">
              <el-input v-model="form.ip" autocomplete="off"></el-input>
              </el-form-item>
            </div>
            <div v-else-if="form.type === 'database'">
              <el-form-item label="数据库用户名" label-width="120px">
              <el-input v-model="form.username" autocomplete="off"></el-input>
              </el-form-item>
            </div> 

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogServerVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogServerVisible = false">确 定</el-button>
          </div>
        </el-dialog>
        
        <div class="table_container">
            <el-table
            v-if="tableData.length > 0"
            :data="tableData"
            
            border
            :default-sort="{prop: 'id', order: 'descending'}"
            style="width: 100%"
            >
                <el-table-column prop="asset_id" label="资产ID" align="center" width="150"></el-table-column>
                <el-table-column label="资产名称" align="center" width="150" >
                    <template slot-scope="scope">
                    <el-button type="text" style="color:blue" title="点击查看资产详细信息" @click="get_detail(scope.row._id)">{{scope.row.asset_name}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="asset_type" label="资产类型" align="center" width="150"></el-table-column>
                <el-table-column prop="asset_location" label="区域" align="center" width="200"></el-table-column>
                <el-table-column prop="asset_tag" label="标签" align="center" width="200"></el-table-column>
                <el-table-column prop="asset_security" label="安全状况" align="center" width="150"></el-table-column>
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
import echarts from 'echarts'
export default {
    
    name:'AssetCenter',
    data(){
        return{
            dialogServerVisible : false,
            
            form: {
              name: '',
              type: '',
              date1: '',
              date2: '',
              delivery: false,
              type: [],
              resource: '',
              desc: ''
            },
            tableData:[],
            allTableData:[],
            filterTableData: [],
            opinion1:['服务器','数据库'],
            opinionData1: [],
            opinion2:['存在风险','保护中','未受保护'],
            opinionData2:[],
            // ??
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
        // ??
        user() {
          return this.$store.getters.user;
      }

    },
    created(){
        this.getAssetInfo();
        this.$nextTick(function() {
                this.drawPie1('container')
                this.drawPie2('container_2')
        })
        // this.tableData=[{
        //         asset_id: "SERVER-01",
        //         asset_name: "gdcni12",
        //         asset_type: "服务器",
        //         location: "北大深研院",
        //         label: "标签信息",
        //         security_situation: "保护中"
        // },{
        //         asset_id: "SERVER-02",
        //         asset_name: "gdcni18",
        //         asset_type: "服务器",
        //         location: "北大深研院",
        //         label: "标签信息",
        //         security_situation: "存在风险"
        //     },
        //     {
        //         asset_id: "DATABASE-S01-01",
        //         asset_name: "数据库01",
        //         asset_type: "数据库",
        //         location: "北大深研院",
        //         label: "标签信息",
        //         security_situation: "保护中"
        //     }
        //     ];
        this.filterTableData = this.tableData;
        this.allTableData = this.tableData;
        //  设置分页数据
        this.setPaginations();
    },
    methods:{
        get_count(){
          let count_servers = 0;
          let count_databases = 0
          let asset;
          console.log({msg: "out"});
          for (asset in this.tableData){
            console.log({msg: "in"});
            if(asset.asset_type === 'server')
              ++count_servers;
            else
              ++count_databases;
            console.log(asset);
          }
          return {count_servers, count_databases};
        },
        drawPie1(id){
            this.charts1 = echarts.init(document.getElementById(id))
            this.$axios.get('/api/asset_info/assetcount').then(res =>{
                // this.opinionData1=[
                //   {value:res.data.count_servers, name:'服务器'},
                //   {value:res.data.count_databases, name:'数据库'}
                // ];
              this.charts1.setOption({
              title: {
              text: '资产类型分布',
              left: 'center'
              },
              tooltip: {
              trigger: 'item',
                    
              },
              legend: {
                    orient: 'vertical',
                    x: 'left',
                    data:this.opinion1
              },
              series: [
                    {
                      name:'资产数量',
                      type:'pie',
                      radius:['50%','70%'],
                      avoidLabelOverlap: false,
                      label: {
                        show: false,
                        position: 'center'
                      },
                      emphasis: {
                        label: {
                          show: true,
                          fontSize: '30',
                          fontWeight: 'bold'
                        }
                      },
                      labelLine: {
                        normal: {
                        show: true
                        }
                      },
                      data:[
                        {value:res.data.count_servers, name:'服务器'},
                        {value:res.data.count_databases, name:'数据库'}
                      ]
                    }
              ]
            })
            });
            
        },
        drawPie2(id){
            this.charts2 = echarts.init(document.getElementById(id))
            this.$axios.get('/api/asset_info/securitycount').then(res =>{
            this.charts2.setOption({
            title: {
              text: '资产安全状态分布',
              left: 'center'
            },
            tooltip: {
            trigger: 'item',
                  
            },
            legend: {
                   orient: 'vertical',
                   x: 'left',
                   data:this.opinion2
            },
            series: [
                   {
                    name:'资产安全',
                    type:'pie',
                    radius:['50%','70%'],
                    avoidLabelOverlap: false,
                    label: {
                      show: false,
                      position: 'center'
                    },
                    emphasis: {
                      label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                      }
                    },
                    labelLine: {
                      normal: {
                        show: false
                      }
                    },
                    data:[
                  {value:res.data.count_risked, name:'存在风险'},
                  {value:res.data.count_protected, name:'保护中'},
                  {value:res.data.count_unprotected, name:'未受保护'}
                ]
                   }
                 ]
               })
            })
          },
        getAssetInfo(){
            this.$axios.get('/api/asset_info/assetinfo').then(res => {
            this.tableData = res.data;
            console.log(this.tableData);
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
        get_detail(id){
          this.$router.push({
            path: '/AssetDetail',
            query:{
              id: id
            }
          })
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
.addButton{
  margin-bottom: 10px;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>