import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyCqoq1zbuq98xeIHhXsiH8fFrX5284fit4",
    authDomain: "coscami-e5d4e.firebaseapp.com",
    projectId: "coscami-e5d4e",
    storageBucket: "coscami-e5d4e.appspot.com",
    messagingSenderId: "977345084580",
    appId: "1:977345084580:web:afe64cab0aa16462297a31"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };


// Obtener paciente por ID
export async function getPacienteById(id) {
    const docRef = doc(db, 'expediente', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log('No se encontró el documento');
        return null;
    }
}

// Actualizar paciente
export async function updatePaciente(id, updatedData) {
    const docRef = doc(db, 'expediente', id);
    await updateDoc(docRef, updatedData);
}

export class ManageAccount {
    // Registrar nuevo usuario
    register(email, password) {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert("Registro exitoso. Serás redirigido a la página de inicio de sesión.");
                window.location.href = "login.html";
            })
            .catch((error) => {
                console.error(error.message);
                alert("Error al registrar: " + error.message);
            });
    }

    // Autenticar administrador
    authenticateAdmin(email, password) {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                Swal.fire({
                    title: 'Inicio de sesión exitoso',
                    text: 'Has iniciado sesión correctamente. Serás redirigido a la página principal.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    window.location.href = "/html/admin-dashboard.html";
                });
            })
            .catch((error) => {
                console.error(error.message);
                Swal.fire({
                    title: 'Error al iniciar sesión',
                    text: `Error: ${error.message}`,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            });
    }

    // Autenticar personal médico
    async authenticateMedicalStaff(email, password) {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                Swal.fire({
                    title: 'Inicio de sesión exitoso',
                    text: 'Has iniciado sesión correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    window.location.href = "/html/medico-dashboard.html";
                });
            })
            .catch((error) => {
                console.error(error.message);
                Swal.fire({
                    title: 'Error al iniciar sesión',
                    text: `Error: ${error.message}`,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            });
    }

    // Cerrar sesión
    signOut() {
        Swal.fire({
            title: '¿Estás seguro de que deseas cerrar sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                signOut(auth)
                    .then(() => {
                        window.location.href = "/";
                    })
                    .catch((error) => {
                        console.error(error.message);
                        Swal.fire({
                            title: 'Error al cerrar sesión',
                            text: `Error: ${error.message}`,
                            icon: 'error',
                            confirmButtonText: 'Aceptar'
                        });
                    });
            }
        });
    }
}
