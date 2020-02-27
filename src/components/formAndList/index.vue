
<template>
  <div id="tags-view-container" class="tags-view-container">
    <el-form :inline="true" v-if="isShow">
      <template v-for="(item, index) in formOption">
        <!-- 下拉框 -->
        <el-form-item v-if="item.type == 'select'" :label="item.label + ':'" :key="index">
          <el-select v-bind="item.options" v-model="item.value">
            <el-option
              v-if="item.dataType == 'arr'"
              v-for="(obj,index) in item.options.data"
              :label="obj[item.arrKey.key]"
              :value="obj[item.arrKey.value]"
              :key="index"
            ></el-option>
            <el-option
              v-if="item.dataType == 'json'"
              v-for="(value,key) in item.options.data"
              :label="key"
              :key="key"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 日期框 -->
        <el-form-item v-if="item.type == 'date-picker'" :label="item.label + ':'" :key="index">
          <el-date-picker
            v-bind="item.options"
            v-model="item.value"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <!-- 输入框 -->
        <el-form-item v-if="item.type == 'input'" :label="item.label + ':'" :key="index">
          <el-input v-bind="item.options" v-model="item.value"></el-input>
        </el-form-item>

        <!-- 下拉+输入框 -->
        <el-form-item v-if="item.type == 'selectAndInput'" :label="item.label + ':'" :key="index">
          <el-select
            v-bind="item.selectOption"
            v-model="item.defaulType"
            placeholder="请选择"
            class="inputWidthAuto"
            filterable
            style="display: inline-block; width: 100px; margin-right: 10px;"
          >
            <el-option v-for="(key,value) in item.name" :label="value" :value="key" :key="value"></el-option>
          </el-select>
          <el-form-item>
            <el-input v-bind="item.inputOtions" v-model="item.value" filterable></el-input>
          </el-form-item>
        </el-form-item>
      </template>
      <!-- 查询按钮 -->
      <!-- <el-form-item v-for="(item,indx) in btnlist" :key="index">
        <el-button type="primary" @click="search">{{item.label}}</el-button>
      </el-form-item>-->
      <el-form-item class="query-btn">
        <div @click="search">查询</div>
        <!-- <el-button type="primary" @click="search">查询</el-button> -->
      </el-form-item>
      <!-- 重置按钮 -->
      <el-form-item v-if="resetShow">
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
      <!-- 补充插槽 -->
      <slot name="buttons"></slot>
    </el-form>
    <div class="table-content">
      <slot name="tableTitle"></slot>
      <lb-table
        :column="Columns"
        :data="tableData"
        :row-class-name="rowClassName"
        :pagination="pagination"
        height="300"
        border
      ></lb-table>
    </div>
  </div>
</template>

<script>
import LbTable from "@/components/lb-table/lb-table.vue";

export default {
  props: {
    url: {
      // 列表url
      type: String,
      default: ""
    },
    Columns: {
      // 表头数据
      type: Array,
      default: []
    },
    formOption: {
      // 查询条件
      type: Array,
      default: [{ key: "n", width: 200 }]
    },
    resetShow: {
      // 重置按钮显示
      type: Boolean,
      default: true
    },
    pagination: {
      type: Boolean,
      default: false
    },
    apiType: {
      // 不同的api地址
      type: String,
      default: "$http"
    },
    tableData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      index: 1, // 当前分页
      searchData: {}, // 搜索数据
      isShow: false // 列表展示
    };
  },
  components: {
    LbTable
  },
  created() {
    this.isShow = true;
  },
  methods: {
    // 列表数据
    allDate(data) {
      this.$emit("allDate", data);
    },
    // 搜索方法
    search() {
      let Param = {};
      this.formOption.forEach(item => {
        // 日期插件
        if (item.type == "date-picker") {
          // 起止日期类型
          if (item.options.type == "daterange") {
            item.value !== null ? (Param[item.name[0]] = item.value[0]) : "";
            item.value !== null ? (Param[item.name[1]] = item.value[1]) : "";
          }
          // 下拉+输入
        } else if (item.type == "selectAndInput") {
          Param[item.defaulType] = item.value;
        } else {
          // 普通类型
          Param[item.name[0]] = item.value;
        }
      });

      // 子组件入参
      this.searchData = Object.assign({}, Param);
      this.$nextTick(() => {
        // 刷新列表
        this.$refs.headerChild.getList(1, this.searchData);
      });
    },
    // 表单重置
    resetForm() {
      this.formOption.forEach(item => {
        item.value = "";
      });
    },
    rowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else if (rowIndex % 2 !== 0) {
        return "success-row";
      }
      return "";
    }
  }
};
</script>
<style lang="less" scope>
@vw: 19.2vw;
.tags-view-container {
  // padding: 0 32/@vw;
  .el-form {
    background-color: #ffffff;
    padding: 0 32 / @vw;
    margin-bottom: 8 / @vw;
    height: 72 / @vw;
    display: flex;
    align-items: center;
    .el-form-item {
      margin-bottom: 10px;
      .el-form-item__label {
        font-size: 12px;
        font-weight: normal;
      }
    }
    .query-btn {
      .el-form-item__content {
        width: 82 / @vw;
        height: 36 / @vw;
        background-color: #39d6b8;
        border-radius: 18 / @vw;
        border-color: #39d6b8;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        div {
          color: #fffefe;
        }
      }
    }
    .el-date-editor .el-range-separator {
      padding: 0;
    }
  }
  .table-content {
    background-color: #ffffff;
    padding: 0 32 / @vw;
    .warning-row {
      background: #ffffff;
    }
    .success-row {
      background: #eff5ff;
    }
  }
}
</style>
