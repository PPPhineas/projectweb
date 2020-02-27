<template>
  <div class="addQua">
    <div class="addQua-header">新增资质</div>
    <div class="addQua-form">
      <el-form ref="form"
               :model="form"
               label-width="120px"
               label-position="left">
        <el-form-item label="资质名称">
          <el-input placeholder="请输入资质名称"
                    v-model="form.certificateName" />
        </el-form-item>
        <el-form-item label="证书类型">
          <el-select v-model="form.certificateType" placeholder="请选择证书类型">
            <el-option v-for="(item,index) in quaType" :key="index" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证书编号">
          <el-input placeholder="请输入证书编号"
                    v-model="form.certificateNumber" />
        </el-form-item>
        <el-form-item label="获证日期">
          <el-date-picker v-model="form.certificateDate"
                          type="datetime"
                          placeholder="请选择获证日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="有效截止日期">
          <el-date-picker v-model="form.effectiveDate"
                          type="datetime"
                          placeholder="请选择有效截止日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="发证机构">
          <el-input placeholder="请输入发证机构"
                    v-model="form.organization" />
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">取消</el-button>
          <el-button @click="addQua">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { addQuaInfo } from "@/api/qualification.js";
import {dateFormatter} from '@/libs/util.js';
export default {
  data () {
    return {
      form: {
        certificateName: '',
        certificateType: 0,
        certificateNumber: '',
        certificateDate: '',
        effectiveDate: '',
        organization: ''
      },
      quaType: [
        {label: '资格类', value: 0},
        {label: '行业类', value: 1},
        {label: '运维类', value: 2}
      ]
    }
  },
  methods: {
    async addQua() {
      let parmas = {
        certificateName: this.form.certificateName,
        certificateType: this.form.certificateType,
        certificateNumber: this.form.certificateNumber,
        certificateDate: this.form.certificateDate ? dateFormatter(this.form.certificateDate) : '',
        effectiveDate: this.form.effectiveDate ? dateFormatter(this.form.effectiveDate) : '',
        organization: this.form.organization
      }
      let res = await addQuaInfo(parmas);
      const { success, message } = res;
      if (success) {
        this.$notify({
          title: "成功提示",
          message: '添加资质信息成功!',
          type: 'success'
        });
        this.$router.push({ name: 'qualification' });
      } else {
        this.$notify({
          title: "错误提示",
          message: message,
          type: 'error'
        });
      }
    },
    reset() {
      this.$refs.form.resetFields();
    }
  }
}
</script>

<style lang="less" scoped>
@vw: 19.2vw;
.addQua {
  background-color: #ffffff;
  &-header {
    height: 59/@vw;
    border-bottom: 1/@vw solid #ebecee;
    display: flex;
    align-items: center;
    font-size: 16/@vw;
    color: #7a7a7a;
    padding-left: 30/@vw;
  }
  &-form {
    width: 500/@vw;
    padding-left: 150/@vw;
    .el-form {
      margin-top: 46/@vw;
      font-size: 14/@vw;
      .el-form-item{
        .el-form-item__content{
          .el-input__inner{
            width: 400/@vw;
            height: 44/@vw;
          }
          .el-button {
            width: 88/@vw;
            height: 36/@vw;
            line-height: 36/@vw;
            border-radius: 18/@vw;
            border: solid 1/@vw #959fbb;
            padding: 0;
          }
        }
      }
      .el-select {
        width: 100%;
      }
      .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 100%;
      }
    }
  }
}
</style>

