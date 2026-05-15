package com.garage.pro.dto;

import com.garage.pro.model.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private Role role;
}
