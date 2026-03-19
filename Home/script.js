document.addEventListener("DOMContentLoaded", () => {

    // ================= HERO SLIDER =================
    document.querySelectorAll(".hero").forEach(hero => {

        const slides = hero.querySelectorAll(".slide");
        const next = hero.querySelector(".arrow.right");
        const prev = hero.querySelector(".arrow.left");
        const bars = hero.querySelectorAll(".bar");

        let heroIndex = 0;
        let startX = 0;
        let isDragging = false;
        let interval;

        function showSlide(i) {
            slides.forEach(s => s.classList.remove("active"));
            bars.forEach(b => b.classList.remove("active"));

            slides[i].classList.add("active");
            bars[i].classList.add("active");
        }

        function nextSlide() {
            heroIndex = (heroIndex + 1) % slides.length;
            showSlide(heroIndex);
        }

        function prevSlide() {
            heroIndex = (heroIndex - 1 + slides.length) % slides.length;
            showSlide(heroIndex);
        }

        // 🔥 AUTO SLIDE FUNCTION
        function startAutoSlide() {
            interval = setInterval(() => {
                nextSlide();
            }, 3000); // 3 sec
        }

        function stopAutoSlide() {
            clearInterval(interval);
        }

        // ✅ Start auto
        startAutoSlide();

        // ✅ Buttons
        next?.addEventListener("click", () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide(); // reset timer
        });

        prev?.addEventListener("click", () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        // ✅ Mouse drag
        hero.addEventListener("mousedown", (e) => {
            isDragging = true;
            startX = e.clientX;
            stopAutoSlide();
        });

        hero.addEventListener("mouseup", (e) => {
            if (!isDragging) return;

            const diff = e.clientX - startX;

            if (diff > 50) prevSlide();
            else if (diff < -50) nextSlide();

            isDragging = false;
            startAutoSlide();
        });

        // ✅ Touch swipe
        hero.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            stopAutoSlide();
        });

        hero.addEventListener("touchend", (e) => {
            const diff = e.changedTouches[0].clientX - startX;

            if (diff > 50) prevSlide();
            else if (diff < -50) nextSlide();

            startAutoSlide();
        });

        // 🔥 BONUS: hover pe pause
        hero.addEventListener("mouseenter", stopAutoSlide);
        hero.addEventListener("mouseleave", startAutoSlide);

    });


    // ================= WORK SLIDER =================
    // FIX 1: Scope every query inside .work — stops grabbing the marquee .track
    const workSection = document.querySelector(".work");

    if (workSection) {
        const track = workSection.querySelector(".track");
        const cards = workSection.querySelectorAll(".card");
        const nextBtn = workSection.querySelector(".next");
        const prevBtn = workSection.querySelector(".prev");
        const fill = workSection.querySelector(".fill");

        let workIndex = 0;   // FIX 2: renamed — was re-declaring 'index' at the same scope level

        function updateSlider() {
            if (!cards.length || !track) return;

            // FIX 3: read the gap from CSS so it's always accurate
            const gap = parseInt(getComputedStyle(track).gap) || 20;
            const cardWidth = cards[0].offsetWidth + gap;

            track.style.transform = `translateX(-${workIndex * cardWidth}px)`;

            if (fill) {
                const progress = cards.length > 1
                    ? (workIndex / (cards.length - 1)) * 100
                    : 0;
                fill.style.width = progress + "%";
            }
        }

        nextBtn?.addEventListener("click", () => {
            if (workIndex < cards.length - 1) {
                workIndex++;
                updateSlider();
            }
        });

        prevBtn?.addEventListener("click", () => {
            if (workIndex > 0) {
                workIndex--;
                updateSlider();
            }
        });

        // ================= EXPAND / CLOSE CARDS =================
        cards.forEach(card => {
            const expandBtn = card.querySelector(".expand");
            const closeBtn = card.querySelector(".close");

            expandBtn?.addEventListener("click", () => {
                cards.forEach(c => c.classList.remove("active"));
                card.classList.add("active");
            });

            closeBtn?.addEventListener("click", () => {
                card.classList.remove("active");
            });
        });
    }


    // ================= TABS =================
    const tabs = document.querySelectorAll(".tab");
    const contents = document.querySelectorAll(".content-box");

    function activateTab(i) {
        tabs.forEach(t => t.classList.remove("active"));
        contents.forEach(c => c.classList.remove("active"));
        tabs[i].classList.add("active");
        contents[i].classList.add("active");
    }

    tabs.forEach((tab, i) => {
        tab.addEventListener("click", () => activateTab(i));

        tab.addEventListener("mouseenter", () => {
            if (window.innerWidth > 768) activateTab(i);
        });
    });


    // ================= FOOTER ACCORDION =================
    window.toggleCol = function (btn) {
        if (window.matchMedia("(min-width:600px)").matches) return;
        const col = btn.closest(".f-col");
        const open = col.getAttribute("aria-expanded") === "true";
        col.setAttribute("aria-expanded", open ? "false" : "true");
    };


    // ================= MOBILE BURGER MENU =================
    const burger = document.querySelector("#burger");
    const menu = document.querySelector("#mobileMenu");
    const closeMenu = document.querySelector("#closeMenu");

    burger?.addEventListener("click", () => {
        menu.classList.add("active");
    });

    closeMenu?.addEventListener("click", () => {
        menu.classList.remove("active");
    });

});