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
        let touchStartX = 0;

        track.addEventListener("touchstart", (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener("touchend", (e) => {
            const diff = e.changedTouches[0].clientX - touchStartX;

            if (diff < -50 && workIndex < getMaxIndex()) {
                workIndex++;
            }
            else if (diff > 50 && workIndex > 0) {
                workIndex--;
            }

            updateSlider();
        });

        // ── helpers ───────────────────────────────────────────────────

        function getCardWidth() {
            const ref = Array.from(cards).find(c => !c.classList.contains("active")) || cards[0];
            const gap = parseInt(getComputedStyle(track).gap) || 30;
            return ref.offsetWidth + gap;
        }

        function getMaxIndex() {
            const cw = getCardWidth();
            const containerW = track.parentElement.offsetWidth;
            const visibleCards = Math.max(1, Math.floor(containerW / cw));
            return Math.max(0, cards.length - visibleCards);
        }

        // max px the track can be shifted — last card's right edge to container right edge
        function getMaxPx() {
            const last = cards[cards.length - 1];
            const gap = 40;

            return Math.max(
                0,
                (last.offsetLeft + last.offsetWidth + gap) - track.parentElement.offsetWidth
            );
        }

        // read current live translateX (works mid-transition too)
        function getCurrentTranslate() {
            const t = getComputedStyle(track).transform;
            if (!t || t === "none") return 0;
            return -new DOMMatrix(t).m41;
        }

        // write clamped translateX, return the clamped value
        function applyTranslate(px) {
            const clamped = Math.min(Math.max(px, 0), getMaxPx());
            track.style.transform = `translateX(-${clamped}px)`;
            return clamped;
        }

        function syncFill(tx) {
            if (!fill) return;
            const maxPx = getMaxPx();
            fill.style.width = (maxPx > 0 ? Math.min(tx / maxPx, 1) * 100 : 0) + "%";
        }

        // ── index-based update (next / prev / resize / close) ─────────
        function updateSlider() {
            if (!cards.length || !track) return;
            workIndex = Math.min(Math.max(workIndex, 0), getMaxIndex());
            const tx = applyTranslate(workIndex * getCardWidth());
            syncFill(tx);
        }

        // ── bring expanded card fully into view ───────────────────────
        // Called AFTER the CSS transition ends (520 ms) so getBoundingClientRect
        // returns the card's final expanded size, not its mid-animation size.
        function bringIntoView(card) {
            const cRect = track.parentElement.getBoundingClientRect();
            const kRect = card.getBoundingClientRect();
            const curr = getCurrentTranslate();

            const gap = parseInt(getComputedStyle(track).gap) || 30; // 🔥 ADD

            let target = curr;

            // 👉 RIGHT SIDE (spacing add)
            if (kRect.right > cRect.right - gap) {
                target += kRect.right - (cRect.right - gap);
            }

            // 👉 LEFT SIDE (spacing add)
            if (kRect.left < cRect.left + gap) {
                target -= (cRect.left + gap) - kRect.left;
            }

            const tx = applyTranslate(target);
            syncFill(tx);

            // sync index
            let best = 0, bestDist = Infinity;
            cards.forEach((c, i) => {
                const d = Math.abs(c.offsetLeft - tx);
                if (d < bestDist) { bestDist = d; best = i; }
            });
            workIndex = Math.min(best, getMaxIndex());
        }

        // ── next / prev ───────────────────────────────────────────────
        nextBtn?.addEventListener("click", () => {
            if (workIndex < getMaxIndex()) { workIndex++; updateSlider(); }
        });

        prevBtn?.addEventListener("click", () => {
            if (workIndex > 0) { workIndex--; updateSlider(); }
        });

        // ── expand / close ────────────────────────────────────────────
        const T = 520; // CSS transition duration (0.5s) + 20ms buffer

        cards.forEach(card => {
            card.querySelector(".expand")?.addEventListener("click", () => {
                cards.forEach(c => c.classList.remove("active"));
                card.classList.add("active");
                // wait for expand transition to finish, then shift into view
                setTimeout(() => bringIntoView(card), T);
            });

            card.querySelector(".close")?.addEventListener("click", () => {
                card.classList.remove("active");
                // wait for collapse transition to finish, then snap to index
                setTimeout(updateSlider, T);
            });
        });

        // ── resize ────────────────────────────────────────────────────
        let rTimer;
        window.addEventListener("resize", () => {
            clearTimeout(rTimer);
            rTimer = setTimeout(updateSlider, 120);
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

    // ================= SECURITY SLIDER =================
    const sec = document.querySelector(".security");

    if (sec) {
        const track = sec.querySelector(".track");
        const cards = sec.querySelectorAll(".card");
        const nextBtn = sec.querySelector(".next");
        const prevBtn = sec.querySelector(".prev");
        const fill = sec.querySelector(".fill");

        let secIndex = 0;
        let autoTimer = null;
        let touchStartX = 0;

        // ── helpers ─────────────────────────────────────

        function getGap() {
            return parseInt(getComputedStyle(track).gap) || 20;
        }

        function getCardWidth() {
            return cards[0].offsetWidth + getGap();
        }

        function getMaxPx() {
            const last = cards[cards.length - 1];
            return Math.max(
                0,
                (last.offsetLeft + last.offsetWidth) - track.parentElement.offsetWidth
            );
        }

        // 🔥 FIXED maxIndex (cardWidth based)
        function getMaxIndex() {
            const cardWidth = getCardWidth();
            const maxPx = getMaxPx();
            return Math.ceil(maxPx / cardWidth);
        }

        function applyTranslate(px) {
            const clamped = Math.min(Math.max(px, 0), getMaxPx());
            track.style.transform = `translateX(-${clamped}px)`;
            return clamped;
        }

        function syncFill(tx) {
            if (!fill) return;
            const maxPx = getMaxPx();
            fill.style.width = (maxPx > 0 ? (tx / maxPx) * 100 : 0) + "%";
        }

        // ── main update ─────────────────────────────────

        function updateSlider() {
            if (!cards.length || !track) return;

            secIndex = Math.min(Math.max(secIndex, 0), getMaxIndex());

            const cardWidth = getCardWidth();
            let target = secIndex * cardWidth;

            // 🔥 no blank space
            if (target > getMaxPx()) {
                target = getMaxPx();
            }

            const tx = applyTranslate(target);
            syncFill(tx);
        }

        // ── autoplay ───────────────────────────────────

        function startAuto() {
            stopAuto();
            autoTimer = setTimeout(function tick() {
                secIndex = secIndex >= getMaxIndex() ? 0 : secIndex + 1;
                updateSlider();
                autoTimer = setTimeout(tick, 4000);
            }, 4000);
        }

        function stopAuto() {
            clearTimeout(autoTimer);
            autoTimer = null;
        }

        startAuto();

        // ── buttons ────────────────────────────────────

        nextBtn?.addEventListener("click", () => {
            secIndex = secIndex >= getMaxIndex() ? 0 : secIndex + 1;
            updateSlider();
            startAuto();
        });

        prevBtn?.addEventListener("click", () => {
            secIndex = secIndex <= 0 ? getMaxIndex() : secIndex - 1;
            updateSlider();
            startAuto();
        });

        // ── swipe ─────────────────────────────────────

        track.addEventListener("touchstart", e => {
            touchStartX = e.touches[0].clientX;
            stopAuto();
        }, { passive: true });

        track.addEventListener("touchend", e => {
            const diff = e.changedTouches[0].clientX - touchStartX;

            if (diff < -50) {
                secIndex = secIndex >= getMaxIndex() ? 0 : secIndex + 1;
            } else if (diff > 50) {
                secIndex = secIndex <= 0 ? getMaxIndex() : secIndex - 1;
            }

            updateSlider();
            startAuto();
        });

        // ── hover pause ───────────────────────────────

        sec.addEventListener("mouseenter", stopAuto);
        sec.addEventListener("mouseleave", startAuto);

        // ── resize fix ────────────────────────────────

        let rTimer;
        window.addEventListener("resize", () => {
            clearTimeout(rTimer);
            rTimer = setTimeout(updateSlider, 120);
        });

        // init
        updateSlider();
    }


    // ====================== MEDIA ================================


    const media = document.querySelector(".media");

    if (media) {
        const track = media.querySelector(".track");
        const cards = media.querySelectorAll(".card");
        const nextBtn = media.querySelector(".next");
        const prevBtn = media.querySelector(".prev");
        const fill = media.querySelector(".fill");

        let secIndex = 0;
        let autoTimer = null;
        let touchStartX = 0;

        // ── helpers ─────────────────────────────────────

        function getGap() {
            return parseInt(getComputedStyle(track).gap) || 20;
        }

        function getCardWidth() {
            return cards[0].offsetWidth + getGap();
        }

        function getMaxPx() {
            const last = cards[cards.length - 1];
            return Math.max(
                0,
                (last.offsetLeft + last.offsetWidth) - track.parentElement.offsetWidth
            );
        }

        // 🔥 FIXED maxIndex (cardWidth based)
        function getMaxIndex() {
            const cardWidth = getCardWidth();
            const maxPx = getMaxPx();
            return Math.ceil(maxPx / cardWidth);
        }

        function applyTranslate(px) {
            const clamped = Math.min(Math.max(px, 0), getMaxPx());
            track.style.transform = `translateX(-${clamped}px)`;
            return clamped;
        }

        function syncFill(tx) {
            if (!fill) return;
            const maxPx = getMaxPx();
            fill.style.width = (maxPx > 0 ? (tx / maxPx) * 100 : 0) + "%";
        }

        // ── main update ─────────────────────────────────

        function updateSlider() {
            if (!cards.length || !track) return;

            secIndex = Math.min(Math.max(secIndex, 0), getMaxIndex());

            const cardWidth = getCardWidth();
            let target = secIndex * cardWidth;

            // 🔥 no blank space
            if (target > getMaxPx()) {
                target = getMaxPx();
            }

            const tx = applyTranslate(target);
            syncFill(tx);
        }

        // ── autoplay ───────────────────────────────────

        function startAuto() {
            stopAuto();
            autoTimer = setTimeout(function tick() {
                secIndex = secIndex >= getMaxIndex() ? 0 : secIndex + 1;
                updateSlider();
                autoTimer = setTimeout(tick, 4000);
            }, 4000);
        }

        function stopAuto() {
            clearTimeout(autoTimer);
            autoTimer = null;
        }

        startAuto();

        // ── buttons ────────────────────────────────────

        nextBtn?.addEventListener("click", () => {
            secIndex = secIndex >= getMaxIndex() ? 0 : secIndex + 1;
            updateSlider();
            startAuto();
        });

        prevBtn?.addEventListener("click", () => {
            secIndex = secIndex <= 0 ? getMaxIndex() : secIndex - 1;
            updateSlider();
            startAuto();
        });

        // ── swipe ─────────────────────────────────────

        track.addEventListener("touchstart", e => {
            touchStartX = e.touches[0].clientX;
            stopAuto();
        }, { passive: true });

        track.addEventListener("touchend", e => {
            const diff = e.changedTouches[0].clientX - touchStartX;

            if (diff < -50) {
                secIndex = secIndex >= getMaxIndex() ? 0 : secIndex + 1;
            } else if (diff > 50) {
                secIndex = secIndex <= 0 ? getMaxIndex() : secIndex - 1;
            }

            updateSlider();
            startAuto();
        });

        // ── hover pause ───────────────────────────────

        media.addEventListener("mouseenter", stopAuto);
        media.addEventListener("mouseleave", startAuto);

        // ── resize fix ────────────────────────────────

        let rTimer;
        window.addEventListener("resize", () => {
            clearTimeout(rTimer);
            rTimer = setTimeout(updateSlider, 120);
        });

        // init
        updateSlider();
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