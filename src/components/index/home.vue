<template>
  <div class="article-stats-container">
    <div class="header">
      <span class="title">个人文章</span>
      <div class="chart-count-selector">
        <div style="width: 150px">
          <label>显示数量:</label>
        </div>
        <el-select v-model="chartDataCount" @change="updateChart">
          <el-option value="3">3条</el-option>
          <el-option value="5">5条</el-option>
          <el-option value="10">10条</el-option>
        </el-select>
      </div>
    </div>
    <div class="chart-container" ref="chartContainer"></div>

    <div class="article-list">
      <el-card
        class="article-card"
        v-for="item in latestArticles"
        :key="item.id"
        @click="ArticleDetail(item.id)"
      >
        <template #header>
          <div class="article-title">标题：{{ item.title }}</div>
        </template>
        <div class="article-meta">
          <span>发布日期：{{ item.createTime }}</span>
          <span> 点赞：{{ item.likeAt }} </span>
          <span> 收藏： {{ item.favorite }} </span>
        </div>
      </el-card>
    </div>
    <el-dialog v-model="idArticleDetail">
      <template #header>
        <span>文章详情</span>
      </template>
      <div class="article-detail">
        <h3>标题：{{ articleDetail.title }}</h3>
        <p>内容：{{ articleDetail.content }}</p>
        <div class="button_container">
          <el-button type="primary" @click="idArticleDetail = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, onMounted, onUnmounted, watch } from "vue";
import { articleList, articleInfo} from "@/api/article.js";

// 图表容器引用
const chartContainer = ref(null);
// ECharts实例
let chartInstance = null;
// 文章数据
const articles = ref([]);
// 最新文章（排序后）
const latestArticles = ref([]);
// 图表数据数量
const chartDataCount = ref(5);

// 获取文章列表
const fetchArticles = async (count = 5) => {
  try {
    const res = await articleList();
    const data = res.data.records || [];

    // 排序：按创建时间降序
    const sortedData = data.sort((a, b) => {
      const timeA = new Date(a.createTime || a.updateTime);
      const timeB = new Date(b.createTime || b.updateTime);
      return timeB - timeA;
    });

    // 更新文章数据
    articles.value = sortedData;
    latestArticles.value = sortedData.slice(0, count);

    // 更新图表
    updateChart();
  } catch (error) {
    console.error("获取文章数据失败:", error);
    // 这里可以添加错误提示
  }
};

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) return;

  // 销毁旧实例
  if (chartInstance) {
    chartInstance.dispose();
  }

  // 创建新实例
  chartInstance = echarts.init(chartContainer.value);

  // 设置图表配置
  updateChart();

  // 监听窗口大小变化，调整图表
  window.addEventListener("resize", handleResize);
};

// 更新图表
const updateChart = () => {
  if (!chartInstance || latestArticles.value.length === 0) return;

  // 准备图表数据
  const titles = latestArticles.value.map((item) => {
    // 截取标题前8个字符
    return item.title.length > 8
      ? item.title.substring(0, 8) + "..."
      : item.title;
  });

  const likeData = latestArticles.value.map((item) => item.likeAt);
  const favoriteData = latestArticles.value.map((item) => item.favorite);
  const createTimes = latestArticles.value.map((item) => item.createTime);

  // 图表配置
  const options = {
    title: {
      text: "文章收藏与点赞趋势",
      left: "center",
      textStyle: {
        fontSize: 16,
        fontWeight: "normal",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999",
        },
      },
      formatter: (params) => {
        const param = params[0];
        const index = param.dataIndex;
        return `
          <div class="tooltip-title">${titles[index]}</div>
          <div>点赞: ${likeData[index]}</div>
          <div>收藏: ${favoriteData[index]}</div>
          <div>发布时间: ${createTimes[index]}</div>
        `;
      },
    },
    legend: {
      data: ["点赞量", "收藏量"],
      top: "5%",
      left: "left",
    },
    xAxis: {
      type: "category",
      data: titles,
      axisLabel: {
        interval: 0,
        rotate: 20,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      axisLabel: {
        formatter: "{value}",
      },
    },
    series: [
      {
        name: "点赞量",
        type: "line",
        data: likeData,
        itemStyle: {
          color: "#5793f3",
        },
        markPoint: {
          data: [{ type: "max", name: "最大值" }],
        },
      },
      {
        name: "收藏量",
        type: "line",
        data: favoriteData,
        itemStyle: {
          color: "#d14a61",
        },
        markPoint: {
          data: [{ type: "max", name: "最大值" }],
        },
      },
    ],
    color: [
      "#5793f3", // 蓝色 - 点赞
      "#d14a61", // 红色 - 收藏
    ],
  };

  // 应用配置
  chartInstance.setOption(options);
};

// 处理窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};
// 生命周期钩子
onMounted(() => {
  fetchArticles(chartDataCount.value);
  initChart();
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  window.removeEventListener("resize", handleResize);
});
// 监听图表数据数量变化
watch(chartDataCount, (newCount) => {
  fetchArticles(newCount);
});
// 文章详情跳转
const idArticleDetail = ref(false);// 文章详情弹窗
const articleDetail = ref({});// 文章详情数据
const ArticleDetail = async(id) => {
  idArticleDetail.value = true;
  // 跳转到文章详情页面
 const res= await articleInfo(id)
  articleDetail.value= res.data;
  console.log(articleDetail.value);
};
</script>

<style scoped>
.article-stats-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.chart-count-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chart-container {
  width: 100%;
  height: 350px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.article-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}

.article-card {
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.article-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-meta {
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 14px;
}

.tooltip-title {
  font-weight: bold;
  margin-bottom: 5px;
}
</style>    