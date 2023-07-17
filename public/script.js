function validateForm() {
    // Obtener los valores de los campos
    var nombreEmpleado = document.getElementById("nombre_empleado").value
    var apellido = document.getElementById("apellido").value
    var telefono = document.getElementById("telefono").value
    var direccion = document.getElementById("dirreccion").value
    var fechaNacimiento = document.getElementById("fecha_naciemiento").value
    var observacion = document.getElementById("observacion").value
    var sueldo = document.getElementById("sueldo").value
    var departamento = document.getElementById("departamento").value

    // Validar cada campo individualmente
    if (nombreEmpleado === "" || apellido === "" || telefono === "" || direccion === "" || fechaNacimiento === "" || observacion === "" || sueldo === "" || departamento === "") {
        alert("Por favor, completa todos los campos.")
        return false // Evita que el formulario se envíe
    }

    /*/////////////////////////////////////////////////////
    //////////// Otras validaciones específicas ///////////
    /////////////////////////////////////////////////////*/

    // Expresión regular para validar el formato de teléfono
    var telefonoPattern = /^\d{10}$/ // Formato de 10 dígitos

    if (!telefonoPattern.test(telefono)) {
        alert("Por favor, ingresa un número de teléfono válido de 10 dígitos.");
        return false // Evita que el formulario se envíe
    }

    // Si todas las validaciones pasan, puedes permitir que el formulario se envíe
    return true
}


// Alerta para el envio del formulario
function validateFormDepartamento() {
    // Validar tus campos y lógica adicional aquí

    // Mostrar alerta
    // alert("¡Formulario enviado correctamente!");

    // Retornar false para evitar que el formulario se envíe
    // return false;
}





/*/////////////////////////////////////////////////////
//////////// PARA EL MENÚ ///////////
/////////////////////////////////////////////////////*/
window.onload = function() {
    var menuItems = document.querySelectorAll("#menu li");

    for (var i = 0; i < menuItems.length; i++) {
        menuItems[i].addEventListener("click", function() {
            // Agrega lógica para manejar la acción al hacer clic en un elemento del menú
            console.log("Haz clic en: " + this.innerText);
        });
    }
};