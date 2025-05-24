<template>
  <div class="article-container">
    <el-button type="primary" @click="isAdd=true">
      <span class="Font">+添加文章</span></el-button>
    <h2 class="section-title">文章列表</h2>
    <div v-loading="loading" element-loading-text="加载课程中...">
      <el-table
        :data="article"
        border
        style="width: 100%"
        class="transparent-table"
      >
        <!-- 显式使用默认插槽 -->
        <template #default>
          <el-table-column prop="title" label="标题" width="300" />
          <el-table-column prop="createTime" label="发布日期" width="200" />
          <el-table-column>
            <template #default="{ row }">
              <el-button @click="handleArticleClick(row.id)"
                >查看详情</el-button
              >
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>

    <!-- 分页器 -->
    <div class="contain_pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[6, 12, 18, 24]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <el-dialog v-model="isAdd" title="添加文章">
      <el-form :model="addForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="addForm.content"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isAdd = false">取 消</el-button>
        <el-button type="primary" @click="addArticle">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
  
  <script setup>
import { articleList,addArticle } from "@/api/article.js";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
//获取文章列表
const article = ref([]); //文章列表
const getArticleList = async () => {
  loading.value = true; // 立即显示加载状态
  const start = Date.now(); // 记录开始时间
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    };
    const res = await articleList(params);
    article.value = res.data.records;
    total.value = res.data.total;
    // 计算实际请求耗时，若小于 1000ms，添加延迟
    const elapsed = Date.now() - start;
    if (elapsed < 1000) {
      await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
    }
  } catch (error) {
    console.error("获取课程列表失败:", error);
  } finally {
    loading.value = false; // 确保加载状态至少显示 1 秒
  }
};
onMounted(() => {
  getArticleList();
});
// const isArticleDetail = ref(false); // 是否显示文章详情对话框
// const articleDetail = ref(); // 文章详情数据
// 处理文章点击事件
const handleArticleClick = async (id) => {
  router.push({name:'articleDetail', params: { id }}); // 跳转到文章详情页面
  // router.push("/index/articleDetail");
  // // 并行发起请求（性能优化）
  // const [info, user] = await Promise.all([articleInfo(id), getUserInfo(id)]);
  // articleDetail.value = info.data; // 设置文章详情
  // articleDetail.value.author = user.data.username; // 设置作者信息
  // isArticleDetail.value = true; // 显示文章详情对话框
};
// 分页参数
const currentPage = ref(1); //当前页
const pageSize = ref(6); // 每页显示数量
const total = ref(0); //总页数

const loading = ref(true);
// 处理每页显示数量变化
const handleSizeChange = (val) => {
  pageSize.value = val;
  getArticleList();
};
// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val;
  getArticleList();
};
//添加文章
const isAdd=ref(false); // 是否显示添加文章对话框
const addForm=ref({
  title:'',
  content:''
})
</script>
  
  <style scoped>
  .Font{
    font-size: 16px;
    color: #333;
    margin-bottom: 2px;
    /* 斜体 */
    font-style: italic;
    /* 加粗 */
    font-weight: bold;
  }
/* 页面容器样式 */
.article-container {
  padding: 20px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  max-width: 1200px;
  margin: 20px auto;
}

/* 标题样式 */
.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

/* 表格样式 */
.transparent-table {
  background: transparent; /* 表格背景透明 */
  border-radius: 10px;
  overflow: hidden;
  box-shadow: none; /* 移除表格的默认阴影 */
}

.el-table {
  background: transparent; /* 确保表格背景透明 */
  border: none;
}

.el-table th {
  background: rgba(255, 255, 255, 0.2); /* 表头背景半透明 */
  color: #333;
  font-weight: bold;
  text-align: center;
}

.el-table td {
  background: rgba(255, 255, 255, 0.1); /* 表格单元格背景半透明 */
  color: #555;
  text-align: center;
}

/* 表格悬停效果 */
.el-table tr:hover td {
  background: rgba(255, 255, 255, 0.2); /* 鼠标悬停时单元格背景变亮 */
}
</style>