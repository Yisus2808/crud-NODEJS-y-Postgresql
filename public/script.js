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