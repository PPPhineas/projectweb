<template>
  <div class="document-container">
    <documentSearch @documentSerach="documentSerach"></documentSearch>
    <div class="tableTitle">
      <div>项目资料信息列表 ( 共 {{0}} 条数据 )</div>
      <div class="btn btn-add" @click="toAdd">
        <span></span>
        <span>新增</span>
      </div>
      <div class="btn btn-del" @click="toDel">
        <span></span>
        <span>删除</span>
      </div>
      <div class="btn btn-add" @click="upload">
        <span></span>
        <span>上传</span>
      </div>
      <div class="btn btn-add">
        <span></span>
        <el-upload
            ref="importUpload"
            :action="importAction"
            :headers="importHeader"
            :on-success="importSuccess"
            :show-file-list="false"
            :on-error="importError">
            <p>导入</p>            
          </el-upload>
      </div>
      <div class="btn btn-add" @click="exportData">
        <span></span>
        <span>导出</span>
      </div>
      <div class="btn btn-add" @click="download">
        <span></span>
        <span>下载</span>
      </div>
    </div>
    <leftSearch class="left-search" @currentProj="currentProj" />
    <div class="right-table">
      <el-table ref="treeData"
        :data="treeData"
        row-key="id"
        @select-all="selectAll"
        @select="select"
        lazy
        :load="loadTreeData"
        :tree-props="{hasChildren: 'children'}">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="fileName" label="文档名称" :show-overflow-tooltip="true">
          <!-- <template slot-scope="scope">
            <span>
              <span v-if="scope.row.folder === 1">
                <img src='images/icon_文件夹.png'
                      alt=""
                      style="margin-right: 8px; height: 24px;">
              </span>
              <span v-else
                    v-for="item in imgs"
                    :key="item.img">
                <img :src='item.type.includes(scope.row.documentAlias.toLowerCase()) ? item.img : "images/文件.png"'
                      alt=''
                      style="margin-right: 8px;height: 24px"
                      v-if='item.type.includes(scope.row.documentAlias) ? item.img : ""'>
              </span>
              <span>{{scope.row.documentName}}</span>
            </span>
          </template> -->
        </el-table-column>
        <el-table-column prop="fileNumber" label="文档编号" align="center"></el-table-column>
        <el-table-column prop="address"
                          label="地址"
                          align="center"
                          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploadTime" align="center"
                          label="上传时间"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-button type="primary" size="small" circle icon="el-icon-document-add" @click="handleClick('add', scope.row)"></el-button>
            <div style="display: inline-block;cursor:pointer;margin: 0 5px 0 5px;" @click="handleClick('upload', scope.row)"><i class="el-icon-plus"></i></div>
            <div class="btn-edit" v-waves @click="handleClick('edit', scope.row)"></div>
            <div class="btn-trash" v-waves @click="handleClick('delete', scope.row)"></div>
          </template>
          <!-- <template v-slot="scope">
            <div class="btn-trash" v-waves @click="handleClick('delete', scope.data.row)"></div>
          </template> -->
        </el-table-column>
      </el-table>
      <el-pagination
                     layout="prev, pager, next"
                     :current-page.sync="currentPage"
                     :page-size="pageSize"
                     :total="totalPage"
                     @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    
    <!-- 弹窗 -->
    <data-dialog
      ref="dialog"
      :title="dialogInfo.title[dialogInfo.type]"
      :visible.sync="dialogInfo.visible"
      :width="dialogInfo.width"
      :bt-loading="dialogInfo.btLoading"
      :bt-list="dialogInfo.type === 'view' ? undefined : dialogInfo.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <DataForm 
        ref="Dataform"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :rules="formInfo.rules"
        :label-position="formInfo.labelPosition"
        :label-width="formInfo.labelWidth"
        :inline="formInfo.inline"
        :list-type-info="listTypeInfo">
        <!-- <template v-slot="scope"> -->
          <el-upload
            slot="form-address"
            ref="uploadref"
            :data="uploadPromse"
            :auto-upload="false"
            :show-file-list="true"
            :action="action"
            :onPreview="onPreview"
            :before-upload="beforeUpload"
            :on-change="fileChange"
            :on-success="successFile"
            :on-error="errorFile"  
          >
            <i class="el-icon-plus"></i>
          </el-upload>        
        <!-- </template> -->
      </DataForm>
    </data-dialog>
  </div>
