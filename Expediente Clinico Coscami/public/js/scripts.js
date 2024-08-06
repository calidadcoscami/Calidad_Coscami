const header = document.querySelector("header");
const footer = document.querySelector("footer");

header.innerHTML = `
<style>
    body {
    font-family: 'Roboto', sans-serif;
    background-color: #f0f4f8; /* Color de fondo más claro */
    margin: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

    header {
      background-color: #F1F2F2;
      color: black;
      padding: 10px 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .logo img {
      width: 150px;
      height: auto;
    }

    #nav {
      display: flex;
      gap: 20px;
    }

    #nav a {
      color: black;
      text-decoration: none;
      font-size: 20px;
      position: relative;
      padding: 5px 0;
      transition: color 0.3s ease;
      display: flex;
      align-items: center;
    }

    #nav a::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      left: 50%;
      bottom: 0;
      background-color: #33CEFF;
      transition: width 0.3s ease, left 0.3s ease;
    }

    #nav a:hover::after {
      width: 100%;
      left: 0;
    }

    #logoutButton {
      background-color: #FF6B6B;
      border: none;
      cursor: pointer;
      outline: none;
      font-size: 16px;
      padding: 5px 10px;
      border-radius: 5px;
      color: white;
      transition: background-color 0.3s ease;
    }

    #logoutButton:hover {
      background-color: #FF4C4C;
    }

    .nav-icon {
      margin-right: 5px;
    }
</style>

<div class="navbar-container">
  <div class="logo">
    <a href="#">
      <img src="/img/logo.png" alt="Centro Medico Coscami">
    </a>
  </div>
  <div id="nav">
    <a href="admin-dashboard.html"><i class="nav-icon fas fa-home"></i> Home</a>
    <a href="verpacientes.html"><i class="nav-icon fas fa-list-alt"></i> Ver pacientes</a> <!-- Corregido -->
    <a href="agregarpaciente.html"><i class="nav-icon fas fa-user-plus"></i> Agregar Pacientes</a>
    <button type="button" id="logoutButton"><i class="nav-icon fas fa-sign-out-alt"></i> Cerrar Sesión</button>
  </div>
</div>

`;

footer.innerHTML = `
<footer class="footer mt-auto py-3 bg-light">
    <div class="container">
      <span class="text-muted">Centro Medico Coscami © 2024</span>
    </div>
</footer>
`;
