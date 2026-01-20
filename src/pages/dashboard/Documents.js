
import { ref, uploadBytes, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../../firebase";

export async function renderDocuments(container) {
    container.innerHTML = `
    <div class="header-actions">
      <h1>Documents & Ressources</h1>
      <label class="btn btn-primary" for="file-upload">
        <i class="fas fa-cloud-upload-alt"></i> Téléverser un fichier
      </label>
      <input type="file" id="file-upload" style="display: none;">
    </div>

    <div class="card">
        <div id="upload-progress" style="display: none; margin-bottom: 1rem;">
            <div style="background: #e5e7eb; border-radius: 10px; height: 10px; overflow: hidden;">
                <div id="progress-bar" style="background: var(--primary-color); width: 0%; height: 100%; transition: width 0.3s;"></div>
            </div>
            <p style="font-size: 0.8rem; color: #6b7280; margin-top: 0.5rem;">Téléversement en cours...</p>
        </div>

        <div class="overflow-auto">
            <table class="w-full">
                <thead>
                    <tr>
                        <th class="p-4">Fichier</th>
                        <th class="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody id="files-table-body">
                    <tr>
                        <td colspan="2" class="p-4" style="text-align: center;">Chargement des documents...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Preview Modal -->
    <div id="preview-modal" class="modal">
      <div class="modal-content" style="max-width: 800px;">
        <span class="close-modal">&times;</span>
        <h2 id="preview-title" style="margin-bottom: 1.5rem; font-size: 1.2rem; word-break: break-all;">Aperçu</h2>
        <div id="preview-body" style="text-align: center; min-height: 200px; display: flex; align-items: center; justify-content: center; background: #f9fafb; border-radius: 0.5rem; overflow: hidden;">
            <!-- Preview content will be injected here -->
        </div>
      </div>
    </div>
  `;

    const tbody = container.querySelector('#files-table-body');
    const fileInput = container.querySelector('#file-upload');
    const progressContainer = container.querySelector('#upload-progress');
    const progressBar = container.querySelector('#progress-bar');

    // Preview Modal Elements
    const previewModal = container.querySelector('#preview-modal');
    const previewTitle = container.querySelector('#preview-title');
    const previewBody = container.querySelector('#preview-body');
    const closePreview = container.querySelector('.close-modal');

    closePreview.onclick = () => previewModal.style.display = "none";
    window.addEventListener('click', (e) => {
        if (e.target === previewModal) previewModal.style.display = "none";
    });

    function getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return 'far fa-file-image';
        if (ext === 'pdf') return 'far fa-file-pdf';
        if (['doc', 'docx'].includes(ext)) return 'far fa-file-word';
        if (['xls', 'xlsx'].includes(ext)) return 'far fa-file-excel';
        return 'far fa-file';
    }

    function isImage(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
    }

    async function loadFiles() {
        tbody.innerHTML = '<tr><td colspan="2" class="p-4" style="text-align: center;">Chargement...</td></tr>';
        try {
            const listRef = ref(storage, 'documents');
            const res = await listAll(listRef);

            if (res.items.length === 0) {
                tbody.innerHTML = '<tr><td colspan="2" class="p-4" style="text-align: center;">Aucun document trouvé.</td></tr>';
                return;
            }

            tbody.innerHTML = '';
            for (const item of res.items) {
                const tr = document.createElement('tr');
                const url = await getDownloadURL(item);
                const iconClass = getFileIcon(item.name);
                const isImg = isImage(item.name);

                tr.innerHTML = `
                    <td class="p-4">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 6px; overflow: hidden;">
                                ${isImg ? `<img src="${url}" style="width: 100%; height: 100%; object-fit: cover;">` : `<i class="${iconClass}" style="font-size: 1.2rem; color: #6b7280;"></i>`}
                            </div>
                            <span style="font-weight: 500;">${item.name}</span>
                        </div>
                    </td>
                    <td class="p-4">
                        <div class="actions-cell">
                            <button class="btn-sm btn-success preview-btn" data-url="${url}" data-name="${item.name}" data-type="${isImg ? 'image' : (item.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'other')}">
                                <i class="fas fa-eye"></i> Aperçu
                            </button>
                            <a href="${url}" target="_blank" class="btn-sm btn-outline" style="width: auto;">
                                <i class="fas fa-download"></i>
                            </a>
                            <button class="btn-sm btn-danger delete-file" data-name="${item.name}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            }

            // Preview listeners
            tbody.querySelectorAll('.preview-btn').forEach(btn => {
                btn.onclick = () => {
                    const { url, name, type } = btn.dataset;
                    previewTitle.textContent = name;
                    previewBody.innerHTML = '';

                    if (type === 'image') {
                        const img = document.createElement('img');
                        img.src = url;
                        img.style.maxWidth = '100%';
                        img.style.maxHeight = '70vh';
                        img.style.objectFit = 'contain';
                        previewBody.appendChild(img);
                    } else if (type === 'pdf') {
                        const iframe = document.createElement('iframe');
                        iframe.src = url;
                        iframe.style.width = '100%';
                        iframe.style.height = '70vh';
                        iframe.style.border = 'none';
                        previewBody.appendChild(iframe);
                    } else {
                        previewBody.innerHTML = `
                            <div style="padding: 2rem;">
                                <i class="${getFileIcon(name)}" style="font-size: 3rem; color: #d1d5db; margin-bottom: 1rem; display: block;"></i>
                                <p>L'aperçu n'est pas disponible pour ce type de fichier.</p>
                                <a href="${url}" target="_blank" class="btn btn-primary" style="margin-top: 1rem;">Télécharger pour voir</a>
                            </div>
                        `;
                    }

                    previewModal.style.display = "block";
                };
            });

            // Delete listeners
            tbody.querySelectorAll('.delete-file').forEach(btn => {
                btn.onclick = async () => {
                    if (confirm(`Supprimer le fichier ${btn.dataset.name} ?`)) {
                        const fileRef = ref(storage, `documents/${btn.dataset.name}`);
                        try {
                            await deleteObject(fileRef);
                            loadFiles();
                        } catch (e) {
                            alert("Erreur lors de la suppression");
                        }
                    }
                };
            });

        } catch (e) {
            console.error(e);
            tbody.innerHTML = '<tr><td colspan="2" class="p-4" style="text-align: center; color: red;">Erreur de chargement.</td></tr>';
        }
    }

    fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const storageRef = ref(storage, `documents/${file.name}`);

        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';

        try {
            await uploadBytes(storageRef, file);
            progressBar.style.width = '100%';
            setTimeout(() => {
                progressContainer.style.display = 'none';
                loadFiles();
            }, 500);
        } catch (error) {
            console.error(error);
            alert("Erreur lors du téléversement");
            progressContainer.style.display = 'none';
        }
    };

    loadFiles();
}
