//class constructora
class Cuadro {
    constructor(id, nombre, tamaño, precio, imagen){
        //propiedades o atributos de nuestra clase
        this.id = id,
        this.nombre = nombre,
        this.tamaño = tamaño,
        this.precio = precio,
        this.imagen = imagen

    }
    //métodos
    mostrarData(){
        console.log(`${this.nombre}, tiene una medida de ${this.tamaño} y su precio es ${this.precio} `)
    }
}
//Instanciación de objetos -- respetamos orden y cantidad de atributos


//array de stock
let estanteria = []

const cuadro1 = new Cuadro(1," De dia cafe, de noche vino","35cm x 40cm",3000,"t-1.jpg")
const cuadro2 = new Cuadro(2," Diego Armando Maradona","80cm x 40cm", 2790,"t-2.jpg")
const cuadro3 = new Cuadro(3," Homero en los Arbustos", "24cm x 70cm",3900,"t-3.jpg")
const cuadro4 = new Cuadro(4," Argentina campeona de America", "85cm x 40cm",3000,"t-4.jpg")

const cargarStock = async()=>{
    const response = await fetch("cuadros.json")
    const data = await response.json()
    for( let cuadro of data){
        let cuadroNuevo = new Cuadro(cuadro.id, cuadro.nombre, cuadro.tamaño, cuadro.precio, cuadro.imagen)
        estanteria.push(cuadroNuevo) 
    }

}

cargarStock()


//CONDICIONAL EVALUA PRIMERA VEZ QUE ENTRA AL PROYECTO
//inicializar estanteria con operador OR 
if(localStorage.getItem("estanteria")){
    estanteria = JSON.parse(localStorage.getItem("estanteria"))
}else{
    //Entra por primera -- setear el array el original
    console.log("Seteando el array por primera vez")
    estanteria.push(cuadro1, cuadro2, cuadro3, cuadro4)
    localStorage.setItem("estanteria", JSON.stringify(estanteria))
}

//capturas DOM
let divProductos = document.getElementById("productos")
let btnGuardarLibro = document.getElementById("guardarLibroBtn")
let buscador = document.getElementById("buscador")
let btnVerCatalogo = document.getElementById("verCatalogo")
let btnOcultarCatalogo = document.getElementById("ocultarCatalogo")
let modalBodyCarrito = document.getElementById("modal-bodyCarrito")
let botonCarrito = document.getElementById("botonCarrito")
let coincidencia = document.getElementById("coincidencia")
let selectOrden = document.getElementById("selectOrden")
let divCompra = document.getElementById("precioTotal")
let botonFinalizarCompra = document.getElementById("botonFinalizarCompra")
const button = document.getElementById("pagar");
const response = document.getElementById("mensaje");


let productosEnCarrito = JSON.parse(localStorage.getItem("carrito")) || []
//FUNCTIONS
function mostrarCatalogo(array){
    divProductos.innerHTML = ""
    for(let cuadro of array){
        let nuevoCuadro = document.createElement("div")
        nuevoCuadro.classList.add("col-12", "col-md-6", "col-lg-4", "my-1")
        
        nuevoCuadro.innerHTML = `<div id="${cuadro.id}" class="card" style="width: 18rem;">
                                    <img class="card-img-top img-fluid" style="height: 20s0px;"src="assets/${cuadro.imagen}" alt="${cuadro.nombre} de ${cuadro.tamaño}">
                                    <div class="card-body">
                                        <h5 class="card-title">${cuadro.nombre}</h5>
                                        <p style="color:black;">Tamaño: <strong>${cuadro.tamaño}</strong></p>
                                        <p style="color:MediumSeaGreen;"><strong>60% de descuento</strong></p>
                                        <p class="${cuadro.precio}" style="color:black;">Precio: <strong>${cuadro.precio}</strong></p>
                                    <button id="agregarBtn${cuadro.id}" class="btn-outline";">Agregar al carrito</button>
                                    </div>
    </div>`
        divProductos.appendChild(nuevoCuadro)
        let btnAgregar = document.getElementById(`agregarBtn${cuadro.id}`)
        
        btnAgregar.addEventListener("click", ()=>{
            agregarAlCarrito(cuadro)
            
        })
    }
}
//function AGREGAR AL CARRITO
function agregarAlCarrito(cuadro){
    //Primer paso
    productosEnCarrito.push(cuadro)
    console.log(productosEnCarrito)
    localStorage.setItem("carrito", JSON.stringify(productosEnCarrito));

    Toastify({
        text: "¡Cuadro agregado al carrito!",
        duration: 1500,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: false,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #fe7865, #fff)",
          color: "black"
        },
        onClick: function(){} // Callback after click
      }).showToast();
}
//function IMPRIMIR en modal
function cargarProductosCarrito(array){
    modalBodyCarrito.innerHTML = ""
    array.forEach((productoCarrito)=>{
        modalBodyCarrito.innerHTML += `
        <div class="card border mb-3" id ="productoCarrito${productoCarrito.id}" style="max-width: 540px;">
            <img class="card-img-top" height="450px" src="assets/${productoCarrito.imagen}" alt="${productoCarrito.nombre}">
            <div class="card-body">
                    <h4 class="card-title">${productoCarrito.nombre}</h4>
                
                    <p class="card-text">$${productoCarrito.precio}</p> 
                    <button class= "btn btn-danger" id="botonEliminar${productoCarrito.id}"><i class="fas fa-trash-alt"></i></button>
            </div>    
        </div>
`
    })
    array.forEach((productoCarrito, indice)=>{
        //capturo elemento del DOM sin guardarlo en variable
        document.getElementById(`botonEliminar${productoCarrito.id}`).addEventListener("click",()=>{
           
           //Eliminar del DOM
           let cardProducto = document.getElementById(`productoCarrito${productoCarrito.id}`)
           cardProducto.remove()
           //Eliminar del array de comprar
           productosEnCarrito.splice(indice, 1) 
           console.log(productosEnCarrito)
           //Eliminar del storage
           localStorage.setItem('carrito', JSON.stringify(productosEnCarrito))
           //vuelvo a calcular el total
           compraTotal(array)
        })
    })
    compraTotal(array)
}

