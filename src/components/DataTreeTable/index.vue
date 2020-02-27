<template>
  <div class="tree-table">
    <!-- 树形表格 -->
    <el-table 
      :data="tableData.data"
      :row-key="tableData.key"
      :lazy="tableData.lazy"
      :load="loadTreeData"
      :tree-props="tableData.treeProps"
      :header-cell-class-name="headerRowClass"
      :row-class-name="rowClassName"
      >
      <!-- @select-all="handleSelectionChange"
      @selection-change="handleSelectionChange" -->
      <el-table-column v-if="checkBox" :key="'selection'" type="selection" width="55" />
      <el-table-column
        v-for="(item, index) in fieldList.filter(item => !item.hidden)"
        :key="index"
        :prop="item.value"
        :label="item.label"
        :fixed="item.fixed"
        align="center"
        :show-overflow-tooltip="true"
        :width="item.width"
        :min-width="item.minWidth || '100px'"></el-table-column>
        
      <el-table-column
        v-if="handle"
        :key="'handle'"
        :fixed="handle.fixed"
        align="center"
        :label="handle.label"
        :width="handle.width"

      >  
        <template v-slot="scope">
          <template v-for="(item) in handle.btList">
            <!-- 自定义操作类型 -->
            <slot v-if="item.slot" :name="'bt-' + item.event" :data="{item, row: scope.row}" />
          </template>
        </template>
      </el-table-column>
      </el-table>

      <!-- 分页组件 -->
    <template v-if="pager">
      <div v-show="!listInfo.loading" class="pagination-container">
        <el-pagination
          :current-page.sync="listInfo.query.current"
          :page-sizes="listInfo.pageSizes"
          :page-size="listInfo.query.size"
          layout="prev, pager, next"
          :total="listInfo.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { treeData } from '../../libs/util';
export default {
  props: {
    refresh: {
      type: Number
    },
    tableData: {
      type: Object
    },
    lazy: {
      type: Boolean,
      default: true
    },
    checkBox: {
      type: Boolean,
      default: true
    },
     // 类型列表
    listTypeInfo: {
      type: Object
    },
    // 表格字段配置
    fieldList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 获取数据的接口
    api: {
      type: Function
    },
    // 获取子数据的接口
    subapi: {
      type: Function
    },
    // 查询条件
    query: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 操作栏配置
    handle: {
      type: Object
    },
    // 是否分页
    pager: {
      type: Boolean,
      default: true
    },
    // 重置当前页
    initCurpage: {
      type: Number
    },
  },
  data () {
    return {
      // 列表相关
      listInfo: {
        tableHeight: 0, // 表格最大高度
        total: 0, // 总条数
        loading: false, // 加载动画
        pageSizes: [10, 20, 50, 100], // 分页数量列表
        query: {
          // 查询条件
          current: 1, // 当前页
          size: 10 // 每页条数
        }
      }
    }
  },
  mounted () {
    // this.initData();
    console.log(this.api)
  },
  watch: {
    initCurpage() {
      this.listInfo.query.current = 1;
    },
    refresh() {
      if (!this.api) return;
      this.initData(this.api);
    },
  },
  methods: {
    headerRowClass(row, column, rowIndex, columnIndex) {
      return "headerRowClass";
    },
    rowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else if (rowIndex % 2 !== 0) {
        return "success-row";
      }
      return "";
    },
    handleSelectionChange() {

    },
    handleSizeChange(val) {
      const query = this.listInfo.query;
      query.size = val; // 每页条数
      query.current = 1; // 每页条数切换，重置当前页
      this.initData(this.api);
    },
    handleCurrentChange(val) {
      this.listInfo.query.current = val; // 当前页
      this.initData(this.api);
    },
    // 处理参数
    handleParams() {
      const obj = {};
      for (const key in this.query) {
        if (this.query[key] || this.query[key] === 0) {
          obj[key] = this.query[key];
        }
      }
      // 如果不需要分页，则无分页相关参数
      return this.pager ? { ...this.listInfo.query, ...obj } : obj;
    },
    initData(api) {
      // this.tableData.data = [
      //     {
      //       departmentName: '研发部',
      //       departmentCode: 'yanfa',
      //       hasChild: true
      //     },
      //     {
      //       departmentName: '综合部',
      //       departmentCode: 'zonghe',
      //       hasChild: true
      //     },
      //     {
      //       departmentName: '人事部',
      //       departmentCode: 'renshi',
      //     }
      // ]
      this.listInfo.loading = true;
      return new Promise((resolve, reject) => {
        // debugger
        console.log(this.handleParams());
        let params = this.handleParams();
        api({params})
          .then(res => {
            this.listInfo.loading = false;
            if(res.success) {
              this.tableData.data = treeData(res.body);
            }
          })
          .catch(res => {
            reject();
            this.listInfo.loading = false;
          })
      })
      
    },
    loadTreeData(tree, treeNode, resolve) {
      // setTimeout(() => {
      //   resolve([
      //     {
      //       departmentName: '研发小组1',
      //       departmentCode: 'yanfa1',
            
      //     },
      //     {
      //       departmentName: '研发小组2',
      //       departmentCode: 'yanfa2',
      //     }
      //   ])
      // }, 1000)

      // let pid = tree.id;
      // this.maps.set(pid,{tree, treeTable,resolve});
      // //懒加载数据
      // setTimeout(async() => {
      //   let params = {
      //     id: tree.id
      //   };
      //   const res = await doclistForChild(params);
      //   if (res.list.length === 0) {
      //     this.$set(this.$refs.treeData.store.states.lazyTreeNodeMap,pid,[]);
      //   }
      //   resolve(res.list)
      // }, 100)
    }
  }
}
</script>

<style lang="less" scoped>
@vw: 19.2vw;
// 自定义表格相关
.tree-table {
  height: 726 / @vw;
  background-color: #ffffff;
  padding: 0 32/@vw;
  .warning-row {
    background: #ffffff;
  }
  .success-row {
    background: #eff5ff;
  }
  .pagination-container {
    padding: 15px 0;
  }

  .headerRowClass {
    background: #eff5ff !important;
    height: 54px;
  }
}
</style>

