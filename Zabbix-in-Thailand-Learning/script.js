document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const filterContainer = document.getElementById('filter-container');
    const searchInput = document.getElementById('search-input');
    const emptyState = document.getElementById('empty-state');
    const modal = document.getElementById('video-modal');
    const playerContainer = document.getElementById('player-container');
    const closeModal = document.getElementById('close-modal');
    
    let currentCategory = 'all';
    let currentSearchQuery = '';

    // Initialize View
    init();

    function init() {
        renderFilters();
        renderContent();
        setupEventListeners();
    }

    function renderFilters() {
        videoData.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = cat.category;
            btn.dataset.filter = cat.category;
            btn.addEventListener('click', () => handleFilterClick(cat.category, btn));
            filterContainer.appendChild(btn);
        });

        // Add listener to 'All' button
        const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
        allBtn.addEventListener('click', () => handleFilterClick('all', allBtn));
    }

    function setupEventListeners() {
        // Search Input Listener
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value.toLowerCase().trim();
            renderContent();
        });

        // Modal Listeners
        closeModal.addEventListener('click', closeVideo);

        // Close on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeVideo();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeVideo();
            }
        });
    }

    function handleFilterClick(category, btn) {
        // Update Active State
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentCategory = category;
        renderContent();
    }

    function renderContent() {
        contentArea.innerHTML = '';
        let totalVideosDisplayed = 0;

        videoData.forEach(cat => {
            // Category Filter Check
            if (currentCategory === 'all' || currentCategory === cat.category) {
                
                // Filter videos by search query
                const filteredVideos = cat.videos.filter(video => 
                    video.title.toLowerCase().includes(currentSearchQuery)
                );

                if (filteredVideos.length > 0) {
                    const section = document.createElement('section');
                    section.className = 'category-section';

                    const title = document.createElement('h2');
                    title.className = 'category-title';
                    title.textContent = cat.category;
                    section.appendChild(title);

                    const grid = document.createElement('div');
                    grid.className = 'video-grid';

                    filteredVideos.forEach(video => {
                        const card = createVideoCard(video);
                        grid.appendChild(card);
                        totalVideosDisplayed++;
                    });

                    section.appendChild(grid);
                    contentArea.appendChild(section);
                }
            }
        });

        // Handle Empty State
        if (totalVideosDisplayed === 0) {
            emptyState.style.display = 'block';
            contentArea.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            contentArea.style.display = 'block';
        }
    }

    function createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';

        const videoId = video.id || extractVideoId(video.url);
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        card.innerHTML = `
            <div class="thumbnail-container" onclick="openVideo('${videoId}')">
                <img src="${thumbnailUrl}" alt="${video.title}" loading="lazy" onerror="this.src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg'">
                <div class="play-button">
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
            </div>
            <div class="video-info">
                <div class="video-title" title="${video.title}">${video.title}</div>
            </div>
        `;

        return card;
    }

    function extractVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Modal Logic
    window.openVideo = function (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        playerContainer.innerHTML = `<iframe src="${embedUrl}" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    function closeVideo() {
        modal.style.display = 'none';
        playerContainer.innerHTML = ''; // Stop video
        document.body.style.overflow = '';
    }
});
