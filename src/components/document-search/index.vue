<template>
  <div class="document-head">
    <div class="title">
      <span v-for="(item,index) in headTitle" :key="index" @click="changeTab(item,index)" :class="{spanactive: selectIndex === index}">{{item.title}}</span>
    </div>
    <div class="search">
      <el-input placeholder="请输入内容" v-model="searchval" class="input-with-select">
        <el-button slot="append" @click="localSearch">搜索</el-button>
      </el-input>
      <!-- <div class="global-search" @click="globalSearch">
        <span>全局搜索</span>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      headTitle: [
        { title: "综合", type: "" },
        { title: "视频", type: "2" },
        { title: "图片", type: "1" },
        { title: "文档", type: "3" },
        { title: "压缩包", type: "4" }
      ],
      searchval: '',
      selectIndex: 0,
      currentType: '',
    }
  },
  methods: {
    changeTab(item, index) {
      this.selectIndex = index;
      this.currentType = item.type;
    },
    localSearch() {
      this.$emit('documentSerach', this.searchval, this.currentType, false);
    },
    globalSearch() {
      this.$emit('documentSerach', this.searchval, this.currentType, true);
    }
  }
}
</script>
<style lang="less" scoped>
@fontsize: 14px;
.document-head {
  height: 105px;
  text-align: center;
  background-color: #ffffff;
  .title {
    padding-top: 20px;
    span {
      display: inline-block;
      padding: 0 20px;
      margin-bottom: 9px;
    }
    span:last-child {
      margin-right: 143px;
    }
    .spanactive {
      color: #1696ef;
    }
  }
  .search {
    .el-input {
      width: 540px;
      .el-button {
        font-size: 16px;
        background-color: #1696ef;
        color: #ffffff;
      }
    }
    .global-search {
      display: inline;
      margin-left: 20px;
      padding: 7px;
      border: solid 1px #b5b7bf;
      border-radius: 4px;
      font-size: @fontsize;
      background-color: #53c79f;
      color: #ffffff;
    }
  }
}
</style>
