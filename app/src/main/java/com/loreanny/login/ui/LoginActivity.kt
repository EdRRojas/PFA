package com.loreanny.login.ui

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.loreanny.login.services.AuthService
import com.loreanny.login.R
import androidx.core.content.edit
import com.loreanny.login.MainActivity

class LoginActivity : AppCompatActivity() {

    private val authService = AuthService()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val cedula = findViewById<EditText>(R.id.txtCedula)
        val pass = findViewById<EditText>(R.id.txtPass)
        val btnLogin = findViewById<Button>(R.id.btnLogin)
        val olvidar = findViewById<TextView>(R.id.btnOlvidar)

        btnLogin.setOnClickListener {
            authService.login(
                cedula.text.toString(),
                pass.text.toString()
            ) {
                runOnUiThread {
                    if (it.exito) {
                        Toast.makeText(this, "Bienvenido", Toast.LENGTH_LONG).show()

                        // Guardar token en SharedPreferences
                        getSharedPreferences("app", MODE_PRIVATE)
                            .edit {
                                putString("token", it.token)
                            }

                        // Abrir menú principal
                        startActivity(Intent(this, MainActivity::class.java))
                        finish()

                    } else {
                        Toast.makeText(this, it.mensaje, Toast.LENGTH_LONG).show()
                    }
                }
            }
        }

        olvidar.setOnClickListener {
            startActivity(Intent(this, ForgotPasswordActivity::class.java))
        }
    }
}
