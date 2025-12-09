package com.loreanny.login.ui

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.loreanny.login.R
import com.loreanny.login.services.AuthService

class ChangePasswordActivity : AppCompatActivity() {

    private val service = AuthService()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_change_password)

        val actual = findViewById<EditText>(R.id.txtActual)
        val nueva = findViewById<EditText>(R.id.txtNueva)
        val confirmar = findViewById<EditText>(R.id.txtConfirmar)
        val btn = findViewById<Button>(R.id.btnCambiar)

        val token = getSharedPreferences("app", MODE_PRIVATE).getString("token", "") ?: ""

        btn.setOnClickListener {

            if (actual.text.isEmpty() || nueva.text.isEmpty() || confirmar.text.isEmpty()) {
                Toast.makeText(this, "Completa todos los campos", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }

            if (nueva.text.toString() != confirmar.text.toString()) {
                Toast.makeText(this, "Las contraseñas no coinciden", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }

            service.cambiarClave(token, actual.text.toString(), nueva.text.toString()) {
                runOnUiThread {
                    Toast.makeText(this, it, Toast.LENGTH_LONG).show()
                }
            }
        }
    }
}
