<template>
  <div class="document">
    <DocumentSearch @documentSerach="documentSerach" />
    <LeftSearch class="left-search"
                @currentProj="currentProj" />
    <div class="document-content">
      <div class="select-radio">
        <!-- <el-radio v-model="radio" label="1">按时间排序</el-radio>
        <el-radio v-model="radio" label="2">按项目排序</el-radio> -->
        <div @click="downloadData">
          <img src="images/icon_下载.png"
               alt />
          <span>下载</span>
        </div>
        <div @click="Upload">
          <img src="images/icon_上传.png"
               alt />
          <span>上传</span>
        </div>
        <div @click="delData">
          <img src="images/icon_删除.png"
               alt />
          <span>删除</span>
        </div>
        <div style="width: 125px"
             @click="newFolder">
          <img src="images/icon-新建文件夹.png"
               alt=""><span>新增文件夹</span>
        </div>
        <div style="width: 125px"
             class="tempdown"
             @click="downloadTemp">
          <img src="images/icon-Excel.png"
               alt="">
          <span>模板下载</span>
        </div>
        <div @click="exportTemp"
             class="handexcel">
          <span>模板导出</span>
        </div>
        <div @click="importTemp"
             class="handexcel">
          <span>模板导入</span>
        </div>
        <div @click="exportTran"
             class="handexcel">
          <span>转移导出</span>
        </div>
        <div @click="importTran"
             class="handexcel">
          <span>转移导入</span>
        </div>
      </div>
      <div class="content-tree">
        <el-table ref="treeData"
                  :data="treeData"
                  row-key="id"
                  @select-all="selectAll"
                  @select="select"
                  lazy
                  :load="loadTreeData"
                  :tree-props="{children: 'children'}">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="文档名称"
                           :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>
                <!-- <img src='images/icon_文件夹.png' alt=''> -->
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
            </template>
          </el-table-column>
          <!-- <el-table-column prop="documentNumber" label="文档编号"></el-table-column> -->
          <el-table-column prop="adress"
                           label="文档路径"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="uploadTime"
                           label="修改时间"
                           :formatter="timeFormat"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <img v-show="scope.row.folder  != 0"
                   src="images/icon-新建文件夹2.png"
                   alt=""
                   title="新增文件夹"
                   style="margin-right: 15px;"
                   @click="onAdd(scope.row)">
              <img v-show="scope.row.folder  != 0"
                   src="images/icon-编辑2.png"
                   alt=""
                   title="编辑"
                   style="margin-right: 15px"
                   @click="onEdit(scope.row)">
              <img src="images/icon_删除2.png"
                   alt=""
                   title="删除"
                   style="margin-right: 15px"
                   @click="onDel(scope.row)">
              <img v-show="scope.row.folder  != 0"
                   src="images/icon_上传2.png"
                   alt=""
                   title="上传"
                   style="margin-right: 15px"
                   @click="onUpload(scope.row)">
              <img v-show="scope.row.folder === 0"
                   src="images/icon_下载2.png"
                   alt=""
                   title="下载"
                   @click="downloadFile(scope.row)">
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination background
                     layout="prev, pager, next"
                     :current-page.sync="currentPage"
                     :page-size="pageSize"
                     :total="totalPage"
                     @current-change="handleCurrentChange">
      </el-pagination>
    </div>

    <el-dialog :visible.sync="dialogVisible"
               width="30%"
               :inline="true"
               :before-close="dialogClose">
      <el-form ref="form1"
               :model="form"
               label-width="85px"
               :rules="formRule"
               :hide-required-asterisk="true">
        <el-form-item label="文件夹名:"
                      prop="documentName"
                      v-if="handlStatus !== 'upload'">
          <el-input v-model="form.documentName"></el-input>
        </el-form-item>
        <el-form-item label="版本号:"
                      prop="version"
                      v-if="handlStatus === 'upload'">
          <el-input v-model="form.version"></el-input>
        </el-form-item>
        <el-form-item label="是否覆盖:"
                      prop="isReplace"
                      v-if="handlStatus === 'upload'">
          <el-switch v-model="form.isReplace"
                     :active-value="1"
                     :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="涉密等级:"
                      prop="secrecyLevel"
                      v-if="handlStatus === 'upload'">
          <el-select v-model="form.secrecyLevel">
            <el-option v-for="(item, index) in leveloptions"
                       :key="index"
                       :value="item.value"
                       :label="item.label">{{item.label}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件上传:"
                      prop="load"
                      v-show="handlStatus === 'upload'">
          <el-upload ref="upload"
                     class="export-proj"
                     :headers="headers"
                     :action="uploadurl"
                     :show-file-list="true"
                     :on-success="handleSuccess"
                     :on-error="handleError"
                     :file-list="fileList"
                     :limit="1"
                     :before-upload="beforUpload"
                     :auto-upload="false"
                     :data="uploadData">
            <i class="el-icon-plus"></i>
            <div slot="tip">只能上传一个文件且大小不能超过100M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="operation">
        <el-button size="medium"
                   style="color: #737373;border: 1px solid #b5b7bf;margin-right: 40px;"
                   @click="cancel(0,'form1')">取消</el-button>
        <el-button size="medium"
                   type="primary"
                   @click="submitData">保存</el-button>
      </div>
    </el-dialog>

    <!-- 转移导入  模板导入 -->
    <el-dialog :visible.sync="exportVisible"
               width="30%"
               :inline="true"
               :before-close="dialogClose2">
      <el-form ref="form2"
               :model="form"
               label-width="85px"
               :rules="formRule"
               :hide-required-asterisk="true">
        <el-form-item label="文件路径:">
          <el-input v-model="form.filePath"></el-input>
        </el-form-item>
        <el-form-item label="文件上传:"
                      prop="load">
          <el-upload ref="exportupload"
                     class="export-proj"
                     :headers="headers"
                     :action="exportDataUrl"
                     :on-success="exportSuccess"
                     :on-error="exportError"
                     :show-file-list="true"
                     :limit="1"
                     :before-upload="beforexpUpload"
                     :auto-upload="false"
                     :data="exportData">
            <i class="el-icon-plus"></i>
            <div slot="tip">只能选择一个文件且大小不能超过100M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="operation">
        <el-button size="medium"
                   style="color: #737373;border: 1px solid #b5b7bf;margin-right: 40px;"
                   @click="cancel(1,'form2')">取消</el-button>
        <el-button size="medium"
                   type="primary"
                   @click="submitexport">保存</el-button>
      </div>
    </el-dialog>

    <importMsg v-show="showMessage"
               :data="importMessage"
               :detailvisable="1"
               @closeMessage="closeMessage"></importMsg>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import DocumentSearch from "@/components/document-search/index.vue";
import LeftSearch from "@/components/left-search/index.vue";
import dragTreeTable from "@/components/treetable/dragTreeTable.vue";
import importMsg from "@/components/importMsg/index.vue";
import {
  projectDataList,
  addProjData,
  delProjData,
  editProjData,
  uploadProjData,
  downloadProjData,
  listForChild,
  downloadProjDataCheck
} from "../../requestData/index";
import { treeData } from "@/utils/index";
import { downloadBuffer } from "@/utils/index";
@Component({
  components: {
    DocumentSearch,
    LeftSearch,
    dragTreeTable,
    importMsg
  },
  filters: {}
})
export default class DocumentManage extends Vue {
  private radio: string = "";
  private tableData: any[] = [];
  private currentfolder: string = "";
  private treeData: any[] = [];
  private exportDataUrl: string = `${
    (window as any).globalUrl.baseURL
  }/projectData/import`;
  private headers: any = {
    token: JSON.parse((sessionStorage as any).getItem("userinfo")).token
  };
  private exportData: any = {
    sourceType: 1,
    filePath: "1231"
  };
  private showMessage: boolean = false;
  private importMessage: any[] = [];
  private formRule: any = {
    documentName: [
      {
        trigger: "blur",
        validator: (rule: any, value: string, callback: Function) => {
          if (!value) {
            return callback(new Error("请输入文件名"));
          } else if (/^[\/\\"<>\?\*\|]/gi.test(value)) {
            return callback(new Error('文件名不能包含/:*?"<>|字符'));
          } else {
            callback();
          }
        }
      }
    ],
    version: [{ message: "请输入版本号", trigger: "blur" }],
    secrecyLevel: [
      { required: true, message: "请选择涉密等级", trigger: "change" }
    ],
    load: [
      // {required: true, message: '请上传文件', trigger: 'change'}
    ],
    filePath: [{ required: true, message: "请输入文件路径", trigger: "blur" }]
  };
  private selectlist: any[] = [];
  private selectedData: object = {};
  private selectedDatas: any[] = [];
  private parentId: string = "0";
  private folder: number = 0;
  private handlStatus: string = "";
  private currentPage: number = 1;
  private pageSize: number = 10;
  private totalPage: number = 0;
  private currentProjId: string = "";
  private currentDocName: string = "";
  private currentDocAlias: string = "";
  private uploadData: any = {};
  private uploadurl = `${(window as any).globalUrl.baseURL}/projectData/upload`;
  private leveloptions: any[] = [
    { value: "0", label: "非密" },
    { value: "1", label: "秘密" },
    { value: "2", label: "机密" },
    { value: "3", label: "绝密" }
  ];
  private dialogVisible: boolean = false;
  private exportVisible: boolean = false;
  private form: object = { secrecyLevel: "" };
  private imgs: any[] = [
    { type: [""], img: "images/icon_文件夹.png" },
    { type: ["txt"], img: "images/icon_txt.png" },
    { type: ["doc", "docx"], img: "images/icon-word.png" },
    { type: ["xls", "xlsx"], img: "images/excel.png" },
    { type: ["pdf"], img: "images/pdf.png" },
    { type: ["ppt"], img: "images/ppt.png" },
    {
      type: [
        "webp",
        "bmp",
        "pcx",
        "tif",
        "gif",
        "jpg",
        "tga",
        "exif",
        "fpx",
        "svg",
        "psd",
        "cdr",
        "pcd",
        "dxf",
        "ufo",
        "eps",
        "ai",
        "png",
        "hdri",
        "raw",
        "wmf",
        "flic",
        "emf",
        "ico"
      ],
      img: "images/图片.png"
    },
    {
      type: [
        "mpeg",
        "avi",
        "navi",
        "asf",
        "mov",
        "wmv",
        "3gp",
        "rm",
        "rmvb",
        "flv",
        "f4v",
        "h.264",
        "h.265"
      ],
      img: "images/视频.png"
    },
    {
      type: [
        "md",
        "html",
        "tmp",
        "wps",
        "rtf",
        "int",
        "sys",
        "dll",
        "adt",
        "dot"
      ],
      img: "images/文件.png"
    },
    {
      type: ["7z", "bzip2", "gzip", "rar", "wim", "xz", "zip"],
      img: "images/压缩包.png"
    }
  ];
  private fileList: any[] = [];
  private selectParentid: any[] = [];
  private maps: Map<string, any> = new Map();
  private createChildPid: string = "";
  private created(): void {
    if (!this.$route.query.id) {
      this.initData();
    }
  }
  private async initData(): Promise<any> {
    let params = {
      parentId: this.parentId,
      projectId: this.currentProjId,
      documentName: this.currentDocName,
      documentAlias: this.currentDocAlias,
      nowPage: this.currentPage,
      pageSize: this.pageSize
      // folder: this.folder
    };
    const res = await projectDataList(params);
    const { isSuccess, list, recordCount } = res as any;
    if (isSuccess) {
      // this.tableData = list;
      (this as any).treeData = list;
      (this as any).totalPage = recordCount;
    }
  }
  private timeFormat(row: any, column: any) {
    //时间格式化
    //string.prototype.padStart(几位， 用什么代替)在前面补全字符串，padEnd()在后面补全
    let y = new Date(row.uploadTime).getFullYear();
    let m = (new Date(row.uploadTime).getMonth() + 1)
      .toString()
      .padStart(2, "0");
    let d = new Date(row.uploadTime)
      .getDate()
      .toString()
      .padStart(2, "0");
    let hh = new Date(row.uploadTime)
      .getHours()
      .toString()
      .padStart(2, "0");
    let MM = new Date(row.uploadTime)
      .getMinutes()
      .toString()
      .padStart(2, "0");
    let ss = new Date(row.uploadTime)
      .getSeconds()
      .toString()
      .padStart(2, "0");
    return `${y}-${m}-${d} ${hh}:${MM}:${ss}`;
  }
  private currentProj(item: any) {
    // 选择项目  加载项目文档资料
    (this as any).currentDocName = "";
    (this as any).currentDocAlias = ""; // 选择项目的时候清空搜索条件
    let id = item.id;
    (this as any).currentProjId =
      this.$route.query.flag === "true" &&
      (id === "" || id === undefined || id === null)
        ? JSON.parse((sessionStorage as any).getItem("projDetail")).id
        : id;
    (this as any).parentId = "0";
    // debugger
    (this as any).treeData = [];
    this.initData();
  }
  private async documentSerach(searchvalue: string, type: any, isGlobal: boolean): Promise<any> {
    // 搜索
    (this as any).treeData = [];
    this.currentDocName = searchvalue;
    this.currentDocAlias = type;
    if (["1", "2", "3", "4"].includes(type)) {
      this.parentId = "";
    } else {
      // 当前是综合，如果输入值parentId为''， 如果没有输入值就是0
      this.parentId = searchvalue ? "" : "0";
    }
    // this.parentId = '';

    this.initData();
  }
  private newFolder() {
    this.form = {};
    this.dialogVisible = true;
    this.handlStatus = "add";
  }
  private async downloadData(): Promise<any> {
    if (this.selectlist.length === 0) {
      (this as any).$message.info("您还未选择任何文件夹!");
      return;
    }
    let params = {
      ids: this.selectlist.join(",")
    };
    console.log(params);
    let res = await downloadProjDataCheck(params);
    let { success, body, message } = res as any;
    if (success) {
      window.location.href = `${
        (window as any).globalUrl.baseURL
      }/projectData/download?ids=${this.selectlist.join(",")}&token=${
        JSON.parse((sessionStorage as any).getItem("userinfo")).token
      }`;
    } else {
      // this.showMessage = true;
      // this.importMessage = body;
      this.$message.error(message);
    }
    (this as any).$refs.treeData.clearSelection();
    this.selectlist = [];
  }
  private downloadTemp(): void {
    window.location.href = `${
      (window as any).globalUrl.baseURL
    }/importTemplate/importProjectDataTemplate.xlsx`;
  }
  private exportTemp(): void {
    window.location.href = `${
      (window as any).globalUrl.baseURL
    }/projectData/exportData?documentName=${
      this.currentDocName
    }&documentAlias=${this.currentDocAlias}&projectId=${
      this.currentProjId
    }&exportType=0&token=${
      JSON.parse((sessionStorage as any).getItem("userinfo")).token
    }`;
  }
  private importTemp(): void {
    this.exportVisible = true;
    this.exportData.sourceType = 0;
    // console.log((this as any).form.filePath)
    this.exportData.filePath = (this as any).form.filePath;
  }
  private exportTran(): void {
    console.log(this.selectlist);
    window.location.href = `${(window as any).globalUrl.baseURL}/projectData/export?ids=${this.selectlist}&projectId=${this.currentProjId}&exportType=1&token=${JSON.parse(((sessionStorage as any)).getItem('userinfo')).token}`;
  }
  private importTran(): void {
    this.exportVisible = true;
    this.exportData.sourceType = 1;
    this.exportData.filePath = (this as any).form.filePath;
  }
  private submitexport() {
    (this as any).$refs.exportupload.submit();
  }
  private selectAll(item: any) {
    this.selectlist = [];
    this.selectParentid = [];
    item.forEach((element: any) => {
      this.selectlist.push(element.id);
      this.selectParentid.push(element.parentId);
    });
  }
  private select(item: any) {
    console.log(item);
    this.selectedDatas = item;
    this.selectlist = [];
    this.selectedData = item[0];
    item.forEach((element: any) => {
      this.selectlist.push(element.id);
    });
  }
  private loadTreeData(tree: any, treeTable: any, resolve: Function): void {
    let pid = tree.id;
    this.maps.set(pid, { tree, treeTable, resolve });
    //懒加载数据
    // console.log(tree)
    setTimeout(async () => {
      let params = {
        id: tree.id
      };
      const res: any = await listForChild(params);
      if (res.list.length === 0) {
        this.$set(
          (this as any).$refs.treeData.store.states.lazyTreeNodeMap,
          pid,
          []
        );
      }
      resolve(res.list);
    }, 100);
  }
  private beforUpload(file: File) {
    let limit = file.size / 1024 / 1024 < 100;
    if (limit) {
      this.uploadData = {
        isReplace: (this as any).form.isReplace,
        parentId: (this as any).form.id,
        projectId: (this as any).form.projectId,
        secrecyLevel: (this as any).form.secrecyLevel,
        version: (this as any).form.version ? (this as any).form.version : ""
      };
      let promise = new Promise(resolve => {
        this.$nextTick(() => {
          resolve(true);
        });
      });
      return promise;
    } else {
      this.$message.error("文件大小超过了100M！");
    }
  }
  private async handleClick(item: any) {
    if (item.folder === 0) {
      return;
    } else {
      let params = {
        id: item.id
      };
      const res = await listForChild(params);
      this.$set(item, "children", (res as any).list);
    }
  }
  private Upload(): void {
    this.form = {};
    if (this.selectlist.length > 0 && this.selectlist.length < 2) {
      this.dialogVisible = true;
      (this as any).form.id = (this as any).selectedData.id;
      (this as any).form.projectId = (this as any).selectedData.projectId;
      (this as any).handlStatus = "upload";
      (this as any).createChildPid = (this as any).selectedData.id;
      // console.log(this.selectedData);
    } else {
      this.$message("只能选择一个文件上传！");
      //清空CheckBox
      (this as any).$refs.treeData.clearSelection();
      this.selectlist = [];
    }
    // console.log(this.form.parentId)
  }
  private handleSuccess() {
    // 上传成功的回调函数
    this.$message.success("上传成功！");
    (this as any).$refs.upload.clearFiles();
    this.fileList = [];
    let { tree, treeTable, resolve } = this.maps.get(
      this.createChildPid
    ) as any;
    this.loadTreeData(tree, treeTable, resolve);
    (this.$refs.form1 as any).resetFields();
  }
  private handleError() {
    // 上传失败的回调函数
    this.$message.error("上传失败！");
    (this as any).$refs.form.resetFields(); //清除校验
    this.form = {};
  }
  private beforexpUpload(file: File) {
    // 对文件大小进行限制
    let limit = file.size / 1024 / 1024 < 100;
    if (limit) {
      this.exportData.filePath = (this as any).form.filePath;
    } else {
      this.$message.error("文件大小超过了100M！");
    }
  }
  private exportSuccess(res: any) {
    // 导入成功的回调函数
    if (res.success) {
      if (res.body.length) {
        this.showMessage = true;
        this.importMessage = res.body;
      }
      // 刷新
      this.initData();
    } else {
      this.$message.error(res.message ? res.message : "导入失败！");
    }
    // console.log(res.body);
    this.exportVisible = false;
    (this as any).$refs.exportupload.clearFiles();
    (this as any).$refs.form.resetFields(); //清除校验
    this.form = {};
  }
  private exportError() {
    // 导入失败的回调函数
    this.$message.error("导入失败！");
    // this.form = {};
  }
  private delData() {
    if (this.selectlist.length === 0) {
      (this as any).$message.info("您还未选择任何文件夹!");
      return;
    }
    this.$confirm(`此操作将永久删除, 是否继续?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let params = {
          ids: this.selectlist.join(",")
        };
        let res = await delProjData(params);
        if ((res as any).success) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.initData();
          // let pid2 = this.selectedData.parentId;
          // if (pid2 && this.maps.has(pid2)) {
          //   let { tree, treeTable, resolve } = this.maps.get(pid2) as any;
          //   this.loadTreeData(tree, treeTable, resolve);
          // }
          this.selectedDatas.forEach(item => {
            let pid = item.parentId;
            if (pid && this.maps.has(pid)) {
              let { tree, treeTable, resolve } = this.maps.get(pid) as any;
              this.loadTreeData(tree, treeTable, resolve);
            }
          });
          this.selectParentid.forEach(item => {
            let pid = item;
            if (pid && this.maps.has(pid)) {
              let { tree, treeTable, resolve } = this.maps.get(pid) as any;
              this.loadTreeData(tree, treeTable, resolve);
            }
          });
        } else {
          this.$message.error('删除失败！')
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }
  private onAdd(item: any): void {
    (this as any).handlStatus = "add";
    this.form = {};
    (this as any).form.id = item.id;
    (this as any).form.projectId = item.projectId;
    (this as any).currentfolder = item.folder;
    this.dialogVisible = true;
  }
  private async onEdit(item: any): Promise<any> {
    (this as any).handlStatus = "edit";
    this.form = Object.assign({}, this.form, item);
    (this as any).currentfolder = item.folder;
    this.dialogVisible = true;
    console.log(this.form);
  }
  private async onDel(item: any): Promise<any> {
    let pid = item.parentId;
    this.$confirm(`此操作将永久删除${item.documentName}, 是否继续?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let params = {
          ids: item.id
        };
        let res = await delProjData(params);
        if ((res as any).success) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.initData();
          if (pid && this.maps.has(pid)) {
            let { tree, treeTable, resolve } = this.maps.get(pid) as any;
            this.loadTreeData(tree, treeTable, resolve);
          }
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }
  private async onUpload(item: any) {
    (this as any).dialogVisible = true;
    (this as any).handlStatus = "upload";
    (this as any).form.id = item.id;
    (this as any).form.projectId = item.projectId;
    this.createChildPid = item.id;
  }
  private async downloadFile(item: any) {
    //文件下载
    let id = item.id;
    let params = {
      ids: id
    };
    let res = await downloadProjDataCheck(params);
    let { success, body, message } = res as any;
    if (success) {
      let downloadUrl = `${
        (window as any).globalUrl.baseURL
      }/projectData/download?ids=${id}&token=${
        JSON.parse((sessionStorage as any).getItem("userinfo")).token
      }`;
      window.location.href = downloadUrl;
    } else {
      this.$message.error("下载失败！");
    }
  }

  private submitData(): void {
    let res = null,
      params = null,
      pid: string = '',
      pid2: string = '';
    (this as any).$refs.form1.validate(async (valid: boolean) => {
      if (valid) {
        switch (this.handlStatus) {
          case "upload":
            (this as any).$refs.upload.submit();
            break;
          case "edit":
            pid = (this as any).form.parentId;
            pid2 = (this as any).form.id;
            // let pid2 = this.form.id;
            params = {
              id: (this as any).form.id,
              documentName: (this as any).form.documentName
            };
            res = await editProjData(params);
            console.log(this.form);
            break;
          case "add":
            params = {
              adress: "",
              documentAlias: "",
              documentName: (this as any).form.documentName,
              folder: 1,
              parentId: (this as any).form.id || 0,
              projectId: (this as any).currentProjId
            };
            if (!params.projectId) {
              this.$message.info("请选择一个项目再新增文件夹!");
            } else {
              res = await addProjData(params);
              let { success } = res as any;
              let pid = (this as any).form.id;
              if (success) {
                this.initData();
                if (pid && this.maps.has(pid)) {
                  let { tree, treeTable, resolve } = this.maps.get(pid) as any;
                  this.loadTreeData(tree, treeTable, resolve);
                }
              }
            }
        }
        this.dialogVisible = false;
        this.initData();
        if (pid && this.maps.has(pid)) {
          // 编辑名字
          let { tree, treeTable, resolve } = this.maps.get(pid) as any;
          this.loadTreeData(tree, treeTable, resolve);
        }
        if (pid2 && this.maps.has(pid2)) {
          let { tree, treeTable, resolve } = this.maps.get(pid2) as any;
          this.loadTreeData(tree, treeTable, resolve);
        }
        this.$forceUpdate(); // 强制刷新
        (this as any).$refs.form.resetFields(); //清除校验
        this.form = {};
      }
    });
  }
  private handleCurrentChange(val: number) {
    this.currentPage = val;
    this.initData();
  }
  private closeMessage(item: boolean): void {
    this.showMessage = item;
  }
  private cancel(val: number, form: string) {
    if (val === 0) {
      this.dialogVisible = false;
      (this.$refs.upload as any).clearFiles();
    } else {
      this.exportVisible = false;
      (this.$refs.exportupload as any).clearFiles();
      this.form = {filePath: ''};
    }
    // this.$refs.form.clearValidate();
    (this.$refs[form] as any).resetFields();
  }
  private dialogClose() {
    // this.form = { documentName: "", secrecyLevel: "" };
    // this.$refs.form.clearValidate();
    (this.$refs.form1 as any).resetFields();
    (this.$refs.upload as any).clearFiles();
    this.dialogVisible = false;
  }
  private dialogClose2() {
    // this.$refs.form.clearValidate();
    this.form = {filePath: ''};
    (this.$refs.form2 as any).resetFields();
    (this.$refs.exportupload as any).clearFiles();
    this.exportVisible = false;
  }
}
</script>
<style lang="less" >
@fontsize: 14px;
.document {
  .left-search {
    float: left;
    margin-top: 10px;
  }
  .document-content {
    margin-top: 10px;
    float: left;
    width: calc(100% - 250px);
    background-color: #ffffff;
    .select-radio {
      padding: 15px 0;
      text-align: left;
      margin: 0 20px;
      display: flex;
      justify-content: flex-end;
      div {
        float: right;
        height: 34px;
        line-height: 34px;
        margin-right: 16px;
        width: 88px;
        background-color: #1696ef;
        border-radius: 2px;
        font-size: @fontsize;
        color: #ffffff;
        cursor: pointer;
        img {
          vertical-align: middle;
          margin: 0 6px 0 18px;
        }
      }
      .tempdown {
        background-color: #ffffff;
        color: #575757;
      }
      .handexcel {
        text-align: center;
        width: 100px;
      }
    }
    .content-tree {
    }
    .el-table {
      padding: 0 15px;
      .headerClassName {
        th {
          background: #f3f4f9;
        }
      }
      .el-table_1_column_6 {
        .cell {
          img {
            cursor: pointer;
          }
        }
      }
    }
  }

  .is-background {
    text-align: right;
    .el-pager {
      .active {
        background-color: #8c96b0 !important;
      }
    }
  }

  .el-select {
    width: 100%;
  }
  .el-form-item__content {
    text-align: left;
  }
}
</style>
<style>
.export-proj .el-upload {
  width: 50px;
  height: 30px;
  line-height: 30px;
  border: 1px dotted #818080;
}
.export-proj .el-upload .el-icon-plus {
  font-size: 16px;
}
</style>
