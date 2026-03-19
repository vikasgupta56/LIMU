document.addEventListener("DOMContentLoaded", () => {

    const messages = [
        "New Arrival - Plaud NotePin's is now available",
        "🔥 Spring Sale - Up to 30% OFF",
        "🚀 Free shipping on all orders"
    ];

    const text = document.querySelector(".announcement .text");
    const left = document.querySelector(".announcement .left");
    const right = document.querySelector(".announcement .right");

    let i = 0;

    function updateText() {
        text.textContent = messages[i];
    }

    right.addEventListener("click", () => {
        i = (i + 1) % messages.length;
        updateText();
    });

    left.addEventListener("click", () => {
        i = (i - 1 + messages.length) % messages.length;
        updateText();
    });

    // AUTO SLIDE 🔥
    setInterval(() => {
        i = (i + 1) % messages.length;
        updateText();
    }, 4000);

    // ================= HERO SLIDER =================
    document.querySelectorAll(".hero").forEach(hero => {

        const slides = hero.querySelectorAll(".slide");
        const next = hero.querySelector(".arrow.right");
        const prev = hero.querySelector(".arrow.left");
        const bars = hero.querySelectorAll(".bar");

        let heroIndex = 0;
        let startX = 0;
        let isDragging = false;
        let interval = null;

        // ── slide logic ──────────────────────────────────────────────────
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

        // ── autoplay ─────────────────────────────────────────────────────
        // FIX 2: always clear the existing interval before starting a new one
        //        so we never accidentally stack two running intervals
        function startAutoSlide() {
            clearInterval(interval);           // no-op if already null — safe
            interval = setInterval(nextSlide, 5000);
        }

        function stopAutoSlide() {
            clearInterval(interval);
            interval = null;
        }

        startAutoSlide();

        // ── arrow buttons ────────────────────────────────────────────────
        next?.addEventListener("click", () => {
            nextSlide();
            startAutoSlide();    // resets the 3 s countdown
        });

        prev?.addEventListener("click", () => {
            prevSlide();
            startAutoSlide();
        });

        // ── mouse drag ───────────────────────────────────────────────────
        hero.addEventListener("mousedown", e => {
            isDragging = true;
            startX = e.clientX;
            stopAutoSlide();
        });

        hero.addEventListener("mouseup", e => {
            if (!isDragging) return;
            const diff = e.clientX - startX;
            if (diff > 50) prevSlide();
            else if (diff < -50) nextSlide();
            isDragging = false;
            startAutoSlide();
        });

        // safety: if the mouse leaves while button is held, end the drag cleanly
        hero.addEventListener("mouseleave", () => {
            if (isDragging) {
                isDragging = false;
                startAutoSlide();
            }
        });

        // ── hover pause ──────────────────────────────────────────────────
        // FIX 1: guard with isDragging so hover events during a drag gesture
        //        don't restart/stop the timer on top of the drag handlers
        hero.addEventListener("mouseenter", () => {
            if (!isDragging) stopAutoSlide();
        });

        // mouseleave is already handled above for the drag case;
        // this covers the normal hover-exit path
        hero.addEventListener("mouseleave", () => {
            if (!isDragging) startAutoSlide();
        });

        // ── touch swipe ──────────────────────────────────────────────────
        hero.addEventListener("touchstart", e => {
            startX = e.touches[0].clientX;
            stopAutoSlide();
        });

        hero.addEventListener("touchend", e => {
            const diff = e.changedTouches[0].clientX - startX;
            if (diff > 50) prevSlide();
            else if (diff < -50) nextSlide();
            startAutoSlide();
        });
    });


    // ================= WORK SLIDER =================
    const workSection = document.querySelector(".work");

    if (workSection) {
        const track = workSection.querySelector(".track");
        const cards = workSection.querySelectorAll(".card");
        const nextBtn = workSection.querySelector(".next");
        const prevBtn = workSection.querySelector(".prev");
        const fill = workSection.querySelector(".fill");

        let workIndex = 0;

        // FIX 2: read width from a NON-expanded card so an open card never
        //        pollutes the measurement. We look for the first card that
        //        does NOT have the "active" class; fall back to cards[0].
        function getCardWidth() {
            const reference = Array.from(cards).find(c => !c.classList.contains("active")) || cards[0];
            const gap = parseInt(getComputedStyle(track).gap) || 20;
            return reference.offsetWidth + gap;
        }

        function getMaxIndex() {
            const cardWidth = getCardWidth();
            const containerWidth = track.parentElement.offsetWidth;
            const visibleCards = Math.max(1, Math.floor(containerWidth / cardWidth));
            return Math.max(0, cards.length - visibleCards);
        }

        function updateSlider() {
            if (!cards.length || !track) return;

            const maxIndex = getMaxIndex();

            // clamp workIndex to valid range
            workIndex = Math.min(Math.max(workIndex, 0), maxIndex);

            const cardWidth = getCardWidth();
            track.style.transform = `translateX(-${workIndex * cardWidth}px)`;

            if (fill) {
                fill.style.width = (maxIndex > 0 ? (workIndex / maxIndex) * 100 : 0) + "%";
            }
        }

        // FIX 1: guard against the real upper limit (maxIndex), NOT cards.length - 1
        nextBtn?.addEventListener("click", () => {
            if (workIndex < getMaxIndex()) {
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

        // ── Expand / Close cards ─────────────────────────────────────────
        cards.forEach(card => {
            card.querySelector(".expand")?.addEventListener("click", () => {
                cards.forEach(c => c.classList.remove("active"));
                card.classList.add("active");
                // FIX 2 continued: recalculate after expand because the active
                //                  card's size has changed
                updateSlider();
            });

            card.querySelector(".close")?.addEventListener("click", () => {
                card.classList.remove("active");
                // Recalculate after collapse too
                updateSlider();
            });
        });

        // FIX 3: recalculate on resize so visibleCards stays accurate
        window.addEventListener("resize", updateSlider);
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

    // ================= SECURITY SLIDER =================
    const sec = document.querySelector(".security");

    if (sec) {
        const track = sec.querySelector(".track");
        const cards = sec.querySelectorAll(".card");
        const nextBtn = sec.querySelector(".next");
        const prevBtn = sec.querySelector(".prev");
        const fill = sec.querySelector(".fill");

        // FIX 1: renamed from 'index' — avoids clash with any other 'let index'
        //        declared in the same DOMContentLoaded scope
        let secIndex = 0;
        let autoTimer = null;

        // ── helpers ──────────────────────────────────────────────────────
        function getCardWidth() {
            const gap = parseInt(getComputedStyle(track).gap) || 20;
            return cards[0].offsetWidth + gap;
        }

        function getMaxIndex() {
            const containerWidth = track.parentElement.offsetWidth;
            // FIX 2: compute max in one pass — no repeated DOM reads
            const visibleCards = Math.max(1, Math.floor(containerWidth / getCardWidth()));
            return Math.max(0, cards.length - visibleCards);
        }

        function clamp(val) {
            return Math.min(Math.max(val, 0), getMaxIndex());
        }

        function updateSlider() {
            if (!cards.length || !track) return;

            // FIX 3: clamp before reading maxIndex so fill never flashes to 100%
            const maxIndex = getMaxIndex();
            secIndex = Math.min(Math.max(secIndex, 0), maxIndex);

            track.style.transform = `translateX(-${secIndex * getCardWidth()}px)`;

            if (fill) {
                fill.style.width = (maxIndex > 0 ? (secIndex / maxIndex) * 100 : 0) + "%";
            }
        }

        // ── autoplay ─────────────────────────────────────────────────────
        // FIX 4: use setTimeout (not setInterval) so each advance waits
        //        for the CSS transition to finish and respects manual clicks
        function startAuto() {
            stopAuto();
            autoTimer = setTimeout(function tick() {
                secIndex++;
                if (secIndex > getMaxIndex()) secIndex = 0; // wrap
                updateSlider();
                autoTimer = setTimeout(tick, 4000);
            }, 4000);
        }

        function stopAuto() {
            clearTimeout(autoTimer);
            autoTimer = null;
        }

        startAuto();

        // ── next / prev ──────────────────────────────────────────────────
        nextBtn?.addEventListener("click", () => {
            const maxIndex = getMaxIndex();

            if (secIndex >= maxIndex) {
                secIndex = 0; // 🔥 jump to start
            } else {
                secIndex++;
            }

            updateSlider();
            startAuto();
        });

        prevBtn?.addEventListener("click", () => {
            const maxIndex = getMaxIndex();

            if (secIndex <= 0) {
                secIndex = maxIndex; // 🔥 jump to last
            } else {
                secIndex--;
            }

            updateSlider();
            startAuto();
        });

        // ── touch swipe ──────────────────────────────────────────────────
        let touchStartX = 0;

        track.addEventListener("touchstart", e => {
            touchStartX = e.touches[0].clientX;
            stopAuto();
        });

        track.addEventListener("touchend", e => {
            const diff = e.changedTouches[0].clientX - touchStartX;
            if (diff > 50) secIndex--;
            else if (diff < -50) secIndex++;
            updateSlider();
            startAuto();
        });

        // ── hover pause ──────────────────────────────────────────────────
        sec.addEventListener("mouseenter", stopAuto);
        sec.addEventListener("mouseleave", startAuto);

        // ── recalculate on resize (card widths change at breakpoints) ────
        window.addEventListener("resize", updateSlider);
    }


    // ====================== MEDIA ================================


    const media = document.querySelector(".media");

    if (media) {
        const track = media.querySelector(".track");
        const cards = media.querySelectorAll(".card");
        const nextBtn = media.querySelector(".next");
        const prevBtn = media.querySelector(".prev");
        const fill = media.querySelector(".fill");

        // FIX 1: renamed from 'index' — avoids clash with any other 'let index'
        //        declared in the same DOMContentLoaded scope
        let secIndex = 0;
        let autoTimer = null;

        // ── helpers ──────────────────────────────────────────────────────
        function getCardWidth() {
            const gap = parseInt(getComputedStyle(track).gap) || 20;
            return cards[0].offsetWidth + gap;
        }

        function getMaxIndex() {
            const containerWidth = track.parentElement.offsetWidth;
            // FIX 2: compute max in one pass — no repeated DOM reads
            const visibleCards = Math.max(1, Math.floor(containerWidth / getCardWidth()));
            return Math.max(0, cards.length - visibleCards);
        }

        function clamp(val) {
            return Math.min(Math.max(val, 0), getMaxIndex());
        }

        function updateSlider() {
            if (!cards.length || !track) return;

            // FIX 3: clamp before reading maxIndex so fill never flashes to 100%
            const maxIndex = getMaxIndex();
            secIndex = Math.min(Math.max(secIndex, 0), maxIndex);

            track.style.transform = `translateX(-${secIndex * getCardWidth()}px)`;

            if (fill) {
                fill.style.width = (maxIndex > 0 ? (secIndex / maxIndex) * 100 : 0) + "%";
            }
        }

        // ── autoplay ─────────────────────────────────────────────────────
        // FIX 4: use setTimeout (not setInterval) so each advance waits
        //        for the CSS transition to finish and respects manual clicks
        function startAuto() {
            stopAuto();
            autoTimer = setTimeout(function tick() {
                secIndex++;
                if (secIndex > getMaxIndex()) secIndex = 0; // wrap
                updateSlider();
                autoTimer = setTimeout(tick, 4000);
            }, 4000);
        }

        function stopAuto() {
            clearTimeout(autoTimer);
            autoTimer = null;
        }

        startAuto();

        // ── next / prev ──────────────────────────────────────────────────
        nextBtn?.addEventListener("click", () => {
            const maxIndex = getMaxIndex();

            if (secIndex >= maxIndex) {
                secIndex = 0; // 🔥 jump to start
            } else {
                secIndex++;
            }

            updateSlider();
            startAuto();
        });

        prevBtn?.addEventListener("click", () => {
            const maxIndex = getMaxIndex();

            if (secIndex <= 0) {
                secIndex = maxIndex; // 🔥 jump to last
            } else {
                secIndex--;
            }

            updateSlider();
            startAuto();
        });

        // ── touch swipe ──────────────────────────────────────────────────
        let touchStartX = 0;

        track.addEventListener("touchstart", e => {
            touchStartX = e.touches[0].clientX;
            stopAuto();
        });

        track.addEventListener("touchend", e => {
            const diff = e.changedTouches[0].clientX - touchStartX;
            if (diff > 50) secIndex--;
            else if (diff < -50) secIndex++;
            updateSlider();
            startAuto();
        });

        // ── hover pause ──────────────────────────────────────────────────
        media.addEventListener("mouseenter", stopAuto);
        media.addEventListener("mouseleave", startAuto);

        // ── recalculate on resize (card widths change at breakpoints) ────
        window.addEventListener("resize", updateSlider);
    }


    // ================= SUMMARIES ========================

    const section = document.querySelector(".summaries");

    if (section) {
        const items = section.querySelectorAll(".item");
        const img = section.querySelectorAll(".img");

        let index = 0;
        const duration = 4000;
        let timeout;

        function reset() {
            items.forEach(item => {
                item.classList.remove("active");

                const bar = item.querySelector("span");
                bar.style.height = "0%";
                bar.style.transition = "none";
            });

            img.forEach(v => v.classList.remove("active"));
        }

        function startProgress(i) {
            const bar = items[i].querySelector("span");

            bar.style.transition = "none";
            bar.style.height = "0%";

            bar.offsetHeight;

            bar.style.transition = `height ${duration}ms linear`;
            bar.style.height = "100%";
        }

        function showSlide(i) {
            reset();

            items[i].classList.add("active");
            img[i].classList.add("active");

            startProgress(i);
        }

        function autoPlay() {
            timeout = setTimeout(() => {
                index = (index + 1) % items.length;
                showSlide(index);
                autoPlay();
            }, duration);
        }

        function restartAuto() {
            clearTimeout(timeout);
            autoPlay();
        }

        // 🔥 CLICK FEATURE (MAIN ADD)
        items.forEach((item, i) => {
            item.addEventListener("click", () => {
                index = i;
                showSlide(index);
                restartAuto(); // 🔥 reset timer
            });
        });

        // START
        showSlide(index);
        autoPlay();
    }

    // ================ MOBILE SUMMARIES =================

    const mobile_summaries = document.querySelector(".mobile-summaries");

    if (mobile_summaries) {
        const track = mobile_summaries.querySelector(".track");
        const cards = mobile_summaries.querySelectorAll(".card");
        const next = mobile_summaries.querySelector(".next");
        const prev = mobile_summaries.querySelector(".prev");
        const pauseBtn = mobile_summaries.querySelector(".pause"); // 🔥 add
        const dotsWrap = mobile_summaries.querySelector(".dots");

        let index = 0;
        const duration = 4000;
        let interval;
        let isPaused = false; // 🔥 state

        // DOTS
        cards.forEach((_, i) => {
            const dot = document.createElement("span");

            const prog = document.createElement("div");
            prog.classList.add("progress");

            dot.appendChild(prog);

            if (i === 0) dot.classList.add("active");

            dotsWrap.appendChild(dot);
        });

        const dots = dotsWrap.querySelectorAll("span");

        function updateSlider() {
            const gap = parseInt(getComputedStyle(track).gap) || 20;
            const width = cards[0].offsetWidth + gap;

            track.style.transform = `translateX(-${index * width}px)`;

            dots.forEach(d => {
                d.classList.remove("active");
                d.querySelector(".progress").style.width = "0%";
            });

            dots[index].classList.add("active");
        }

        function startProgress() {
            const activeDot = dots[index].querySelector(".progress");

            activeDot.style.transition = "none";
            activeDot.style.width = "0%";

            setTimeout(() => {
                activeDot.style.transition = `width ${duration}ms linear`;
                activeDot.style.width = "100%";
            }, 50);
        }

        function autoPlay() {
            if (isPaused) return; // 🔥 STOP if paused

            startProgress();

            interval = setTimeout(() => {
                index = (index + 1) % cards.length;
                updateSlider();
                autoPlay();
            }, duration);
        }

        function restart() {
            clearTimeout(interval);
            if (!isPaused) autoPlay();
        }

        // NEXT
        next.onclick = () => {
            index = (index + 1) % cards.length;
            updateSlider();
            restart();
        };

        // PREV
        prev.onclick = () => {
            index = (index - 1 + cards.length) % cards.length;
            updateSlider();
            restart();
        };

        // 🔥 PAUSE BUTTON
        pauseBtn?.addEventListener("click", () => {
            isPaused = !isPaused;

            if (isPaused) {
                clearTimeout(interval);

                // stop animation instantly
                const bar = dots[index].querySelector(".progress");
                const computedWidth = getComputedStyle(bar).width;
                bar.style.transition = "none";
                bar.style.width = computedWidth;

                pauseBtn.textContent = "▶"; // play icon
            } else {
                pauseBtn.textContent = "||";
                autoPlay();
            }
        });

        // DOT CLICK
        dots.forEach((dot, i) => {
            dot.addEventListener("click", () => {
                index = i;
                updateSlider();
                restart();
            });
        });

        updateSlider();
        autoPlay();
    }
});