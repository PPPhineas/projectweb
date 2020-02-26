<template>
  <div class="pro-risk-container">
    <DataFilter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      :list-type-info="listTypeInfo"
      @handleClick="handleClick"
      @handleEvent="handleEvent">
    </DataFilter>

    <div class="tableTitle">
      <div>项目风险信息列表 ( 共 {{0}} 条数据 )</div>
      <div class="btn btn-add" @click="toAdd">
        <span></span>
        <span>新增</span>
      </div>
      <div class="btn btn-del" @click="toDel">
        <span></span>
        <span>删除</span>
      </div>
    </div>

    <DataTable
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :data.sync="tableInfo.data"
      :api="getProRiskList"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      :checkBox="true"
      @handleClick="handleClick"
      @handleEvent="handleEvent">
      <!-- 自定义插槽状态按钮 -->
      <template v-slot:bt-edit="scope">
        <div class="btn-edit" v-waves @click="handleClick(scope.data.item.event, scope.data.row)"></div>
      </template>
      <template v-slot:bt-delete="scope">
        <div class="btn-trash" v-waves @click="handleClick(scope.data.item.event, scope.data.row)"></div>
      </template>
    </DataTable>
  </div>
</template>

<script>
import qs from 'qs'
import DataFilter from "@/components/DataFilter";
import DataTable from "@/components/DataTable";
import { getProRiskList, delProRiskInfo } from "@/api/proRisk.js";
export default {
  data () {
    return {
      getProRiskList,
      listTypeInfo: {
        flagList: [
          {key: '新建', value: 0},
          {key: '处理中', value: 1},
          {key: '关闭', value: 2}
        ],
        degreeList: [
          {key: '轻度', value: 0},
          {key: '中等', value: 1},
          {key: '严重', value: 2}
        ]
      },
      filterInfo: {
        query: {
          title: "",
          type: "",
          flag: ""
        },
        list: [
          { type: "input", label: "项目编号:", value: "projectNumber" },
          {
            type: "button",
            name: "查询",
            btType: "primary",
            event: "search",
            show: true
          }
        ],
      },
      tableInfo: {
        refresh: 1,
        data: [],
        fieldList: [
          {label: '风险编号', value: 'riskNumber'},
          {label: '项目编号', value: 'projectNumber'},
          {label: '提出人', value: 'exhibitor'},
          {label: '发现时间', value: 'presentation', minWidth: 160},
          {label: '风险描述', value: 'descr'},
          {label: '风险程度', value: 'lev', list: 'degreeList'},
          {label: '应对方法', value: 'solution'},
          {label: '负责人', value: 'principal'},
          {label: '实际执行措施情况', value: 'cond', minWidth: 160},
          {label: '状态', value: 'state', list: 'flagList'},
        ],
        handle: {
          fixed: "right",
          label: "操作",
          width: "200",
          btList: [
            {
              event: "edit",
              show: false,
              slot: true,
            },
            {
              event: "delete",
              loading: "statusLoading",
              show: false,
              slot: true
            },
          ]
        },
        initCurpage: 1
      }
    }
  },
  mounted() {
    this.initList();
    this.initDataPerms();
    this.getList();
  },
  methods: {
     // 初始化数据权限
    initDataPerms() {
      const btList = this.tableInfo.handle.btList;
      const btList1 = this.filterInfo.list;
      // this.$initDataPerms('columnMan', btList)
      // this.$initDataPerms('columnMan', btList1)
    },
    initList() {},
    // 获取列表
    getList() {
      this.tableInfo.refresh = Math.random();
    },
    // 按钮点击
    handleClick(event, data) {
      console.log(event)
      const tableInfo = this.tableInfo;
      const dialogInfo = this.dialogInfo;
      switch (event) {
        // 搜索
        case "search":
          // 重置分页
          tableInfo.initCurpage = Math.random();
          tableInfo.refresh = Math.random();
          break;
        // 创建
        case "create":
          dialogInfo.type = event;
          dialogInfo.visible = true;
          break;
        case "edit":
          sessionStorage.editProRisk = JSON.stringify(data);
          this.$router.push({name:'editProRisk'});
          break;
        // 查看和编辑
        case "view":
        // falls through 告诉ESlint不检查这一行
        case "update":
          dialogInfo.type = event;
          dialogInfo.visible = true;
          this.articleInfo = JSON.parse(JSON.stringify(data));
          getRowApi(data.id).then(res => {
            if (res.success) {
              this.articleInfo = res.content[0];
            }
          });
          break;
        // 删除
        case "delete":
          let params = qs.stringify({ids:[data.id]},{indices:false})
          this.$handleAPI(event, delProRiskInfo, params).then(res => {
            if (res.success) {
              this.tableInfo.refresh = Math.random();
            }
          });
          break;
        // 弹窗点击关闭
        case "close":
          dialogInfo.visible = false;
          break;
      }
    },
    // 触发事件
    handleEvent(event, data) {
      // debugger
      switch (event) {
        // 对表格获取到的数据做处理
        case "list":
          if (!data) return;
          data.forEach(item => {
            this.$set(item, "statusLoading", false);
            item.create_time = this.$fn.switchTime(
              item.create_time,
              "YYYY-MM-DD hh:mm:ss"
            );
            item.update_time = this.$fn.switchTime(
              item.update_time,
              "YYYY-MM-DD hh:mm:ss"
            );
          });
          break;
        case "tableCheck":
          this.currentSelectlist = data;
          break;
      }
    },
    toAdd() {
      this.$router.push({ name: "addProRisk" });
    },
    toDel() {
      if (this.currentSelectlist.length === 0) {
        this.$notify({
          title: "错误提示",
          message: "您还未选择任何数据!",
          type: "error"
        });
      } else {
        let params = [];
        this.currentSelectlist.forEach(item => {
          params.push(item.id);
        });
        params = qs.stringify({ids:params},{indices:false});
        console.log(params)
        this.$handleAPI("delete", delProRiskInfo, params).then(
          res => {
            if (res.success) {
              this.tableInfo.refresh = Math.random();
            }
          }
        );
      }
    }
  },
  components: {
    DataFilter,
    DataTable
  }
}
</script>

<style lang="less">
@vw: 19.2vw;
.pro-risk-container{
  .tableTitle {
    height: 66 / @vw;
    display: flex;
    align-items: center;
    padding: 0 32 / @vw;
    background-color: #ffffff;
    .btn {
      margin-left: 59 / @vw;
      width: 88 / @vw;
      height: 36 / @vw;
      border-radius: 18 / @vw;
      border: solid 1 / @vw #c0c4ca;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .btn-add {
      span:nth-child(1) {
        width: 8 / @vw;
        height: 8 / @vw;
        border-radius: 50%;
        margin-right: 9 / @vw;
        background-color: #71d8c4;
      }
    }
    .btn-del {
      span:nth-child(1) {
        width: 8 / @vw;
        height: 8 / @vw;
        border-radius: 50%;
        margin-right: 9 / @vw;
        background-color: #ee6976;
      }
    }
  }
}
</style>

