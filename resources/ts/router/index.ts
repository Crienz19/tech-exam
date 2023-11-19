import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import LoginPage from '@/pages/Login.vue'
import TaskPage from '@/pages/Tasks.vue';
import { useAuthStore } from '@/store/auth';

let routes:Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "login",
        component: LoginPage
    },
    {
        path: "/tasks",
        name: "task-page",
        component: TaskPage
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (!authStore.authenticated && to.name !== 'login') {

        next({ name: 'login' })
    } else if(authStore.authenticated && to.name !== 'task-page') {
        
        next({ name: 'task-page' })
    }
    else {
        next();
    }
})

export default router;