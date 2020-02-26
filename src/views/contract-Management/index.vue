<template>
  <div class="person-container">
    <!-- 条件栏 -->
    <data-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      :list-type-info="listTypeInfo"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <div class="tableTitle">
      <div>合同列表 ( 共 {{0}} 条数据 )</div>
      <div class="btn btn-add" @click="toAdd">
        <span></span>
        <span>新增</span>
      </div>
      <div class="btn btn-del" @click="toDel">
        <span></span>
        <span>删除</span>
      </div>
    </div>
    <!-- 表格 -->
    <data-table
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :data.sync="tableInfo.data"
      :api="getContract"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      :checkBox="true"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 自定义插槽状态按钮 -->
      <template v-slot:bt-edit="scope">
        <div class="btn-edit" v-waves @click="handleClick(scope.data.item.event, scope.data.row)"></div>
      </template>
      <template v-slot:bt-delete="scope">
        <div class="btn-trash" v-waves @click="handleClick(scope.data.item.event, scope.data.row)"></div>
      </template>
    </data-table>
    <!-- 弹窗 -->
    <data-dialog
      :title="dialogInfo.title[dialogInfo.type]"
      :visible.sync="dialogInfo.visible"
      :width="dialogInfo.width"
      :bt-loading="dialogInfo.btLoading"
      :bt-list="dialogInfo.type === 'view' ? undefined : dialogInfo.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
  </div>
</template>

<script>
import qs from "qs";
import { mapGetters } from "vuex";
import { getContract, getDictlist, delContract } from "@/api/contract";
import DataFilter from "@/components/DataFilter";
import DataTable from "@/components/DataTable";
import DataDialog from "@/components/DataDialog";

export default {
  components: {
    DataFilter,
    DataTable,
    DataDialog
  },
  data() {
    return {
      getContract,
      // 相关列表
      listTypeInfo: {
        flagList: [
          { key: "草稿", value: 1 },
          { key: "审核中", value: 2 },
          { key: "已发布", value: 3 },
          { key: "审核失败", value: 4 },
          { key: "封禁", value: 5 }
        ],
        typeList: [
          { key: "原创", value: 1 },
          { key: "转载", value: 2 },
          { key: "翻译", value: 3 }
        ],
        statusList: [
          { key: "启用", value: 1 },
          { key: "停用", value: 0 }
        ]
      },
      // 过滤相关配置
      filterInfo: {
        query: {
          title: "",
          type: "",
          flag: ""
        }
      },
      // 表格相关
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          {
            value: "contractNumber",
            label: "合同编号"
          },
          {
            value: "contractName",
            minWidth: 180,
            label: "合同名称"
          },
          {
            value: "cType",
            label: "合同类型"
          },
          {
            value: "cCategory",
            label: "合同分类"
          },
          {
            value: "unit",
            minWidth: 180,
            label: "合同对方单位名称"
          },
          {
            value: "departmentCode",
            label: "部门ID"
          },
          {
            value: "isOrig",
            label: "是否原件"
          },
          {
            value: "isCFile",
            minWidth: 180,
            label: "是否验收文件"
          },
          {
            value: "isQReport",
            minWidth: 180,
            label: "是否质检报告"
          },
          {
            value: "contractCount",
            label: "合同份数"
          },
          {
            value: "signTime",
            minWidth: 180,
            label: "签订时间"
          },
          {
            value: "receiveTime",
            minWidth: 180,
            label: "接收时间"
          },
          {
            value: "remark",
            minWidth: 180,
            label: "备注"
          }
        ],
        handle: {
          fixed: "right",
          label: "操作",
          width: "200",
          btList: [
            {
              event: "edit",
              show: false,
              slot: true
            },
            {
              event: "delete",
              loading: "statusLoading",
              show: false,
              slot: true
            }
            // {
            //   label: "删除",
            //   type: "danger",
            //   icon: "el-icon-delete",
            //   event: "delete",
            //   show: true
            // }
          ]
        }
      },
      // 文章相关
      articleInfo: {},
      // 弹窗相关
      dialogInfo: {
        width: "80%",
        title: {
          create: "添加",
          update: "编辑"
        },
        visible: false,
        type: "",
        btLoading: false,
        btList: [
          { label: "关闭", type: "", icon: "", event: "close", show: true },
          {
            label: "保存",
            type: "primary",
            icon: "",
            event: "save",
            saveLoading: false,
            show: true
          }
        ]
      },
      currentSelectlist: [] // 单选或者全选存储值
    };
  },
  computed: {
    ...mapGetters(["theme", "userInfo", "dataPerms"])
  },
  watch: {},
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
        case "edit":
          sessionStorage.editcontract = JSON.stringify(data);
          this.$router.push({ name: "editcontract" });
          break;
        // 删除
        case "delete":
          let params = qs.stringify({ ids: [data.id] }, { indices: false });
          this.$handleAPI(event, delContract, params).then(res => {
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
          let contractTypelist = ["其他", "测绘", "信息化"];
          let contractCategorylist = {
            inflow: "流入",
            outflow: "流出",
            agreement: "协议"
          };
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
            item.cType = contractTypelist[item.contractType];
            item.cCategory = contractCategorylist[item.contractCategory];
            item.isOrig = item.isOriginal == 0 ? "否" : "是";
            item.isCFile = item.isCheckFile == 0 ? "否" : "是";
            item.isQReport = item.isQualityReport == 0 ? "否" : "是";
          });
          break;
        case "tableCheck":
          this.currentSelectlist = data;
          break;
      }
    },
    toAdd() {
      this.$router.push({ name: "addContract" });
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
        params = qs.stringify({ ids: params }, { indices: false });
        this.$handleAPI("delete", delContract, params).then(res => {
          if (res.success) {
            this.tableInfo.refresh = Math.random();
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 19.2vw;
.person-container {
  .page-filter {
    background-color: #ffffff;
    height: 72 / @vw;
    display: flex;
    align-items: center;
    margin-bottom: 8 / @vw;
    padding: 0 32 / @vw;
  }
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
  .page-table {
    padding: 0 32 / @vw;
    background-color: #ffffff;
  }
}
</style>
