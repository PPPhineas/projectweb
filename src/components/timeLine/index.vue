<template>
	<div class='time' @click.stop="stopBubble">
    <el-scrollbar style="height:100%">
		<div class='text-content'>
			<div class='time-line' v-infinite-scroll="loadData">
				<div v-for='(item,index) in timeLineList' :key="item.id" class='time-line-div' @click.stop="selectProj(item,index)" :class="{lineactive:index == selectIndex}">
					<p>{{item.projectTime | format}}</p>
					<p ref='circular'></p>
          <el-tooltip class="item" effect="light" :content="item.projectName" placement="top-start">
            <p :style="'text-overflow:' + value">{{item.projectName}}</p>
          </el-tooltip>
				</div>
				<div class='img-dotted' ref='dotted'></div>
			</div>
			<div style='margin-top:20px;'>
			</div>
		</div>
    </el-scrollbar>
	</div>
</template>
<script>
// import { Vue, Component, Prop} from 'vue-property-decorator';
import { getProjectlist } from "../../api/project.js";
export default {
  props: ['timeLineList', 'maxYear', 'name'],
  data () {
    return {
      selectIndex: -1,
      timeline: '',
      loading: false,
      currentPage: 1,
      pageCount: 5,
      value: 'ellipsis',
    }
  },
  created () {
    
  },
  mounted() {
    this.timeline = this.$parent;
  },
  computed: {
    noMore() {
      return this.currentPage >= this.pageCount;
    },
    disabled() {
      return this.loading || this.noMore;
    }
  },
  methods: {
    selectProj(item, index) {
      if (this.selectIndex === index) {
        this.selectIndex = -1;
        item = {};
      }else {
        this.selectIndex = index;
      }
      // console.log(item);
      this.$emit('selectProj',item);
    },
    async loadData() {
      this.loading = true;
      setTimeout(async () => {
        this.currentPage += 1;
        if (this.currentPage >= this.pageCount) {
          return;
        }
        let params = {
          projectTime: this.maxYear,
          projectName: this.name,
          nowPage:this.currentPage,
          pageSize:10,
        };
        let res = await getProjectlist(params);
        const { success, pageCount, list } = res;
        if (success) {
          if (this.currentPage <= pageCount) {
            this.timeLineList = this.timeLineList.concat(list);
          }
          this.pageCount = pageCount;
        };
        this.loading= false;
      },500);
    },
    stopBubble() {
      // 阻止冒泡触发父级事件
      console.log('不冒泡')
    }
  },
  filters: {
    format: (value) => {
      let time = new Date(value);
      return time.getMonth() +1 +'月';
    }
  }
}
</script>

<style lang="less">
.time {
  overflow-x: auto;
  height: 500px;
  .text-content {
    background-color: #fff;
    text-align: center;
    .time-line{
      position: relative;
      margin:0 auto;
      .time-line-div {
        position:relative;
        min-height:56px;
        p:nth-child(1) {
          position: absolute;
          left:0;
          width:60px;
        }
        p:nth-child(2) {
          position:absolute;
          left: 60px;
          width:8px;
          height:8px;
          top:10px;
          background:#B5B7BF;
          border-radius: 50%;
          z-index: 10
        }
        p:nth-child(3) {
          position:absolute;
          left: 64px;
          padding: 5px 0 5px 10px;
          width: 120px;
          // text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          text-align: left;
        }
      }
      .lineactive{
        p:nth-child(2) {
          background:#53c79f;
        }
        p:nth-child(3) {
          color: #1696ef;
        }
      }
      .img-dotted{
        position:absolute;
        width:2px;
        height:100%;
        top:0;
        left: 64px;
        z-index: 1;
        background:url('../../assets/img/dotted.png');
      }
    }
  }
  .el-scrollbar {
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
}
</style>
