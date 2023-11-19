import { ApiRequest } from '@/lib/apiRequest';
import { AxiosResponse } from 'axios';

export interface ITaskForm {
    title: string;
    description: string;
    due_date: string;
    status: string;
}

export default {
    loadTasks() : Promise<AxiosResponse> {
        return ApiRequest.get('/tasks');
    },
    storeTask(data : ITaskForm) {
        return ApiRequest.post('/tasks', { ...data });
    },
    updateTask(data : ITaskForm, taskId : string) {
        return ApiRequest.put(`/tasks/${taskId}`, { ...data });
    },
    deleteTask(taskId : string) {
        return ApiRequest.delete(`/tasks/${taskId}`);
    }
}