<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller {

    /**
     * Get all users list
     * 
     * @return type
     */
    public function index() {
        $users = User::orderBy('created', 'desc')->paginate(10);
        return response()->json($users);
    }

    /**
     * Store users details
     * 
     * @param Request $request
     * @return type
     */
    public function store(Request $request) {
        try {
            $data = $request->validate([
                'firstName' => 'required|string',
                'lastName' => 'required|string',
                'email' => [
                    'required',
                    'unique:users,email',
                    'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'
                ],
            ]);

            $data['created'] = date('Y-m-d H:i:s');
            $user = new User;
            $user->firstName = $request->input('firstName');
            $user->lastName = $request->input('lastName');
            $user->email = $request->input('email');
            $user->created = date('Y-m-d H:i:s');
            $user->save();

            return response()->json([
                        'message' => 'User created successfully',
                        'status' => true
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                        'message' => 'Validation failed',
                        'errors' => $e->errors(),
                        'status' => false,
                            ], 422);
        } catch (Exception $e) {
            return response()->json([
                        'message' => 'Server error',
                        'error' => $e->getMessage(),
                        'status' => false,
                            ], 500);
        }
    }

    /**
     * Get user detail according to id
     * @param type $id
     * @return type
     */
    public function show($id) {
        try {
            $user = User::where('id', $id)->first();

            return response()->json($user);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                        'message' => 'User not found'
                            ], 404);
        }
    }

    /**
     * update user Details
     * 
     * @param Request $request
     * @param type $id
     * @return type
     */
    public function update(Request $request, $id) {
        try {
            $data = $request->validate([
                'firstName' => 'required|string',
                'lastName' => 'required|string',
                'email' => [
                    'required',
                    "unique:users,email,$id",
                    'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'
                ],
            ]);

            $user = User::where('id', $id)->first();
            $user->firstName = $request->input('firstName');
            $user->lastName = $request->input('lastName');
            $user->email = $request->input('email');
            $user->save();

            return response()->json([
                        'message' => 'User updated successfully',
                        'status' => true
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                        'message' => 'Validation failed',
                        'errors' => $e->errors(),
                        'status' => false,
                            ], 422);
        } catch (Exception $e) {
            return response()->json([
                        'message' => 'Server error',
                        'error' => $e->getMessage(),
                        'status' => false,
                            ], 500);
        }
    }

    /**
     * Delete the user 
     * 
     * @param type $id
     * @return type
     */
    public function destroy($id) {
        try {
            $user = User::where('id', $id)->first();

            if (!$user) {
                return response()->json([
                            'message' => 'User not found'
                                ], 404);
            }

            $user->delete();

            return response()->json([
                        'status' => true,
                        'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                        'message' => 'Server error',
                        'error' => $e->getMessage()
                            ], 500);
        }
    }

}
