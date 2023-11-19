<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TaskFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_tasks_api()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->getJson('api/v1/tasks');

        $response->assertOk();
    }

    public function test_store_task_api()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $data = [
            'title' => 'Test title',
            'description' => 'Test description',
            'status' => 'TODO',
            'due_date' => '2023-01-01'
        ];

        $response = $this->postJson('api/v1/tasks', $data);

        $this->assertDatabaseCount('tasks', 1);
        $response->assertCreated();
    }

    public function test_update_task_api()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $data = [
            'user_id' => $user->id,
            'title' => 'Test title',
            'description' => 'Test description',
            'status' => 'TODO',
            'due_date' => '2023-01-01'
        ];

        $createdTask = Task::create($data);

        $response = $this->putJson('api/v1/tasks/' . $createdTask->id, $data);

        $response->assertOk();
    }

    public function test_delete_task_api()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $data = [
            'user_id' => $user->id,
            'title' => 'Test title',
            'description' => 'Test description',
            'status' => 'TODO',
            'due_date' => '2023-01-01'
        ];

        $createdTask = Task::create($data);

        $response = $this->deleteJson('api/v1/tasks/' . $createdTask->id);

        $this->assertDatabaseCount('tasks', 0);
        $response->assertOk();
    }
}
