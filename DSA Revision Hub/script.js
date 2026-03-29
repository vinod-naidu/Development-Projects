document.addEventListener('DOMContentLoaded', () => {
    // Domain Elements
    const container = document.getElementById('problemList');
    const searchInput = document.getElementById('searchInput');
    const difficultyFilters = document.querySelectorAll('.filter-btn');
    
    // Modal Elements
    const addModal = document.getElementById('addModal');
    const openAddModalBtn = document.getElementById('openAddModalBtn');
    const closeAddModalBtn = document.getElementById('closeAddModalBtn');
    const cancelAddBtn = document.getElementById('cancelAddBtn');
    const saveProblemBtn = document.getElementById('saveProblemBtn');
    const addProblemForm = document.getElementById('addProblemForm');

    // Global State
    let problems = loadProblems(); // from Data.js
    let currentFilter = 'All';
    let searchQuery = '';

    // --- Rendering Logic ---
    function renderProblems() {
        container.innerHTML = '';
        
        let filtered = problems.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(searchQuery) || p.pattern.toLowerCase().includes(searchQuery);
            const matchesDifficulty = currentFilter === 'All' || p.difficulty === currentFilter;
            return matchesSearch && matchesDifficulty;
        });

        // Sort by newest top
        filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                    </svg>
                    <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">No Solutions Found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(p => {
            const div = document.createElement('div');
            div.className = 'card';
            
            const diffClass = p.difficulty.toLowerCase(); // easy, medium, hard
            
            div.innerHTML = `
                <div class="card-header">
                    <h3 class="card-title">${p.title}</h3>
                    <span class="badge ${diffClass}">${p.difficulty}</span>
                </div>
                <div class="card-topic">
                    <svg class="topic-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    ${p.pattern}
                </div>
                <div class="card-footer">
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">
                        ${p.timestamp ? new Date(p.timestamp).toLocaleDateString() : 'Added earlier'}
                    </div>
                    <a href="problem.html?id=${p.id}" class="view-btn">
                        View Solution
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                </div>
            `;
            
            container.appendChild(div);
        });
    }

    // --- Interaction Listeners ---
    
    // Search
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderProblems();
    });

    // Filtering
    difficultyFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active from all
            difficultyFilters.forEach(b => b.classList.remove('active'));
            // Add to clicked
            e.target.classList.add('active');
            
            currentFilter = e.target.getAttribute('data-filter');
            renderProblems();
        });
    });

    // --- Modal Logic ---
    function openModal() {
        addModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
    
    function closeModal() {
        addModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        addProblemForm.reset();
    }

    openAddModalBtn.addEventListener('click', openModal);
    closeAddModalBtn.addEventListener('click', closeModal);
    cancelAddBtn.addEventListener('click', closeModal);

    // Save functionality
    saveProblemBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Validate
        if (!addProblemForm.checkValidity()) {
            addProblemForm.reportValidity();
            return;
        }

        const newProblem = {
            id: Date.now(),
            title: document.getElementById('pTitle').value,
            pattern: document.getElementById('pPattern').value,
            difficulty: document.getElementById('pDifficulty').value,
            approach: document.getElementById('pApproach').value,
            code: document.getElementById('pCode').value,
            timestamp: Date.now()
        };

        problems.push(newProblem);
        saveProblems(problems); // from Data.js
        
        renderProblems();
        closeModal();
    });

    // Init call
    renderProblems();
});