import { getPacienteById, updatePaciente } from '/js/firebaseconect.js';
import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';

const storage = getStorage();

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pacienteId = urlParams.get('id');
    let oldPdfUrls = []; // Variable para almacenar las URLs de los PDFs anteriores

    if (pacienteId) {
        const paciente = await getPacienteById(pacienteId);
        if (paciente) {
            Object.keys(paciente).forEach(key => {
                const input = document.getElementById(key);
                if (input) {
                    input.value = paciente[key];
                }
            });

            // Mostrar información de los PDFs actuales si existen
            const currentPdfElement = document.getElementById('currentPdf');
            if (paciente.pdfUrls && paciente.pdfUrls.length > 0) {
                currentPdfElement.innerHTML = paciente.pdfUrls.map((url, index) => 
                    `<div>Archivo actual: <a href="${url}" target="_blank">${decodeURIComponent(url.split('/').pop().split('#')[0].split('?')[0].replace('pdfs%2F', ''))}</a> 
                    <button type="button" class="btn btn-danger btn-sm ml-2" data-index="${index}">Eliminar</button></div>`
                ).join('');
                oldPdfUrls = paciente.pdfUrls; // Guardar las URLs de los PDFs actuales
            }

            // Función para eliminar un PDF individual
            const removeIndividualPdf = async (index) => {
                if (confirm('¿Está seguro de que desea eliminar este archivo PDF?')) {
                    const pdfUrl = oldPdfUrls[index];
                    const pdfRef = ref(storage, pdfUrl);
                    await deleteObject(pdfRef);
                    oldPdfUrls.splice(index, 1); // Eliminar la URL del array
                    // Actualizar la visualización
                    currentPdfElement.innerHTML = oldPdfUrls.map((url, i) =>
                        `<div>Archivo actual: <a href="${url}" target="_blank">${decodeURIComponent(url.split('/').pop().split('#')[0].split('?')[0].replace('pdfs%2F', ''))}</a> 
                        <button type="button" class="btn btn-danger btn-sm ml-2" data-index="${i}">Eliminar</button></div>`
                    ).join('');
                }
            };

            // Event listener para los botones de eliminación individual
            currentPdfElement.addEventListener('click', (event) => {
                if (event.target.tagName === 'BUTTON' && event.target.getAttribute('data-index') !== null) {
                    const index = parseInt(event.target.getAttribute('data-index'), 10);
                    removeIndividualPdf(index);
                }
            });

            const removePdfButton = document.getElementById('removePdfButton');
            removePdfButton.addEventListener('click', async () => {
                if (confirm('¿Está seguro de que desea eliminar todos los archivos PDF?')) {
                    for (const oldPdfUrl of oldPdfUrls) {
                        const oldPdfRef = ref(storage, oldPdfUrl);
                        await deleteObject(oldPdfRef);
                    }
                    currentPdfElement.innerHTML = 'Archivos eliminados';
                    oldPdfUrls = []; // Marcar para eliminar
                }
            });
        }

        const editarPacienteForm = document.getElementById('editarPacienteForm');
        editarPacienteForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const updatedData = {};

            ['nombre', 'apellidos', 'edad', 'fechaNacimiento', 'genero', 'direccion', 'telefono', 'grupoetnico', 
             'antecedentesheredofamiliares', 'antecedentespersonales', 'padecimientoactual', 'interrogatorioaparatos', 
             'habitus','peso', 'talla', 'datoscabeza', 'datoscuello', 'datostorax', 'datosabdomen', 
             'datosmiembros', 'datosgenitales', 'resultadosestudios', 'diagnosticos', 'pronostico', 'indicacionterapeutica', 

             'evolucion', 'resultadosrelevantes', 'tratamientoindicaciones', 'criteriosdiagnosticos', 'planestudios', 'sugerenciasdiagnosticas', 
             'motivoatencion', 'resumeninterrogatorio', 'resultadosrelevantesurgencias', 'diagnosticosurgencias', 
             'tratamientopronostico','FC','TA','FR','T']
            .forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    updatedData[id] = input.value;
                }
            });

            // Manejar subida de nuevos archivos PDF
            const pdfFiles = document.getElementById('pdfFile').files;
            const newPdfUrls = [];

            if (pdfFiles.length > 0) {
                try {
                    for (let i = 0; i < pdfFiles.length; i++) {
                        const pdfFile = pdfFiles[i];
                        const pdfRef = ref(storage, 'pdfs/' + pdfFile.name);
                        const snapshot = await uploadBytes(pdfRef, pdfFile);
                        const pdfUrl = await getDownloadURL(snapshot.ref);
                        newPdfUrls.push(pdfUrl);
                    }

                    // Eliminar los PDFs anteriores si existen y hay nuevos PDFs
                    if (oldPdfUrls.length > 0 && newPdfUrls.length > 0) {
                        for (const oldPdfUrl of oldPdfUrls) {
                            const oldPdfRef = ref(storage, oldPdfUrl);
                            await deleteObject(oldPdfRef);
                        }
                    }

                    updatedData.pdfUrls = newPdfUrls;
                } catch (error) {
                    console.error('Error subiendo los nuevos archivos PDF: ', error);
                    alert('Hubo un error al subir los nuevos archivos PDF');
                }
            } else {
                // Mantener los PDFs existentes si no se han cambiado
                updatedData.pdfUrls = oldPdfUrls;
            }

            try {
                await updatePaciente(pacienteId, updatedData);
                alert('Paciente actualizado exitosamente');
                window.location.href = '/html/verpacientes.html';
            } catch (error) {
                console.error('Error actualizando los datos del paciente:', error);
                alert('Hubo un error al intentar actualizar los datos del paciente');
            }
        });
    } else {
        console.error('ID de paciente no proporcionado');
        alert('No se ha proporcionado un ID de paciente válido');
    }
});
