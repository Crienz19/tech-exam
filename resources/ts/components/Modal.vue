<script setup lang="ts">
import { useTaskStore } from '@/store/task';
import { ref, onMounted, watch } from 'vue';
import { ITaskForm } from '@/services/TaskApi';
import { storeToRefs } from 'pinia';

const taskStore = useTaskStore();
const { selectedTask, actionType, errors, hasErrors } = storeToRefs(taskStore);

onMounted(() => {
    taskForm.value.title = selectedTask.value.title;
    taskForm.value.description = selectedTask.value.description;
    taskForm.value.due_date = selectedTask.value.due_date;
    taskForm.value.status = selectedTask.value.status;
});

const emits = defineEmits<{
    (e : 'closeModalEvent') : void
}>();

const taskForm = ref<ITaskForm>({
    title: '',
    description: '',
    due_date: '',
    status: ''
});

const submitTaskHandler = async () => {
    if (actionType.value == 'add') {
        await taskStore.storeTask(taskForm.value)
    }

    if (actionType.value == 'edit') {
        await taskStore.updateTask(selectedTask.value.id, taskForm.value);
    }

    if (!hasErrors.value) {
        emits('closeModalEvent');
    }
}

const cancelTaskHandler = () => {
    taskStore.resetDefault();
    emits('closeModalEvent');
}
</script>

<template>
  <!-- Main modal -->
  <div tabindex="-1" aria-hidden="true" class="flex overflow-y-auto overflow-x-hidden fixed z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div class="relative p-4 w-full max-w-2xl max-h-full">
          <!-- Modal content -->
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <!-- Modal header -->
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                      Task
                  </h3>
              </div>
              <!-- Modal body -->
              <div class="p-4 md:p-5 space-y-4">
                <div>
                    <label for="email" class="block text-sm font-medium leading-6 dark:text-white">Title</label>
                    <div class="mt-2">
                      <input :class="{ 'border-1 border-red-500' : errors && errors.hasOwnProperty('title') }" v-model="taskForm.title" type="text" autocomplete="email" class="block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium leading-6 dark:text-white">Description</label>
                    <div class="mt-2">
                      <textarea :class="{ 'border-1 border-red-500' : errors && errors.hasOwnProperty('description') }" v-model="taskForm.description" class="block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium leading-6 dark:text-white">Due Date</label>
                    <div class="mt-2">
                      <input :class="{ 'border-1 border-red-500' : errors && errors.hasOwnProperty('due_date') }" v-model="taskForm.due_date" type="date" class="block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium leading-6 dark:text-white">Status</label>
                    <div class="mt-2">
                      <select :class="{ 'border-1 border-red-500' : errors && errors.hasOwnProperty('status') }" v-model="taskForm.status" class="block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        <option value="">Select status</option>
                        <option value="TODO">TODO</option>
                        <option value="IN-PROGRESS">IN-PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                    </div>
                </div>
              </div>
              <!-- Modal footer -->
              <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button @click="submitTaskHandler()" data-modal-hide="default-modal" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{{ actionType == 'add' ? 'Save' : 'Update' }} task</button>
                  <button @click="cancelTaskHandler()" data-modal-hide="default-modal" type="button" class="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
              </div>
          </div>
      </div>
  </div>  
</template>