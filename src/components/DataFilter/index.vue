<template>
  <div class="data-filter" :class="className">
    <!-- <div
      class="filter-item"
    >-->
    <!-- <label class="filter-label" v-if="item.type !== 'button'">{{item.key}}</label> -->
    <!-- 输入框 -->
    <el-form :inline="true" class="filter-form">
      <el-form-item v-for="(item, index) in getConfigList()" :key="index" :label="item.label">
        <el-input
          v-if="item.type === 'input'"
          v-model="searchQuery[item.value]"
          :class="`filter-${item.type}`"
          :type="item.type"
          :disabled="item.disabled"
          :clearable="item.clearable === false ? item.clearable : true"
          :placeholder="getPlaceholder(item)"
          @focus="handleEvent(item.event)"
        />

        <!-- 选择框 -->
        <el-select
          v-if="item.type === 'select'"
          v-model="searchQuery[item.value]"
          :class="`filter-${item.type}`"
          :disabled="item.disabled"
          :clearable="item.clearable === false ? item.clearable : true"
          :filterable="item.filterable === false ? item.filterable : true"
          :placeholder="getPlaceholder(item)"
          @change="handleEvent(item.event)"
        >
          <el-option
            v-for="(childItem, childIndex) in listTypeInfo[item.list]"
            :key="childIndex"
            :label="childItem.key"
            :value="childItem.value"
          />
        </el-select>
        <!-- 时间选择框 -->
        <el-time-select
          v-if="item.type === 'time'"
          v-model="searchQuery[item.value]"
          :class="`filter-${item.type}`"
          :picker-options="item.TimePickerOptions"
          :clearable="item.clearable === false ? item.clearable : true"
          :disabled="item.disabled"
          :placeholder="getPlaceholder(item)"
        />
        <!-- 日期选择框 -->
        <el-date-picker
          v-if="item.type === 'date'"
          v-model="searchQuery[item.value]"
          :class="`filter-${item.type}`"
          :picker-options="item.datePickerOptions || datePickerOptions"
          :type="item.dateType"
          :clearable="item.clearable === false ? item.clearable : true"
          :disabled="item.disabled"
          :placeholder="getPlaceholder(item)"
          @focus="handleEvent(item.event)"
        />
        <!-- 按钮 -->
        <div
          class="filter-btn"
          v-else-if="item.type === 'button'"
          v-waves
          :class="`filter-${item.type}`"
          :type="item.btType"
          :icon="item.icon"
          @click="handleClick(item.event)"
        >
        {{ item.name }}
        </div>
        <!-- <el-button
          v-else-if="item.type === 'button'"
          v-waves
          :class="`filter-${item.type}`"
          :type="item.btType"
          :icon="item.icon"
          @click="handleClick(item.event)"
        >{{ item.name }}</el-button> -->
      </el-form-item>
    </el-form>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  name: "PageFilter",
  props: {
    // 自定义类名
    className: {
      type: String
    },
    // 相关列表
    listTypeInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 过滤器列表
    filterList: {
      type: Array
    },
    // 参数
    query: {
      type: Object
    }
  },
  data() {
    return {
      // 时间相关设置
      datePickerOptions: {
        disabledDate(time) {
          // 大于当前的时间都不能选 (+十分钟让点击此刻的时候可以选择到当前时间)
          return time.getTime() > +new Date() + 1000 * 600 * 1;
        }
      },
      flag: "inner", // 内 inner  外outside
      searchQuery: {}
    };
  },
  watch: {
    searchQuery: {
      handler: function(val) {
        // 传入参数修改，不派发
        if (this.flag === "outside") {
          this.flag = "inner";
          return;
        }
        // 修改传入进来的参数
        this.$emit("update:query", { ...this.query, ...val });
      },
      deep: true // 深度监听
    },
    query(val) {
      this.flag = "outside"; // 标识为传入参数修改
      this.searchQuery = val;
    }
  },
  mounted() {
    this.initParams();
  },
  methods: {
    initParams() {
      const obj = {};
      for (const key in this.query) {
        if (this.query[key]) {
          obj[key] = this.query[key];
        }
      }
      this.searchQuery = obj;
    },
    // 获取列表
    getConfigList() {
      return this.filterList.filter(
        item =>
          !item.hasOwnProperty("show") ||
          (item.hasOwnProperty("show") && item.show)
      );
    },
    // 得到placeholder的显示
    getPlaceholder(row) {
      let placeholder;
      let  tempstr = row.label.split(":");
      if (row.type === "input" || row.type === "textarea") {
        placeholder = "请输入" + tempstr[0];
      } else if (
        row.type === "select" ||
        row.type === "time" ||
        row.type === "date"
      ) {
        placeholder = "请选择" + tempstr[0];
      } else {
        placeholder = tempstr[0];
      }
      return placeholder;
    },
    // 绑定的相关事件
    handleEvent(evnet) {
      this.$emit("handleEvent", evnet);
    },
    // 派发按钮点击事件
    handleClick(event, data) {
      console.log(data)
      this.$emit("handleClick", event, data);
    }
  }
};
</script>

<style lang="less">
@vw: 19.2vw;
// 自定义过滤相关
.data-filter {
  height: 72/@vw;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  margin-bottom: 8/@vw;
  padding-left: 32/@vw;
  .filter-item {
    display: inline-flex;
    align-items: center;
    margin-bottom: 7px;
    margin-right: 10px;
  }
  .filter-form{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    .el-form-item {
      margin-bottom: 0;
      .el-form-item__label {
        font-size: 12px;
        color: #666666;
      }
      .filter-input,
      .filter-time,
      .filter-date,
      .filter-select {
        width: 180/@vw;
        height: 36/@vw;
        .el-input__inner {
          height: 36/@vw;
        }
      }
      .filter-btn {
        width: 82/@vw;
        height: 36/@vw;
        background-color: #39d6b8;
        border-radius: 18/@vw;
        border-color: #39d6b8;
        color: #fffefe;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14/@vw;
      }
    }

  }
  .filter-label {
    padding-right: 5px;
    font-size: 14px;
    color: #606266;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

}
</style>
