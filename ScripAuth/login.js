async function iniciarSesion() {
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    if (!correo || !contrasena) {
        alert('Por favor, complete todos los campos.');
        return;
    }
    
    const requestBody = {
        Correo: correo,
        Contrasena: contrasena 
    };

    try {
        const response = await fetch('http://localhost:5095/api/Auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (response.ok) {
            const userData = await response.json();
            alert('Inicio de sesión exitoso.');
            document.getElementById('correo').value = '';
            document.getElementById('contrasena').value = '';

            const rol = String(userData.rol || userData.Rol).toLowerCase(); 

            if (rol === 'alumno' || rol === '1') {
             
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'alumnos.html'; 
            } else if (rol === 'profesor' || rol === '2') {
            
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'profesores.html'; 
            } else {

                console.error("Rol de usuario no reconocido:", rol);
                alert('Rol de usuario no reconocido. Serás redirigido a la página de inicio de sesión.');
                window.location.href = 'login.html'; 
            }

        } else {
            const errorText = await response.text();
            let errorMessage = `Error del servidor (${response.status}): Credenciales incorrectas.`;
            
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorData.title || errorData.detail || 'Credenciales incorrectas.';
            } catch (e) {
                errorMessage = errorText; 
            }
            throw new Error(`Inicio de sesión fallido: ${errorMessage}`);
        }
    } catch (err) {
        console.error(`Error al iniciar sesión: ${err}`);
        alert(`Error al iniciar sesión: ${err.message || 'No se pudo conectar al servidor.'}`);
    }
}