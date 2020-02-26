<template>
  <el-form
    ref="form"
    class="data-form"
    :class="className"
    :model="data"
    :rules="rules"
    :label-width="labelWidth"
    :label-position="labelPosition"
    :inline="inline"
  >
    <el-form-item
      v-for="(item, index) in getConfigList()"
      :key="index"
      :prop="item.value"
      :label="item.label"
      :class="item.className"
    >
      <!-- solt -->   
      <template v-if="item.type === 'slot'">
        <slot :name="'form-' + item.value" />
      </template>
      <!-- 普通输入框 -->
      <el-input
        v-if="item.type === 'input' || item.type === 'password'"
        v-model="data[item.value]"
        :class="`datafrom-${item.type}`"
        :type="item.type"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        @focus="handleEvent(item.event)"
      >
       <i v-if="item.suffix" slot="suffix">{{item.suffixname}}</i>
      </el-input>
      <!-- 文本输入框 -->
      <el-input
        v-if="item.type === 'textarea'"
        v-model.trim="data[item.value]"
        :class="`datafrom-${item.type}`"
        :type="item.type"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        :autosize="item.autosize || {minRows: 2, maxRows: 10}"
        @focus="handleEvent(item.event)"
      />
      <!-- 计数器 -->
      <el-input-number
        v-if="item.type === 'inputNumber'"
        v-model="data[item.value]"
        :class="`datafrom-${item.type}`"
        size="small"
        :min="item.min"
        :max="item.max"
        @change="handleEvent(item.event)"
      />
      <!-- 选择框 -->
      <el-select
        v-if="item.type === 'select'"
        v-model="data[item.value]"
        :class="`datafrom-${item.type}`"
        :disabled="item.disabled"
        :clearable="item.clearable"
        :filterable="item.filterable"
        remote
        :remote-method="palremoteMethod" 
        :loading="loading"
        :placeholder="getPlaceholder(item)"
        @change="handleEvent(item.event, data[item.value])"
      >
        <template  v-if="!item.person">
          <el-option
            v-for="(childItem, childIndex) in listTypeInfo[item.list]"
            :key="childIndex"
            :label="childItem.name"
            :value="childItem.value"
          />
        </template>
        <template v-else>
          <el-option  
            v-for="item in palOption"
            :key="item.id"
            :label="item.username"
            :value="item.id"></el-option>
        </template>

      </el-select>
      <!-- 日期选择框 -->
      <el-date-picker
        v-if="item.type === 'date'"
        :class="`datafrom-${item.type}`"
        v-model="data[item.value]"
        :type="item.dateType"
        :picker-options="item.TimePickerOptions"
        :value-format="item.format? item.firmat:''"
        :clearable="item.clearable"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        @focus="handleEvent(item.event)"
      />
      <el-switch
        v-if="item.type === 'switch'"
        :class="`dataform-${item.type}`"
        v-model="data[item.value]"
        :active-value="item.activevalue"
        :inactive-value="item.inactivevalue"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        @focus="handleEvent(item.event)"
      />
      <el-upload
        v-if="item.type ==='upload'"
        :ref="data.uploadref"
        :class="`dataform-${item.type}`"
        :headers="item.headers"
        :data="data.uploadPromse"
        :auto-upload="item.autoupload"
        :show-file-list="item.showfilelist"
        :accept="item.accept"
        :action="item.action"
        :onPreview="onPreview"
        :before-upload="beforeUpload"
        :on-change="fileChange"
        :on-success="successFile"
        :on-error="errorFile"  
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <!-- 信息展示框 -->
      <el-tag v-if="item.type === 'tag'">
        {{ $fn.getDataName({dataList: listTypeInfo[item.list], value: 'value', label: 'key', data: data[item.value]}) || '-' }}
      </el-tag>
    </el-form-item>
  </el-form>
</template>

<script>
import { getPersonlist } from "@/api/person";
import { mapMutations } from 'vuex';
export default {
  name: 'PageForm',
  props: {
    // 自定义类名
    className: {
      type: String
    },
    // 表单数据
    data: {
      type: Object
    },
    // 相关字段
    fieldList: {
      type: Array
    },
    // 验证规则
    rules: {
      type: Object
    },
    // 相关的列表
    listTypeInfo: {
      type: Object
    },
    // label宽度
    labelWidth: {
      type: String,
      default: '120px'
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    inline: {
      type: Boolean,
      default: true
    },
    uploadrefObj: {
      type: Object
    }
  },
  data () {
    return {
      loading: false,
      palOption: [],
    }
  },
  watch: {
    data: {
      handler: function (val) {
        // console.log(val)
        // 将form实例返回到父级
        this.$emit('update:uploadrefObj', this.$refs[this.data.uploadref]);
      },
      deep: true // 深度监听
    }
  },
  mounted () {
    // 将form实例返回到父级
    this.$emit('update:uploadrefObj', this.$refs[this.data.uploadref])
    // this.setUploadref(this.$refs[this.data.uploadrefObj])
  },
  methods: {
    // 获取字段列表
    getConfigList () {
      return this.fieldList.filter(item => !item.hasOwnProperty('show') || (item.hasOwnProperty('show') && item.show))
    },
    // 得到placeholder的显示
    getPlaceholder (row) {
      let placeholder
      if (row.type === 'input' || row.type === 'textarea') {
        placeholder = '请输入' + row.label
      } else if (row.type === 'select' || row.type === 'time' || row.type === 'date') {
        placeholder = '请选择' + row.label
      } else {
        placeholder = row.label
      }
      return placeholder
    },
    // 绑定的相关事件
    handleEvent (evnet) {

      this.$emit('handleEvent', evnet)
    },
    // 派发按钮点击事件
    handleClick (event, data) {
      this.$emit('handleClick', event, data)
    },
    onPreview(file) {
      this.$emit('onPreview',file);
    },
    beforeUpload(file) {
      this.$emit('beforeUpload', file)
    },
    fileChange(file,fileList) {
      this.$emit('fileChange',file,fileList);
    },
    successFile(response,file,fileList) {
      this.$emit('successFile',response,file,fileList)
    },
    errorFile(err,file,fileList) {
      this.$emit('errorFile',err,file,fileList)
    },
    palremoteMethod(query) {
      // debugger
      if (query !== '') {
        this.loading = true;
        setTimeout(async () => {
          this.loading = false;
          let parmas = {
            username: query
          }
          let res = await getPersonlist(parmas);
          const { success, body } = res;
          if (success) {
            this.palOption = body.records;
          }else {
            this.palOption = [];
          }
        },200)
      }else {
          this.palOption = [];
      }
      
    },
  }
}
</script>

<style lang="less" scoped>
// 自定义form相关
.data-form{
  .el-form-item{
    // display: inline-block;
    // float: left;
    // width: 48%;
    .el-form-item__content{
      width: 400px;
      .el-input, .el-select, .el-textarea{
        // width: 240px;
      }
      .el-input-number{
        .el-input{
          width: inherit;
        }
      }
    }
  }
  .el-form-block{
    display: block;
    width: 100%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
}
.page-form-block{
  .el-form-item{
    display: block;
    .el-form-item__content{
      .el-input, .el-select, .el-textarea{
        width: inherit;
      }
      .el-input-number{
        .el-input{
          width: inherit;
        }
      }
    }
  }
  .el-form-block{
    display: block;
    width: 100%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
}
</style>
