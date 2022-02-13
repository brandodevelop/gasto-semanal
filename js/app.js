// Variables y Selectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

// Eventos
eventlistener();
function eventlistener(){
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
    formulario.addEventListener("submit", agregarGasto);
}

// Clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        console.log(this.gastos);
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto)=> total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI{
    insertarPresupuesto(cantidad){
        // Extrayendo los valores
        const {presupuesto, restante} = cantidad;

        // Agregar el HTMl :)
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
        // crear el div
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", "alert");

        if(tipo === "error"){
            divMensaje.classList.add("alert-danger");
        }else{
            divMensaje.classList.add("alert-success");
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el HTML
        
        document.querySelector(".primario").insertBefore(divMensaje, formulario);

        // Quitar el HTML
        setTimeout(()=>{
            divMensaje.remove();
        }, 3000)
    }

    agregarGastoListado(gastos){
        // Iterar sobre los gastos

        this.limpiarHTML();

        gastos.forEach( gasto =>{
            const {cantidad, nombre, id} = gasto;

            // Crear un li
            const nuevoGasto = document.createElement("li");
            nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center";
            nuevoGasto.setAttribute("data-id", id);
            /*nuevoGasto.dataset.id = id;*/

            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`

            // Boton para borrar el gasto
            const btnBorrar = document.createElement("button");
            btnBorrar.innerHTML = "Borrar &times;"
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
            btnBorrar.onclick = ()=> {
                eliminarGasto(id);
            }

            nuevoGasto.appendChild(btnBorrar);

            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        })
    }

    actualizarRestante(restante){
        document.querySelector("#restante").textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector(".restante")

        // Comprobar 25%
        if((presupuesto / 4) > restante){
            restanteDiv.classList.remove("alert-success", "alert-warning");
            restanteDiv.classList.add("alert-danger");
        }else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove("alert-success", "alert-danger");
            restanteDiv.classList.add("alert-warning");
        }else{
            restanteDiv.classList.remove("alert-danger", "alert-warning");
            restanteDiv.classList.add("alert-success");
        }

        // Si el total es 0 o menor
        if(restante <= 0){
            ui.imprimirAlerta("El presupuesto se ha agotado", "error");
            formulario.querySelector("button[type='submit']").disabled = true;
        }
    }

    // Limpiar el HTML previo
    limpiarHTML(){
        while(gastoListado.firstChild){
        gastoListado.removeChild(gastoListado.firstChild);
    }
}
}

// Instanciar 
const ui = new UI();

let presupuesto;


// Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("¿Cual es tu presupuesto?");

    if(presupuestoUsuario === null || presupuestoUsuario === ""  ||  isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }

    // Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
}

// Añade Gasto
function agregarGasto(e){
    e.preventDefault();

    // Leer los Datos del formulario
    const nombre = document.querySelector("#gasto").value;
    const cantidad = Number(document.querySelector("#cantidad").value);

    // Validar
    if(nombre === "" || cantidad === "" ){
        ui.imprimirAlerta("Ambos campos son obligatorios", "error");
        return;
    }else if( cantidad <= 0 || isNaN(cantidad) ){
        ui.imprimirAlerta("Cantidad no válida", "error");
        return;
    }
    else if( isNaN(nombre) === false ){
        ui.imprimirAlerta("Nombre no válido", "error");
        return;
    }

    // Generar un objeto con el gasto
    const gasto = {nombre , cantidad, id: Date.now()};

    presupuesto.nuevoGasto(gasto);

    ui.imprimirAlerta("Gasto agregado Correctamente");

    // Imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.agregarGastoListado(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    // Reiniciar Formulario
    formulario.reset();

}

// Eliminar Gasto
function eliminarGasto(id){
    // Los elimina del obj
    presupuesto.eliminarGasto(id);
    const {gastos, restante} = presupuesto;

    // Elimina los gastos del HTML
    ui.agregarGastoListado(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

}


