<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      text-color="#555555"
      active-text-color="#ffffff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "@/libs/bus";
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "el-icon-lx-home",
          index: "dashboard",
          title: "系统首页"
        },
        {
          icon: "el-icon-lx-cascades",
          index: "person",
          title: "人员管理"
        },
        {
          icon: "el-icon-lx-copy",
          index: "project",
          title: "项目管理",
          subs: [
            {
              icon: "el-icon-lx-copy",
              index: "project",
              title: "项目信息"
            },
            {
              icon: "el-icon-lx-copy",
              index: "Contract",
              title: "合同管理"
            },
            {
              icon: "el-icon-lx-copy",
              index: "pTask",
              title: "生产任务管理"
            },
            {
              icon: "el-icon-lx-copy",
              index: "Bid",
              title: "投标管理"
            },
            {
              icon: "el-icon-lx-cascades",
              index: "projectIssue",
              title: "项目问题"
            },
            {
              icon: "el-icon-lx-cascades",
              index: "proRisk",
              title: "项目风险"
            },
            {
              icon: "el-icon-lx-cascades",
              index: "proDocument",
              title: "项目资料管理"
            }
          ]
        },
        {
          icon: "el-icon-lx-cascades",
          index: "qualification",
          title: "资质管理"
        },
        {
          icon: "el-icon-lx-cascades",
          index: "role",
          title: "系统管理",
          subs: [
            {
              icon: "el-icon-lx-cascades",
              index: "role",
              title: "角色管理"
            },
            {
              icon: "el-icon-lx-cascades",
              index: "department",
              title: "组织机构管理"
            }
          ]
        },

        // {
        //   icon: "el-icon-lx-calendar",
        //   index: "3",
        //   title: "表单相关",
        //   subs: [
        //     {
        //       index: "form",
        //       title: "基本表单"
        //     },
        //     {
        //       index: "3-2",
        //       title: "三级菜单",
        //       subs: [
        //         {
        //           index: "editor",
        //           title: "富文本编辑器"
        //         },
        //         {
        //           index: "markdown",
        //           title: "markdown编辑器"
        //         }
        //       ]
        //     },
        //     {
        //       index: "upload",
        //       title: "文件上传"
        //     }
        //   ]
        // },
        // {
        //   icon: "el-icon-lx-emoji",
        //   index: "icon",
        //   title: "自定义图标"
        // },
        // {
        //   icon: "el-icon-pie-chart",
        //   index: "charts",
        //   title: "schart图表"
        // },
        // {
        //   icon: "el-icon-rank",
        //   index: "6",
        //   title: "拖拽组件",
        //   subs: [
        //     {
        //       index: "drag",
        //       title: "拖拽列表"
        //     },
        //     {
        //       index: "dialog",
        //       title: "拖拽弹框"
        //     }
        //   ]
        // },
        // {
        //   icon: "el-icon-lx-global",
        //   index: "i18n",
        //   title: "国际化功能"
        // },
        // {
        //   icon: "el-icon-lx-warn",
        //   index: "7",
        //   title: "错误处理",
        //   subs: [
        //     {
        //       index: "permission",
        //       title: "权限测试"
        //     },
        //     {
        //       index: "404",
        //       title: "404页面"
        //     }
        //   ]
        // },
      ]
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
      bus.$emit("collapse-content", msg);
    });
  }
};
</script>

<style lang="less" scoped>
.sidebar {
  height: 100%;
  min-width: 200px;
  .sidebar-el-menu {
    .el-menu {
      .is-active {
        background-color: #00bbf8;
      }
    }
    .el-menu-item.is-active {
        background-color: #409EFF!important;
    }
  }
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar > ul {
  height: 100%;
}
</style>