</template>

<script>
import qs from 'qs'
import DataFilter from "@/components/DataFilter";
import documentSearch from '@/components/document-search';
import DataDialog from '@/components/DataDialog';
import DataForm from "@/components/DataForm";
// import DataTreeTable from "@/components/DataTreeTable";
import leftSearch from "@/components/leftSearch/index.vue";
import {getDocumentList, getDocumentChildList, delDocumentInfo} from "@/api/document.js";
export default {
  data () {
    return {
      getDocumentList,
      getDocumentChildList,
      importAction: `${window.globalUrl.HOME_API}/project/project-data/import?importType=1`,
      importHeader: {token: ''},
      importType: 1,
      fileName: '',
      fileType: '',
      treeData: [],
      currentProjName: '',
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      currentProjectId: '',
      maps: new Map(),
      currentSelectlist: [],
      selectParentId: [],
      form: {},
      uploadref:null,
      listTypeInfo:{},
      dialogInfo: {
        width: "30%",
        title: {
          upload: "上传",
          import: "导入"
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
            event: "upload",
            saveLoading: false,
            show: true
          }
        ]
      },
      formInfo: {
        ref: 'dialogInfo',
        labelPosition:'left',
        uploadPromse:null,
        data: {
          fileNumber: '',
          fileName: '',
          // fileType: 0,
          address: '',
          uploadTime: '',
          remark: '',
          uploadref:'uploadref',
          folder: 1
        },
        fieldList : [
          {label: '文档编号', value: 'fileNumber', type: 'input'},
          {label: '文档名称', value: 'fileName', type: 'input'},
          // {label: '文档类型', value: 'fileType', type: 'select', list: 'flagList'},
          // {label: '地址', value: 'address', type: 'input'},
          {label: '上传文件', value: 'address', type: 'slot', action:`${ window.globalUrl.HOME_API}/project/project-data/upload`,autoupload:false, data: {}},
          // {label: '上传时间', value: 'uploadTime', type: 'date'},
          {label: '备注', value: 'remark', type: 'textarea'},
          {label: '是否是文件夹', value: 'folder', type: 'switch', activevalue: 0,inactivevalue: 1},
        ],
        rules: {},
        labelWidth: '120px',
        inline: false
      },
      uploadPromse: {},
      action: `${ window.globalUrl.HOME_API}/project/project-data/upload`,
      headers: ''
    }
  },
  components: {
    DataFilter,
    leftSearch,
    documentSearch,
    DataDialog,
    DataForm
  },
  created () {
    
  },
  mounted () {
    // this.getList();
    this.initData();
  },
  methods: {
    async initData() {
      let params = {
        current: this.currentPage,
        fileName: this.fileName,
        projectNumber: this.currentProjectId,
        size: this.pageSize
      }
      // console.log(params)
      let res = await getDocumentList(params);
      let {success, body} = res;
      if(success) {
        for(let i=0;i<body.records.length;i++) {
          body.records[i].children = body.records[i].children ==  0 ? true : false;
        }
        this.treeData = body.records;
        this.totalPage = body.total;
      }
      // console.log(this.treeData)
    },
    async documentSerach(searchvalue, type, isGlobal) {
      // 搜索
      this.treeData = [];
      this.fileName = searchvalue;
      this.fileType = type;
      // if (["1", "2", "3", "4"].includes(type)) {
      //   this.parentId = 0;
      // } else {
      //   // 当前是综合，如果输入值parentId为''， 如果没有输入值就是0
      //   this.parentId = searchvalue ? "" : "0";
      // }
      this.initData();
    },
    // 获取列表
    getList() {
      this.treeTable.refresh = Math.random();
    },
    // 按钮点击
    handleClick(event, data) {
      // console.log(data)
      const treeTable = this.treeTable;
      const dialogInfo = this.dialogInfo;
      switch (event) {
        // 搜索
        case "search":
          // 重置分页
          // treeTable.initCurpage = Math.random();
          // treeTable.refresh = Math.random();
          // this.currentProjName = this.filterInfo.query.projectName;
          // this.initData();
          break;
        // 创建
        case "upload":
          dialogInfo.type = event;
          dialogInfo.visible = true;
          this.$refs.uploadref.submit();
          break;
        case "add":
          sessionStorage.proDoc = JSON.stringify(data);
          this.$router.push({name: 'addProDoc'})
          break;
        case "edit":
          sessionStorage.proDoc = JSON.stringify(data);
          this.$router.push({name:'editProDoc'});
          break;
        // 查看和编辑
        case "view":
        // falls through 告诉ESlint不检查这一行
        case "import":
          dialogInfo.type = event;
          dialogInfo.visible = true;
          this.articleInfo = JSON.parse(JSON.stringify(data));
          getRowApi(data.id).then(res => {
            if (res.success) {
              this.articleInfo = res.content[0];
            }
          });
          break;
        // 删除
        case "delete":
          let params = qs.stringify({ids:[data.id]},{indices:false})
          this.$handleAPI(event, delDocumentInfo, params).then(res => {
            if (res.success) {
              // this.treeTable.refresh = Math.random();
              this.initData();
              let pid = data.parentId;
              if (pid && this.maps.has(pid)) {
                  let { tree, treeTable, resolve } = this.maps.get(pid);
                  this.loadTreeData(tree, treeTable, resolve);
              }
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
      if(this.currentProjectId) {
        console.log(this.currentSelectlist)
        if(this.currentSelectlist.length) {
          if(this.currentSelectlist[0].length == 1) {
            // 如果有选择文件则保存当前文件， parentId为当前id
            sessionStorage.setItem('proDoc', JSON.stringify(this.currentSelectlist[0][0]));
            this.$router.push({ name: "addProDoc" });
          } else {
            this.$notify({
              title: "信息提示",
              message: '只能选择一个文件夹',
              type: 'info'
            });
          }
        } else {
          // 清除当前保存的项目文档信息 parentId为0
          sessionStorage.removeItem('proDoc');
           this.$router.push({ name: "addProDoc" });
        }
        
      } else {
        this.$notify({
          title: "信息提示",
          message: '请选择项目',
          type: 'info'
        });
      }
    },
    toDel() {
      if (this.currentSelectlist.length === 0) {
        this.$notify({
          title: "错误提示",
          message: "您还未选择任何数据!",
          type: "error"
        });
      } else {
        let params = [];
        this.currentSelectlist[0].forEach(item => {
          params.push(item.id);
        });
        params = qs.stringify({ids:params},{indices:false});
        this.$handleAPI("delete", delDocumentInfo, params).then(
          res => {
            if (res.success) {
              // this.treeTable.refresh = Math.random();
              // debugger
              this.initData();
              this.selectParentId.forEach(item => {
                let pid = item;
                if (pid && this.maps.has(pid)) {
                  let { tree, treeTable, resolve } = this.maps.get(pid);
                  this.loadTreeData(tree, treeTable, resolve);
                }
              });
            }
          }
        );
        
      }
    },
    upload() {
      if(this.currentSelectlist.length && this.currentSelectlist[0].length == 1) {
        this.dialogInfo.visible = true;
      } else {
        this.$notify({
          title: "信息提示",
          message: '请选择一个文件夹上传文件',
          type: 'info'
        });
      }
    },
    exportData() {
      let url = `${window.globalUrl.HOME_API}/project/project-data/export`
      window.open(url, '_blank');
    },
    download() {
      let ids = [], downloadUrl;
      if(this.currentSelectlist.length) {
        this.currentSelectlist[0].forEach((item) => {
          ids.push(item.id)
        })
        downloadUrl = `${window.globalUrl.HOME_API}/project/project-data/download?ids=${ids}`;
        window.location.href = downloadUrl;
      } else {
        this.$confirm('此操作将下载全部文件，是否继续？', '提示', {
          confirmButtonText: '确定',
          concelButtonText: '取消',
        }).then(() => {
          downloadUrl = `${window.globalUrl.HOME_API}/project/project-data/download?ids=0`;
          window.location.href = downloadUrl;
        }).catch(() => {
          this.$notify({
            title: "信息提示",
            message: '请选择要下载的文件',
            type: 'info'
          })
        })
      }
      // console.log(downloadUrl)
    },
    currentProj(item) {
      // 选择项目  加载项目文档资料
      this.currentProjectId = item.projectNumber;
      sessionStorage.setItem('currentProjectId', item.projectNumber);
      this.fileName = "";
      this.currentProjName = item.projectName;
      this.treeData = [];
      this.initData();
    },
    select(item) {
      this.currentSelectlist = [];
      this.selectParentId = [];
      this.currentSelectlist.push(item);
      // debugger
      item.forEach((el) => {
        this.selectParentId.push(el.parentId)
      })
    },
    selectAll(item) {
      this.currentSelectlist = [];
      this.currentSelectlist.push(item);
    },
    loadTreeData(tree, treeTable, resolve) {
      let pid = tree.id;
      this.maps.set(pid, { tree, treeTable, resolve });
       //懒加载数据
      // console.log(tree)
      setTimeout(async () => {
        let params = {
          id: tree.id
        };
        const res = await getDocumentChildList(params);
        if (res.body.length === 0) {
          this.$set(this.$refs.treeData.store.states.lazyTreeNodeMap, pid, []);
        }
        for(let i=0;i<res.body.length;i++) {
          res.body[i].children = res.body[i].children ==  0 ? true : false;
        }        
        resolve(res.body);
      }, 100);
    },
    handleCurrentChange() {

    },
    onPreview(file) {
      
    },
    fileChange(file,fileList) {

    },
    beforeUpload(file) {
      // console.log(file)
      debugger
      let limit = file.size / 1024 / 1024 < 100;
      if (limit) {
        // this.formInfo.fieldList[3].data = {
        //   fileNumber: this.formInfo.data.fileNumber,
        //   fileName: this.formInfo.data.fileName
        // }
        console.log(this.currentSelectlist)
        this.uploadPromse = {
          id: this.currentSelectlist[0][0].id,
          fileNumber: this.formInfo.data.fileNumber,
          fileName: this.formInfo.data.fileName,
          // address: this.formInfo.data.address,
          remark: this.formInfo.data.remark,
          folder: this.formInfo.data.folder
        }
        let promise = new Promise(resolve => {
          this.$nextTick(() => {
            resolve(true);
          });
        });
        return promise;
      } else {
        this.$message.error("文件大小超过了100M！");
      }
    },
    fieldList(file,fileList) {
      
    },
    successFile(response,file,fileList) {
      debugger
      if(response.success) {
        this.dialogInfo.visible = false;
        this.initData();
        this.selectParentId.forEach(item => {
          let pid = item;
          if (pid && this.maps.has(pid)) {
            let { tree, treeTable, resolve } = this.maps.get(pid);
            this.loadTreeData(tree, treeTable, resolve);
          }
        });
      } else {
        this.$notify({
          title: "失败提示",
          message: res.message,
          type: 'error'
        });
      }
      // this.$refs.Dataform.resetFields();
      this.$refs.uploadref.clearFiles();
    },
    errorFile(err,file,fileList) {
      this.$notify({
        title: "失败提示",
        message: '上传失败！',
        type: 'error'
      });
      this.$refs.importUpload.clearFiles(); // 清空文件列表
    },
    importSuccess(res, file, filelist) {
      if(res.success) {
        this.$notify({
          title: "成功提示",
          message: '导入成功！',
          type: 'success'
        });
        this.initData();
        this.$refs.importUpload.clearFiles(); // 清空文件列表
      }
    },
    importError(res) {
      this.$notify({
        title: "失败提示",
        message: '导入失败！',
        type: 'error'
      });
      this.$refs.importUpload.clearFiles(); // 清空文件列表
    }
  }
}
</script>

<style lang="less">
@vw: 19.2vw;
.document-container{
  .tableTitle {
    height: 66 / @vw;
    display: flex;
    align-items: center;
    padding: 0 32 / @vw;
    background-color: #ffffff;
    margin-top: 10px;
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

  .left-search {
    float: left;
    margin-top: 10px;
    width: 16%;
  }
  .right-table {
    background: #ffffff;
    float: left;
    margin-top: 10px;
    margin-left: 20px;
    // width: 80%;
    width: calc(84% - 20px);
    .el-table {
      max-height: 882px;
    }
  }
}
</style>
