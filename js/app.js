//campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

//UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas =document.querySelector('#citas');


let editanto;
//Clases

class Citas{
    constructor(){
        this.citas = [];
    }

    agregarCita(cita){
        this.citas = [...this.citas, cita];

        //console.log(this.citas);
    }

    eliminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id)
    }

    editarCita(citaActulizada){
        this.citas = this.citas.map( cita=>cita.id === citaActulizada.id ? citaActulizada : cita);
    }
}

class UI{
    imprimirAlerta(mensaje,tipo){
        //Crear el div
        const divMensaje= document.createElement('div');
        divMensaje.classList.add('text-center','alert','d-block','col-12');

        //Agregar clase en base al tipo de error
        if(tipo ==='error') {
            divMensaje.classList.add('alert-danger');

        }else{
            divMensaje.classList.add('alert-success');
        }


        //Mensaje de error
        divMensaje.textContent = mensaje;

        //agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar_cita'));


        //Quitar la alerta despeus de 3 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);

    }

    imprimirCitas({citas}){
        
        this.limpiarHMTL();

        citas.forEach(cita=>{
            const {mascota, propietario, telefono, fecha, hora, sintomas,id} =cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita','p-3');
            divCita.dataset.id = id;

            //Scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-litle', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo= document.createElement('p');
            propietarioParrafo.innerHTML=`
                <span class="font-weight-bolder">Propietario: </span> ${propietario}
            `;

            const telefonoParrafo= document.createElement('p');
            telefonoParrafo.innerHTML=`
                <span class="font-weight-bolder">Teléfono: </span> ${telefono}
            `;

            const fechaParrafo= document.createElement('p');
            fechaParrafo.innerHTML=`
                <span class="font-weight-bolder">Fecha: </span> ${fecha}
            `;

            const horaParrafo= document.createElement('p');
            horaParrafo.innerHTML=`
                <span class="font-weight-bolder">Hora: </span> ${hora}
            `;

            const sintomasParrafo= document.createElement('p');
            sintomasParrafo.innerHTML=`
                <span class="font-weight-bolder">Síntomas: </span> ${sintomas}
            `;

            //Boton para eliminar esta cita

            const btnEliminar= document.createElement('button');
            btnEliminar.classList.add('btn','btn-danger','mr-2');
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`; 
            btnEliminar.onclick = () => eliminarCita(id);

            //Boton para editar una cita
            const btnEditar =document.createElement('button');
            btnEditar.classList.add('btn','btn-info');
            btnEditar.innerHTML= `Editar <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>`
            btnEditar.onclick = () => cargarEdicion(cita);


            // Agregar los parrafos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            //Agregar citas al html
            contenedorCitas.appendChild(divCita);

        });
    }

    limpiarHMTL(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }

}
const ui= new UI();
const administrarCitas = new Citas();





//registrar eventos
eventListeners();
function eventListeners(){
    mascotaInput.addEventListener('input',datosCita);
    propietarioInput.addEventListener('input',datosCita);
    telefonoInput.addEventListener('input',datosCita);
    fechaInput.addEventListener('input',datosCita);
    horaInput.addEventListener('input',datosCita);
    sintomasInput.addEventListener('input',datosCita);

    formulario.addEventListener('submit',nuevaCita);
}


//Objeto con la información de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    hora: '',
    sintomas: ''
}


//Agrega datos al objeto de cita
function datosCita(e){
   citaObj[e.target.name] = e.target.value;


}

//Valida y agrega una nueva cita a la clase de citas

function nuevaCita(e){
    e.preventDefault();

    //extraer la informacion del objeto de cita
    const {mascota, propietario, telefono, fecha, hora, sintomas} =citaObj;


    // validar
    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    if(editanto){
        ui.imprimirAlerta('Editado Correctamente')

        //Pasar el objeto de la cita a edición
        administrarCitas.editarCita({...citaObj})

        //regresar el texto del botón a su estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        //Quitar modo edición
        editanto = false;

    }else{

        //Generar un id único
        citaObj.id =Date.now();

        //Crear una nueva cita
        administrarCitas.agregarCita({...citaObj});

        //Mensaje de agreado correctamente
        ui.imprimirAlerta('Se agregó correctamente')
    }

    //reiniciar el objeto para la validación
    reiniciarObjeto();

    //Reinicia el formulario
    formulario.reset();

    //Mostrar el html de citas
    ui.imprimirCitas(administrarCitas);
}


function reiniciarObjeto(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';

}

function eliminarCita(id){
    //Eliminar la cita
    administrarCitas.eliminarCita(id);

    //Mueste un mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente');

    //Refrescar las citas
    ui.imprimirCitas(administrarCitas);

}
    //carga los datos y el modo edición
function cargarEdicion(cita){
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} =cita;

    //Llenar los inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //Cambiar el texto del botón
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
    editanto = true;
}