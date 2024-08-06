import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, getDocs, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCqoq1zbuq98xeIHhXsiH8fFrX5284fit4",
  authDomain: "coscami-e5d4e.firebaseapp.com",
  projectId: "coscami-e5d4e",
  storageBucket: "coscami-e5d4e.appspot.com",
  messagingSenderId: "977345084580",
  appId: "1:977345084580:web:afe64cab0aa16462297a31"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para obtener la lista de pacientes
const getPacientes = async () => {
  try {
    const pacientesCollection = collection(db, 'expediente');
    const pacientesSnapshot = await getDocs(pacientesCollection);
    const pacientesData = pacientesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return pacientesData;
  } catch (error) {
    console.error('Error obteniendo los pacientes:', error);
  }
};

const mostrarPacientes = (pacientes) => {
  const pacientesListElement = document.getElementById('pacientes-list');
  pacientesListElement.innerHTML = ''; // Limpiar la lista antes de agregar pacientes nuevos

  const rowWrapper = document.createElement('div');
  rowWrapper.classList.add('row', 'row-cols-1', 'row-cols-md-2', 'g-4');

  pacientes.forEach(paciente => {
    const column = document.createElement('div');
    column.classList.add('col', 'mb-4');

    const notification = document.createElement('div');
    notification.classList.add('notification');

    const notiTitle = document.createElement('div');
    notiTitle.classList.add('notititle');
    notiTitle.innerHTML = `${paciente.nombre} ${paciente.apellidos}`;

    const notiBody = document.createElement('div');
    notiBody.classList.add('notibody');
    notiBody.innerHTML = `
      <p><strong>Edad:</strong> ${paciente.edad}</p>
      <p><strong>Fecha de nacimiento:</strong> ${paciente.fechaNacimiento}</p>
      <p><strong>Género:</strong> ${paciente.genero}</p>
      <p><strong>Dirección:</strong> ${paciente.direccion}</p>
      <p><strong>Teléfono:</strong> ${paciente.telefono}</p>
      <p><strong>Grupo Étnico:</strong> ${paciente.grupoetnico}</p>
      <p><strong>ID:</strong> <span class="badge bg-secondary rounded-pill">${paciente.id}</span></p>
      <p><strong>Fecha de Registro:</strong> ${paciente.fechaRegistro}</p>
  
      <button class="btn btn-link btn-sm ver-detalles-btn" type="button" data-paciente-id="${paciente.id}">Ver detalles</button>
    `;

    notification.appendChild(notiTitle);
    notification.appendChild(notiBody);
    column.appendChild(notification);
    rowWrapper.appendChild(column);
  });

  pacientesListElement.appendChild(rowWrapper);

  // Agregar event listener a los botones de ver detalles
  document.querySelectorAll('.ver-detalles-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const pacienteId = event.target.getAttribute('data-paciente-id');
      const paciente = pacientes.find(p => p.id === pacienteId);
      mostrarDetallesPaciente(paciente);
    });
  });
};

