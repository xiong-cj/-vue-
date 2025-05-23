<template>
  <div>
    <span @click="back">返回</span>
    文章详细{{ articleId }}
  </div>
</template>

<script setup>
import {ref, watch } from "vue";
import { articleInfo } from "@/api/article.js";
import { useRoute, useRouter } from "vue-router";
// 获取路由参数
const route = useRoute(); 
const articleId = ref(route.params.id); // 使用 ref 存储参数，方便监听

// 文章详情数据
const articleDetail = ref(null);
const loading = ref(true);

// 监听参数变化（处理动态跳转场景）
watch(
  () => route.params.id,
  async (newId) => {
    loading.value = true;
    if (newId) {
      try {
        const articleRes = await articleInfo(newId);
        articleDetail.value = articleRes.data;
      } catch (error) {
        console.error("获取文章详情失败:", error);
      } finally {
        loading.value = false;
      }
    }
  },
  { immediate: true } // 组件挂载时立即执行
);
// 返回文章列表页
const router = useRouter();
const back = () => {
  router.push("/index/article");
};
</script>
<style scoped>
</style>