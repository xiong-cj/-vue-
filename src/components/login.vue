<template>
  <div class="contain">
    <div class="contain_login">
      <h2>登录</h2>
      <div class="contain_input">
        <input 
        class="input" 
        placeholder="请输入账号" 
        v-model="username"/>
      </div>
      <div class="contain_input">
        <input 
        class="input" 
        placeholder="请输入密码" 
        type="password"
        v-model="password" />
      </div>
      <div class="button_container">
        <el-button type="primary" class="login_button" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { userLogin } from '@/api/login';
import { ElMessage } from 'element-plus';
const router = useRouter();

const username = ref('');
const password = ref('');
const login = async () => {
  const res = await userLogin({ username: username.value, password: password.value });
  if (res.data!==null) {
    const token = res.data; 
    localStorage.setItem('token', token); 
    router.push('/index/home');
  } else {
    ElMessage.error(res.msg);
  }
};
</script>

<style scoped>
/* 背景样式 */
.contain {
  background: linear-gradient(
      to bottom right,
      rgba(0, 0, 0, 0.5),
      rgba(255, 0, 0, 0.5)
    ); height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 登录框样式 */
.contain_login {
  position: relative;
  width: 400px;
  height: 300px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 输入框容器样式 */
.contain_input {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

/* 输入框样式 */
.input {
  width: 80%;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  transition: border-color 0.3s ease;
}

.input:focus {
  border-color: #ff6a6a;
  outline: none;
}

/* 按钮容器样式 */
.button_container {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* 登录按钮样式 */
.login_button {
  width: 80%;
  border-radius: 10px;
  background: linear-gradient(to right, #ff758c, #ff6a6a);
  color: white;
  font-weight: bold;
  transition: background 0.3s ease, transform 0.2s ease;
}

.login_button:hover {
  background: linear-gradient(to right, #ff6a6a, #ff758c);
  transform: scale(1.05);
}

</style>