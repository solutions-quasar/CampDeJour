import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getByCollection } from "../../services/db";
import { app } from "../../firebase";

const db = getFirestore(app);

export async function renderPlanning(container) {
  container.innerHTML = `
    <div class="header-actions">
      <h1>Planning Hebdomadaire</h1>
      <button class="btn btn-primary" id="add-event-btn">Ajouter un événement</button>
    </div>
    <div class="card">
       <div id="planning-calendar" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px;">
          <div class="p-4" style="background: #f8fafc; font-weight: bold; text-align: center;">Lun</div>
          <div class="p-4" style="background: #f8fafc; font-weight: bold; text-align: center;">Mar</div>
          <div class="p-4" style="background: #f8fafc; font-weight: bold; text-align: center;">Mer</div>
          <div class="p-4" style="background: #f8fafc; font-weight: bold; text-align: center;">Jeu</div>
          <div class="p-4" style="background: #f8fafc; font-weight: bold; text-align: center;">Ven</div>
          <div class="p-4" style="background: #f8fafc; font-weight: bold; text-align: center;">Sam</div>
          <div class="p-4" style="background: #f8fafc; font-weight: bold; text-align: center;">Dim</div>
          <!-- Days will go here -->
       </div>
    </div>
    <p style="margin-top: 2rem;"><i>Note: Vue simplifiée pour l'instant.</i></p>
  `;

  const calendar = container.querySelector('#planning-calendar');

  // Fill with empty days for demonstration
  for (let i = 0; i < 7; i++) {
    const day = document.createElement('div');
    day.style.minHeight = '150px';
    day.style.border = '1px solid #e5e7eb';
    day.style.padding = '0.5rem';
    day.innerHTML = `<small>${i + 1} Juillet</small>`;
    calendar.appendChild(day);
  }
}
