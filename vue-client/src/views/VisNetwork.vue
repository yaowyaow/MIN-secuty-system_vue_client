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
      network: null
    }
  },
  mounted(){
    this.create();
  },
  methods: {
  handleClick(params){
    this.$router.push({
            path: '/index2',
            query:{
              id: params.nodes[0]
            }
          })
  }
  ,
    create () {
      // create an array with nodes
      var nodes = new DataSet([
         {id: 'IP 公网', 
           label: 'IP 公网',
           level:0,
           font:{size:20},
           size:50,
           image: require("../assets/img/internet.png"),
           shape:"image",
           title: "点击查看详细信息"
           },
          {id: 'gdcni18', 
           label: 'gdcni18'+'\n'+'态势感知系统',
           level:1,
           font:{size:20},
           size:50,
           image: require("../assets/img/computer.png"),
           shape:"image",
           title: "点击查看详细信息"
           },
          {id: 'gdcni12', 
           label: 'gdcni12'+'\n'+'态势感知系统',
           level:2,
           font:{size:20},
           size:50,
           image: require("../assets/img/computer.png"),
           shape:"image",
           title: "点击查看详细信息"
          },
          {id: 'gdcni16', 
           label: 'gdcni16'+'\n'+'态势感知系统',
           level:2,
           font:{size:20},
           size:50,
           image: require("../assets/img/computer.png"),
           shape:"image",
           title: "点击查看详细信息"
          }
      ]);
      
      // create an array with edges
      var edges = new DataSet([
          {from: 'IP 公网', to: 'gdcni18'},
          {from: 'gdcni18', to: 'gdcni12'},
          {from: 'gdcni18', to: 'gdcni16'}
      ]);

      // create a network
      var container = document.querySelector('#visualization');

      // provide the data in the vis format
      var data = {
          nodes: nodes,
          edges: edges
      };
      var options = {
          nodes: {
          borderWidth: 3
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
          interaction: { hover: true, tooltipDelay: 300 }
      };
      
      // initialize your network!
      this.network = new Network(container, data, options);
      this.network.setSize('1200','600');   //设置画布的大小（canvas的宽高）
      this.network.enableEditMode()
      this.network.on("selectNode", this.handleClick);
      this.network.on("hoverNode", function (params) {
        console.log("hoverNode Event:", params);
      });
      this.network.on("blurNode", function (params) {
        console.log("blurNode Event:", params);
      });
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
    width: 100%;
    height: 100%;
}

</style>
 
