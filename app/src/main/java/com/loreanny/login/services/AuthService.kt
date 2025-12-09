package com.loreanny.login.services

import okhttp3.*
import org.json.JSONObject
import com.loreanny.login.models.*

class AuthService {

    private val client = OkHttpClient()
    private val baseUrl = "https://adamix.net/medioambiente"

    // LOGIN -------------------------------------------------------------
    fun login(cedula: String, clave: String, callback: (LoginResponse) -> Unit) {

        val body = FormBody.Builder()
            .add("cedula", cedula)
            .add("clave", clave)
            .build()

        val request = Request.Builder()
            .url("$baseUrl/login.php")
            .post(body)
            .build()

        client.newCall(request).enqueue(object: Callback {
            override fun onFailure(call: Call, e: java.io.IOException) {
                callback(LoginResponse(false, "Error de conexión", null))
            }

            override fun onResponse(call: Call, response: Response) {
                val json = JSONObject(response.body!!.string())
                callback(
                    LoginResponse(
                        json.getBoolean("exito"),
                        json.getString("mensaje"),
                        json.optString("token")
                    )
                )
            }
        })
    }

    // RECUPERAR CONTRASEÑA ---------------------------------------------
    fun recuperar(correo: String, callback: (String) -> Unit) {

        val body = FormBody.Builder()
            .add("correo", correo)
            .build()

        val request = Request.Builder()
            .url("$baseUrl/recuperar_clave.php")
            .post(body)
            .build()

        client.newCall(request).enqueue(object: Callback {
            override fun onFailure(call: Call, e: java.io.IOException) {
                callback("Error de conexión")
            }

            override fun onResponse(call: Call, response: Response) {
                val json = JSONObject(response.body!!.string())
                callback(json.getString("mensaje"))
            }
        })
    }

    // CAMBIAR CONTRASEÑA ------------------------------------------------
    fun cambiarClave(token: String, actual: String, nueva: String, callback: (String) -> Unit) {

        val body = FormBody.Builder()
            .add("token", token)
            .add("clave_anterior", actual)
            .add("clave_nueva", nueva)
            .build()

        val request = Request.Builder()
            .url("$baseUrl/cambiar_clave.php")
            .post(body)
            .build()

        client.newCall(request).enqueue(object: Callback {
            override fun onFailure(call: Call, e: java.io.IOException) {
                callback("Error de conexión")
            }

            override fun onResponse(call: Call, response: Response) {
                val json = JSONObject(response.body!!.string())
                callback(json.getString("mensaje"))
            }
        })
    }
}
