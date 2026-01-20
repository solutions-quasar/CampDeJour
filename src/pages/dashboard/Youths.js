
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../firebase";
import { registerChild, deleteChild } from "../../services/db";

const db = getFirestore(app);

export async function renderYouths(container) {
  container.innerHTML = `
    <div class="header-actions">
      <h1>Jeunes / Inscriptions</h1>
      <button class="btn btn-primary" id="add-youth-btn">Ajouter un jeune</button>
    </div>
    <div class="card overflow-auto">
       <table class="w-full">
         <thead>
           <tr style="border-bottom: 2px solid #e5e7eb;">
             <th class="p-4">Prénom</th>
             <th class="p-4">Nom</th>
             <th class="p-4">Âge</th>
             <th class="p-4">Date d'inscription</th>
             <th class="p-4">Actions</th>
           </tr>
         </thead>
         <tbody id="youths-table-body">
           <tr>
             <td colspan="5" class="p-4" style="text-align: center;">Chargement...</td>
           </tr>
         </tbody>
       </table>
    </div>

    <!-- Add Youth Modal -->
    <div id="add-youth-modal" class="modal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Inscrire un nouveau jeune</h2>
        <form id="add-youth-form">
          <div class="form-group">
            <label for="fname">Prénom</label>
            <input type="text" id="fname" class="form-input" required>
          </div>
          <div class="form-group">
            <label for="lname">Nom</label>
            <input type="text" id="lname" class="form-input" required>
          </div>
          <div class="form-group">
            <label for="age">Âge</label>
            <input type="number" id="age" class="form-input" required min="3" max="17">
          </div>
          <button type="submit" class="btn btn-primary btn-block">Enregistrer</button>
        </form>
      </div>
    </div>
  `;

  const tbody = container.querySelector('#youths-table-body');
  const modal = container.querySelector('#add-youth-modal');
  const addBtn = container.querySelector('#add-youth-btn');
  const closeBtn = container.querySelector('.close-modal');
  const form = container.querySelector('#add-youth-form');

  // UI Logic
  addBtn.onclick = () => modal.style.display = "block";
  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

  async function loadData() {
    tbody.innerHTML = '<tr><td colspan="5" class="p-4" style="text-align: center;">Chargement...</td></tr>';
    try {
      const querySnapshot = await getDocs(collection(db, "registrations"));
      if (querySnapshot.empty) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-4" style="text-align: center;">Aucun jeune inscrit.</td></tr>`;
        return;
      }

      tbody.innerHTML = '';
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt;
        let dateStr = 'N/A';

        if (createdAt) {
          // Check if it's a Firestore Timestamp or a JS Date
          const dateObj = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
          dateStr = dateObj.toLocaleDateString();
        }

        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #f3f4f6';
        const id = doc.id;
        tr.innerHTML = `
            <td class="p-4">${data.firstName}</td>
            <td class="p-4">${data.lastName}</td>
            <td class="p-4">${data.age}</td>
            <td class="p-4">${dateStr}</td>
            <td class="p-4">
              <div class="actions-cell">
                <button class="btn-sm btn-success view-btn" data-id="${id}">Voir</button>
                <button class="btn-sm btn-danger delete-btn" data-id="${id}">Supprimer</button>
              </div>
            </td>
          `;
        tbody.appendChild(tr);
      });

      // Action listeners
      tbody.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = async () => {
          if (confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) {
            const res = await deleteChild(btn.dataset.id);
            if (res.success) loadData();
            else alert('Erreur lors de la suppression');
          }
        };
      });

    } catch (e) {
      console.error(e);
      tbody.innerHTML = `<tr><td colspan="5" class="p-4" style="text-align: center; color: red;">Erreur de chargement.</td></tr>`;
    }
  }

  form.onsubmit = async (e) => {
    e.preventDefault();
    const childData = {
      firstName: form.fname.value,
      lastName: form.lname.value,
      age: parseInt(form.age.value)
    };
    const res = await registerChild(childData);
    if (res.success) {
      modal.style.display = "none";
      form.reset();
      loadData();
    } else {
      alert("Erreur lors de l'ajout");
    }
  };

  loadData();
}
