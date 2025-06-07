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
        <div>
          <el-input
            placeholder="跟作者唠嗑两句"
            v-model="commentData"
          ></el-input>
        </div>
        <div class="add_button"><el-button type="danger" plain @click="add">评论</el-button></div>
      </div>
      <div>
        <div v-for="item in comment" :key="item.id" class="comment_list">
          <el-avatar :src="item.user.avatar"></el-avatar>
          <div class="comment_usernam">
            <span>{{ item.user.username }}</span>
          </div>
          <div>
            <span>{{ item.content }}</span>
          </div>
          <div>
            <span>{{ item.createdAt }}</span>
          </div>
          <el-button
            type="success"
            size="small"
            link
            @click="toggleReply(item.id)"
          >
            {{ isReplyActive(item.id) ? "收起回复" : "回复列表" }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            link
            @click="openReplyDialog(item.id)"
          >
            回复
          </el-button>
          <div v-if="isReplyActive(item.id)" class="reply_list">
            <div v-for="items in getReplyData(item.id)" :key="items.id">
              <el-avatar :src="items.user.avatar"></el-avatar>
              <div class="comment_usernam">
                <span>{{ items.user.username }}</span>
              </div>
              <div>
                <span>{{ items.content }}</span>
              </div>
              <div>
                <span>{{ items.createdAt }}</span>
              </div>
              <el-divider class="custom-divider"></el-divider>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="回复评论" v-model="isReplay"> 
      <el-input placeholder="回复" v-model="replyData"></el-input>
      <el-button @click="reply">回复</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getUserInfo,batchUserInfoByIds } from "@/api/user.js";
import { courseInfo } from "@/api/course.js";
import { addComment, commentList, replyList } from "@/api/comment.js";
import { useUserStore } from "@/store/userData";
import { useRoute } from "vue-router";

const route = useRoute();
const courseDetail = ref({}); // 课程详情数据
const comment = ref([]); // 评论列表数据
const replyDataMap = ref({}); // 使用对象存储每个评论的回复数据，键为评论ID
const activeReplyId = ref(null); // 当前激活的回复列表ID
const commentData = ref(""); // 评论输入框数据
const userStore = useUserStore();

// 获取回复列表
const fetchReplyList = async (commentId) => {
  try {
    const res = await replyList(commentId);
    const replies = res.data.records;
    const userIds = [...new Set(replies.map(item => item.userId))];
    const userDataMap = await batchGetUserInfo(userIds);
    // 将回复数据和用户信息合并
    replyDataMap.value[commentId] = replies.map(item => {
      const userData = userDataMap[item.userId] || {};
      return {
        ...item,
        user: {
          username: userData.username || '未知用户',
          avatar: userData.avatar || 'default-avatar.png',
        },
      };
    });
}catch(err){
  console.error("获取回复列表失败", err);
}
};

// 切换回复列表显示状态
const toggleReply = async (commentId) => {
  if (activeReplyId.value === commentId) {
    // 如果点击已激活的评论，关闭回复列表
    activeReplyId.value = null;
  } else {
    // 激活新的回复列表
    activeReplyId.value = commentId;

    // 如果该评论的回复数据不存在，则获取数据
    if (!replyDataMap.value[commentId]) {
      await fetchReplyList(commentId);
    }
  }
};

// 计算属性：判断评论的回复列表是否激活
const isReplyActive = (commentId) => {
  return activeReplyId.value === commentId;
};

// 计算属性：获取指定评论的回复数据
const getReplyData = (commentId) => {
  return replyDataMap.value[commentId] || [];
};

// 添加评论
const add = async () => {
  if (!commentData.value.trim()) {
    ElMessage.error("评论内容不能为空");
    return;
  }
  const Data = {
    content: commentData.value, // 评论内容
    articleId: route.params.id, // 课程ID
    parentId: 0, // 层级ID
  };
  await addComment(Data);
  await loadComments(); // 刷新评论列表
  commentData.value = ""; // 清空输入框
};

const isReplay = ref(false); // 是否显示回复对话框
const openReplyDialog = async(id) => {
  isReplay.value = true; // 打开回复对话框
  activeReplyId.value = id; // 设置当前回复的评论ID

  console.log("打开回复对话框，评论ID:", id);
};
const replyData=ref(""); // 回复内容
const reply=async()=>{
  if (!replyData.value.trim()) {
    ElMessage.error("评论内容不能为空");
    return;
  }
  const Data = {
    content: replyData.value, // 获取回复内容
    articleId: route.params.id, // 课程ID
    parentId: activeReplyId.value, // 回复的评论ID
  };
  console.log("回复数据:", Data);
  await addComment(Data); // 调用添加评论接口
  isReplay.value = false; // 关闭回复对话框
  await fetchReplyList(activeReplyId.value); // 刷新回复列表
}
// 加载评论列表
const loadComments = async () => {
  const newId = route.params.id;
  if (!newId) return;
  
  // 获取课程详情
  const courseData = await courseInfo(newId);
  courseDetail.value = courseData.data;

  // 获取评论列表
  const commentData = await commentList(newId);
  const comments = commentData.data.records;
  
  // 提取所有唯一的userId（去重）
  const userIds = [...new Set(comments.map(item => item.userId))];
  
  // 批量获取用户信息（关键优化点）
  const userDataMap = await batchGetUserInfo(userIds);
  
  // 合并评论和用户信息
  comment.value = comments.map(item => {
    const userData = userDataMap[item.userId] || {};
    return {
      ...item,
      user: {
        username: userData.username || '未知用户',
        avatar: userData.avatar || 'default-avatar.png',
      },
    };
  });

  // 重置回复数据
  activeReplyId.value = null;
  replyDataMap.value = {};
};
// 批量获取用户信息的方法
const batchGetUserInfo = async (userIds) => {
  if (userIds.length === 0) return {};
  
  try {
    // 假设后端提供了批量获取用户信息的接口
    const response = await batchUserInfoByIds(userIds);
    // 将结果转换为 { userId: userData } 的映射对象
    return response.data.reduce((map, user) => {
      map[user.id] = user;
      console.log("批量获取用户信息", user);
      return map;
    }, {});
  } catch (error) {
    console.error('批量获取用户信息失败', error);
    return {};
  }
};

// 初始加载
onMounted(async () => {

  await loadComments();
});

// 监听路由变化
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
.add_button{
  padding: 10px;
  /* 位于右边 */
  text-align: right;
}
.comment_list {
  background-color: #f78989;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
}
.comment_usernam {
  /* 位于上方元素的右边 */
  margin-left: 10px;
  display: inline-block;
  vertical-align: top;
}
.reply_list {
  background-color: #fec1c1;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
}
.custom-divider{
  border-color: #000000; /* 颜色 */
  border-width: 2px;    /* 粗细 */
}
</style>