<template>
  <div class="addBid">
    <div class="addBid-header">新增投标</div>
    <div class="addBid-form">
      <el-form ref="form"
               :model="form"
               label-width="140px"
               label-position="left"
               :inline="true">
        <el-form-item label="投标负责部门编号">
          <el-input placeholder="请输入投标负责部门编号"
                    v-model="form.departmentCode" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input placeholder="请输入名称"
                    v-model="form.bidName" />
        </el-form-item>
        <el-form-item label="标段">
          <el-input placeholder="请输入标段"
                    v-model="form.section" />
        </el-form-item>
        <el-form-item label="预算金额">
          <el-input placeholder="请输入预算金额"
                    v-model="form.budget">
                    <i slot="suffix">(万元)</i>
          </el-input>
        </el-form-item>
        <el-form-item label="采购单位">
          <el-input placeholder="请输入采购单位"
                    v-model="form.procurementUnit" />
        </el-form-item>
        <el-form-item label="投标性质">
          <el-input placeholder="请输入投标性质"
                    v-model="form.sign" />
        </el-form-item>
        <el-form-item label="申请人">
          <!-- <el-input placeholder="请输入申请人"
                    v-model="form.proposer" /> -->
          <el-select 
            filterable 
            clearable 
            remote 
            v-model="form.proposer"
            :remote-method="palremoteMethod" 
            :loading="loading"
            placeholder="请输入申请人">
              <el-option  v-for="item in palOption" :key="item.id" :label="item.username" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="协调人">
          <!-- <el-input placeholder="请输入协调人"
                    v-model="form.coordinator" /> -->
          <el-select 
            filterable 
            clearable 
            remote 
            v-model="form.coordinator"
            :remote-method="palremoteMethod" 
            :loading="loading"
            placeholder="请输入协调人">
              <el-option  v-for="item in palOption" :key="item.id" :label="item.username" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目报名人">
          <!-- <el-input placeholder="请输入项目报名人"
                    v-model="form.projectApply" /> -->
          <el-select 
            filterable 
            clearable 
            remote 
            v-model="form.projectApply"
            :remote-method="palremoteMethod" 
            :loading="loading"
            placeholder="请输入项目报名人">
              <el-option  v-for="item in palOption" :key="item.id" :label="item.username" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标书编制人">
          <!-- <el-input placeholder="请输入标书编制人"
                    v-model="form.bidEditor" /> -->
          <el-select 
            filterable 
            clearable 
            remote 
            v-model="form.bidEditor"
            :remote-method="palremoteMethod" 
            :loading="loading"
            placeholder="请输入标书编制人">
              <el-option  v-for="item in palOption" :key="item.id" :label="item.username" :value="item.id"></el-option>
          </el-select>    
        </el-form-item>
        <el-form-item label="现场投标人">
          <!-- <el-input placeholder="请输入现场投标人"
                    v-model="form.bidor" /> -->
          <el-select 
            filterable 
            clearable 
            remote 
            v-model="form.bidor"
            :remote-method="palremoteMethod" 
            :loading="loading"
            placeholder="请输入现场投标人">
              <el-option  v-for="item in palOption" :key="item.id" :label="item.username" :value="item.id"></el-option>
          </el-select>  
        </el-form-item>
        <el-form-item label="合作单位">
          <el-input placeholder="请输入合作单位"
                    v-model="form.cooperator" />
        </el-form-item>
        <el-form-item label="保证金额">
          <el-input placeholder="请输入保证金额"
                    v-model="form.cashDeposit" >
                    <i slot="suffix">(万元)</i>
          </el-input>
        </el-form-item>
        <el-form-item label="开标时间">
          <el-date-picker v-model="form.bidOpeningTime"
                          type="datetime"
                          placeholder="请选择开标时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="中标单位">
          <el-input placeholder="请输入中标单位"
                    v-model="form.bidUnit" />
        </el-form-item>
        <el-form-item label="中标金额">
          <el-input placeholder="请输入中标金额"
                    v-model="form.bidPrice" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input placeholder="请输入备注"
                    v-model="form.remark" />
        </el-form-item>
        <el-form-item label="投标申请单编号">
          <el-input placeholder="请输入投标申请单编号"
                    v-model="form.taskNumber" />
        </el-form-item>
        <el-form-item label="投标申请单是否提交">
          <el-switch v-model="form.taskSubmit"
                     :active-value="1"
                     :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">取消</el-button>
          <el-button @click="addBid">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { saveBidInfo } from '@/api/bid.js';
import { getPersonlist } from "@/api/person";
import {dateFormatter} from '@/libs/util.js';
export default {
  data () {
    return {
      loading: false,
      palOption: [],
      form: {
        departmentCode: '',
        bidName: '',
        section: '',
        budget: '',
        procurementUnit: '',
        sign: '',
        proposer: '',
        coordinator: '',
        projectApply: '',
        bidEditor: '',
        bidor: '',
        cooperator: '',
        cashDeposit: '',
        bidOpeningTime: '',
        bidUnit: '',
        bidPrice: '',
        remark: '',
        taskSubmit: 0,
        taskNumber: ''
      }
    }
  },
  computed: {

  },
  methods: {
    palremoteMethod(query) {
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
    async addBid () {
      let parmas = {
        departmentCode: this.form.departmentCode,
        bidName: this.form.bidName,
        section: this.form.section,
        budget: this.form.budget,
        procurementUnit: this.form.procurementUnit,
        sign: this.form.sign,
        proposer: this.form.proposer,
        coordinator: this.form.coordinator,
        projectApply: this.form.projectApply,
        bidEditor: this.form.bidEditor,
        bidor: this.form.bidor,
        cooperator: this.form.cooperator,
        cashDeposit: this.form.cashDeposit,
        bidOpeningTime: this.form.bidOpeningTime ? dateFormatter(this.form.bidOpeningTime) : '',
        bidUnit: this.form.bidUnit,
        bidPrice: this.form.bidPrice,
        remark: this.form.remark,
        taskSubmit: this.form.taskSubmit,
        taskNumber: this.form.taskNumber
      };
      let res = await saveBidInfo(parmas);
      const { success, message } = res;
      if (success) {
        this.$notify({
          title: "成功提示",
          message: '添加投标信息成功!',
          type: 'success'
        });
        this.$router.push({ name: 'Bid' });
      } else {
        this.$notify({
          title: "错误提示",
          message: message,
          type: 'error'
        });
      }
    },
    reset () {
      this.$refs.form.resetFields();
    }
  }
}
</script>
<style lang="less" scope>
@vw: 19.2vw;
.addBid {
  background-color: #ffffff;
  &-header {
    height: 59 / @vw;
    border-bottom: 1 / @vw solid #ebecee;
    display: flex;
    align-items: center;
    font-size: 16 / @vw;
    color: #7a7a7a;
    padding-left: 30 / @vw;
  }
  &-form {
    // width: 500/@vw;
    padding-left: 150 / @vw;
    padding-right: 150 / @vw;
    .el-form {
      margin-top: 46 / @vw;
      font-size: 14 / @vw;
      .el-form-item {
        margin-left: 80px;
        .el-form-item__content {
          .el-input__inner {
            width: 400 / @vw;
            height: 44 / @vw;
          }
          .el-button {
            width: 88 / @vw;
            height: 36 / @vw;
            line-height: 36 / @vw;
            border-radius: 18 / @vw;
            border: solid 1 / @vw #959fbb;
            padding: 0;
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
