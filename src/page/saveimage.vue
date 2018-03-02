<template>
  <div class="saveimage">
    <ul class='imgeList'>
      <li v-for='(item,index) in imageList' :key='index' @click='saveimageFn(item,index)' :class='{active:index==activeIndex}'>
        <img :src="item.images"  alt="" style='height: 110px;'>
      </li>
    </ul>
  </div>
</template>

<script>
import { saveimage } from "@/api/getData";
export default {
  name: 'saveimage',
  data () {
    return {
      msg:'',
      imageNum:24,
      imageList:[],
      activeIndex:1
    }
  },
  created(){
    this.imgeList()
    let images = sessionStorage.getItem("image")
    if(images){
      // images ='heads_23'
      this.activeIndex = images.split('_')[1] -1
      // console.log(this.activeIndex)
    }
  },
  methods:{
    async saveimageFn(data,index){
      this.$confirm('确定更改头像?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try{
        let results  = await saveimage({
          // "userId":"U000000",
          "userId":sessionStorage.getItem("userID"),
          "image":data.url
        })
        if(results){
          this.activeIndex=index
          sessionStorage.setItem("image", results.image)
          this.$store.commit('coustomerImage',results.image)
          this.$message({
            type: 'success',
            message: '更改成功!'
          })
        }
        

        }catch(er){
        // this.$message({
        //   type: 'success',
        //   message: '更改失败!'
        // })

        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消更改'
        });
      }); 
    },
    imgeList(){
      for (var i = 0; i < this.imageNum; i++) {
        this.imageList.push({
          images:require('../assets/img/heads/heads_'+(i+1)+'.png'),
          url:'heads_'+(i+1)
        })
      };
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.saveimage{
  padding:20px;
  .imgeList{
    overflow: hidden;
    li{
      float: left;
      cursor:pointer;
      padding:5px;
      img{
        border: 1px solid #ccc;
      }
    }
    li.active img{
      background: #ccc;
    }
  }

}
</style>
