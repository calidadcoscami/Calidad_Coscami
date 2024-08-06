import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
document.addEventListener('DOMContentLoaded', () => {
   

    // Inicializa Firestore
    const db = getFirestore();

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

            // Actualiza el DOM con los datos
            document.getElementById('totalPatients').textContent = totalPatients;
            document.getElementById('totalMale').textContent = totalMale;
            document.getElementById('totalFemale').textContent = totalFemale;

            // Cargar los datos de la semana
            await loadWeeklyPatientData();

        } catch (error) {
            console.error('Error al obtener los datos de los pacientes:', error);
        }
    }

    async function loadWeeklyPatientData() {
        try {
            // Obtener la fecha actual y la fecha de hace 7 días
            const today = new Date(); 
            const lastWeek = new Date(); 
            lastWeek.setDate(today.getDate() - 7); 

            // Convertir fechas a formato YYYY-MM-DD
            const todayStr = today.toISOString().split('T')[0]; 
            const lastWeekStr = lastWeek.toISOString().split('T')[0]; 

            // Consulta para obtener pacientes registrados en la última semana
            const patientCollection = collection(db, 'expediente'); 
            const q = query(patientCollection, where('fechaRegistro', '>=', lastWeekStr), where('fechaRegistro', '<=', todayStr)); 
            const patientSnapshot = await getDocs(q); 
            const patients = patientSnapshot.docs.map(doc => doc.data()); 

            // Contar pacientes nuevos por día
            const dailyCounts = {}; 
            patients.forEach(patient => {
                const date = patient.fechaRegistro; 
                dailyCounts[date] = (dailyCounts[date] || 0) + 1; 
            });

            // Ordenar fechas
            const sortedDates = Object.keys(dailyCounts).sort(); 
            const counts = sortedDates.map(date => dailyCounts[date]); 

            // Actualiza el DOM con los datos
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
                            padding: 20 // Ajusta el padding para separar las etiquetas del gráfico
                        },
                        gridLines: {
                            drawTicks: false,
                            display: false,
                            drawBorder: false
                        }
                    }],
                    
                }
            }
        });
    }

    loadPatientData();
});
