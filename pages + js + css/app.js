//  cotizador de seguros
let listaSeguros = []

// Funciones

// buscamos en el array de seguros para ver q sea valido
function pasarStringAObjetoSeguro(seguro){
    return listaSeguros.find( (Seguro) => Seguro.nombre === seguro) 
}
// buscamos si el seguro elegido, ya no esta agregado al carrito
function seguroRepetido(seguro){
    if(carritoDeSeguros.find( (Seguro) => Seguro.nombre === seguro)){
        return true
    }
    else{
        return false
    }
}

// llama a la funcion para ver q el seguro sea valido, al ser valido
// lo suma al array (carrito de seguros) y suma sus costos
// para brindar un monto total final
const seguroElegido = (segElegido)=>{
    segElegido = pasarStringAObjetoSeguro(segElegido)
    carritoDeSeguros.push(segElegido)
    localStorage.setItem("carrito", JSON.stringify(carritoDeSeguros))
    let lugarEnArray = listaSeguros.indexOf(segElegido)
    costoSegurosElegidos = costoSegurosElegidos + listaSeguros[lugarEnArray].costo  
    localStorage.setItem("sumaTotal", JSON.stringify(costoSegurosElegidos)) 
    renderCarrito()
}

// actualiza la informacion de los seguros contratados y el costo total
function renderCarrito(){
    segurosElegidos()
    const p = document.createElement("p")
    carrito.append(p)
    costoCarrito.innerHTML = `<h3>Selecionaste ${carritoDeSeguros.length} 
    seguros y el costo total de los seguros adquiridos es de $ ${costoSegurosElegidos}</h3>`
}

function segurosElegidos(){
    // borro el html para que no se duplique el html del carrito
    carrito.innerHTML = ""
    const p = document.createElement("p")
    carritoDeSeguros.forEach((seguro) => {
        const p = document.createElement("p")
        carrito.append(p)
        p.innerHTML = `<h4 class="centrar"> ${seguro.nombre}  ($${seguro.costo})</h4>
        `
     })


    
}


// vacia el carrito, el localStorage y reinicia la pagina
function clearCarrito(){
    carritoDeSeguros = []
    localStorage.clear()
    window.location.reload()

}



// objeto Seguro
class Seguro{
    constructor (nombre, costo, img) {
        this.nombre = nombre;
        this.costo = costo;
        this.img = img
    }
}

// main

//creamos las variables vacias
let carritoDeSeguros
let costoSegurosElegidos
// creamos variables con informacion almacenada en el localStorage
const costoSegurosElegidosEnLS = JSON.parse(localStorage.getItem("sumaTotal"))
const carritoDeSegurosEnLS = JSON.parse(localStorage.getItem("carrito"))
// si tiene informacion, la asigna, sino, las inciia con sus respectivos valores de "vacias"
if(carritoDeSegurosEnLS){
    carritoDeSeguros = carritoDeSegurosEnLS
}else{
    carritoDeSeguros = []
}
// si tiene informacion, la asigna, sino, crea la variable
if(costoSegurosElegidosEnLS){
    costoSegurosElegidos = costoSegurosElegidosEnLS
}else{
    costoSegurosElegidos = 0
}

// brindamos los seguros en el html
const contenerDeProcutos = document.getElementById("cuerpoHTML")
contenerDeProcutos.classList.add("segurosMostrados")

const mostrarSeguros = async () => {
    fetch("./pages + js + css/seguros.json")
        .then(response => response.json())
        .then(data => {
            listaSeguros = data;
            listaSeguros.forEach((seguro) => {
                const div = document.createElement(`div`)
                const image = document.createElement("img")
                image.src = seguro.img
                image.classList.add("imagenSeguro")
                div.innerHTML = `<h3 class="centrar" id="${seguro.nombre}-image" > ${seguro.nombre} </h3>
                                <h4 class="centrar">el precio $ ${seguro.costo}</h4>
                                <div class="agregadoAlCarrito centrar" id="agregarAlCarrito${seguro.nombre}">
                                    <button id="${seguro.nombre}" class="boton-agregar">agregar al carrito</button>
                                </div>
                                <hr>`
                contenerDeProcutos.append(div)
                document.getElementById(`${seguro.nombre}-image`).appendChild(image)
    
                
            })
        })
}

// inicializamos todo lo necesario para el funcionamiento de nuestro proyecto
const contenedorDelCarrito = document.getElementById("carrito")
const carrito = document.getElementById("segContratados")
const botonVaciarCarrito = document.getElementById("vaciar-carrito")


// creamos la etiqueta P que luego sera el costo total de los productos
const costoCarrito = document.createElement("p")
contenedorDelCarrito.append(costoCarrito)

// renderizamos el carrito
renderCarrito()


function eventoAgregarSeguroAlCarrito(e){
    if (e.target.classList.contains("boton-agregar")) {
        const seg = e.target.id;
        if(!seguroRepetido(seg)){
            seguroElegido(seg)
            Swal.fire(`PERFECTO! haz agregado el seguro de  ${seg} a su carrito`)
        }
        else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `El seguro de ${seg} ya se encuentra en el carrito`
              })
    
    
        }
    }
}

// Obtengo el contenedor
const contenedorSeguros = document.getElementById('cuerpoHTML');
contenedorSeguros.addEventListener('click', eventoAgregarSeguroAlCarrito);

//creamos el evento de vaciar el carrito y reiniciar la pagina si seleciona el boton
botonVaciarCarrito.addEventListener("click", ()=>{
    clearCarrito()
})

window.addEventListener('DOMContentLoaded', mostrarSeguros);