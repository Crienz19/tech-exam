<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TaskCard from '@/components/TaskCard.vue';
import Modal from '@/components/Modal.vue';
import draggable from 'vuedraggable';
import { useTaskStore } from '@/store/task';
import { storeToRefs } from 'pinia';
import Navbar from '@/components/Navbar.vue';

const taskStore = useTaskStore();
const { isLoading, isSuccess, tasks } = storeToRefs(taskStore);

onMounted(async () => {
  await taskStore.loadTasks();
})

const drag = ref<boolean>(false);
const isTaskModelOpen = ref<boolean>(false);

const testHandler = async (taskElem : any) => {

  await taskStore.updateTaskStatus(taskElem.item.id, taskElem.to.id);
}

const showTaskHandler = (e : any) => {
  isTaskModelOpen.value = true;
}
</script>

<template>
    <Navbar @create-task-event="isTaskModelOpen = true" />
    <div class="flex justify-center">
      <Modal @close-modal-event="isTaskModelOpen = false" v-if="isTaskModelOpen" />
      <div class="flex py-5 h-[90vh]">
        <div
          v-for="column in tasks"
          :key="column.title"
          class="bg-gray-100 px-3 py-3 column-width rounded mr-4 min-w-[330px]"
        >
          <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">{{column.title}}</p>
          <draggable 
              :id="column.title"
              :list="column.tasks" 
              item-key="id" 
              :animation="200" 
              class="ghost-card mt-3" 
              @end="testHandler"
              group="title"
          >
            <template #item="{element}">
                <TaskCard
                    :task="element"
                    :id="element.id"
                    class="mt-3 cursor-move"
                    @show-task-event="showTaskHandler"
                />
            </template>
          </draggable>
        </div>
      </div>
    </div>
</template>

<style scoped>
.column-width {
  min-width: 320px;
  width: 320px;
}
.ghost-card {
  background: #F7FAFC;
  height: 96%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>