import { auth } from './firebaseconect.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('admin-login-form');
    const medicoLoginForm = document.getElementById('medico-login-form');

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;

            try {
                // Autenticación con Firebase Authentication
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const emailDomain = email.split('@')[1]; // Extrae el dominio del correo electrónico

                if (emailDomain === 'coscami.com') { // Dominio para administradores
                    window.location.href = '/admin-dashboard.html';
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Dominio de correo electrónico no reconocido.',
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el login',
                    text: error.message,
                });
            }
        });
    }

    if (medicoLoginForm) {
        medicoLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('medico-email').value;
            const password = document.getElementById('medico-password').value;

            try {
                // Autenticación con Firebase Authentication
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const emailDomain = email.split('@')[1]; // Extrae el dominio del correo electrónico

                if (emailDomain === 'gmail.com') { // Dominio para personal médico
                    window.location.href = '/medico-dashboard.html';
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Dominio de correo electrónico no reconocido.',
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el login',
                    text: error.message,
                });
            }
        });
    }
});
