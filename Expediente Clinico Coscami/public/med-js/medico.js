import { getFirestore, collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCqoq1zbuq98xeIHhXsiH8fFrX5284fit4",
    authDomain: "coscami-e5d4e.firebaseapp.com",
    projectId: "coscami-e5d4e",
    storageBucket: "coscami-e5d4e.appspot.com",
    messagingSenderId: "977345084580",
    appId: "1:977345084580:web:afe64cab0aa16462297a31"
};

initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const emailDomain = user.email.split('@')[1];
        if (emailDomain === 'coscami.com' || emailDomain === 'gmail.com') {
            await loadPatientData();
        } else {
            console.error('Dominio de correo electrónico no reconocido.');
        }
    } else {
        console.error('No hay usuario autenticado');
    }
});

async function loadPatientData() {
    try {
        const patientCollection = collection(db, 'expediente');
        const patientSnapshot = await getDocs(patientCollection);
        const patients = patientSnapshot.docs.map(doc => doc.data());

        let totalPatients = patients.length;
        let totalMale = 0;
        let totalFemale = 0;

        patients.forEach(patient => {
            if (patient.genero === 'masculino') {
                totalMale++;
            } else if (patient.genero === 'femenino') {
                totalFemale++;
            }
        });

        document.getElementById('totalPatients').textContent = totalPatients;
        document.getElementById('totalMale').textContent = totalMale;
        document.getElementById('totalFemale').textContent = totalFemale;

        await loadWeeklyPatientData();
    } catch (error) {
        console.error('Error al obtener los datos de los pacientes:', error);
    }
}

async function loadWeeklyPatientData() {
    try {
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        const todayStr = today.toISOString().split('T')[0];
        const lastWeekStr = lastWeek.toISOString().split('T')[0];

        const patientCollection = collection(db, 'expediente');
        const q = query(patientCollection, where('fechaRegistro', '>=', lastWeekStr), where('fechaRegistro', '<=', todayStr));
        const patientSnapshot = await getDocs(q);
        const patients = patientSnapshot.docs.map(doc => doc.data());

        const dailyCounts = {};
        patients.forEach(patient => {
            const date = patient.fechaRegistro;
            dailyCounts[date] = (dailyCounts[date] || 0) + 1;
        });

        const sortedDates = Object.keys(dailyCounts).sort();
        const counts = sortedDates.map(date => dailyCounts[date]);

        loadWeeklyPatientChart(sortedDates, counts);
    } catch (error) {
        console.error('Error al obtener los datos de pacientes nuevos:', error);
    }
}

function loadWeeklyPatientChart(dates, counts) {
    const ctx = document.getElementById('weeklyChart').getContext('2d');

    if (!ctx) {
        console.error('No se encontró el contexto del canvas');
        return;
    }

    const gradientStroke = ctx.createLinearGradient(0, 0, 0, 400);
    gradientStroke.addColorStop(0, 'rgba(0, 122, 255, 1)');
    gradientStroke.addColorStop(1, 'rgba(0, 204, 255, 1)');

    const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, 'rgba(0, 204, 255, 0.5)');
    gradientFill.addColorStop(1, 'rgba(0, 122, 255, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Pacientes Nuevos Esta Semana',
                borderColor: gradientStroke,
                backgroundColor: gradientFill,
                pointBorderColor: gradientStroke,
                pointBackgroundColor: gradientStroke,
                pointHoverBackgroundColor: gradientStroke,
                pointHoverBorderColor: gradientStroke,
                pointBorderWidth: 5,
                pointHoverRadius: 5,
                pointHoverBorderWidth: 1,
                pointRadius: 3,
                fill: true,
                borderWidth: 5,
                data: counts
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem) {
                        const date = dates[tooltipItem.index];
                        const count = counts[tooltipItem.index];
                        return `Fecha: ${date} - Pacientes Nuevos: ${count}`;
                    }
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: '#556F7B',
                        fontStyle: 'bold',
                        beginAtZero: true,
                        maxTicksLimit: 5,
                        padding: 20
                    },
                    gridLines: {
                        drawTicks: false,
                        display: false,
                        drawBorder: false
                    }
                }]
            }
        }
    });
}
