<template>
  <div class="left-search">
    <div class="search">
      <el-input placeholder="搜索项目名称" v-model="searchVlue"></el-input>
      <img src="img/icon-搜索.png" alt @click="search2" />
    </div>
    <el-scrollbar style="height:100%">
      <div class="menu-scrollbar">
        <el-menu
          :default-active="activeIndex"
          :default-openeds="opendes"
          class="el-menu-vertical"
          :unique-opened="true">
          <!--  @select="handleSelect" -->
          <div v-for="(item,index) in spaceYear" :key="index">
            <el-submenu :index="index + ''" @click.native="queryProj((maxYear - index),index)">
              <template slot="title">
                <span>{{maxYear - index}}</span>
              </template>

              <TimeLine
                :maxYear="maxYear"
                :name="searchVlue"
                :timeLineList="item.children"
                @selectProj="selectProj"
              />
            </el-submenu>
          </div>
        </el-menu>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
// import { Vue, Component, Prop } from "vue-property-decorator";
import TimeLine from "@/components/timeLine";
import { getYears, getProjectlist } from "../../api/project.js";
export default{
  data () {
    return {
      timeLineList: [],
      searchVlue: '',
      activeIndex: '0',
      opendes: ['0'],
      maxYear: 0,
      spaceYear: [],
      flag2: false,
    }
  },
  components: {
    TimeLine
  },
  created () {
    this.initData();
  },
  methods: {
    async initData() {
      let res = await getYears();
      this.maxYear = parseInt(res.body.maxYear);
      let numlen =
        parseInt(res.body.maxYear) - parseInt(res.body.minYear) + 1;
      for (let i = 0; i < numlen; i++) {
        let temp = {};
        this.spaceYear.push(temp);
      }
      console.log(this.spaceYear)
      let paramslist = {
        projectTime: this.maxYear,
        projectName: this.searchVlue,
        nowPage: 1,
        pageSize: 10,
      };
      let reslist = await getProjectlist(paramslist);
      const { success, body } = reslist;
      // console.log(body.records)
      if (success) {
        // debugger
        this.$set(this.spaceYear[0], "children", body.records);
      }
    },
    async search2() {
      // 点击搜索
      this.spaceYear = [];
      let  params, paramslist;
      params = {
        projectName: this.searchVlue,
      };
      let res = await getYears(params);
      this.spaceYear = [];
      this.maxYear = parseInt(res.maxDate);
      let numlen =
        parseInt(res.maxDate) - parseInt(res.minDate) + 1;
      for (let i = 0; i < numlen; i++) {
        let temp = {};
        this.spaceYear.push(temp);
      }

      // 请求接口搜索数据
      paramslist = {
        // projectTime: this.maxYear,
        projectName: this.searchVlue,
        nowPage: 1,
        pageSize: 10,
      };
      let reslist = await getProjectlist(paramslist);
      const { isSuccess, list } = reslist;
      if (isSuccess) {
        this.$set(this.spaceYear[0], "children", list);
      }
      console.log(list[0].id)
      // debugger
      this.flag2 = this.searchVlue ? true : false;
      if(this.flag2 === false) {
        console.log('不提交')
      } else {
        this.$emit("currentProj", list[0]);
      }
    },
    async queryProj(item, index) {
      let params = {
        projectTime: item,
        projectName: this.searchVlue,
        nowPage: 1,
        pageSize: 10,
      };
      let res = await getProjectlist(params);
      const { success, body } = res;
      if (success) {
        this.$set(this.spaceYear[index], "children", body.records);
      }

    },
    selectProj(item) {
      // console.log(this.flag2)
      // if(this.flag2) {
      //   // 当前有搜索内容时flag2就为true，就不需要提交currentProj，请求initData
      //   console.log('1111')
      // } else {
      //   // 没有搜索内容 刚进来初始化需要调用此函数
      //   this.$emit("currentProj", item);
      // }
      this.$emit("currentProj", item);
    }
  }
}

// export default class LeftSearch extends Vue {
//   private timeLineList: any = [];
//   private searchVlue: string = "";
//   private activeIndex: string = "0";
//   private opendes: any[] = ['0'];
//   private maxYear: number = 0;
//   private spaceYear: any[] = [];
//   private flag2: boolean = false;
//   private handleSelect() {}
//   private created(): void {
//     if(this.$route.query.flag) {
//       this.search();
//     } else {
//       this.initData();
//     }
//   }
//   private async initData(): Promise<any> {
//     let params = {
//       name: "",
//       type: 1
//     };
//     let res = await getYears(params);
//     this.maxYear = parseInt((res as any).maxDate);
//     let numlen =
//       parseInt((res as any).maxDate) - parseInt((res as any).minDate) + 1;
//     for (let i = 0; i < numlen; i++) {
//       let temp = {};
//       this.spaceYear.push(temp);
//     }
//     let paramslist = {
//       startTime: this.maxYear,
//       name: this.searchVlue,
//       nowPage: 1,
//       pageSize: 10,
//       searchType: 1
//     };
//     let reslist = await projectlist(paramslist);
//     const { isSuccess, list } = reslist as any;
//     if (isSuccess) {
//       // debugger
//       this.$set((this as any).spaceYear[0], "children", list);
//     }
//     console.log(this.spaceYear)
//   };

