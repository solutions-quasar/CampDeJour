
import { getAuth, signOut } from "firebase/auth";
import { renderYouths } from "./dashboard/Youths";
import { renderAnimators } from "./dashboard/Animators";
import { renderGroups } from "./dashboard/Groups";
import { renderPlanning } from "./dashboard/Planning";
import { renderDocuments } from "./dashboard/Documents";
import { getByCollection } from "../services/db";

const auth = getAuth();

export function renderDashboard(container) {
  container.innerHTML = `
    <div class="dashboard-layout">
      <!-- Mobile Header -->
      <div class="mobile-header">
        <div class="logo-admin" style="margin-bottom: 0;">CampAdmin</div>
        <button id="menu-toggle" class="menu-toggle">
          <i class="fas fa-bars"></i>
        </button>
      </div>

      <!-- Overlay for mobile -->
      <div id="sidebar-overlay" class="overlay"></div>

      <aside class="sidebar" id="sidebar">
        <div class="logo-admin">CampAdmin</div>
        <nav class="nav-links">
          <a href="#" class="nav-link active" data-view="overview">
            <i class="fas fa-th-large"></i> Vue d'ensemble
          </a>
          <a href="#" class="nav-link" data-view="youths">
            <i class="fas fa-child"></i> Jeunes
          </a>
          <a href="#" class="nav-link" data-view="animators">
            <i class="fas fa-user-tie"></i> Animateurs
          </a>
          <a href="#" class="nav-link" data-view="groups">
            <i class="fas fa-users"></i> Groupes
          </a>
          <a href="#" class="nav-link" data-view="planning">
            <i class="fas fa-calendar-alt"></i> Planning
          </a>
          <a href="#" class="nav-link" data-view="docs">
            <i class="fas fa-file-alt"></i> Documents
          </a>
        </nav>
        <div class="user-info">
          <div class="user-email">${auth.currentUser ? auth.currentUser.email : 'Admin'}</div>
          <button id="logout-btn" class="btn btn-outline">
            <i class="fas fa-sign-out-alt"></i> Déconnexion
          </button>
        </div>
      </aside>

      <main class="main-content" id="dashboard-content">
        <!-- Dynamic Content -->
        <h1>Bienvenue sur l'ERP Camp de Jour</h1>
        <p>Sélectionnez une option dans le menu.</p>
      </main>
    </div>
  `;

  const contentContainer = container.querySelector('#dashboard-content');
  const sidebar = container.querySelector('#sidebar');
  const overlay = container.querySelector('#sidebar-overlay');
  const menuToggle = container.querySelector('#menu-toggle');
  const links = container.querySelectorAll('.nav-link');

  // Mobile Menu Toggle Logic
  const toggleSidebar = () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  };

  menuToggle.addEventListener('click', toggleSidebar);
  overlay.addEventListener('click', toggleSidebar);

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Close sidebar on mobile after clicking a link
      if (window.innerWidth <= 1024) {
        toggleSidebar();
      }

      // Remove active class
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const view = link.dataset.view;
      renderView(view, contentContainer);
    });
  });

  document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
      if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        await signOut(auth);
      }
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la déconnexion');
    }
  });

  // Initial load
  renderView('overview', contentContainer);
}

function renderView(view, container) {
  container.innerHTML = '';
  switch (view) {
    case 'overview':
      container.innerHTML = `
        <h1 style="margin-bottom: 2rem;">Vue d'ensemble</h1>
        <div class="info-grid" style="margin-top: 0;">
           <div class="info-card">
             <h3 id="stat-youths">...</h3>
             <p>Jeunes Inscrits</p>
           </div>
           <div class="info-card">
             <h3 id="stat-animators">...</h3>
             <p>Animateurs</p>
           </div>
           <div class="info-card">
             <h3 id="stat-groups">...</h3>
             <p>Groupes</p>
           </div>
        </div>
      `;
      // Fetch stats
      getByCollection('registrations').then(res => {
        if (res.success) {
          const el = container.querySelector('#stat-youths');
          if (el) el.textContent = res.data.length;
        }
      });
      getByCollection('animators').then(res => {
        if (res.success) {
          const el = container.querySelector('#stat-animators');
          if (el) el.textContent = res.data.length;
        }
      });
      getByCollection('groups').then(res => {
        if (res.success) {
          const el = container.querySelector('#stat-groups');
          if (el) el.textContent = res.data.length;
        }
      });
      break;
    case 'youths':
      renderYouths(container);
      break;
    case 'animators':
      renderAnimators(container);
      break;
    case 'groups':
      renderGroups(container);
      break;
    case 'planning':
      renderPlanning(container);
      break;
    case 'docs':
      renderDocuments(container);
      break;
    default:
      container.innerHTML = `<p>Vue non trouvée</p>`;
  }
}
