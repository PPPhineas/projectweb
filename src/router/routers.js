export default [
  {
    path: "/",
    redirect: "/dashboard"
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/home/index.vue"),
    children: [
      {
        path: "/dashboard",
        component: () => import("@/views/system/index.vue"),
        meta: { title: "系统首页" }
      },
      {
        path: "/person",
        name: "person",
        component: () => import("@/views/person-Management/index.vue"),
        meta: { title: "人员管理" }
      },
      {
        path: "/addperson",
        name: "addperson",
        component: () => import("@/views/person-Management/add.vue"),
        meta: { title: "新增人员" }
      },
      {
        path: "/editperson",
        name: "editperson",
        component: () => import("@/views/person-Management/edit.vue"),
        meta: { title: "编辑人员" }
      },
      {
        path: "/dashboard",
        component: () => import("@/views/system/index.vue"),
        meta: { title: "系统首页" }
      },
      {
        path: "/project",
        name: "project",
        component: () => import("@/views/pro-Management/index.vue"),
        meta: { title: "项目管理" }
      },
      {
        path: "/addPoject",
        name: "addPoject",
        component: () => import("@/views/pro-Management/add.vue"),
        meta: { title: "新增项目" }
      },
      {
        path: "/editPoject",
        name: "editPoject",
        component: () => import("@/views/pro-Management/edit.vue"),
        meta: { title: "编辑项目" }
      },
      {
        path: "/Contract",
        name: "Contract",
        component: () => import("@/views/contract-Management/index.vue"),
        meta: { title: "合同管理" }
      },
      {
        path: "/addContract",
        name: "addContract",
        component: () => import("@/views/contract-Management/add.vue"),
        meta: { title: "新增合同" }
      },
      {
        path: "/editcontract",
        name: "editcontract",
        component: () => import("@/views/contract-Management/edit.vue"),
        meta: { title: "编辑合同" }
      },
      {
        path: "/Bid",
        name: "Bid",
        component: () => import("@/views/bid-Management/index.vue"),
        meta: { title: "投标管理" }
      },
      {
        path: "/addBid",
        name: "addBid",
        component: () => import("@/views/bid-Management/add.vue"),
        meta: { title: "新增投标" }
      },
      {
        path: "/editBid",
        name: "editBid",
        component: () => import("@/views/bid-Management/edit.vue"),
        meta: { title: "编辑投标任务" }
      },
      {
        path: "/pTask",
        name: "pTask",
        component: () => import("@/views/PTask-Management/index.vue"),
        meta: { title: "生产任务管理" }
      },
      {
        path: "/addpTask",
        name: "addpTask",
        component: () => import("@/views/PTask-Management/add.vue"),
        meta: { title: "新增生产任务" }
      },
      {
        path: "/editpTask",
        name: "editpTask",
        component: () => import("@/views/PTask-Management/edit.vue"),
        meta: { title: "编辑生产任务" }
      },
      {
        path: '/qualification',
        name: 'qualification',
        component: () => import("@/views/qua-Management/index.vue"),
        meta: { title: "资质管理" }
      },
      {
        path: '/addQua',
        name: 'addQua',
        component: () => import("@/views/qua-Management/add.vue"),
        meta: { title: "新增资质任务" }
      },
      {
        path: '/editQua',
        name: 'editQua',
        component: () => import("@/views/qua-Management/edit.vue"),
        meta: { title: "编辑资质任务" }
      },
      {
        path: '/projectIssue',
        name: 'projectIssue',
        component: () => import("@/views/proIssue-Management/index.vue"),
        meta: { title: "项目问题" }
      },
      {
        path: '/addProjectIssue',
        name: 'addProjectIssue',
        component: () => import("@/views/proIssue-Management/add.vue"),
        meta: { title: "新增项目问题" }
      },
      {
        path: '/editProIssue',
        name: 'editProIssue',
        component: () => import("@/views/proIssue-Management/edit.vue"),
        meta: { title: "编辑项目问题" }
      },
      {
        path: '/proRisk',
        name: 'proRisk',
        component: () => import("@/views/proRisk-Management/index.vue"),
        meta: { title: "项目风险" }
      },
      {
        path: '/addProRisk',
        name: 'addProRisk',
        component: () => import("@/views/proRisk-Management/add.vue"),
        meta: { title: "新增项目风险" }
      },
      {
        path: '/editProRisk',
        name: 'editProRisk',
        component: () => import("@/views/proRisk-Management/edit.vue"),
        meta: { title: "编辑项目风险" }
      },
      {
        path: '/proDocument',
        name: 'proDocument',
        component: () => import("@/views/proDoc-Management/index.vue"),
        meta: { title: "项目资料管理" }
      },
      {
        path: '/addProDoc',
        name: 'addProDoc',
        component: () => import("@/views/proDoc-Management/add.vue"),
        meta: { title: "新增项目资料" }
      },
      {
        path: '/editProDoc',
        name: 'editProDoc',
        component: () => import("@/views/proDoc-Management/edit.vue"),
        meta: { title: "编辑项目资料" }
      },
      {
        path: '/role',
        name: 'role',
        component: () => import("@/views/role-Management/index.vue"),
        meta: { title: "角色管理" }
      },
      {
        path: '/addRole',
        name: 'addRole',
        component: () => import("@/views/role-Management/add.vue"),
        meta: { title: "新增角色" }
      },
      {
        path: '/editRole',
        name: 'editRole',
        component: () => import("@/views/role-Management/edit.vue"),
        meta: { title: "编辑角色" }
      },
      {
        path: '/department',
        name: 'department',
        component: () => import("@/views/dep-Management/index.vue"),
        meta: { title: "组织机构管理" }
      },
      {
        path: '/addDep',
        name: 'addDep',
        component: () => import("@/views/dep-Management/add.vue"),
        meta: { title: "新增组织机构管理" }
      },
      {
        path: '/editDep',
        name: 'editDep',
        component: () => import("@/views/dep-Management/edit.vue"),
        meta: { title: "编辑组织机构管理" }
      }
    ]
  },
  {
    path: "*",
    redirect: "/404"
  }
];
