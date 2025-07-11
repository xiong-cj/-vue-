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