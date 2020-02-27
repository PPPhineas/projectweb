<template>
  <div class="addContract">
    <div class="addContract-header">新增合同</div>
    <div class="addContract-form">
      <el-form ref="form" :model="form"  label-width="130px" label-position="left" :inline="true">
        <el-form-item label="合同编号">
          <el-input placeholder="请输入合同编号" v-model="form.contractNumber"/>
        </el-form-item>
        <el-form-item label="合同名称">
          <el-input  placeholder="请输入合同名称" v-model="form.contractName"/>
        </el-form-item>
        <el-form-item label="合同类型">
          <el-select placeholder="请输入合同类型" v-model="form.contractType">
            <el-option v-for="(item,index) in contractTypelist" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同分类">
          <el-select placeholder="请输入合同分类" v-model="form.contractCategory">
            <el-option v-for="(item,index) in contractCategorylist" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同对方单位名称">
          <el-input placeholder="请输入合同对方单位名称" v-model="form.unit"/>
        </el-form-item>
        <el-form-item label="合同标的">
          <el-input placeholder="请输入合同标的" v-model="form.contractObject"/>
        </el-form-item>
        <el-form-item label="部门">
          <el-input placeholder="请输入部门" v-model="form.departmentCode"/>
        </el-form-item>
        <el-form-item label="合同金额">
          <el-input placeholder="请输入合同金额" v-model="form.contractAmount">
            <i slot="suffix">(万元)</i>
          </el-input>
        </el-form-item>
        <el-form-item label="是否原件">
          <el-switch :active-value="1" :inactive-value="0" v-model="form.isOriginal"></el-switch>
        </el-form-item>
        <el-form-item label="是否验收文件">
          <el-switch :active-value="1" :inactive-value="0" v-model="form.isCheckFile"></el-switch>
        </el-form-item>
        <el-form-item label="是否质检报告">
          <el-switch :active-value="1" :inactive-value="0" v-model="form.isQualityReport"></el-switch>
        </el-form-item>
        <el-form-item label="合同份数">
          <el-input placeholder="请输入合同份数" v-model.number="form.contractCount"/>
        </el-form-item>
        <el-form-item label="签订时间">
          <el-date-picker v-model="form.signTime"  type="datetime" placeholder="请选择签订时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="接收时间">
          <el-date-picker v-model="form.receiveTime"  type="datetime" placeholder="请选择接收时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">取消</el-button>
          <el-button @click="submitContract">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { contractTypelist, contractCategorylist } from './options';
import { addContract } from '@/api/contract';
import {dateFormatter} from '@/libs/util.js';
export default {
  data() {
    return {
      form:{
        signTime: dateFormatter(signTime),
        receiveTime: dateFormatter(receiveTime)
      },
      contractTypelist:contractTypelist,
      contractCategorylist:contractCategorylist
    }
  },
  computed: {

  },
  methods: {
    async submitContract() {
      let parmas = this.form;
      let res = await addContract(parmas);
      const {success,message} = res;
      if (success) {
        this.$notify({
          title: "成功提示",
          message: '新增合同成功!',
          type:'success'
        });
        this.$router.push({name:'Contract'});
      }else {
        this.$notify({
          title: "错误提示",
          message: message,
          type:'error'
        });
      }
    },
    reset() {
      this.$refs.form.resetFields();
    }
  }
}
</script>
<style lang="less" scope>
@vw: 19.2vw;
.addContract {
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
    padding-left: 150/@vw;
    padding-bottom: 34/@vw;
    .el-form {
      margin-top: 46/@vw;
      font-size: 14/@vw;
      .el-form-item{
        width: 530/@vw;
        margin-right: 80/@vw;
        .el-form-item__content{
          .el-input__inner,.el-textarea__inner{
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
          .el-input__suffix {
            color: #606266;
          }
        }
      }
      .el-form-item:last-child {
        display: block;
      }
    }

  }
}
</style>
