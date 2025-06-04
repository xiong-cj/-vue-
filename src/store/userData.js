import { defineStore } from "pinia";
import { ref } from "vue";
import {getPersonInfo} from "@/api/user.js";
export const useUserStore = defineStore("user",()=> {
    const userInfo = ref({});
    const getUserInfo = async() => {
        const res=await getPersonInfo();
            userInfo.value = res.data;
    }
  // 设置用户信息
  const setUserInfo = (obj) => {
    userInfo.value = obj || {}
  }
    // 清除用户信息（登出）
    const clearUserInfo = () => {
        userInfo.value = {}
      }
      return {
        userInfo,
        getUserInfo,
        setUserInfo,
        clearUserInfo}
},{
    persist: {
        key: 'pinia-user-info', // 指定存储键名
        storage: localStorage, // 选择存储位置
        paths: ['userInfo'] // 指定需要持久化的字段
      }
})