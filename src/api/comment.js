import requset from '@/utils/axios'
//评论列表
export const commentList = (id) => {
    return requset.get('/interaction/list', { params: { articleId: id } });
  }
  //回复列表
  export const replyList = (id) => {
    return requset.get('/interaction/replyList', { params: { parentId: id } });
  }
//添加评论
export const addComment = (data) => {
    console.log("数据书数据",data)
    return requset.post('/interaction/add', data)
}
//删除评论
export const delComment = (id) => {
    return requset.delete('/interaction/delete', {params: {id}})
}