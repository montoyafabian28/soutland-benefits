// Se almacenan los datos del paciente
const memberID = "{member_id}";
const groupID = "{group_id}";

// Extraemos elementos del sitio
const selectSearchMethod = document.getElementById('mycbfilterBy');
const groupInputsMethod1 = document.getElementById('bygroupprovider');
const memberIDInput = document.getElementById('as_memberIdentifier');
const groupIDInput = document.getElementById('groupNum');
const retrieveButton = document.getElementById('asRetrieve');
const tableResults = document.querySelector('#asTableGroup4provider > tbody');


// Verificamos que el sitio disponga de todos los elementos necesarios
const siteObjects = new Array();
siteObjects.push(selectSearchMethod,groupInputsMethod1,memberIDInput,
    groupIDInput,retrieveButton,tableResults);
if (siteObjects.some(element => element === null)){
    return 'FAILED TO LOAD RESOURCE AT SITE';
}

// Seleccionamos el primero metodo de busqueda por member id y group id
selectSearchMethod.value = 'bygroupprovider';
selectSearchMethod.dispatchEvent(new Event('change'));

// Aseguramos que los inputs esten disponibles
try {
    await waitForElement(groupInputsMethod1);
} catch (error) {
    console.error(error);
    return 'FAILED TO LOAD RESOURCE AT SITE';
}

// Colocamos el member id y group id en los inputs
memberIDInput.value = memberID;
groupIDInput.value = groupID;

retrieveButton.click();

// Se comprueba que la tabla ha sido renderizada
try {
    await waitForTable(tableResults,retrieveButton);
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