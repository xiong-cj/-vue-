import request from "@/uitls/axios"

// 文章列表
export const articleList = (data) => {
    return request.get('/article/articleList',{params:data})
}
// 文章详细
export const articleInfo = (id) => {
    return request.get('/article/info', {
        params: {
            id
        }
    })
}
//添加文章
export const addArticle = (data) => {
    return request.post('/article/add', {params:data})
}
//点赞文章
export const likeArticle = (data) => {
    return request.post('/interaction/like', {params:data})
}
//收藏文章
export const collectArticle = (data) => {
    return request.post('/interaction/favorite', {params:data})
}