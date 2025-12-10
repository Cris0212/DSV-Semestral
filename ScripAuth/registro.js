async function registrarUsuario() {
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const rol = parseInt(document.getElementById('rol').value); 

    if (!nombre || !correo || !contrasena || !rol) {
        alert('Por favor, complete todos los campos.');
        return;
    }
    
    const requestBody = {
        Nombre: nombre,
        Correo: correo,
        Contrasena: contrasena,
        Rol: rol
    };

    try{
      
        const response = await fetch('http://localhost:5215/api/Auth/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody) 
        });
        
      
        if (response.ok) {
            alert('Usuario registrado con éxito. Ahora puede iniciar sesión.');
            document.getElementById('nombre').value = '';
            document.getElementById('correo').value = '';
            document.getElementById('contrasena').value = '';
            document.getElementById('rol').value = '';
            window.location.href = 'login.html';
        } else {
            const errorData = await response.json();
            const errorMessage = errorData.detail || JSON.stringify(errorData);
            throw new Error(`Error del servidor (${response.status}): ${errorMessage}`);
        }

    } catch (err) {
        console.error(`Error al registrar el usuario: ${err}`);
        alert(`Error al registrar el usuario: ${err.message || 'Por favor, intente de nuevo más tarde.'}`);
    }
}





