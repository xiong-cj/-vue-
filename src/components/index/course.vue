<template>
  <div>
    <!-- 轮播图 -->
    <el-carousel :interval="3000" arrow="always" height="200px">
      <el-carousel-item v-for="(image, index) in courseImg" :key="index">
        <img :src="image" alt="轮播图" class="carousel-image" />
      </el-carousel-item>
    </el-carousel>
    <!-- 我喜欢的课程 -->
    <div class="course-container">
      <h2 class="section-title">我喜欢的课程</h2>
      <div class="course-grid" 
      v-loading="loading" 
      element-loading-text="加载课程中...">
        <el-card
          v-for="item in course"
          :key="item.id"
          class="course-card"
          shadow="hover"
          @click="handleCourseClick(item.id)"
        >
          <!-- 课程封面图片 -->
          <img :src="item.coverImage" alt="课程封面" class="course-image" />
          <div class="course-title">{{ item.title }}</div>
        </el-card>
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
    </div>
    <el-dialog v-model="isCourseDetail" title="课程详情" width="400px"> 
      <h3>标题：{{ courseDetail.title }}</h3>
      <p>内容：{{ courseDetail.description }}</p>
      <div class="button_container">
        <el-button type="primary" class="course_button" >进入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { courseList, courseInfo } from "@/api/course.js";

// 分页参数
const currentPage = ref(1);//当前页
const pageSize = ref(6); // 每页显示数量
const total = ref(0);//总页数

const loading = ref(true);
// 处理每页显示数量变化
const handleSizeChange = (val) => {
  pageSize.value = val;
  getCourseList();
};
// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val;
  getCourseList();
};
const courseImg =ref([])// 课程封面图片列表
const course = ref([]); // 课程列表数据
// 获取课程列表（带分页）
const getCourseList = async () => {
  loading.value = true; // 立即显示加载状态
  const start = Date.now(); // 记录开始时间
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    };
    const res = await courseList(params);
    course.value = res.data.records;
    total.value = res.data.total;
    courseImg.value = res.data.records.map(item => item.coverImage);

    // 计算实际请求耗时，若小于 1000ms，添加延迟
    const elapsed = Date.now() - start;
    if (elapsed < 1000) {
      await new Promise(resolve => setTimeout(resolve, 1000 - elapsed));
    }
  } catch (error) {
    console.error("获取课程列表失败:", error);
  } finally {
    loading.value = false; // 确保加载状态至少显示 1 秒
  }
};

onMounted(() => {
  getCourseList(); // 初始化加载课程列表
});
const isCourseDetail = ref(false); // 是否显示课程详情
const courseDetail = ref({}); // 课程详情数据
const handleCourseClick = async (courseId) => {
  isCourseDetail.value = true;
  const res = await courseInfo(courseId);
  courseDetail.value = res.data;
};
</script>

<style scoped>
/* 轮播图样式 */
.carousel-wrapper {
  position: relative;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.el-carousel-item {
  width: 100%!important;
  padding: 0;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.carousel-image:hover {
  transform: scale(1.03);
}

/* 空数据样式 */
.empty-state {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
  background: #f8f8f8;
}

/* 其他样式保持不变... */
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #f08a8a;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #ecb49a;
}

.course-container {
  margin-top: 10px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 标题样式 */
.section-title {
  margin-top: 2px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
}

/* 课程网格布局 */
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 30px;
  justify-items: center;
}

/* 课程卡片样式 */
.course-card {
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* 课程图片样式 */
.course-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}

/* 课程标题样式 */
.course-title {
  font-size: 16px;
  font-weight: bold;
  color: #555;
  text-align: center;
  padding: 10px 0;
}

.contain_pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 按钮容器样式 */
.button_container {
  width: 100%;
  display: flex;
  justify-content: center;
}
/* 按钮样式 */
.course_button {
  width: 80%;
  border-radius: 10px;
  background: linear-gradient(to right, #ff758c, #ff6a6a);
  color: white;
  font-weight: bold;
  transition: background 0.3s ease, transform 0.2s ease;
}
</style>