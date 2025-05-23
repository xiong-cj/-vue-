import request from "@/uitls/axios";
// 课程列表
export const courseList=(data)=>{
    return request.get('/course/courseList',{params:data})
}
// 添加课程
export const addCourse=(data)=>{
    return request.post('/course/add',data)
}
// 课程详细
export const courseInfo=(id)=>{
    return request.get('/course/courseInfo',{
        params:{
            id
        }
    })
}
