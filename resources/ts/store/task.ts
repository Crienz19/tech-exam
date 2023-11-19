import TaskApi, { ITaskForm } from "@/services/TaskApi";
import { defineStore } from "pinia";

export interface ITask {
    id: string;
    title: string;
    description: string;
    status: string;
    formatted_due_date: string;
    due_date: string;
    created_by: string;
}

export interface ITaskCollection {
    title: string;
    tasks: ITask[]
}

export interface ITaskStoreState {
    actionType: string;
    selectedTask: ITask;
    isLoading: boolean;
    isSuccess: boolean;
    errors: any;
    tasks: ITaskCollection[]
}

export const useTaskStore = defineStore({
    id: 'taskStore',
    state: () : ITaskStoreState => ({
        actionType: 'add',
        selectedTask: {} as ITask,
        isLoading: false,
        isSuccess: false,
        errors: {},
        tasks: []
    }),
    getters: {
        hasErrors : (state) => Object.keys(state.errors).length > 0
    },
    actions: {
        editTask(task : ITask) {
            this.selectedTask = task;
            this.actionType = 'edit';
        },
        resetDefault() {
            this.actionType = 'add';
            this.selectedTask = {} as ITask;
        },
        async loadTasks() {
            try {
                this.isLoading = false;
                this.isSuccess = true;

                const response = (await TaskApi.loadTasks()).data;
                this.tasks = response.data;

                this.errors = {};

                this.isLoading = false;
                this.isSuccess = true;
            } catch (error : any) {
                this.isLoading = false;
                this.isSuccess = false;
                this.errors = error.response.data.errors;
            }
        },
        async storeTask(data : ITaskForm) {
            try {
                this.isLoading = false;
                this.isSuccess = true;

                const response = (await TaskApi.storeTask(data)).data;
                this.tasks.filter((e) => {
                    if (e.title == data.status) {
                        e.tasks.unshift(response.data);
                    }
                });

                this.errors = {};

                this.isLoading = false;
                this.isSuccess = true;
            } catch (error : any) {
                this.isLoading = false;
                this.isSuccess = false;
                this.errors = error.response.data.errors;
            }
        },
        async updateTask(taskId : string, data : ITaskForm) {
            try {
                this.isLoading = true;
                this.isSuccess = false;

                const response = (await TaskApi.updateTask(data, taskId)).data;

                if (this.selectedTask.status != data.status) {
                    this.tasks.filter((e) => {
                        if(e.title == this.selectedTask.status) {
                            let updatedTasks = e.tasks.filter(t => t.id != taskId);
                            e.tasks = updatedTasks;
                        }
                    });

                    this.tasks.filter((e) => {
                        if(e.title == data.status) {
                            e.tasks.unshift(response.data);
                        }
                    });
                } else {
                    this.tasks.filter((e) => {
                        if (e.title == response.data.status) {
                            let taskSelected = e.tasks.findIndex(t => t.id == taskId);
                            
                            if(taskSelected !== -1) {
                                e.tasks[taskSelected] = response.data;
                            }
                        }
                    });
                }

                this.resetDefault();

                this.errors = {};

                this.isLoading = false;
                this.isSuccess = true;
            } catch (error : any) {
                this.isLoading = false;
                this.isSuccess = false;
                this.errors = error.response.data.errors;
            }
        },
        async updateTaskStatus(taskId : string, status : string) {
            try {
                this.isLoading = false;
                this.isSuccess = true;

                let taskForm : ITaskForm = {
                    title: '',
                    description: '',
                    due_date: '',
                    status: ''
                }

                this.tasks.filter((e) => {
                    if (e.title == status) {
                        let selectedTask = e.tasks.find(t => t.id == taskId);
                        
                        if(selectedTask) {
                            selectedTask.status = status;
                            taskForm.title = selectedTask.title;
                            taskForm.description = selectedTask.description;
                            taskForm.due_date = selectedTask.due_date;
                            taskForm.status = status;
                        }
                    }
                });

                await TaskApi.updateTask(taskForm, taskId);

                this.errors = {};

                this.isLoading = false;
                this.isSuccess = true;
            } catch (error : any) {
                this.isLoading = false;
                this.isSuccess = false;
                this.errors = error.response.data.errors;
            }
        },
        async removeTask(taskId : string, status: string) {
            try {
                this.isLoading = true;
                this.isSuccess = false;

                await TaskApi.deleteTask(taskId);

                this.tasks.filter((e) => {
                    if (e.title == status) {
                        let updatedTasks = e.tasks.filter(t => t.id != taskId);
                        
                        e.tasks = updatedTasks;
                    }
                });

                this.errors = {};
                this.isLoading = false;
                this.isSuccess = true;
            } catch (error : any) {
                this.isLoading = false;
                this.isSuccess = false;
                this.errors = error.response.data.errors;
            }
        }
    }
})