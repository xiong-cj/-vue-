<template>
  <div>
    <el-menu mode="horizontal" class="admin-menu" @select="handleMenuSelect">
      <el-menu-item index="1">头像</el-menu-item>
      <el-menu-item index="2">修改密码</el-menu-item>
    </el-menu>
    <div v-if="activeMenu === '1'">
      <span>点击上传图片</span>
      <el-upload
        ref="uploadRef"
        
        class="avatar-uploader"
        :auto-upload="false"
        :limit="1"
        :on-change="handleFileChange"
        accept="image/*"
      >
        <img 
          v-if="userStore.userInfo.avatar" 
          :src="userStore.userInfo.avatar" 
          class="avatar" 
          alt="用户头像"
        />
      </el-upload>
      <el-button 
        :loading="uploading" 
        type="primary" 
        @click="submitUpload"
        :disabled="!selectedFile"
      >
        上传头像
      </el-button>
    </div>
    <div v-if="activeMenu === '2'">
      <el-form :model="passwordForm" label-width="100px">
        <el-form-item label="旧密码">
          <el-input 
            type="password" 
            placeholder="请输入旧密码" 
            v-model="passwordForm.oldPassword"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input 
            type="password" 
            placeholder="请输入新密码" 
            v-model="passwordForm.newPassword"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input 
            type="password" 
            placeholder="请重新输入新密码" 
            v-model="passwordForm.confirmPassword"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            :loading="passwordLoading" 
            type="primary" 
            @click="submitPassword"
          >
            修改密码
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/userData.js";
import { uploadFile } from "@/api/file.js";
import { updateAvatar, updatePwd } from "@/api/user.js";

const userStore = useUserStore();
const uploadRef = ref(null);
const activeMenu = ref("1");
const selectedFile = ref(null);
const uploading = ref(false);
const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
});
const passwordLoading = ref(false);

const handleMenuSelect = (index) => {
  activeMenu.value = index;
};

const handleFileChange = (file, fileList) => {
  console.log("文件变化:", file, fileList);
  selectedFile.value = file.raw;
};



const submitUpload = async () => {
  if (!selectedFile.value) {
    ElMessage.warning("请选择要上传的文件");
    return;
  }
  
  uploading.value = true;
  
  try {
    const response = await uploadFile(selectedFile.value);
    // 上传成功后调用更新头像接口
    await updateAvatar(response.msg);
    // 更新用户信息
    userStore.userInfo.avatar = response.msg;
    console.log("头像更新成功:", response.msg);
    ElMessage.success("头像更新成功");
    // 清空文件选择
    uploadRef.value.clearFiles();
    selectedFile.value = null;
  } catch (error) {
    console.error("上传失败:", error);
    ElMessage.error("头像更新失败: " + error.message);
  } finally {
    uploading.value = false;
  }
};


const submitPassword = async () => {
  if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    ElMessage.info("请填写所有密码字段");
    return;
  }
  
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.error("新密码和确认密码不一致");
    return;
  }
  
  passwordLoading.value = true;
  
  try {
    await updatePwd({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    });
    
    passwordForm.oldPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";
    
    ElMessage.success("密码修改成功");
  } catch (error) {
    ElMessage.error("密码修改失败: " + error.message);
  } finally {
    passwordLoading.value = false;
  }
};

onMounted(() => {
  // 组件挂载后初始化
  console.log("用户信息:", userStore.userInfo);
});
</script>

<style scoped>
.admin-menu {
  background-color: rgb(255, 255, 255);
  justify-content: center;
  height: 50px;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

</style>