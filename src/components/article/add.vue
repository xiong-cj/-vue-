<template>
  <div class="add-article-contain">
    <el-breadcrumb separator="/" style="padding: 20px">
      <el-breadcrumb-item :to="{ path: '/index/article' }"
        >文章列表</el-breadcrumb-item
      >
      <el-breadcrumb-item> 添加文章 </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style scoped>
.add-article-contain{
    min-height: 100vh;
  padding: 30px 20px;
  background-color: #f0f2f5;
}
</style>