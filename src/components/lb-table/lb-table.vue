<template>
  <div class="lb-table">
    <el-table ref="elTable"
      v-bind="$attrs"
      v-on="$listeners"
      :header-cell-class-name="headerRowClass"
      :data="data"
      :span-method="this.merge ? this.mergeMethod : this.spanMethod">
      <lb-column v-bind="$attrs"
        v-for="(item, index) in column"
        :key="index"
        :column="item">
      </lb-column>
    </el-table>
    <el-pagination class="lb-table-pagination"
      v-if="pagination"
      v-bind="$attrs"
      v-on="$listeners"
      layout="prev,pager,next"
      @current-change="paginationCurrentChange"
      :style="{ 'margin-top': paginationTop, 'text-align': paginationAlign }">
    </el-pagination>
  </div>
</template>

<script>
import LbColumn from './lb-column';
export default {
  props: {
    column: Array,
    data: Array,
    spanMethod: Function,
    pagination: {
      type: Boolean,
      default: false
    },
    paginationTop: {
      type: String,
      default: '15px'
    },
    paginationAlign: {
      type: String,
      default: 'left'
    },
    merge: Array
  },
  components: {
    LbColumn
  },
  data () {
    return {
      mergeLine: {},
      mergeIndex: {}
    }
  },
  created () {
    this.getMergeArr(this.data, this.merge)
  },
  computed: {
    dataLength () {
      return this.data.length
    }
  },
  methods: {
    clearSelection () {
      this.$refs.elTable.clearSelection()
    },
    toggleRowSelection (row, selected) {
      this.$refs.elTable.toggleRowSelection(row, selected)
    },
    toggleAllSelection () {
      this.$refs.elTable.toggleAllSelection()
    },
    toggleRowExpansion (row, expanded) {
      this.$refs.elTable.toggleRowExpansion(row, expanded)
    },
    setCurrentRow (row) {
      this.$refs.elTable.setCurrentRow(row)
    },
    clearSort () {
      this.$refs.elTable.clearSort()
    },
    clearFilter (columnKey) {
      this.$refs.elTable.clearFilter(columnKey)
    },
    doLayout () {
      this.$refs.elTable.doLayout()
    },
    sort (prop, order) {
      this.$refs.elTable.sort(prop, order)
    },
    paginationCurrentChange (val) {
      this.$emit('p-current-change', val)
    },
    getMergeArr (tableData, merge) {
      if (!merge) return
      this.mergeLine = {}
      this.mergeIndex = {}
      merge.forEach((item, k) => {
        tableData.forEach((data, i) => {
          if (i === 0) {
            this.mergeIndex[item] = this.mergeIndex[item] || []
            this.mergeIndex[item].push(1)
            this.mergeLine[item] = 0
          } else {
            if (data[item] === tableData[i - 1][item]) {
              this.mergeIndex[item][this.mergeLine[item]] += 1
              this.mergeIndex[item].push(0)
            } else {
              this.mergeIndex[item].push(1)
              this.mergeLine[item] = i
            }
          }
        })
      })
    },
    mergeMethod ({ row, column, rowIndex, columnIndex }) {
      const index = this.merge.indexOf(column.property)
      if (index > -1) {
        const _row = this.mergeIndex[this.merge[index]][rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    headerRowClass(row,column,rowIndex,columnIndex) {
      return 'headerRowClass';
    }
  },
  watch: {
    merge () {
      this.getMergeArr(this.data, this.merge)
    },
    dataLength () {
      this.getMergeArr(this.data, this.merge)
    }
  }
}

</script>
<style lang="less">
.headerRowClass  {
  background: #eff5ff !important;
}
.lb-table-pagination {
  text-align: left;
}
</style>
