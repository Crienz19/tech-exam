<script setup lang="ts">
import { useTaskStore, ITask } from '@/store/task';
const taskStore = useTaskStore();

const { task } = defineProps<{
    task : ITask
}>();

const emits = defineEmits<{
  (e : 'showTaskEvent') : void
}>();

const showTaskHandler = () => {
  taskStore.editTask(task);
  emits('showTaskEvent');
}

const removeTaskHandler = async () => {
  await taskStore.removeTask(task.id, task.status);
}
</script>

<template>
    <div class="relative bg-white shadow rounded px-3 pt-3 pb-5 border border-white">
        <div @click="removeTaskHandler()" class="cursor-pointer absolute z-40 top-2 right-2">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close modal</span>
        </div>
        <div class="flex justify-between">
          <p @click="showTaskHandler()" class="text-gray-700 font-semibold font-sans tracking-wide text-sm hover:underline hover:cursor-pointer">{{ task.title }}</p>
    
          <div class="w-6 h-6 rounded-full ml-3">
            <span></span>
          </div>
        </div>
        <div class="mt-1">
          <p class="text-sm">{{ task.description }}</p>
        </div>
        <div class="flex mt-4 justify-between items-center">
          <span class="text-sm text-gray-600">Due date: {{ task.formatted_due_date }}</span>
          <!-- <span class="text-sm">{{ task.created_by }}</span> -->
          <!-- <badge v-if="task.type" :color="badgeColor">{{task.type}}</badge> -->
        </div>
      </div>
</template>