const mostrarDetallesPaciente = (paciente) => {
  const modalBodyContent = document.getElementById('modal-body-content');
  
  // Función para reemplazar saltos de línea con <br>
  const formatText = (text) => text ? text.replace(/\n/g, '<br>') : '';

  modalBodyContent.innerHTML = `
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6">
          <p class="font-weight-bold text-dark">
            <span class="bg-light text-dark px-3 py-2 rounded-pill fw-semibold text-custom">
              ${paciente.nombre} ${paciente.apellidos}
            </span>
          </p>
          <div class="section-title">Historia Clínica</div>
          <div class="section-content">
            <div class="mb-3">
              <h6><strong>Antecedentes Heredo Familiares</strong></h6>
              <p>${formatText(paciente.antecedentesheredofamiliares)}</p>
            </div>
            <div class="mb-3">
              <h6><strong>Antecedentes Personales:</strong></h6>
              <p>${formatText(paciente.antecedentespersonales)}</p>
            </div>
            <div class="mb-3">
              <h6><strong>Padecimiento Actual:</strong></h6>
              <p>${formatText(paciente.padecimientoactual)}</p>
            </div>
            <div class="mb-3">
              <h6><strong>Interrogatorio por Aparatos y Sistemas:</strong></h6>
              <p>${formatText(paciente.interrogatorioaparatos)}</p>
            </div>
          </div>
          <div class="section-title">Exploración Física</div>
          <div class="section-content">
            <div class="row">
              <div class="col-md-6">
                <p><strong>Habitus Exterior:</strong> ${formatText(paciente.habitus)}</p>
                <p><strong>Peso:</strong> ${formatText(paciente.peso)}</p>
                <p><strong>Talla:</strong> ${formatText(paciente.talla)}</p>
              </div>
              <div class="col-md-6">
                <p><strong>FC:</strong> ${formatText(paciente.FC)}</p>
                <p><strong>TA:</strong> ${formatText(paciente.TA)}</p>
                <p><strong>FR:</strong> ${formatText(paciente.FR)}</p>
                <p><strong>T:</strong> ${formatText(paciente.T)}</p>
              </div>
            </div>
            <div class="section-content">
              <ul>
                <li><strong>Datos de Cabeza:</strong>${formatText(paciente.datoscabeza)}</li>
                <li><strong>Datos de Cuello:</strong>${formatText(paciente.datoscuello)}</li>
                <li><strong>Datos de Tórax:</strong>${formatText(paciente.datostorax)}</li>
                <li><strong>Datos de Abdomen:</strong>${formatText(paciente.datosabdomen)}</li>
                <li><strong>Datos de Miembros:</strong>${formatText(paciente.datosmiembros)}</li>
                <li><strong>Datos de Genitales:</strong>${formatText(paciente.datosgenitales)}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="section-title">Estudios y Diagnóstico</div>
          <div class="section-content">
            <div class="mb-3">
              <p><strong>Resultados de Estudios de Laboratorio y Gabinete:</strong> ${formatText(paciente.resultadosestudios)}</p>
              <p><strong>Diagnósticos o Problemas Clínicos:</strong> ${formatText(paciente.diagnosticos)}</p>
              <p><strong>Pronóstico:</strong> ${formatText(paciente.pronostico)}</p>
              <p><strong>Indicación Terapéutica:</strong> ${formatText(paciente.indicacionterapeutica)}</p>
            </div>
          </div>
          <div class="section-title">Nota de Interconsulta</div>
          <div class="section-content">
            <div class="mb-3">
              <p><strong>Evolución y Actualización del Cuadro Clínico:</strong> ${formatText(paciente.evolucion)}</p>
              <p><strong>Resultados Relevantes de Estudios:</strong> ${formatText(paciente.resultadosrelevantes)}</p>
              <p><strong>Tratamiento e Indicaciones Médicas:</strong> ${formatText(paciente.tratamientoindicaciones)}</p>
              <p><strong>Criterios Diagnósticos:</strong> ${formatText(paciente.criteriosdiagnosticos)}</p>
              <p><strong>Plan de Estudios:</strong> ${formatText(paciente.planestudios)}</p>
              <p><strong>Sugerencias Diagnósticas y Tratamiento:</strong> ${formatText(paciente.sugerenciasdiagnosticas)}</p>
            </div>
          </div>
          <div class="section-title">Nota Médica en Urgencias</div>
          <div class="section-content">
            <div class="mb-3">
              <p><strong>Motivo de la Atención:</strong> ${formatText(paciente.motivoatencion)}</p>
              <p><strong>Resumen del Interrogatorio:</strong> ${formatText(paciente.resumeninterrogatorio)}</p>
              <p><strong>Resultados Relevantes de Estudios:</strong> ${formatText(paciente.resultadosrelevantesurgencias)}</p>
              <p><strong>Diagnósticos o Problemas Clínicos:</strong> ${formatText(paciente.diagnosticosurgencias)}</p>
              <p><strong>Tratamiento y Pronóstico:</strong> ${formatText(paciente.tratamientopronostico)}</p>
            </div>
          </div>
          <div class="section-title">Archivos PDF</div>
          <div class="section-content">
            ${paciente.pdfUrls ? paciente.pdfUrls.map(url => {
                const fileName = decodeURIComponent(url.split('/').pop().split('#')[0].split('?')[0].replace('pdfs%2F', ''));
                return `<p><a href="${url}" target="_blank">${fileName}</a></p>`;
            }).join('') : '<p>No hay archivos PDF asociados</p>'}
          </div>
        </div>
      </div>
    </div>
  `;
  $('#detallesModal').modal('show');
};


// Configurar el modal para que sea más amplio
$('#detallesModal').on('show.bs.modal', function () {
  $(this).find('.modal-dialog').addClass('modal-wide');
});

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const pacientes = await getPacientes();
    console.log('Pacientes obtenidos:', pacientes); // Verifica los datos obtenidos
    mostrarPacientes(pacientes);

    const searchInput = document.getElementById('searchInput');

    const filtrarPacientes = () => {
      const term = searchInput.value.toLowerCase().trim(); // Normaliza el término de búsqueda
      if (term === '') {
        mostrarPacientes(pacientes); // Si el término de búsqueda está vacío, muestra todos los pacientes
        return;
      }
    
      const filteredPacientes = pacientes.filter(paciente => {
        // Normaliza y valida las propiedades del paciente
        const nombre = paciente.nombre ? paciente.nombre.toLowerCase() : '';
        const apellidos = paciente.apellidos ? paciente.apellidos.toLowerCase() : '';
        const genero = paciente.genero ? paciente.genero.toLowerCase() : '';
        const edad = paciente.edad ? paciente.edad.toString().toLowerCase() : ''; // Convertir edad a string
        const id = paciente.id ? paciente.id.toLowerCase() : '';
    
        const nombreCompleto = `${nombre} ${apellidos}`.trim();
    
        // Verifica que el término de búsqueda esté presente en algún campo
        return nombre.includes(term) || apellidos.includes(term) || nombreCompleto.includes(term) || genero.includes(term) || edad.includes(term) || id.includes(term);
      });
    
      mostrarPacientes(filteredPacientes);
    };
    

    searchInput.addEventListener('keyup', event => {
      if (event.key === 'Enter') {
        filtrarPacientes();
      }
    });

  } catch (error) {
    console.error('Error obteniendo los pacientes:', error);
  }
});