//   private async search(): Promise<any> {
//     (this as any).spaceYear.children = [];
//     // 页面跳转过来时进行初始化数据，通过search方法来
//     let  params, paramslist;
//     // debugger
//     if(this.$route.query.flag) {
//       params = {
//         name: JSON.parse((sessionStorage as any).getItem('projDetail')).name,
//         type: 0
//       };
//     } else {
//       params = {
//         name: this.searchVlue,
//         type: 1
//       };
//     }
//     let res = await getYears(params);
//     this.spaceYear = [];
//     this.maxYear = parseInt((res as any).maxDate);
//     let numlen =
//       parseInt((res as any).maxDate) - parseInt((res as any).minDate) + 1;
//     for (let i = 0; i < numlen; i++) {
//       let temp = {};
//       this.spaceYear.push(temp);
//     }

//     // 请求接口搜索数据
//     if(this.$route.query.flag) {
//       paramslist = {
//         startTime: this.maxYear,
//         name: JSON.parse((sessionStorage as any).getItem('projDetail')).name,
//         nowPage: 1,
//         pageSize: 10,
//         searchType: 0
//       };
//     } else {
//       paramslist = {
//         startTime: this.maxYear,
//         name: this.searchVlue,
//         nowPage: 1,
//         pageSize: 10,
//         searchType: 1
//       };
//     }
//     let reslist = await projectlist(paramslist);
//     const { isSuccess, list } = reslist as any;
//     if (isSuccess) {
//       this.$set((this as any).spaceYear[0], "children", list);
//     }
//     console.log(this.spaceYear)
//   };

//   private async search2() {
//     // 点击搜索
//     this.spaceYear = [];
//     let  params, paramslist;
//     // debugger
//     if(this.$route.query.flag) {
//       params = {
//         name: JSON.parse((sessionStorage as any).getItem('projDetail')).name,
//         type: 0
//       };
//     } else {
//       params = {
//         name: this.searchVlue,
//         type: 1 // 年份模糊查询  1是模糊 0是精确
//       };
//     }
//     let res = await getYears(params);
//     this.spaceYear = [];
//     this.maxYear = parseInt((res as any).maxDate);
//     let numlen =
//       parseInt((res as any).maxDate) - parseInt((res as any).minDate) + 1;
//     for (let i = 0; i < numlen; i++) {
//       let temp = {};
//       this.spaceYear.push(temp);
//     }

//     // 请求接口搜索数据
//     paramslist = {
//       startTime: this.maxYear,
//       name: this.searchVlue,
//       nowPage: 1,
//       pageSize: 10,
//       searchType: 1
//     };
//     let reslist = await projectlist(paramslist);
//     const { isSuccess, list } = reslist as any;
//     if (isSuccess) {
//       this.$set((this as any).spaceYear[0], "children", list);
//     }
//     console.log(list[0].id)
//     // debugger
//     this.flag2 = this.searchVlue ? true : false;
//     if(this.flag2 === false) {
//       console.log('不提交')
//     } else {
//       this.$emit("currentProj", list[0]);
//     }
//   };

//   private async queryProj(item: number, index: number): Promise<any> {
//     let params = {
//       startTime: item,
//       name: this.searchVlue,
//       nowPage: 1,
//       pageSize: 10,
//       searchType: 0
//     };
//     let res = await projectlist(params);
//     const { isSuccess, list } = res as any;
//     if (isSuccess) {
//       this.$set((this as any).spaceYear[index], "children", list);
//     }

//   }
//   private selectProj(item: any) {
//     console.log(this.flag2)
//     if(this.flag2) {
//       // 当前有搜索内容时flag2就为true，就不需要提交currentProj，请求initData
//       console.log('1111')
//     } else {
//       // 没有搜索内容 刚进来初始化需要调用此函数
//       this.$emit("currentProj", item);
//     }

//   }
// }
</script>
<style lang="less" >
.left-search {
  max-width: 259px;
  border-right: solid 1px #e4e4e4;
  background-color: #ffffff;
  height: 700px;
  .search {
    padding: 0 16px;
    margin-top: 24px;
    position: relative;
    img {
      position: absolute;
      right: 25px;
      top: 10px;
    }
  }
  .el-menu-vertical {
    margin-top: 16px;
    min-height: 40rem;
    .el-submenu {
      margin: 0 30px;
      background-color: #b5b7bf;
      margin-bottom: 20px;
      border-radius: 3px;
      .el-submenu__title {
        height: 40px;
        line-height: 40px;
        text-align: center;
        .el-submenu__icon-arrow {
          display: none;
        }
      }
    }
  }
}
</style>
