import EXPERIMENTS, { HOME_CONTENT, ABOUT_CONTENT, HOME_CATEGORY_CARDS, SITE_DATA } from './content.js';

// --- VIEW GENERATORS ---

// 1. Home View HTML
function getHomeView() {
    return `
        <section class="hero">
            <h1>${HOME_CONTENT.heroTitle}</h1>
            <p>${HOME_CONTENT.heroDescription}</p>
        </section>

        <section>
            <h2 class="section-heading">${HOME_CONTENT.experimentsTitle}</h2>
            <div class="card-grid" id="home-grid"></div>
        </section>
    `;
}

// 2. Experiments View HTML
function getExperimentsView(filterSubject) {
    return `
        <a href="#home" class="btn-back">&larr; Back to Home</a>
        <div class="experiments-title-search">
            <h2 class="section-heading">${filterSubject} Experiments</h2>
            <input type="text" id="experiment-search" class="search-bar" placeholder="Search experiments...">
        </div>
        <div id="exp-list-container"></div>
    `;
}

// 3. About View HTML (Dynamic Loop)
function getAboutView() {
    let htmlContent = `<div class="about-container">`;

    ABOUT_CONTENT.forEach(section => {
        htmlContent += `<h3>${section.title}</h3>`;
        
        if(section.intro) {
            htmlContent += `<p>${section.intro}</p>`;
        }

        if (section.isList) {
            htmlContent += `<ol class="about-list">`;
            section.text.forEach(item => {
                htmlContent += `<li>${item}</li>`;
            });
            htmlContent += `</ol>`;
        } else {
            htmlContent += `<p>${section.text}</p>`;
        }
    });

    htmlContent += `</div>`;
    return htmlContent;
}

// --- PULL TO REFRESH LOGIC ---
function setupPullToRefresh() {
    const container = document.getElementById('app-container');
    const loader = document.getElementById('ptr-loader');
    const icon = document.getElementById('ptr-icon');
    
    let startY = 0;
    let isPulling = false;
    let distance = 0;
    const threshold = 150; // Required drag distance to trigger reload

    // 1. Touch Start
    container.addEventListener('touchstart', (e) => {
        // Only enable if we are at the very top of the scroll
        if (container.scrollTop === 0) {
            startY = e.touches[0].clientY;
            isPulling = true;
        } else {
            isPulling = false;
        }
    }, { passive: true });

    // 2. Touch Move
    container.addEventListener('touchmove', (e) => {
        if (!isPulling) return;

        const currentY = e.touches[0].clientY;
        distance = currentY - startY;

        // Only react if pulling DOWN
        if (distance > 0) {
            // Visual Feedback: Move the loader down
            // We use a logarithmic curve so it feels "stretchy"
            const translateVal = Math.min(distance * 0.4, 80); 
            
            loader.style.opacity = '1';
            loader.style.transform = `translateY(${translateVal}px)`;
            
            // Rotate the icon based on distance
            icon.style.transform = `rotate(${distance}deg)`;
        }
    }, { passive: true });

    // 3. Touch End
    container.addEventListener('touchend', () => {
        if (!isPulling) return;
        isPulling = false;

        // Check if dragged far enough
        if (distance > threshold) {
            // Trigger Reload
            loader.style.transform = `translateY(50px)`; // Lock position
            icon.classList.add('ptr-spinning'); // Start spinning animation
            
            setTimeout(() => {
                window.location.reload();
            }, 500); // Small delay so user sees the spin
        } else {
            // Snap back (Reset)
            loader.style.opacity = '0';
            loader.style.transform = 'translateY(-20px)';
            distance = 0;
        }
    });
}


// --- RENDER LOGIC ---

function render() {
    const app = document.getElementById('app-container');
    const hash = window.location.hash;

    // A. Experiments Route
    if (hash.startsWith('#experiments')) {
        const subject = hash.split('-')[1] || 'All'; 
        app.innerHTML = getExperimentsView(decodeURIComponent(subject));
        
        const listContainer = document.getElementById('exp-list-container');
        const searchInput = document.getElementById('experiment-search');
        const allFiltered = EXPERIMENTS.filter(e => e.subject === subject || subject === 'All');
        
        function renderExperimentsList(data) {
            listContainer.innerHTML = '';
            if(data.length === 0) {
                listContainer.innerHTML = '<p>No experiments found matching your search!</p>';
                return;
            }
            data.forEach(exp => {
                const div = document.createElement('div');
                div.className = 'exp-list-item';
                div.innerHTML = `
                    <img src="${exp.imagePath}" class="exp-thumb" onerror="this.src='images/logo1.png'">
                    <div class="exp-info">
                        <h3>${exp.title} <span class="badge">${exp.subject}</span></h3>
                        <p>${exp.description}</p>
                        <button class="btn-start" onclick="window.open('${exp.link}', '_self')">Start Experiment</button>
                    </div>
                `;
                listContainer.appendChild(div);
            });
        }

        renderExperimentsList(allFiltered);

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const searchedData = allFiltered.filter(exp => 
                    exp.title.toLowerCase().includes(query) || 
                    exp.description.toLowerCase().includes(query)
                );
                renderExperimentsList(searchedData);
            });
        }

    } 
    // B. About Route
    else if (hash === '#about') {
        app.innerHTML = getAboutView();
    } 
    // C. Home Route (Default)
    else {
        app.innerHTML = getHomeView();
        
        const grid = document.getElementById('home-grid');
        HOME_CATEGORY_CARDS.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'card';
            card.onclick = () => window.location.hash = `#experiments-${cat.id}`;
            
            card.innerHTML = `
                <div class="card-image" style="background-image: url('${cat.image}');"></div>
                <div class="card-content">
                    <h3>${cat.displayTitle}</h3>
                    <p>${cat.description}</p>
                    <span class="link-text">Enter Lab &rarr;</span>
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Set Static Header/Footer Text from Content.js
    document.querySelector('.brand-name').textContent = SITE_DATA.brandName;
    document.querySelector('.brand-sub').textContent = SITE_DATA.brandSub;
    
    // Inject Footer Content dynamically
    const footer = document.querySelector('.main-footer');
    if(footer) {
        footer.innerHTML = `
            <p>${SITE_DATA.footerText}</p>
            <p>${SITE_DATA.footerSubText}</p>
        `;
    }

    // 2. Initial Render
    render();

    // 3. Initialize Pull to Refresh
    setupPullToRefresh();
});

// Listen for navigation changes
window.addEventListener('hashchange', render);