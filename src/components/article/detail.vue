<template>
  <div class="detail-contain">
    <el-button @click="back" class="back-btn">
      返回文章列表
    </el-button>
    <div 
      v-loading="loading" 
      class="content-container"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.9)"
    >
      <div class="article-header">
        <h2 class="article-title">{{ articleDetail?.title || "文章标题未获取" }}</h2>
        <div class="article-meta">
          <span class="meta-item">    
            作者：{{ userInfo?.username || "匿名用户" }}
          </span>
          <span class="meta-item"> 
            时间：{{ formatTime(articleDetail?.updateTime) }}
          </span>
        </div>
      </div>
      <div v-if="hasContent" class="article-content" v-html="formattedContent"></div>
      <div v-else class="empty-tip">暂无文章内容</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { articleInfo } from "@/api/article.js";
import { getUserInfo } from "@/api/user";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
// 路由相关
const route = useRoute();
const router = useRouter();
// 状态管理
const articleDetail = ref(null); // 文章详情
const userInfo = ref(null); // 作者信息
const loading = ref(true); // 加载状态

// 计算属性：格式化时间
const formatTime = (timeStr) => {
  return timeStr 
    ? dayjs(timeStr).format("YYYY-MM-DD HH:mm:ss") 
    : "时间未记录";
};

// 计算属性：是否有有效内容
const hasContent = computed(() => {
  return (
    articleDetail.value && 
    typeof articleDetail.value.content === "string" && 
    articleDetail.value.content.trim() !== ""
  );
});

// 计算属性：处理正文首行缩进
const formattedContent = computed(() => {
  if (!hasContent.value) return ""; // 避免无效数据处理
  
  return articleDetail.value.content
    .split("\n") // 按行分割
    .map((line) => line.trim()) // 去除行首尾空格
    .map((line) => (line ? `&emsp;${line}` : "")) // 添加首行缩进
    .join("<br>"); // 转换为HTML换行
});

// 数据获取逻辑
watch(
  () => route.params.id, // 监听路由参数变化
  async (newId) => {
    if (!newId) return; // 忽略无效参数
    
    try {
      loading.value = true; // 显示加载状态
      
      // 1. 获取文章详情
      const articleRes = await articleInfo(newId);
      if (!articleRes.data) throw new Error("文章数据为空");
      
      articleDetail.value = articleRes.data;
      
      // 2. 获取作者信息（假设文章数据中的userId对应用户ID）
      const userRes = await getUserInfo(articleDetail.value.userId);
      if (!userRes.data) throw new Error("作者信息为空");
      
      userInfo.value = userRes.data;
      
    } catch (error) {
      console.error("数据获取失败：", error);
      // 可在此处添加错误提示（如ElMessage）
    } finally {
      loading.value = false; // 隐藏加载状态
    }
  },
  { immediate: true } // 组件挂载时立即执行
);

// 返回列表页
const back = () => {
  router.push('/index/article'); // 使用命名路由（需在路由配置中定义）
  // 或直接使用路径：router.push("/index/article");
};
</script>

<style scoped>
.detail-contain {
  min-height: 100vh;
  padding: 30px 20px;
  background-color: #f0f2f5;
}

.back-btn {
  margin-bottom: 20px;
  font-size: 14px;
  width: 120px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 100px);
  font-size: 16px;
  color: #6c757d;
}

.loading-text {
  margin-top: 15px;
}

.content-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.article-header {
  margin-bottom: 30px;
  border-bottom: 1px solid #ebedf0;
  padding-bottom: 20px;
}

.article-title {
  font-size: 22px;
  font-weight: 600;
  color: #1a73e8;
  margin-bottom: 15px;
}

.article-meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #666;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.el-icon {
  font-size: 18px;
  color: #999;
}

.article-content {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 30px;
}

.article-content p {
  margin: 15px 0;
}

/* 处理v-html生成的段落 */
.article-content br {
  display: block;
  margin: 10px 0;
}

.empty-tip {
  padding: 30px;
  text-align: center;
  color: #6c757d;
}

.empty-tip .el-icon {
  font-size: 48px;
  color: #f0f0f0;
  margin-bottom: 15px;
}
</style>