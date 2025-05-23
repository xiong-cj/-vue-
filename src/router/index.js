import { createRouter,createWebHistory } from "vue-router";
import login from "@/components/login.vue";
import index from "@/components/index.vue";
import home from "@/components/index/home.vue";
import course from "@/components/index/course.vue";
import article from "@/components/index/article.vue";
import intro from "@/components/index/intro.vue";
import articleDetail from "@/components/article/detail.vue";

const routes=[
    {
        path:'/',
        component:login,
        name:'login'
    },

    {
        path:'/index',
        component:index,
        name:'index',
        children:[
            {
                path:'home',
                component:home  ,
                name:'home'
            },
            {
                path:'course',
                component:course,
                name:'course'
            },
            {
                path:'article',
                component:article,
                name:'article'
            },
            {
                path:'intro',
                component:intro,
                name:'intro'
            },
            {
                path:'articleDetail:id',
                component:articleDetail,
                name:'articleDetail'
            }
        ]

    },
]
const router=createRouter({
    history:createWebHistory(),
    routes
})
export default router;