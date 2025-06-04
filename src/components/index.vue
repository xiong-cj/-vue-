<template>
  <div class="contain">
    <el-header>
      <div class="Collapse_button">
        <el-button @click="toggleCollapse">折叠</el-button>
      </div>
      <div class="header-content">
        <el-dropdown>
          <span>用户名</span>
          <template #dropdown>
            <el-dropdown-menu @click="handleUserSelect">
              <el-dropdown-item data-path="/index/userData">个人信息</el-dropdown-item>
              <el-dropdown-item >设置</el-dropdown-item>
              <el-dropdown-item data-path="/">退出</el-dropdown-item>
            </el-dropdown-menu>
            </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-aside>
      <el-menu class="left_menu" :collapse="isCollapse" @select="handleSelect" :default-active="activeIndex">
        <el-menu-item index="/index/home">
          <el-tooltip content="首页" placement="left-start">
            <el-icon><Location /></el-icon>
          </el-tooltip>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/index/intro">
          <el-tooltip content="介绍" placement="left-start">
            <el-icon><Document /></el-icon
          ></el-tooltip>
          <span>介绍</span>
        </el-menu-item>
        <el-menu-item index="/index/course">
          <el-tooltip content="课程" placement="left-start">
            <el-icon><MessageBox /></el-icon
          ></el-tooltip>
          <span>课程</span>
        </el-menu-item>
        <el-menu-item index="/index/article">
          <el-tooltip content="文章" placement="left-start">
            <el-icon><EditPen /></el-icon
          ></el-tooltip>
          <span>文章</span>
        </el-menu-item>
        <el-menu-item index="/">
          <el-tooltip content="退出" placement="left-start">
            <el-icon><SwitchButton /></el-icon
          ></el-tooltip>
          <span>退出</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main :style="{ left: isCollapse ? '100px' : '240px' }" class="main">
      <router-view v-slot="{ Component }">
        <transition name="fade"  mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox, ElLoading  } from "element-plus";
import {useUserStore} from "@/store/userData.js";
import {
  Document,
  Location,
  MessageBox,
  EditPen,
  SwitchButton,
} from "@element-plus/icons-vue";
const userStore = useUserStore();
const isCollapse = ref(true);
const activeIndex = ref('');
const router = useRouter();
const route = useRoute();

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

const handleSelect = (index) => {
  if (index == "/") {
    ElMessageBox.confirm("退出登录？", "确认退出", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        ElMessage({
          type: "success",
          message: "退出成功",
        });
        userStore.clearUserInfo();
        localStorage.clear();
        router.push(index);
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消",
        });
      });
  } else {
    router.push(index);
    localStorage.setItem('activeMenuIndex', index);
  }
};
const handleUserSelect = (event) => {
  const path = event.target.dataset.path; // 从自定义属性获取路径
    handleSelect(path)
};
onMounted(() => {
  const storedIndex = localStorage.getItem('activeMenuIndex');
  if (storedIndex) {
    activeIndex.value = storedIndex;
  } else {
    activeIndex.value = route.fullPath;
  }
});
</script>
  
  <style scoped>
.contain {
  /* 窗口全屏，背景颜色左上角黑色渐变到右下角红色 */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom right,
    rgba(0, 0, 0, 0.5),
    rgba(255, 0, 0, 0.5)
  );
}
.Collapse_button {
  position: absolute;
  top: 20px;
}
.header-content{
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
}

.left_menu:not(.el-menu--collapse) {
  /*  离窗口左边和高20px距离，圆角边框，背景为黑色  */
  position: absolute;
  top: 70px;
  left: 20px;
  border-radius: 10px;
  background-color: rgb(0, 0, 0);
  /*  菜单宽度为200px，菜单高度为100px  */
  width: 200px;
  min-height: 80%;
  bottom: 20px; /* 窗口底部距离 */
  /*  菜单文字居中  */
  text-align: center;
  border: none;
}
.left_menu.el-menu--collapse {
  /* 折叠状态下的样式 */
  position: absolute;
  top: 70px;
  left: 20px;
  border-radius: 10px;
  background-color: rgb(0, 0, 0);
  width: 60px; /* 折叠时宽度变小 */
  min-height: 400px;
  min-height: 80%;
  bottom: 20px; /* 窗口底部距离 */
  color: white;
  border: none;
}
.left_menu span {
  /* 字体20px */
  font-size: 15px;
  font-weight: bold; /* 字体加粗 */
  color: white; /* 字体颜色白色 */
}
.left_menu i {
  color: white; /* 图标颜色为白色 */
  font-weight: bold; /* 图标加粗 */
}
/* 鼠标悬停时的样式 */
.left_menu .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
/* 选中项图标的颜色 */
.left_menu .el-menu-item.is-active i {
  color: rgb(248, 158, 173);
}
/* 选中项文字的颜色 */
.left_menu .el-menu-item.is-active span {
  color: rgb(248, 158, 173);
}
.main {
  /* 主体部分的样式 */
  position: absolute;
  top: 70px;
  left: 240px; /* 左侧菜单宽度 */
  right: 20px; /* 窗口右边距 */
  bottom: 20px; /* 窗口底部距离 */
  border-radius: 10px;
  padding: 0px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: left 0.3s ease;
  scrollbar-width: none; /* 隐藏Firefox浏览器的滚动条 */
  -ms-overflow-style: none; /* 隐藏IE和Edge浏览器的滚动条 */
}
/* 滚动条的样式 */
/* .main::-webkit-scrollbar {
  display: none;
} */
/* 定义过渡动画的 CSS 样式 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>