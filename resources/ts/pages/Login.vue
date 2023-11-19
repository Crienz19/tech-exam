<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { isLoading, isSuccess, errors } = storeToRefs(authStore);

const loginForm = ref({
    email: '',
    password: ''
});

const loginHandler = async () => {
    await authStore.login(loginForm.value.email, loginForm.value.password);
}

</script>

<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
          <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
        </div>
    
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form @submit.prevent="loginHandler" class="space-y-6" action="#" method="POST">
            <div>
              <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
              <div class="mt-2">
                <input :class="{ 'border-1 border-red-500' : errors && errors.hasOwnProperty('email') }" v-model="loginForm.email" id="email" name="email" type="email" autocomplete="email" class="border block w-full rounded-md  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                <span v-if="errors && errors.hasOwnProperty('email')" class="text-red-500">{{ errors.email[0] }}</span>
              </div>
            </div>
    
            <div>
                <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                <div class="mt-2">
                  <input :class="{ 'border-1 border-red-500' : errors && errors.hasOwnProperty('password') }" v-model="loginForm.password" id="password" name="password" type="password" autocomplete="current-password" class="border block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  <span v-if="errors && errors.hasOwnProperty('password')" class="text-red-500">{{ errors.password[0] }}</span>
                </div>
            </div>
    
            <div>
              <button :disabled="isLoading" type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
            </div>
          </form>
        </div>
      </div>
</template>