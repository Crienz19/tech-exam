import AuthApi from '@/services/AuthApi';
import { defineStore } from 'pinia';
import { RemovableRef, useLocalStorage } from '@vueuse/core';

export interface IUser {
    id: string;
    name: string;
    email: string;
}

export interface IAuthState {
    isLoading: boolean;
    isSuccess: boolean;
    errors: any;
    accessToken: RemovableRef<string>
    user: RemovableRef<IUser>
}

const initialUser : IUser = {
    id: '',
    email: '',
    name: ''
}

export const useAuthStore = defineStore({
    id: 'authStore',
    state: () : IAuthState => ({
        isLoading: false,
        isSuccess: false,
        accessToken: useLocalStorage('access_token', ''),
        user: useLocalStorage('auth', initialUser),
        errors: {},
    }),
    getters: {
        authenticated: (state) => state.accessToken != ''
    },
    actions: {
        async login(email : string, password : string) {
            try {
                this.isLoading = true;
                this.isSuccess = false;

                const response = (await AuthApi.login(email, password)).data;
                this.user = await response.data.user;
                this.accessToken = await response.data.access_token;

                await this.router.push({ name: 'task-page' });

                this.isLoading = false
                this.isSuccess = true;
            } catch (error : any) {
                this.isLoading = false;
                this.isSuccess = false;
                this.errors = error.response.data.errors;
            }
        },
        async logout() {
            try {
                this.isLoading = true;
                this.isSuccess = false;

                await AuthApi.logout();
                this.accessToken = '';
                this.user = initialUser;

                await this.router.replace({ name: 'login' })
                
                this.isLoading = false
                this.isSuccess = true;
            } catch (error : any) {
                this.isLoading = false;
                this.isSuccess = false;
                this.errors = error.response.data.errors;
            }
        }
    }
});