<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AuthFeatureTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_login_api()
    {
        $data = [
            'name' => 'test',
            'email' => 'test_user@app.com',
            'password' => 'password'
        ];

        User::create($data);

        $response = $this->postJson('api/v1/login', $data);

        $response->assertOk();
    }

    public function test_register_api()
    {
        $data = [
            'username' => 'test',
            'email' => 'test_user@app.com',
            'password' => 'password',
            'password_confirmation' => 'password'
        ];

        $response = $this->postJson('api/v1/register', $data);

        $this->assertDatabaseCount('users', 1);
        $response->assertCreated();
    }

    public function test_logout_api()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->postJson('api/v1/logout');

        $response->assertOk();
    }
}
