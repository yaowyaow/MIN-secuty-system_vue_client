<template>
    <div id="visualization">
      <div class="vis-network" >
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
    create () {
      // create an array with nodes
      var nodes = new DataSet([
          {id: 1, 
           label: 'IP 公网',
           level:0,
           font:{size:20},
           size:200,
          
           shape:"circle"
           },
          {id: 2, 
           label: 'gdcni18'+'\n'+'态势感知系统',
           level:1,
           font:{size:20},
           size:50,
           
           shape:"circle"},
          {id: 3, 
           label: 'gdcni12'+'\n'+'态势感知系统',
           level:2,
           font:{size:20},
           size:50,
           shape:"circle",
          },
          {id: 4, 
           label: 'gdcni16'+'\n'+'态势感知系统',
           level:2,
           font:{size:20},
           size:50,
           shape:"circle",
          }
      ]);

      // create an array with edges
      var edges = new DataSet([
          {from: 1, to: 2},
          {from: 2, to: 3},
          {from: 2, to: 4}
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
      };
      
      // initialize your network!
      this.network = new Network(container, data, options);
      this.network.setSize('1200','600');   //设置画布的大小（canvas的宽高）
      this.network.enableEditMode()
    }
  }
}
</script>


<style scoped>
.vis-network{
    position: fixed;
    overflow: hidden;
    touch-action: pan-y;
    user-select: none;
    -webkit-user-drag: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    width: 100%;
    height: 100%;
}

</style>
 