//function calcular total
function compraTotal(array){
    let acumulador = 0
    acumulador = array.reduce((acc, productoCarrito)=>acc + productoCarrito.precio,0)
    console.log(acumulador)
    acumulador == 0 ? divCompra.innerHTML = `<br> <h6> No hay productos en el carrito</h6>`: divCompra.innerHTML = `<br><h6>&nbsp; &nbsp; El total de su carrito es: $<strong>${acumulador}</strong></h6>`
}


//function buscador que se activa con evento change del input para buscar
function buscarInfo(buscado, array){
    let busqueda = array.filter(
        (cuadro) => cuadro.tamaño.toLowerCase().includes(buscado.toLowerCase()) || cuadro.nombre.toLowerCase().includes(buscado.toLowerCase())
        // Coincidencias sin includes (cuadro) => cuadro.tamaño.toLowerCase() == buscado.toLowerCase() || cuadro.nombre.toLowerCase() == buscado.toLowerCase()
    )
    //con ternario:
    busqueda.length == 0 ? 
    (coincidencia.innerHTML = `<h3 class="text-black m-2"><br>
    No hay coincidencias con su búsqueda...</h3>
    <br>
    <br>`, mostrarCatalogo(array)) 
    : (coincidencia.innerHTML = "", mostrarCatalogo(busqueda))
}


//Functions ordenar stock
function ordenarMayorMenor(array){
   let mayorMenor = [].concat(array)
   mayorMenor.sort((a,b) => (b.precio - a.precio))
   console.log(array)
   console.log(mayorMenor)
   mostrarCatalogo(mayorMenor)
}
function ordenarMenorMayor(array){
let menorMayor = [].concat(array)
   menorMayor.sort((a,b) => (a.precio - b.precio))
   console.log(array)
   console.log(menorMayor)
   mostrarCatalogo(menorMayor)
}
function ordenarAlfabeticamente(array){
    let alfabeticamente = array.slice()
    alfabeticamente.sort((a,b) => {
    if(a.nombre < b.nombre)return -1
    if(a.nombre > b.nombre)return 1
    return 0
   })
   console.log(array)
   console.log(alfabeticamente)
   mostrarCatalogo(alfabeticamente)
}





//EVENTOS PROYECTO
buscador.addEventListener("input", ()=>{buscarInfo(buscador.value, estanteria)})
botonCarrito.addEventListener("click", ()=>{
    cargarProductosCarrito(productosEnCarrito)
})
selectOrden.addEventListener("change", ()=>{
    console.log(selectOrden.value)

    if(selectOrden.value == 1){
        ordenarMayorMenor(estanteria)
    }else if (selectOrden.value == 2){
        ordenarMenorMayor(estanteria)
    }else if (selectOrden.value == 3){
        ordenarAlfabeticamente(estanteria)
    }else{
        mostrarCatalogo(estanteria)
    }
}) 
botonFinalizarCompra.addEventListener("click",()=>{
    finalizarCompra()
})


setTimeout(()=>{
    loaderTexto.innerHTML = ""
    loader.remove()
    mostrarCatalogo(estanteria)

}, 3000)

botonFinalizarCompra.addEventListener("click",()=>{
    finalizarCompra()
})
function finalizarCompra(){
    Swal.fire({
        title: 'Está seguro de realizar la compra',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí, seguro',
        cancelButtonText: 'No, no quiero',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
    }).then((result)=>{
        if(result.isConfirmed){
            Swal.fire({
            title: 'Compra realizada',
            icon: 'success',
            confirmButtonColor: 'green',
            text: `Te enviamos un mail con los pasos a seguir. ¡Muchas Gracias! `,
            
            })
            //resetear o llevar a cero el array de carrito
            //Tenemos que researtearlo tanto al array como al localStorage
            productosEnCarrito =[]
            localStorage.removeItem("carrito")
        }else{
            //Va a entrar cuando ponga
            Swal.fire({
                title: 'Compra cancelada',
                icon: 'info',
                text: `La compra no ha sido realizada. Sus productos siguen en el carrito.`,
                confirmButtonColor: 'green',
                timer:3500
            })
        }
    })
}



//API DE PROVINCIAS ARGENTINAS

const selectProvincias = document.getElementById("selectProvincias");

function provincia(){
fetch("https://apis.datos.gob.ar/georef/api/provincias")
.then(res => res.json())
.then(json =>{
  let opciones = `<option value= "Selecciona tu provincia">Selecciona tu provincia</option>`;

  json.provincias.forEach(el => opciones += `<option value= "${el.nombre}">${el.nombre}</option>`)

  selectProvincias.innerHTML = opciones
})
}

document.addEventListener("DOMContentLoaded", provincia)