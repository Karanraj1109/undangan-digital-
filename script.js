document.addEventListener('DOMContentLoaded', () => {

    // 1. Loading Screen
    const loading = document.getElementById('loading');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
                document.body.classList.add('locked'); // Lock scroll until envelope opens
            }, 800);
        }, 500);
    });

    // 2. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: 'forwards' });
        });

        // Hover effect for links and buttons
        const interactables = document.querySelectorAll('a, button, input, select, textarea, .gallery-item, summary');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-hover'));
        });
    }

    // 3. Envelope Opening & Music
    const openBtn = document.getElementById('open-invitation');
    const envelopeContainer = document.querySelector('.envelope-container');
    const envelopeScreen = document.getElementById('envelope-screen');
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-control');
    let isPlaying = false;

    openBtn.addEventListener('click', () => {
        envelopeContainer.classList.add('envelope-open');
        
        // Play music
        bgMusic.play().then(() => {
            isPlaying = true;
            updateMusicIcon();
        }).catch(err => console.log("Audio autoplay prevented by browser"));

        setTimeout(() => {
            envelopeScreen.classList.add('screen-hide');
            document.body.classList.remove('locked');
            triggerVisibleReveals(); // Trigger reveals that are in viewport
        }, 1200);
    });

    // Music Control Toggle
    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
        } else {
            bgMusic.play();
        }
        isPlaying = !isPlaying;
        updateMusicIcon();
    });

    function updateMusicIcon() {
        if (isPlaying) {
            musicBtn.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;
        } else {
            musicBtn.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73l4.73 4.73c-.23.49-.44 1.02-.6 1.57l1.39 1.39C19.78 18.06 21 15.17 21 12v-5h-4V3h-5v5.73l-7.73-7.73zM14 7h4V5h-4v2z"/></svg>`;
        }
    }

    // 4. Scroll Progress & Back to Top
    const scrollProgress = document.querySelector('.scroll-progress');
    const topBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = `${scrollPercent}%`;

        if (scrollTop > 500) {
            topBtn.classList.add('visible');
        } else {
            topBtn.classList.remove('visible');
        }
    });

    topBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 5. Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    function triggerVisibleReveals() {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }

    // 6. Countdown Timer
    const weddingDate = new Date('Aug 24, 2026 08:00:00').getTime();

    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            clearInterval(timer);
            document.getElementById('days').innerText = "00";
            document.getElementById('hours').innerText = "00";
            document.getElementById('minutes').innerText = "00";
            document.getElementById('seconds').innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    }, 1000);

    // 7. Lightbox Gallery
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            lightboxImg.src = item.src;
            lightbox.classList.add('active');
        });
    });

    closeLightbox.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) lightbox.classList.remove('active');
    });

    // 8. Copy to Clipboard
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = btn.innerText;
                btn.innerText = "Tersalin!";
                btn.style.backgroundColor = "var(--dark-gold)";
                btn.style.color = "#fff";
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = "transparent";
                    btn.style.color = "var(--dark-gold)";
                }, 2000);
            });
        });
    });

    // 9. Dummy Forms (RSVP & Wishes)
    const rsvpForm = document.getElementById('rsvp-form');
    if(rsvpForm){
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = rsvpForm.querySelector('button');
            btn.innerText = "Konfirmasi Terkirim!";
            btn.style.backgroundColor = "var(--text-dark)";
            rsvpForm.reset();
            setTimeout(() => { btn.innerText = "Kirim Konfirmasi"; btn.style.backgroundColor = "var(--gold)"; }, 3000);
        });
    }

    const wishForm = document.getElementById('wish-form');
    const wishesContainer = document.getElementById('wishes-container');
    if(wishForm){
        wishForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('wish-name').value;
            const message = document.getElementById('wish-message').value;
            
            const newWish = document.createElement('div');
            newWish.className = 'wish-card glass-card reveal active';
            newWish.innerHTML = `
                <h5>${name}</h5>
                <span class="wish-time">Baru saja</span>
                <p>${message}</p>
            `;
            
            wishesContainer.prepend(newWish);
            wishForm.reset();
            
            const btn = wishForm.querySelector('button');
            btn.innerText = "Ucapan Terkirim!";
            setTimeout(() => { btn.innerText = "Kirim Ucapan"; }, 3000);
        });
    }

    // 10. Floating Petals Effect
    const petalsContainer = document.getElementById('petals-container');
    const petalCount = 15;

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // Randomize properties
        const size = Math.random() * 15 + 10; // 10px to 25px
        const left = Math.random() * 100; // 0 to 100vw
        const animDuration = Math.random() * 10 + 10; // 10s to 20s
        const animDelay = Math.random() * 10; // 0s to 10s

        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${left}vw`;
        petal.style.animationDuration = `${animDuration}s`;
        petal.style.animationDelay = `${animDelay}s`;
        
        petalsContainer.appendChild(petal);
    }
});
