<template>
    <div>
    <div id="visualization">
      <div class="vis-network" >
      </div> 
    </div>
    </div>
</template>

<script>
//按需引入
import { DataSet, Network } from 'vis/index-network';

export default {
  name: 'VisNetwork',
  data () {
    return {
      //msg:String,
      nodes_data:[],
      root: null
    }
  },
  mounted(){
    
    //this.create();
    
  },
  created(){
    
    this.$axios.get('/api/nodes_msg/nodes').then(res=>{
      this.nodes_data=res.data;
      console.log(this.nodes_data);
      this.$axios.get('/api/nodes_msg/nodes_connection').then(res=>{
        this.root=res.data;
        console.log(this.root);
        this.createNetwork()
      });
    })
  //   this.$axios.all([
  //   this.$axios.get('/api/nodes_msg/nodes'),
  //   this.$axios.get('/api/nodes_msg/nodes_connection')
  // ])
  // .then(this.$axios.spread(function (nodesResp, rootResp) {
  //   // 上面两个请求都完成后，才执行这个回调方法
  //   console.log('nodes', nodesResp.data);
  //   console.log('root', rootResp.data);
  //   this.nodes_data = nodesResp.data;
  //   this.root = rootResp.data
  //   console.log(this.nodes_data);  // this判为null，无用
  // }));
  },
  methods: {
    handleClick(params){
      if(params.nodes[0] === 'IP 公网')
        return;
      localStorage.setItem('ip', params.nodes[0]);
      this.$router.push({
              path: '/index2',
              // query:{
              //   id: params.nodes[0]
              // }
      })
      // this.$router.push({
      //         name: 'invasionMapOf',
      //         params:{
      //           id: params.nodes[0]
      //         }
      // })
    }
  ,
    createNetwork () {
      var nodes = new DataSet([]);
      var edges = new DataSet([]);
      nodes.add({
            id: 'IP 公网', 
            label: 'IP 公网',
            level:0,            
            image: require("../assets/img/internet.png"),
            shape:"image"
      })
      console.log(this.nodes_data);
      for(var i=0; i<this.nodes_data.length; ++i){
        if(this.nodes_data[i] === this.root["root"]){
          nodes.add({
            id: this.nodes_data[i], 
            label: this.nodes_data[i]+'\n'+'态势感知系统',
            level:1,
            image: require("../assets/img/computer.png"),
            shape:"image",
            title: "test"
          });
        }
        else{
          nodes.add({
            id: this.nodes_data[i], 
            label: this.nodes_data[i]+'\n'+'态势感知系统',
            level:2,
            image: require("../assets/img/computer.png"),
            shape:"image",
            title: "test"
          });
        }
      }
      // for(var i=1; i<this.nodes_data.length; ++i){
      //       nodes.add({
      //         id: this.nodes_data[i], 
      //         label: this.nodes_data[i]+'\n'+'态势感知系统',
      //         level:2,
      //         font:{size:20},
      //         size:50,
      //         image: require("../assets/img/computer.png"),
      //         shape:"image",
      //         title: "点击查看详细信息"
      //       });
      //  }
       edges.add({
         from: 'IP 公网', 
         to: this.root["root"]
       })
       for(var i=0; i<this.nodes_data.length; ++i){
         if(this.nodes_data[i] === this.root["root"])
            continue;
         edges.add({
            from: this.root["root"], 
            to: this.nodes_data[i]
          }); 
       }
      //  edges.add({
      //    from: this.root["root"], 
      //    to: '192.168.1.16'
      //  })
      //  for(var i=2; i<nodes.length; ++i){
      //    edges.add({
      //      from: nodes[1].id,
      //      to: nodes[i].id
      //    })
      //  }
      // create an array with nodes
//       var nodes = new DataSet([
//          {id: 'IP 公网', 
//            label: 'IP 公网',
//            level:0,
//            font:{size:20},
//            size:50,
//            image: require("../assets/img/internet.png"),
//            shape:"image",
//            title: "点击查看详细信息"
//            },
//           {id: 'gdcni18', 
//            label: 'gdcni18'+'\n'+'态势感知系统',
//            level:1,
//            font:{size:20},
//            size:50,
//            image: require("../assets/img/computer.png"),
//            shape:"image",
//            title: "点击查看详细信息"
//            },
//           {id: 'gdcni12', 
//            label: 'gdcni12'+'\n'+'态势感知系统',
//            level:2,
//            font:{size:20},
//            size:50,
//            image: require("../assets/img/computer.png"),
//            shape:"image",
//            title: "点击查看详细信息"
//           },
//           {id: 'gdcni16', 
//            label: 'gdcni16'+'\n'+'态势感知系统',
//            level:2,
//            font:{size:20},
//            size:50,
//            image: require("../assets/img/computer.png"),
//            shape:"image",
//            title: "点击查看详细信息"
//           }
//       ]);
      
      // create an array with edges
//       var edges = new DataSet([
//           {from: 'IP 公网', to: 'gdcni18'},
//           {from: 'gdcni18', to: 'gdcni12'},
//           {from: 'gdcni18', to: 'gdcni16'}
//       ]);

      // create a network
      var container = document.querySelector('.vis-network');

      // provide the data in the vis format
      var data = {
          nodes: nodes,
          edges: edges
      };
      var options = {
          nodes: {
            borderWidth: 3,
            font:{size:18},
            size:50,
         },
         edges: {
          color: 'lightgray'
        },
          physics:{
            enabled:true,
          },
          layout:{
            hierarchical:{
              direction:"UD",
            },
          },
          interaction: { hover: true, tooltipDelay: 300 },
          manipulation: {
            enabled: true,
        },
      };
      
      // initialize your network!
      this.network = new Network(container, data, options);
      // this.network.setSize('1200','600');   //设置画布的大小（canvas的宽高）
      //this.network.enableEditMode()
      this.network.on("selectNode", this.handleClick);
      // this.network.on("hoverNode", function (params) {
      //   console.log("hoverNode Event:", params);
      // });
      // this.network.on("blurNode", function (params) {
      //   console.log("blurNode Event:", params);
      // });
    }
  }
}
</script>


<style scoped>
.vis-network{
    position: fixed;
    overflow: visible;
    touch-action: pan-y;
    user-select: none;
    -webkit-user-drag: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    width: 70%;
    height: 100%;
}

</style>
 
