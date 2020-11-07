//Variables
//registrar eventos
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

//interfas de usuario
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');
let editando;

class Citas {
    constructor() {
        this.citas = []
    }

    agregarCita(cita){
        this.citas = [...this.citas,cita]
        }

    eliminarCita(id){
        this.citas = this.citas.filter(cita=> cita.id !== id)
    }

    editarCita (citaActualizada){
        this.citas = this.citas.map(cita=> cita.id === citaActualizada.id ? citaActualizada : cita )
    }

}

class UI {

    imprimirAlerta(mensaje,tipo){

        //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','d-block','alert','col-12');

        //agregar clase dependiendo el tipo de error

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger')
        }else{
            divMensaje.classList.add('alert-success')
        }

        //mensaje de error
        divMensaje.textContent = mensaje;

        //agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje,document.querySelector('.agregar-cita'))

        //eliminar de DOM despues de 5 segundos

        setTimeout(()=>{
            divMensaje.remove()
        },5000)

    }

    imprimirCitas({citas}){

        this.limpiarHTML()
       
        citas.forEach( cita =>{
            const { mascota, propietario ,telefono , fecha , hora , sintomas,id} = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita','p-3')
            divCita.dataset.id =id

            //scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title','font-weight-bolder');
            mascotaParrafo.textContent = mascota ;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
            <span class="font-weight-bolder">Propietario:</span>${propietario}
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
            <span class="font-weight-bolder">Telefono:</span>${telefono}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
            <span class="font-weight-bolder">Fecha:</span>${fecha}
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
            <span class="font-weight-bolder">Hora:</span>${hora}
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
            <span class="font-weight-bolder">sintomas:</span>${sintomas}
            `;

            //agregar boton para eliminar cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn','btn-danger','mr-2');
            btnEliminar.innerHTML ='Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' 

            btnEliminar.onclick = ()=> eliminarCita(id)

            //Agregar boton de editar

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn','btn-info');
            btnEditar.innerHTML = 'Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>'

            btnEditar.onclick = ()=> cargarEdicion(cita)

            //Agregar los parrafos a la cita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);


            //Agregar la citas al HTML
            contenedorCitas.appendChild(divCita);



        })

    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas(); 

//Event Listener
eventListener()
function eventListener(){

mascotaInput.addEventListener('input',datosCitas);
propietarioInput.addEventListener('input',datosCitas);
telefonoInput.addEventListener('input',datosCitas);
fechaInput.addEventListener('input',datosCitas);
horaInput.addEventListener('input',datosCitas);
sintomasInput.addEventListener('input',datosCitas);

formulario.addEventListener('submit',validarCita)

}

//objeto para alojar la informacion de los input
const citasObj = {
    mascota: '',
    propietario:'',
    telefono:'',
    fecha:'',
    hora:'',
    sintomas:''

}

// agrega datos al objeto de cita
function datosCitas (e){
  citasObj[e.target.name] = e.target.value


}

//valida un nueva cita y agregar a la base de citas

function validarCita (e){
    e.preventDefault()

    //extraer la informacion

    const { mascota, propietario ,telefono , fecha , hora , sintomas} = citasObj

    //valida
    if(mascota ===''||propietario === ''|| telefono===''||fecha===''||hora===''||sintomas ===''){
        ui.imprimirAlerta('Todos los campos son obligatorios','error')

        
       return; 
    }

    if(editando){
        ui.imprimirAlerta('Se edito correctamente')
        // pasar el objeto de cita a edicion
        administrarCitas.editarCita({...citasObj})

        formulario.querySelector('button[type="submit"]').textContent = 'Crear Citas';

        editando = false;
    }else{
        
    //generar un id unico
    citasObj.id = Date.now()

    //crea un nueva cita
    administrarCitas.agregarCita({...citasObj})

    //genera un mensaje de exito
    ui.imprimirAlerta('Se agrego correctamente')
    }

    //reiniciar Objeto
    reiniciarObjeto()
    //reiniciar formulario
    formulario.reset()
    //Imprimir HTML

    ui.imprimirCitas(administrarCitas)

}


function reiniciarObjeto(){
    citasObj.mascota = ''
    citasObj.propietario = ''
    citasObj.telefono = ''
    citasObj.hora= ''
    citasObj.fecha = ''
    citasObj.sintomas = ''
}

function eliminarCita (id){
    console.log(id)
    //eliminar la citas
    administrarCitas.eliminarCita(id)

    //muestre un mensaje
    ui.imprimirAlerta('La cita se elimino correctamente')

    //refescar citas
    ui.imprimirCitas(administrarCitas);
}


//funcion para editar compos de la cita

function cargarEdicion (cita){

    const { mascota, propietario ,telefono , fecha , hora , sintomas,id} = cita;

    //llenar el formuario
    mascotaInput.value= mascota;
    propietarioInput.value= propietario;
    telefonoInput.value= telefono;
    fechaInput.value= fecha;
    horaInput.value= hora;
    sintomasInput.value= sintomas;


    //Llenar el objeto
    citasObj.mascota = mascota;  
    citasObj.propietario = propietario;  
    citasObj.telefono = telefono;  
    citasObj.fecha = fecha;  
    citasObj.hora = hora;  
    citasObj.sintomas = sintomas;
    citasObj.id = id ;  

    //cambiar el texto deñ input submit
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true
}