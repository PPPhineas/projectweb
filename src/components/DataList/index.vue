<template>
  <div style="margin-top:10px">
    <slot name="tablename"></slot>
    <div :bordered="false">
      <div>
        <!-- 表格插件 -->
        <div class="table">
          <el-table
            max-height="530"
            border
            :columns="Columns"
            :data="tableData"
            :loading="loading"
            :disabled-hover="true"
            :rowClassName="rowClassName"
          >
          <TbColumns v-for="(item,index) in Columns" :key="index" :columns="item" />
          </el-table>
        </div>


      </div>
    </div>
  </div>
</template>
<script>
import TbColumns from './tb-columns'
export default {
  props: {
    url: {
      // 列表url
      type: String,
      default: ""
    },
    searchData: {
      type: Object,
      default: {}
    },
    Columns: {
      type: Array,
      default: []
    },
    index: {
      type: Number,
      default: 1
    },
    rowClassName: {
      type: Function,
      default: null
    },
    apiType: {
      type: String,
      default: "$http"
    }
  },
  data() {
    return {
      pageIndex: 1,
      dataCount: 0, // 总条数
      pageSize: 10, // 每页显示多少条
      ColumnsData: [], // 表头数据
      tableData: [], // 表体数据
      loading: true, // 表格loading状态
      isShow: true, // 是否显示标题
      ajax: {}, // apis指向

    };
  },
  components: {
    TbColumns
  },
  created() {
    console.log(this.Columns)
    // api服务接口指向
    this.ajax = this[this.apiType];
    // 调用分页数据
    this.getList(1);
  },
  methods: {
    getList(index) {
      this.loading = true;

      // 合并分页、searchData
      const postFomr = Object.assign(
        {
          num: this.pageSize,
          page: index
        },
        this.searchData
      );

      // 发送请求获取数据
      this.ajax
        .get(this.url, { params: postFomr })
        .then((response) => {
          this.$emit("allDate", response);

          // 定义表头数据
          const Columns = response.data.Columns;

          // 入参表头与获取数据表头属性合并
          this.Columns.forEach(function(item, index) {
            Columns.forEach(function(obj, index) {
              if (item.key === obj.key) {
                Object.assign(obj, item);
              }
            });
          });

          // 定义表体数据
          this.ColumnsData = Columns;

          // 分页数据
          this.pageSize = response.data.pageSize;
          this.dataCount = response.data.dataCount;

          // loading状态
          this.loading = false;
          this.pageIndex = index;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    pageChange(index) {
      // 分页change
      this.loading = true;
      this.getList(index);
    },
    pageSizeChange(index) {
      this.pageSize = index;
      this.loading = true;
      this.getList(1);
    }
  }
};
</script>
<style lang="less" scoped>
.no-data {
  text-align: center;
  padding: 40px 0;
  border: 1px solid #dcdee2;
}
</style>
