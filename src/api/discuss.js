import requset from '@/utils/request'
//评论列表
export const commomList = (id) => {
    return requset.get('/interaction/list',{params:id})
}
//添加评论
export const addComment = (data) => {
    return requset.post('/interaction/add', {params: data})
}
//删除评论
export const delComment = (id) => {
    return requset.delete('/interaction/delete', {params: {id}})
}