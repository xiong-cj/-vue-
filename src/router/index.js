import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/',
        component: () => import('@/components/login.vue'),
        name: 'login'
    },
    {
        path: '/index',
        component: () => import('@/components/index.vue'),
        name: 'index',
        children: [
            {
                path: 'home',
                component: () => import('@/components/index/home.vue'),
                name: 'home'
            },
            {
                path: 'course',
                component: () => import('@/components/index/course.vue'),
                name: 'course'
            },
            {
                path: 'article',
                component: () => import('@/components/index/article.vue'),
                name: 'article'
            },
            {
                path: 'intro',
                component: () => import('@/components/index/intro.vue'),
                name: 'intro'
            },
            {
                path: 'articleDetail:id',
                component: () => import('@/components/article/detail.vue'),
                name: 'articleDetail'
            },
            {
                path: 'addArticle',
                component: () => import('@/components/article/add.vue'),
                name: 'addArticle'
            },
            {
                path: 'userData',
                component: () => import('@/components/user/userData.vue'),
                name: 'userData'
            },
            {
                path: 'courseDetail:id',
                component: () => import('@/components/course/detail.vue'),
                name: 'courseDetail'
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;