package com.loreanny.login.ui

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.loreanny.login.R
import com.loreanny.login.services.AuthService

class ForgotPasswordActivity : AppCompatActivity() {

    private val service = AuthService()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_forgot_password)

        val correo = findViewById<EditText>(R.id.txtCorreo)
        val btn = findViewById<Button>(R.id.btnEnviar)

        btn.setOnClickListener {

            if (correo.text.isEmpty()) {
                Toast.makeText(this, "Escribe un correo", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }

            service.recuperar(correo.text.toString()) {
                runOnUiThread {
                    Toast.makeText(this, it, Toast.LENGTH_LONG).show()
                }
            }
        }
    }
}
