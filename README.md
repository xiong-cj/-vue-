
# learn_front

This template should help get you started developing with Vue 3 in Vite.

## 项目简介
`learn_front` 是一个基于 Vue 3 和 Vite 构建的前端项目，集成了 ElementPlus 组件库、Pinia 状态管理和 Vue Router 路由管理。项目包含文章详情、课程详情、用户信息管理等功能模块，同时提供了文件上传、用户信息获取、评论回复等接口服务。

## 推荐开发环境
[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (请禁用 Vetur)

## 自定义配置
具体配置可参考 [Vite Configuration Reference](https://vite.dev/config/)。

## 项目设置

### 安装依赖
```sh
npm install
```

### 开发环境编译与热重载
```sh
npm run dev
```

### 生产环境编译与压缩
```sh
npm run build
```

### 预览生产环境构建
```sh
npm run preview
```

## 项目结构概述
### 主要目录
- `src`：项目源代码目录
  - `api`：API 接口请求封装
  - `components`：项目组件目录
  - `router`：路由配置文件
  - `store`：状态管理（Pinia）相关文件
  - `main.js`：项目入口文件
- `index.html`：项目 HTML 模板文件
- `package.json`：项目依赖和脚本配置文件

### 主要功能模块
#### 文章详情页 (`src/components/article/detail.vue`)
- 展示文章详细信息，包括标题、作者、发布时间和正文内容。
- 处理文章数据和作者信息的获取，支持格式化时间和正文首行缩进。

#### 课程详情页 (`src/components/course/detail.vue`)
- 展示课程详情，包括课程封面视频、评论列表和回复功能。
- 支持添加评论和回复评论，同时提供评论和回复列表的加载和显示。

#### 用户信息管理页 (`src/components/user/userData.vue`)
- 提供用户头像上传和密码修改功能。
- 支持文件上传和用户信息更新，确保用户信息的安全和完整性。

## API 接口
### 文件上传 (`src/api/file.js`)
```javascript
import request from '@/utils/axios';

export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
```

### 用户信息 (`src/api/user.js`)
```javascript
import request from "@/utils/axios";

// 根据id查询用户信息
export const getUserInfo = (id) => {
    return request.get('/user/getUserInfo', {
        params: {
            id
        }
    });
}

// 登录用户信息
export const getPersonInfo = () => {
    return request.get('/user/userInfo')
}

// 获取所有用户信息
export const getAllUserInfo = () => {
    return request.get('/user/list');
}

// 批量获取用户信息
export const batchUserInfoByIds = (ids) => {
    return request.post('/user/batchUserInfoByIds', ids);
}

// 用户修改密码
export const updatePwd = (data) => {
    return request.patch('/user/updatePwd', data);
}

// 更新头像
export const updateAvatar = (avatarUrl) => {
    console.log('头像参数', avatarUrl);
    return request.patch('/user/updateAvatar', null, {
        params: { avatarUrl }
    });
}
```

### 文章接口 (`src/api/article.js`)
```javascript
import request from "@/utils/axios"

// 文章列表
export const articleList = (data) => {
    return request.get('/article/articleList', { params: data })
}

// 文章详细
export const articleInfo = (id) => {
    return request.get('/article/info', {
        params: {
            id
        }
    })
}

// 添加文章
export const addArticle = (data) => {
    return request.post('/article/add', { params: data })
}

// 点赞文章
export const likeArticle = (data) => {
    return request.post('/interaction/like', { params: data })
}

// 收藏文章
export const collectArticle = (data) => {
    return request.post('/interaction/favorite', { params: data })
}
```

### 课程接口 (`src/api/course.js`)
```javascript
import request from "@/utils/axios";

// 课程列表
export const courseList = (data) => {
    return request.get('/course/courseList', { params: data })
}

// 添加课程
export const addCourse = (data) => {
    return request.post('/course/add', data)
}

// 课程详细
export const courseInfo = (id) => {
    return request.get('/course/courseInfo', {
        params: {
            id
        }
    })
}
```

### 评论接口 (`src/api/comment.js`)
```javascript
import requset from '@/utils/axios'

// 评论列表
export const commentList = (id) => {
    return requset.get('/interaction/list', { params: { articleId: id } });
}

// 回复列表
export const replyList = (id) => {
    return requset.get('/interaction/replyList', { params: { parentId: id } });
}

// 添加评论
export const addComment = (data) => {
    return requset.post('/interaction/add', data)
}

// 删除评论
export const delComment = (id) => {
    return requset.delete('/interaction/delete', { params: { id } })
}
```

## 状态管理（Pinia）
`src/store/userData.js` 文件中定义了用户信息的状态管理，支持用户信息的获取、设置和清除操作。

```javascript
import { defineStore } from "pinia";
import { ref } from "vue";
import { getPersonInfo } from "@/api/user.js";

export const useUserStore = defineStore("user", () => {
    const userInfo = ref({});

    const getUserInfo = async () => {
        const res = await getPersonInfo();
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
        clearUserInfo
    }
}, {
    persist: {
        key: 'pinia-user-info', // 指定存储键名
        storage: localStorage, // 选择存储位置
        paths: ['userInfo'] // 指定需要持久化的字段
    }
})
```

## 注意事项
- 请确保你的 Node.js 版本符合项目依赖的要求，可参考 `package.json` 文件中的 `engines` 字段。
- 在开发过程中，可根据实际需求修改 API 请求的 URL 和参数。
- 项目中使用了 ElementPlus 组件库，如有需要可参考 [ElementPlus 官方文档](https://element-plus.org/) 进行组件的定制和扩展。

希望这份 README 文件能帮助你更好地理解和使用这个项目。如果你有其他需求或问题，请随时提问。
