<template>
  <div class="dep-container">
    <DataFilter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      :list-type-info="listTypeInfo"
      @handleClick="handleClick"
      @handleEvent="handleEvent">
    </DataFilter>

    <div class="tableTitle">
      <div>组织机构列表 ( 共 {{0}} 条数据 )</div>
      <div class="btn btn-add" @click="toAdd">
        <span></span>
        <span>新增</span>
      </div>
      <div class="btn btn-del" @click="toDel">
        <span></span>
        <span>删除</span>
      </div>
    </div>

    <DataTreeTable
      :refresh="treeTable.refresh"
      :init-curpage="treeTable.initCurpage"
      :tableData="treeTable.tableData"
      :fieldList="treeTable.fieldList"
      :query="filterInfo.query"
      :handle="treeTable.handle"
      :api="getDepList">
      <!-- 自定义插槽状态按钮 -->
      <template v-slot:bt-edit="scope">
        <div class="btn-edit" v-waves @click="handleClick(scope.data.item.event, scope.data.row)"></div>
      </template>
      <template v-slot:bt-delete="scope">
        <div class="btn-trash" v-waves @click="handleClick(scope.data.item.event, scope.data.row)"></div>
      </template>
    </DataTreeTable>
  </div>
</template>

<script>
import qs from 'qs'
import DataFilter from "@/components/DataFilter";
import DataTreeTable from "@/components/DataTreeTable";
import {getDepList, delDepInfo} from "@/api/department.js";
export default {
  data () {
    return {
      getDepList,
      filterInfo: {
        query: {
          title: "",
          type: "",
          flag: ""
        },
        list: [
          { type: "input", label: "部门名称:", value: "departmentName" },
          {
            type: "button",
            name: "查询",
            btType: "primary",
            event: "search",
            show: true
          }
        ],
      },
      listTypeInfo: {
        flagList: [
          {key: '启用', value: 0},
          {key: '禁用', value: 1},
        ],
      },
      treeTable: {
        refresh:1,
        initCurpage: 1,
        tableData: {
          data: [],
          key: 'departmentCode',
          lazy: true,
          hasChildren: 'hasChild'
        },
        fieldList: [
          {label: '部门名称', value: 'departmentName',width:'200px'},
          {label: '部门编码', value: 'departmentCode'}
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
      }
    }
  },
  components: {
    DataFilter, DataTreeTable
  },
  mounted () {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      this.treeTable.refresh = Math.random();
    },
    // 按钮点击
    handleClick(event, data) {
      console.log(event)
      const treeTable = this.treeTable;
      const dialogInfo = this.dialogInfo;
      switch (event) {
        // 搜索
        case "search":
          // 重置分页
          treeTable.initCurpage = Math.random();
          treeTable.refresh = Math.random();
          break;
        // 创建
        case "create":
          dialogInfo.type = event;
          dialogInfo.visible = true;
          break;
        case "edit":
          sessionStorage.editDep = JSON.stringify(data);
          this.$router.push({name:'editDep'});
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
          this.$handleAPI(event, delDepInfo, params).then(res => {
            if (res.success) {
              this.treeTable.refresh = Math.random();
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
      this.$router.push({ name: "addDep" });
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
        this.$handleAPI("delete", delDepInfo, params).then(
          res => {
            if (res.success) {
              this.treeTable.refresh = Math.random();
            }
          }
        );
      }
    }
  }
}
</script>

<style lang="less">
@vw: 19.2vw;
.dep-container{
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
