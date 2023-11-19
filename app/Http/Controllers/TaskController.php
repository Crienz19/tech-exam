<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $taskStatus = ['TODO', 'IN-PROGRESS', 'DONE'];

        $tasks = Task::query()->where('user_id', Auth::user()->id)->latest()->get();
        
        $formattedTask = [];

        foreach ($taskStatus as $key => $value) {
            $formattedTask[] = [
                'title' => $value,
                'tasks' => TaskResource::collection($tasks->where('status', $value))
            ];
        }

        return response()->json([
            'status' => Response::HTTP_OK,
            'message' => 'Tasks loaded successfully',
            'data' => $formattedTask
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TaskRequest $request)
    {
        $createdTask = Task::query()
            ->create([
                'user_id' => Auth::user()->id,
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'due_date' => $request->input('due_date'),
                'status' => $request->input('status')
            ]);

        return response()->json([
            'status' => Response::HTTP_CREATED,
            'message' => 'Task created successfully',
            'data' => new TaskResource($createdTask)
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TaskRequest $request, string $id)
    {
        $task = Task::query()->where('id', $id);

        if (!$task->exists()) {

            abort(Response::HTTP_NOT_FOUND, 'Task not found');
        }

        $task->update([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'due_date' => $request->input('due_date'),
            'status' => $request->input('status')
        ]);

        return response()->json([
            'status' => Response::HTTP_OK,
            'message' => 'Task updated successfully',
            'data' => new TaskResource($task->first())
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $task = Task::query()->where('id', $id);

        if (!$task->exists()) {

            abort(Response::HTTP_NOT_FOUND, 'Task not found');
        }

        $task->delete();

        return response()->json([
            'status' => Response::HTTP_OK,
            'message' => 'Task deleted successfully'
        ], Response::HTTP_OK);
    }
}
