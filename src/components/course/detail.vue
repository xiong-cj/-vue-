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
        <div><el-avatar :src="userStore.userInfo.avatar"></el-avatar></div>

        <el-input placeholder="跟作者唠嗑两句" v-model="commentData"></el-input>
        <el-button type="primary" @click="add">评论</el-button>
      </div>
      <div>
        <div v-for="item in comment" :key="item.id" class="comment-item">
          <div>
            <el-avatar :src="item.user.avatar"></el-avatar>
          </div>
          <div>
            <span>{{ item.user.username }}</span>
          </div>
          <div>
            <span>{{ item.content }}</span>
          </div>
          <div>
            <span>{{ item.createdAt }}</span>
          </div>
          <el-button size="small" @click="reply(item.id)">回复</el-button>
          <div v-if="replyData.length > 0 && isReply">
            <span>回复列表</span>
            <div v-for="items in replyData" :key="items.id">
              <div>
                <el-avatar :src="items.user.avatar"></el-avatar>
              </div>
              <div>
                <span>{{ items.user.username }}</span>
              </div>
              <div>
                <span>{{ items.content }}</span>
              </div>
              <div>
                <span>{{ items.createdAt }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from "vue";
import { getUserInfo } from "@/api/user.js";
import { courseInfo } from "@/api/course.js";
import {
  addComment,
  commentList,
  replyList,
} from "@/api/comment.js";
import { useUserStore } from "@/store/userData";
import { useRoute } from "vue-router";
const route = useRoute();
const courseDetail = ref({}); // 课程详情数据
const comment = ref([]); // 评论列表数据
const replyData = ref([]); // 回复列表数据
const isReply = ref(false); // 是否显示回复列表
const commentData = ref(""); // 评论输入框数据
const userStore = useUserStore();
//获取回复的用户信息
const reply = async (id) => {
  if (isReply.value) {
    isReply.value = false; // 如果已经显示回复列表，则隐藏
    replyData.value = []; // 清空回复数据
    return;
  } else {
    isReply.value = true; // 显示回复列表
    try {
      const res = await replyList(id);
      const replies = res.data.records || [];
      // 补充：获取回复的用户信息
      const userPromises = replies.map(async (item) => {
        const userData = await getUserInfo(item.userId);
        return {
          ...item,
          user: {
            username: userData.data.username,
            avatar: userData.data.avatar,
          },
        };
      });

      replyData.value = await Promise.all(userPromises);
    } catch (error) {
      console.error("获取回复失败:", error);
    }
  }
};
// 添加评论
const add = async () => {
  const addData = {
    content: commentData.value, // 评论内容
    articleId: route.params.id, // 课程ID
    parentId: 0, // 层级ID
  };
  console.log("添加评论数据:", addData);
  await addComment(addData);

  await loadComments(); // 刷新评论列表
  commentData.value = ""; // 清空输入框
};
// 加载评论列表（新增）
const loadComments = async () => {
  const newId = route.params.id;
  if (!newId) return;
  
  // 获取课程详情（可选，根据需求保留）
  const courseData = await courseInfo(newId);
  courseDetail.value = courseData.data;
  
  // 获取评论列表
  const commentData = await commentList(newId);
  const comments = commentData.data.records.map(async (item) => {
    const userData = await getUserInfo(item.userId);
    return {
      ...item,
      user: {
        username: userData.data.username,
        avatar: userData.data.avatar,
      },
    };
  });
  comment.value = await Promise.all(comments);
};

// 初始加载（挂载时）
onMounted(async () => {
  userStore.getUserInfo();
  await loadComments();
});

// 监听路由变化（简化版）
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await loadComments();
    }
  }
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
