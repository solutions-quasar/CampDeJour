
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { app } from "../firebase";

const auth = getAuth(app);

export function renderLogin(container) {
    container.innerHTML = `
    <div class="container section" style="display: flex; justify-content: center; align-items: center; min-height: 80vh;">
      <div class="card login-card" style="width: 100%; max-width: 400px;">
        <h2 style="text-align: center; margin-bottom: 2rem;">Connexion ERP</h2>
        <form id="login-form">
          <div class="form-group">
            <label for="email">Courriel</label>
            <input type="email" id="email" name="email" required class="form-input" placeholder="admin@campdejour.com">
          </div>
          <div class="form-group" style="position: relative;">
            <label for="password">Mot de passe</label>
            <input type="password" id="password" name="password" required class="form-input" placeholder="••••••••">
            <button type="button" id="toggle-password" style="position: absolute; right: 10px; top: 38px; background: none; border: none; font-size: 1.2rem; display: none;">👁️</button> 
            <!-- Toggle logic needs styling adjustments, implementing simplified version below -->
            <label style="margin-top: 0.5rem; display: flex; align-items: center; cursor: pointer;">
               <input type="checkbox" id="show-password" style="margin-right: 0.5rem;"> Afficher le mot de passe
            </label>
          </div>
          <div class="form-group">
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input type="checkbox" id="remember-me" name="remember-me" style="margin-right: 0.5rem;"> Se souvenir de mon courriel
            </label>
          </div>
          <div class="form-group">
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input type="checkbox" id="stay-connected" name="stay-connected" checked style="margin-right: 0.5rem;"> Rester connecté
            </label>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Se connecter</button>
        </form>
        <p style="text-align: center; margin-top: 1rem;"><a href="#/" style="color: var(--primary-color);">Retour à l'accueil</a></p>
      </div>
    </div>
  `;

    const form = container.querySelector('#login-form');
    const showPasswordCheckbox = container.querySelector('#show-password');
    const passwordInput = container.querySelector('#password');
    const emailInput = container.querySelector('#email');

    // Remember Email Logic
    const savedEmail = localStorage.getItem('campdejour_email');
    if (savedEmail) {
        emailInput.value = savedEmail;
        container.querySelector('#remember-me').checked = true;
    }

    showPasswordCheckbox.addEventListener('change', (e) => {
        passwordInput.type = e.target.checked ? 'text' : 'password';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
        const rememberMe = container.querySelector('#remember-me').checked;
        const stayConnected = container.querySelector('#stay-connected').checked;

        if (rememberMe) {
            localStorage.setItem('campdejour_email', email);
        } else {
            localStorage.removeItem('campdejour_email');
        }

        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Connexion...';
        btn.disabled = true;

        try {
            // Set persistence based on "Stay Connected"
            await setPersistence(auth, stayConnected ? browserLocalPersistence : browserSessionPersistence);

            await signInWithEmailAndPassword(auth, email, password);
            // Success triggers auth state change which router should handle or we redirect manually
            window.location.hash = '#/dashboard';
        } catch (error) {
            console.error(error);
            alert('Échec de la connexion : ' + error.message);
            btn.textContent = 'Se connecter';
            btn.disabled = false;
        }
    });
}
