
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../firebase";
import { addAnimator, deleteAnimator } from "../../services/db";

const db = getFirestore(app);

export async function renderAnimators(container) {
  container.innerHTML = `
    <div class="header-actions">
      <h1>Gestion des Animateurs</h1>
      <button class="btn btn-primary" id="add-animator-btn">Ajouter un animateur</button>
    </div>
    <div class="card overflow-auto">
       <table class="w-full">
         <thead>
           <tr style="border-bottom: 2px solid #e5e7eb;">
             <th class="p-4">Prénom</th>
             <th class="p-4">Nom</th>
             <th class="p-4">Spécialité</th>
             <th class="p-4">Actions</th>
           </tr>
         </thead>
         <tbody id="animators-table-body">
           <tr>
             <td colspan="4" class="p-4" style="text-align: center;">Chargement...</td>
           </tr>
         </tbody>
       </table>
    </div>

    <!-- Add Animator Modal -->
    <div id="add-animator-modal" class="modal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Nouvel Animateur</h2>
        <form id="add-animator-form">
          <div class="form-group">
            <label for="afname">Prénom</label>
            <input type="text" id="afname" class="form-input" required>
          </div>
          <div class="form-group">
            <label for="alname">Nom</label>
            <input type="text" id="alname" class="form-input" required>
          </div>
          <div class="form-group">
            <label for="specialty">Spécialité</label>
            <input type="text" id="specialty" class="form-input" placeholder="ex: Sport, Arts, Science">
          </div>
          <button type="submit" class="btn btn-primary btn-block">Ajouter</button>
        </form>
      </div>
    </div>
  `;

  const tbody = container.querySelector('#animators-table-body');
  const modal = container.querySelector('#add-animator-modal');
  const addBtn = container.querySelector('#add-animator-btn');
  const closeBtn = container.querySelector('.close-modal');
  const form = container.querySelector('#add-animator-form');

  addBtn.onclick = () => modal.style.display = "block";
  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

  async function loadData() {
    tbody.innerHTML = '<tr><td colspan="4" class="p-4" style="text-align: center;">Chargement...</td></tr>';
    try {
      const querySnapshot = await getDocs(collection(db, "animators"));
      if (querySnapshot.empty) {
        tbody.innerHTML = `<tr><td colspan="4" class="p-4" style="text-align: center;">Aucun animateur trouvé.</td></tr>`;
        return;
      }

      tbody.innerHTML = '';
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #f3f4f6';
        const id = doc.id;
        tr.innerHTML = `
            <td class="p-4">${data.firstName}</td>
            <td class="p-4">${data.lastName}</td>
            <td class="p-4">${data.specialty || 'N/A'}</td>
            <td class="p-4">
              <div class="actions-cell">
                <button class="btn-sm btn-danger delete-btn" data-id="${id}">Supprimer</button>
              </div>
            </td>
          `;
        tbody.appendChild(tr);
      });

      tbody.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = async () => {
          if (confirm('Supprimer cet animateur ?')) {
            const res = await deleteAnimator(btn.dataset.id);
            if (res.success) loadData();
          }
        };
      });
    } catch (e) {
      console.error(e);
      tbody.innerHTML = `<tr><td colspan="4" class="p-4" style="text-align: center; color: red;">Erreur.</td></tr>`;
    }
  }

  form.onsubmit = async (e) => {
    e.preventDefault();
    const data = {
      firstName: form.afname.value,
      lastName: form.alname.value,
      specialty: form.specialty.value
    };
    const res = await addAnimator(data);
    if (res.success) {
      modal.style.display = "none";
      form.reset();
      loadData();
    }
  };

  loadData();
}
