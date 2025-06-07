class ProjectCard {
    static create(project, handlers) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-info">
                <h3 class="project-name">${project.internal_name}</h3>
                <p class="project-description">${project.internal_description || 'Sem descrição'}</p>
                <div class="project-dates">
                    <span class="project-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${Helpers.formatDate(project.updated_at)}
                    </span>
                </div>
                <div class="project-actions">
                    <button class="project-action edit-action">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="project-action delete-action">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;

        // Event listeners
        card.querySelector('.edit-action').addEventListener('click', () => {
            handlers.onEdit(project);
        });

        card.querySelector('.delete-action').addEventListener('click', () => {
            handlers.onDelete(project);
        });

        return card;
    }
} 