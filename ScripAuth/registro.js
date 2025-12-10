async function registrarUsuario() {
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const rolInput = parseInt(document.getElementById('rol').value); 
    
    
    let rolNombre = '';
    if (rolInput === 1) {
        rolNombre = 'Alumno';
    } else if (rolInput === 2) {
        rolNombre = 'Profesor';
    } else {
        alert('Por favor, seleccione un rol válido (1 para Alumno, 2 para Profesor).');
        return;
    }

    
    if (!nombre || !correo || !contrasena || !rolNombre) {
        alert('Por favor, complete todos los campos.');
        return;
    }
    
    const requestBody = {
        Nombre: nombre,
        Correo: correo,
        Contrasena: contrasena,
        Rol: rolNombre 
    };

    try{
        const response = await fetch('http://localhost:5095/api/Auth/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody) 
        });
        
        if (response.ok) {
            alert('Usuario registrado con éxito. Serás redirigido para iniciar sesión.');
           
            document.getElementById('nombre').value = '';
            document.getElementById('correo').value = '';
            document.getElementById('contrasena').value = '';
            document.getElementById('rol').value = '';
            window.location.href = 'login.html';
        } else {
            const errorText = await response.text();
            let errorMessage = `Error del servidor (${response.status}): ${errorText}`;
            
            try {
                const errorData = JSON.parse(errorText);
                
                errorMessage = errorData.errors?.Correo?.[0] || errorData.title || JSON.stringify(errorData);
            } catch (e) {
            }
            throw new Error(errorMessage);
        }

    } catch (err) {
        console.error(`Error al registrar el usuario: ${err}`);
        alert(`Error al registrar el usuario: ${err.message || 'Por favor, intente de nuevo más tarde.'}`);
    }
}