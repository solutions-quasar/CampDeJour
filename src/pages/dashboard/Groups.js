
import { getByCollection, addGroup, deleteGroup } from "../../services/db";

export async function renderGroups(container) {
  container.innerHTML = `
    <div class="header-actions">
      <h1>Constitution des Groupes</h1>
      <button class="btn btn-primary" id="add-group-btn">Créer un groupe</button>
    </div>
    <div class="card overflow-auto">
       <table class="w-full">
         <thead>
           <tr style="border-bottom: 2px solid #e5e7eb;">
             <th class="p-4">Nom du Groupe</th>
             <th class="p-4">Animateur</th>
             <th class="p-4">Nombre de Jeunes</th>
             <th class="p-4">Actions</th>
           </tr>
         </thead>
         <tbody id="groups-table-body">
           <tr>
             <td colspan="4" class="p-4" style="text-align: center;">Chargement...</td>
           </tr>
         </tbody>
       </table>
    </div>

    <!-- Add Group Modal -->
    <div id="add-group-modal" class="modal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Nouveau Groupe</h2>
        <form id="add-group-form">
          <div class="form-group">
            <label for="groupName">Nom du Groupe</label>
            <input type="text" id="groupName" class="form-input" required placeholder="ex: Les Castors">
          </div>
          <div class="form-group">
            <label for="groupAnimator">Animateur</label>
            <select id="groupAnimator" class="form-input" required>
              <option value="">Sélectionnez un animateur</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Créer</button>
        </form>
      </div>
    </div>
  `;

  const tbody = container.querySelector('#groups-table-body');
  const modal = container.querySelector('#add-group-modal');
  const addBtn = container.querySelector('#add-group-btn');
  const closeBtn = container.querySelector('.close-modal');
  const form = container.querySelector('#add-group-form');
  const animSelect = container.querySelector('#groupAnimator');

  addBtn.onclick = async () => {
    // Populate animators
    const res = await getByCollection('animators');
    if (res.success) {
      animSelect.innerHTML = '<option value="">Sélectionnez un animateur</option>';
      res.data.forEach(anim => {
        const opt = document.createElement('option');
        opt.value = anim.id;
        opt.textContent = `${anim.firstName} ${anim.lastName}`;
        animSelect.appendChild(opt);
      });
    }
    modal.style.display = "block";
  };

  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

  async function loadData() {
    tbody.innerHTML = '<tr><td colspan="4" class="p-4" style="text-align: center;">Chargement...</td></tr>';
    try {
      const groupsRes = await getByCollection('groups');
      const animatorsRes = await getByCollection('animators');

      if (!groupsRes.success) throw new Error("Erreur groupes");

      const animatorsMap = {};
      if (animatorsRes.success) {
        animatorsRes.data.forEach(a => animatorsMap[a.id] = `${a.firstName} ${a.lastName}`);
      }

      if (groupsRes.data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="p-4" style="text-align: center;">Aucun groupe créé.</td></tr>`;
        return;
      }

      tbody.innerHTML = '';
      groupsRes.data.forEach((group) => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #f3f4f6';
        const id = group.id;
        tr.innerHTML = `
            <td class="p-4">${group.name}</td>
            <td class="p-4">${animatorsMap[group.animatorId] || 'Inconnu'}</td>
            <td class="p-4">0</td> <!-- Placeholder for youth count -->
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
          if (confirm('Supprimer ce groupe ?')) {
            const res = await deleteGroup(btn.dataset.id);
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
      name: form.groupName.value,
      animatorId: form.groupAnimator.value
    };
    const res = await addGroup(data);
    if (res.success) {
      modal.style.display = "none";
      form.reset();
      loadData();
    }
  };

  loadData();
}
