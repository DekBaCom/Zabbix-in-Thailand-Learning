document.addEventListener('DOMContentLoaded', () => {
    const heroContainer = document.getElementById('hero-container');
    const contentArea = document.getElementById('content-area');
    const header = document.getElementById('main-header');
    const modal = document.getElementById('video-modal');
    const playerContainer = document.getElementById('player-container');
    const closeModal = document.getElementById('close-modal');
    const categoriesDropdown = document.getElementById('categories-dropdown');

    // Initialize View
    init();

    function init() {
        renderHero();
        renderRows();
        renderDropdown();
        setupHeaderScroll();
        setupModalListeners();
    }

    function renderDropdown() {
        categoriesDropdown.innerHTML = '';
        videoData.forEach((cat, index) => {
            const item = document.createElement('a');
            item.href = `#row-${index}`;
            item.textContent = cat.category;
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const row = document.getElementById(`row-${index}`);
                const headerOffset = 80;
                const elementPosition = row.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            });
            categoriesDropdown.appendChild(item);
        });
    }

    function renderHero() {
        // ... (rest of the function remains same, but I need to provide it all)
        const allVideos = videoData.flatMap(cat => cat.videos);
        const featuredVideo = allVideos[Math.floor(Math.random() * allVideos.length)];
        const videoId = featuredVideo.id;
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        heroContainer.style.backgroundImage = `url('${thumbnailUrl}')`;
        heroContainer.innerHTML = `
            <div class="hero-content">
                <h1>${featuredVideo.title}</h1>
                <p>สัมผัสประสบการณ์การเรียนรู้ Zabbix ในรูปแบบใหม่ที่เข้าใจง่ายและเป็นกันเอง โดยกลุ่ม Zabbix in Thailand</p>
                <div class="hero-btns">
                    <button class="btn-play" onclick="openVideo('${videoId}')">
                        <ion-icon name="play"></ion-icon> Play
                    </button>
                    <button class="btn-info">
                        <ion-icon name="information-circle-outline"></ion-icon> More Info
                    </button>
                </div>
            </div>
        `;
    }

    function renderRows() {
        contentArea.innerHTML = '';

        videoData.forEach((cat, index) => {
            const row = document.createElement('div');
            row.className = 'carousel-row';
            row.id = `row-${index}`;
            
            const headerRow = document.createElement('div');
            headerRow.className = 'row-header';

            const title = document.createElement('h2');
            title.className = 'row-title';
            title.textContent = cat.category;
            headerRow.appendChild(title);

            if (cat.playlistId) {
                const playAllBtn = document.createElement('button');
                playAllBtn.className = 'btn-play-all';
                playAllBtn.innerHTML = '<ion-icon name="play-circle-outline"></ion-icon> Play All';
                playAllBtn.onclick = () => openPlaylist(cat.playlistId);
                headerRow.appendChild(playAllBtn);
            }

            row.appendChild(headerRow);

            const container = document.createElement('div');
            container.className = 'row-container';

            const slider = document.createElement('div');
            slider.className = 'row-slider';
            slider.id = `slider-${index}`;

            cat.videos.forEach(video => {
                const card = createVideoCard(video);
                slider.appendChild(card);
            });

            const leftBtn = document.createElement('button');
            leftBtn.className = 'slider-control left';
            leftBtn.innerHTML = '<ion-icon name="chevron-back-outline"></ion-icon>';
            leftBtn.onclick = () => scrollSlider(slider, 'left');

            const rightBtn = document.createElement('button');
            rightBtn.className = 'slider-control right';
            rightBtn.innerHTML = '<ion-icon name="chevron-forward-outline"></ion-icon>';
            rightBtn.onclick = () => scrollSlider(slider, 'right');

            container.appendChild(leftBtn);
            container.appendChild(slider);
            container.appendChild(rightBtn);
            row.appendChild(container);
            contentArea.appendChild(row);
        });
    }

    function createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.onclick = () => openVideo(video.id);

        const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;

        card.innerHTML = `
            <img src="${thumbnailUrl}" alt="${video.title}" loading="lazy">
            <div class="video-card-info">
                <div class="video-card-title">${video.title}</div>
            </div>
        `;

        return card;
    }

    function scrollSlider(slider, direction) {
        const scrollAmount = slider.offsetWidth * 0.8;
        if (direction === 'left') {
            slider.scrollLeft -= scrollAmount;
        } else {
            slider.scrollLeft += scrollAmount;
        }
    }

    function setupHeaderScroll() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Modal Logic
    window.openVideo = function (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        playerContainer.innerHTML = `<iframe src="${embedUrl}" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; 
    };

    window.openPlaylist = function (playlistId) {
        const embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1`;
        playerContainer.innerHTML = `<iframe src="${embedUrl}" title="YouTube playlist player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    function setupModalListeners() {
        closeModal.addEventListener('click', closeVideo);

        const overlay = document.querySelector('.modal-overlay');
        overlay.addEventListener('click', closeVideo);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeVideo();
            }
        });
    }

    function closeVideo() {
        modal.style.display = 'none';
        playerContainer.innerHTML = '';
        document.body.style.overflow = '';
    }
});
