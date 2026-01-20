
import { registerChild } from '../services/db';

export function renderHome(container) {
  container.innerHTML = `

    <div class="hero">
      <div class="hero-overlay"></div>
      <a href="#/login" class="admin-login-btn">Accès Admin</a>
      <div class="hero-content">
        <h1>Camp de Jour été 2023</h1>
        <p class="hero-subtitle">Le plaisir de l'été pour les 4 à 12 ans à Saint-Ubalde !</p>
        <div class="hero-actions">
           <a href="#register" class="btn btn-primary btn-lg">S'inscrire maintenant</a>
           <a href="#info" class="btn btn-secondary btn-lg">En savoir plus</a>
        </div>
      </div>
    </div>
    
    <section id="info" class="section container">
      <div class="info-grid">
        <div class="info-card">
           <h3>📅 Dates</h3>
           <p>Du 26 juin au 11 août 2023</p>
           <p>Lundi au Vendredi</p>
        </div>
        <div class="info-card">
           <h3>⏰ Horaire</h3>
           <p>9h00 à 16h00</p>
        </div>
        <div class="info-card">
           <h3>📍 Lieu</h3>
           <p>Centre récréatif ESU de Saint-Ubalde</p>
        </div>
      </div>
    </section>

    <section id="pricing" class="section container">
      <div style="text-align: center; margin-bottom: 3rem;">
        <h2 style="font-size: 2.5rem; color: var(--primary-color); margin-bottom: 1rem;">Tarifs 2023</h2>
        <p style="color: #6b7280; max-width: 600px; margin: 0 auto;">Le prix est de 55$ par semaine, avec un minimum de 4 semaines. Cela revient à seulement 11$ par jour par enfant.</p>
      </div>

      <div class="pricing-grid">
        <div class="card pricing-card">
          <div class="pricing-header">
            <h3>Temps Plein</h3>
            <span class="badge">5 jours / semaine</span>
          </div>
          <table class="pricing-table">
            <thead>
              <tr><th>Durée</th><th>Tarif</th></tr>
            </thead>
            <tbody>
              <tr><td>4 semaines</td><td>220,00 $</td></tr>
              <tr><td>5 semaines</td><td>275,00 $</td></tr>
              <tr><td>6 semaines</td><td>330,00 $</td></tr>
              <tr class="highlight"><td>7 semaines</td><td>385,00 $</td></tr>
            </tbody>
          </table>
        </div>

        <div class="card pricing-card">
          <div class="pricing-header">
            <h3>Temps Partiel</h3>
            <span class="badge">3 jours / semaine</span>
          </div>
          <table class="pricing-table">
            <thead>
              <tr><th>Durée</th><th>Tarif</th></tr>
            </thead>
            <tbody>
              <tr><td>4 semaines</td><td>132,00 $</td></tr>
              <tr><td>5 semaines</td><td>165,00 $</td></tr>
              <tr><td>6 semaines</td><td>198,00 $</td></tr>
              <tr class="highlight"><td>7 semaines</td><td>231,00 $</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="alert-info">
        <p><strong>Note sur les sorties :</strong> Le coût est fixé selon la destination et les frais d'admission (entre 15$ et 35$). Les détails seront communiqués par internet dès que la programmation sera confirmée.</p>
      </div>
    </section>

    <section id="register" class="section bg-light">
      <div class="container">
        <div class="card registration-card">
          <h2>Inscription Simple</h2>
          <form id="registration-form">
            <div class="form-group">
               <label for="firstName">Prénom de l'enfant</label>
               <input type="text" id="firstName" name="firstName" required class="form-input" placeholder="ex: Thomas">
            </div>
            <div class="form-group">
               <label for="lastName">Nom de l'enfant</label>
               <input type="text" id="lastName" name="lastName" required class="form-input" placeholder="ex: Tremblay">
            </div>
            <div class="form-group">
               <label for="age">Âge</label>
               <input type="number" id="age" name="age" min="4" max="12" required class="form-input" placeholder="4 à 12 ans">
            </div>
            <button type="submit" class="btn btn-primary btn-block">Inscrire mon enfant</button>
          </form>
        </div>
      </div>
    </section>
  `;

  // Attach event listener
  const form = container.querySelector('#registration-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const originalText = btn.textContent;

      try {
        const formData = new FormData(form);
        const child = {
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          age: parseInt(formData.get('age'))
        };

        btn.textContent = 'Envoi en cours...';
        btn.disabled = true;

        const result = await registerChild(child);

        if (result.success) {
          alert(`Inscription réussie pour ${child.firstName} !`);
          form.reset();
        } else {
          console.error(result.error);
          alert('Une erreur est survenue. Veuillez réessayer.');
        }
      } catch (error) {
        console.error(error);
        alert('Erreur inattendue.');
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }
}
