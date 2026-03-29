package com.eventzen.service;

import com.eventzen.dto.request.UpdateProfileRequest;
import com.eventzen.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse getUserById(Long id);
    UserResponse updateProfile(Long id, UpdateProfileRequest request);
    List<UserResponse> getAllUsers();
    void deleteUser(Long id);
}