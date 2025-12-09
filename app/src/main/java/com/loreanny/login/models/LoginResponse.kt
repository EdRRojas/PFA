package com.loreanny.login.models

data class LoginResponse(
    val exito: Boolean,
    val mensaje: String,
    val token: String?
)
