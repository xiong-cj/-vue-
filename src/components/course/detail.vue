<template>
  <div>
    <el-breadcrumb separator="/" style="padding: 20px">
      <el-breadcrumb-item :to="{ path: '/index/course' }"
        >课程列表</el-breadcrumb-item
      >
      <el-breadcrumb-item> 课程详情 </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="video_container">
      <video :src="courseDetail.coverVideo" controls></video>
    </div>
    <div>
      <div>
        <span>评论</span>
        <el-input></el-input>
       
      </div>
      评论区{{ userStore.userInfo }}
      </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { courseInfo } from "@/api/course.js";
import {useUserStore} from "@/store/userData";
import { useRoute } from "vue-router";
const route = useRoute();
const courseDetail = ref({}); // 课程详情数据
const userStore = useUserStore();
const fetchUserInfo = async () => {
  await userStore.getUserInfo();
};
fetchUserInfo();
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      try {
        const response = await courseInfo(newId);
        courseDetail.value = response.data; // 假设返回的数据结构中包含课程详情
        console.log("课程详情:", courseDetail.value);
        // 处理课程详情数据
      } catch (error) {
        console.error("获取课程详情失败:", error);
      }
    }
  },
  { immediate: true } // 初始时也执行一次
);
</script>
<style scoped>
.video_container {
  width: 100%;
  height: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.video_container video {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
