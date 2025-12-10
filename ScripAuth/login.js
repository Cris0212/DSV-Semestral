async function iniciarSesion() {
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    if (!correo || !contrasena) {
        alert('Por favor, complete todos los campos.');
        return;
    }
    

    const requestBody = {
        correo: correo,
        contrasena: contrasena 
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
            const data = await response.json();
            
           
            
            
            localStorage.setItem('userData', JSON.stringify(data));
            localStorage.setItem('isLoggedIn', 'true'); 

            alert('Inicio de sesión exitoso.');
            
         
            document.getElementById('correo').value = '';
            document.getElementById('contrasena').value = '';
            
            //  acordame de cambiar el nombre cuando se haga la pantalla principal
            window.location.href = 'principal.html'; 

        } else {
            const errorText = await response.text();
            let errorMessage = `Error del servidor (${response.status}): ${errorText}`;
            
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.detail || errorData.message || 'Credenciales incorrectas.';
            } catch (e) {
                
            }
            throw new Error(`Inicio de sesión fallido: ${errorMessage}`);
        }
    } catch (err) {
        console.error(`Error al iniciar sesión: ${err}`);
        alert(`Error al iniciar sesión: ${err.message || 'No se pudo conectar al servidor.'}`);
    }
}