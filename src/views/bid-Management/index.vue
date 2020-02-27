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
      <div>资源服务列表 ( 共 {{ 1 }} 条数据 )</div>
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
      :api="getBidList"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      :checkBox="true"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 自定义插槽状态按钮 -->
      <!-- <template v-slot:bt-status="scope">
        <img src="img/icons/icon-edit.png" alt="" v-waves @click="handleClick(scope.data.item.event, scope.data.row)">
        <img src="img/icons/icon-trash.png" alt="" v-waves @click="handleClick(scope.data.item.event, scope.data.row)"> -->
        <!-- <el-button
          v-if="scope.data.item.show && (!scope.data.item.ifRender || scope.data.item.ifRender(scope.data.row))"
          v-waves
          size="mini"
          :type="scope.data.row.status - 1 >= 0 ? 'danger' : 'success'"
          :icon="scope.data.item.icon"
          :disabled="scope.data.item.disabled"
          :loading="scope.data.row[scope.data.item.loading]"
          @click="handleClick(scope.data.item.event, scope.data.row)"
        >
          {{ scope.data.row.status - 1 >= 0 ? '停用' : '启用' }}
        </el-button> -->
      <!-- </template> -->
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
import qs from 'qs'
import { mapGetters } from "vuex";
// import { getListApi, getRowApi, createApi, updateApi, deleteApi } from '@/api/opsCenter/columnMan'
import { getBidList, delBid } from "@/api/bid.js";
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
      getBidList,
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
        },
        list: [
          { type: "input", label: "专栏名称", value: "name" },
          { type: "select", label: "状态", value: "flag", list: "flagList" },
          {
            type: "button",
            name: "搜索",
            btType: "primary",
            icon: "el-icon-search",
            event: "search",
            show: true
          }
        ]
      },
      // 表格相关
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          {
            value: "departmentCode",
            label: "投标负责部门编号",
            minWidth: 135
          },
          {
            value: "bidName",
            label: "名称"
          },
          {
            value: "section",
            label: "标段"
          },
          {
            value: "budget",
            label: "预算金额"
          },
          {
            value: "procurementUnit",
            label: "采购单位",
            minWidth: 160
          },
          {
            value: "sign",
            label: "投标性质"
          },
          {
            value: "proposer",
            label: "申请人"
          },
          {
            value: "coordinator",
            label: "协调人"
          },
          {
            value: "projectApply",
            label: "项目报名人"
          },
          {
            value: "bidEditor",
            label: "标书编制人"
          },
          {
            value: "bidor",
            label: "现场投标人"
          },
          {
            value: "cooperator",
            label: "合作单位"
          },
          {
            value: "cashDeposit",
            label: "保证金额"
          },
          {
            value: "bidOpeningTime",
            label: "开标时间",
            minWidth: 160
          },
          {
            value: "bidUnit",
            label: "中标单位"
          },
          {
            value: "bidPrice",
            label: "中标金额"
          },
          {
            value: "taskSubmit",
            label: "投标申请单是否提交",
            minWidth: 150
          },
          {
            value: "taskNumber",
            label: "投标申请单编号",
            minWidth: 135
          },
          {
            value: "remark",
            label: "备注"
          }
          
          // { label: '专栏名称', value: 'name', minWidth: 180 },
          // { label: '专栏地址', value: 'url', minWidth: 180 },
          // { label: '状态', value: 'flag', width: 90, type: 'select', list: 'flagList' },
          // { label: '创建人', value: 'create_user_name' },
          // { label: '创建时间', value: 'create_time', width: 180 }
          // {label: '更新人', value: 'update_user_name'},
          // {label: '更新时间', value: 'update_time', minWidth: 180}
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
        // 编辑
        case "edit":
          sessionStorage.editBid = JSON.stringify(data);
          this.$router.push({name:'editBid'});
          break;
        // 删除
        case "delete":
          let params = qs.stringify({ids:[data.id]},{indices:false})
          this.$handleAPI(event, delBid, params).then(res => {
            if (res.success) {
              tableInfo.refresh = Math.random();
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
      this.$router.push({ name: "addBid" });
    },
    toDel() {
      // if (this.currentSelectlist.length === 0) {
      //   this.$notify({
      //     title: "错误提示",
      //     message: "您还未选择任何数据!",
      //     type: "error"
      //   });
      // } else {
      //   let params = [];
      //   this.currentSelectlist.forEach(item => {
      //     params.push(item.id);
      //   });
      //   params = qs.stringify({ids:params},{indices:false});
      //   console.log(params);
      //   this.$handleAPI("delete", delBid, params).then(
      //     res => {
      //       if (res.success) {
      //         tableInfo.refresh = Math.random();
      //       }
      //     }
      //   );
      // }
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
        this.$handleAPI("delete", delBid, params).then(
          res => {
            if (res.success) {
              this.tableInfo.refresh = Math.random();
            }
          }
        );
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
