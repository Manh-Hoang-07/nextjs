document.addEventListener('DOMContentLoaded', () => {
    // Remove loader
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                // Trigger hero animation
                document.querySelectorAll('.hero .fade-up').forEach(el => {
                    el.classList.add('active');
                });
            }, 500);
        }, 1000);
    });

    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;

            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Smooth scroll for indicator
    const mouse = document.querySelector('.mouse');
    if (mouse) {
        mouse.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }

    // Add some parallax effect to hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContainer = document.querySelector('.hero-image-container');
        if (heroContainer) {
            // Di chuyển container lên trên một chút khi cuộn xuống để tạo hiệu ứng sâu
            heroContainer.style.transform = `translateY(${scrolled * -0.2}px)`;
        }
    });

    // IMAGE MODAL FUNCTIONALITY with Navigation and Zoom
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const captionText = document.getElementById('caption');
    const closeModal = document.querySelector('.close-modal');
    const navPrev = document.querySelector('.nav-prev');
    const navNext = document.querySelector('.nav-next');

    // Zoom Controls
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const zoomResetBtn = document.getElementById('zoomReset');

    // Get all images that should be clickable
    const images = Array.from(document.querySelectorAll('.milestone-image img, .gallery-item img, .mosaic-item img'));
    let currentIndex = 0;

    // Zoom & Pan State
    let scale = 1;
    let isPanning = false;
    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;

    const updateTransform = () => {
        modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    };

    const resetZoom = () => {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    };

    const openModal = (index) => {
        currentIndex = index;
        const img = images[currentIndex];
        modal.style.display = "block";
        modalImg.src = img.src;
        captionText.innerHTML = img.alt;
        document.body.style.overflow = 'hidden';
        resetZoom();
    };

    const showNext = (e) => {
        if (e) e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        modalImg.style.animation = 'none';
        void modalImg.offsetWidth;
        modalImg.style.animation = 'zoomModal 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        modalImg.src = images[currentIndex].src;
        captionText.innerHTML = images[currentIndex].alt;
        resetZoom();
    };

    const showPrev = (e) => {
        if (e) e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        modalImg.style.animation = 'none';
        void modalImg.offsetWidth;
        modalImg.style.animation = 'zoomModal 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        modalImg.src = images[currentIndex].src;
        captionText.innerHTML = images[currentIndex].alt;
        resetZoom();
    };

    images.forEach((img, index) => {
        img.onclick = function () {
            openModal(index);
        }
    });

    if (closeModal) {
        closeModal.onclick = function () {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    }

    if (navNext) navNext.onclick = showNext;
    if (navPrev) navPrev.onclick = showPrev;

    // Zoom Button Listeners
    if (zoomInBtn) {
        zoomInBtn.onclick = (e) => {
            e.stopPropagation();
            scale = Math.min(scale + 0.25, 4);
            updateTransform();
        };
    }

    if (zoomOutBtn) {
        zoomOutBtn.onclick = (e) => {
            e.stopPropagation();
            scale = Math.max(scale - 0.25, 0.5);
            updateTransform();
        };
    }

    if (zoomResetBtn) {
        zoomResetBtn.onclick = (e) => {
            e.stopPropagation();
            resetZoom();
        };
    }

    // Mouse Wheel Zoom
    modal.onwheel = (e) => {
        if (modal.style.display === "block") {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            scale = Math.min(Math.max(scale + delta, 0.5), 4);
            updateTransform();
        }
    };

    // Panning Logic
    modalImg.onmousedown = (e) => {
        if (scale > 1) {
            isPanning = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            modalImg.style.transition = 'none'; // Smooth pan
        }
    };

    window.onmousemove = (e) => {
        if (isPanning) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        }
    };

    window.onmouseup = () => {
        isPanning = false;
        modalImg.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
    };

    // Close modal when clicking outside the image (only if not panning)
    modal.onclick = function (event) {
        if (event.target == modal || event.target.className === 'modal-image-wrapper') {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === "block") {
            if (e.key === "Escape") {
                modal.style.display = "none";
                document.body.style.overflow = 'auto';
            } else if (e.key === "ArrowRight") {
                showNext();
            } else if (e.key === "ArrowLeft") {
                showPrev();
            } else if (e.key === "+" || e.key === "=") {
                scale = Math.min(scale + 0.25, 4);
                updateTransform();
            } else if (e.key === "-" || e.key === "_") {
                scale = Math.max(scale - 0.25, 0.5);
                updateTransform();
            }
        }
    });

    console.log("Memory page loaded with love ❤️");
});
