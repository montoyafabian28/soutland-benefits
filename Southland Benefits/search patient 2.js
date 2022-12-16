// Se almacenan los datos del paciente
const patientName = "{patient_name}";
const patientLastName = "{patient_last_name}";
const patientDOB = "{patient_dob}";

// Extraemos elementos del sitio
const selectSearchMethod = document.getElementById('mycbfilterBy');
const groupInputsMethod2 = document.getElementById('name');
const inputLastName = document.getElementById('as_lastName');
const inputName = document.getElementById('as_firstName');
const inputDOB = document.getElementById('patientdateofbirth');
const retrieveButton = document.getElementById('asRetrieve');
const tableResults = document.querySelector('#asTableGroup4provider > tbody');

// Verificamos que el sitio disponga de todos los elementos necesarios
const siteObjects = [].push(selectSearchMethod,groupInputsMethod2,
    inputLastName,inputName,inputDOB,retrieveButton,tableResults);
if (siteObjects.some(element => element === null)) {
    return 'FAILED TO LOAD RESOURCE AT SITE';
}

// Seleccionamos el primero metodo de busqueda por nombre, apellido y dob
selectSearchMethod.value = 'bynameprovider';
selectSearchMethod.dispatchEvent(new Event('change'));

// Aseguramos que los inputs esten disponibles
try {
    await waitForElement(groupInputsMethod2);
} catch (error) {
    console.error(error);
    return 'FAILED TO LOAD RESOURCE AT SITE';
}

// Ingresamos los datos en el sitio
inputLastName.value = patientLastName;
inputName.value = patientName;
inputDOB.value = patientDOB;


//Esperamos cambios en la tabla despues de dar click
try {
    await waitForTable(tableResults, retrieveButton);
    if (tableResults.innerText.toLowerCase().includes('no data available in table')) {
        console.log('No hay pacientes con esos datos');
        return 'NOT FOUND';
    }else{
        console.log('Paciente encontrado');
        return 'SUCCESS'
    }
}catch (error) {
    console.error(error);
    return 'FAILED TO LOAD RESOURCE AT SITE';
}

// Funcion que obliga al script a esperar que los inputs esten visibles antes de proceder
function waitForElement(element) {
    let maxTimeMS = 10000; // Tiempo maximo 10s

    // Retorna una promesa que espera que la propiedad display del elemento sea distinto None
    return new Promise((resolve, reject) => {
        // Se utilizan intervalos de tiempo de 500 ms
        // Cada 500 ms se comprobara si la propiedad display es distinto de None

        const intervalForDisplay = setInterval(() => {
            const computedStyle = window.getComputedStyle(element);
            const display = computedStyle.display;

            if (display !== 'none') { // Salida del intervalo en cado de exito
                console.log('Elemento visible');
                clearInterval(intervalForDisplay);
                resolve();
            } else {
                console.log('Elemento no visible');
            }
            if (maxTimeMS <= 0) { // Salida del intervalo en caso de tiempo agotado
                console.log('Tiempo agotado');
                clearInterval(intervalForDisplay);
                reject();
            }
            maxTimeMS -= 500;
        }, 500);
    })
}

// Funcion que espera por el renderizado de una tabla
function waitForTable(tableElement, elementToClick) {
    let maxTimeMS = 10000; // Tiempo maximo 10s

    // Retorna una promesa que espera que la tabla tenga un cambio de renderizado
    return new Promise((resolve, reject) => {
        let status = false;
        // Añadimos un eventlistener que escuche por el evento DOMNodeInserted y cambie el status cuando se ejecute
        const handleRender = (event) => {
            console.log('El elemento ha sido renderizado de nuevo');
            status = true;
        };
        tableElement.addEventListener('DOMNodeInserted', handleRender);
        elementToClick.click();
        // Se utilizan intervalos de tiempo de 500 ms
        // Cada 500 ms se comprobara si la tabla sufrio un nuevo renderizado
        const intervalForDisplay = setInterval(() => {

            if (status === true) { // Salida del intervalo en cado de exito
                console.log('Tabla renderizada');
                clearInterval(intervalForDisplay);
                tableElement.removeEventListener('DOMNodeInserted', handleRender);
                resolve();
            } else {
                console.log('Tabla aun no renderizada');
            }
            if (maxTimeMS <= 0) { // Salida del intervalo en caso de tiempo agotado
                console.log('Tiempo agotado');
                clearInterval(intervalForDisplay);
                tableElement.removeEventListener('DOMNodeInserted', handleRender);
                reject('No se renderizo el elemento');
            }
            maxTimeMS -= 500;
        }, 500);
    })
}