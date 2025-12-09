package com.loreanny.login.models

data class ChangePasswordRequest(
    val token: String,
    val actual: String,
    val nueva: String
)
