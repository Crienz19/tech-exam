<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request) 
    {
        $inputtedEmail = $request->input('email');

        if (!Auth::attempt([
            'email' => $inputtedEmail, 
            'password' => $request->input('password')
        ])) {
            
            abort(Response::HTTP_UNPROCESSABLE_ENTITY, 'Invalid credentials');        
        }

        $authUser = Auth::user();

        return response()->json([
            'status_code' => 200,
            'message' => 'Login successful',
            'data' => [
                'access_token' => $authUser->createToken($inputtedEmail)->plainTextToken,
                'user' => new UserResource($authUser)
            ]
        ], Response::HTTP_OK);
    }

    public function register(RegisterRequest $request)
    {
        $createdUser = User::query()
            ->create([
                'name' => $request->input('username'),
                'password' => $request->input('password'),
                'email' => $request->input('email')
            ]);

        $authUser = Auth::loginUsingId($createdUser->id);

        return response()
            ->json([
                'status' => Response::HTTP_CREATED,
                'message' => 'Register Successful',
                'data' => [
                    'access_token' => $authUser->createToken($createdUser->name)->plainTextToken,
                    'user' => new UserResource($createdUser)
                ]
            ], Response::HTTP_CREATED);
    }

    public function logout()
    {
        Auth::user()->tokens()->delete();

        return response()
            ->json([
                'status' => Response::HTTP_OK,
                'message' => 'Logout Successful'
            ], Response::HTTP_OK);
    }
}
