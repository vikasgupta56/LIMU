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

    // ====================== SECURITY ================================

    const sec = document.querySelector(".security");

    if (sec) {
        const track = sec.querySelector(".track");
        const cards = sec.querySelectorAll(".card");
        const next = sec.querySelector(".next");
        const prev = sec.querySelector(".prev");
        const fill = sec.querySelector(".fill");

        let index = 0;
        let interval;

        function updateSlider() {
            const gap = 20;
            const width = cards[0].offsetWidth + gap;

            track.style.transform = `translateX(-${index * width}px)`;

            const progress = (index / (cards.length - 1)) * 100;
            fill.style.width = progress + "%";
        }

        // 🔥 AUTO SLIDE
        function startAuto() {
            interval = setInterval(() => {
                index = (index + 1) % cards.length; // LOOP 🔁
                updateSlider();
            }, 3000); // 3s (change to 5000 if needed)
        }

        function stopAuto() {
            clearInterval(interval);
        }

        startAuto();

        // ✅ NEXT BUTTON
        next.addEventListener("click", () => {
            index = (index + 1) % cards.length; // loop
            updateSlider();

            stopAuto();
            startAuto();
        });

        // ✅ PREV BUTTON
        prev.addEventListener("click", () => {
            index = (index - 1 + cards.length) % cards.length; // loop reverse
            updateSlider();

            stopAuto();
            startAuto();
        });

        // 🔥 HOVER PAUSE (premium feel)
        sec.addEventListener("mouseenter", stopAuto);
        sec.addEventListener("mouseleave", startAuto);
    }


    // ====================== MEDIA ================================


    const media = document.querySelector(".media");

    if (media) {
        const track = media.querySelector(".track");
        const cards = media.querySelectorAll(".card");
        const next = media.querySelector(".next");
        const prev = media.querySelector(".prev");
        const fill = media.querySelector(".fill");

        let index = 0;
        let interval;

        function updateSlider() {
            const gap = 20;
            const width = cards[0].offsetWidth + gap;

            track.style.transform = `translateX(-${index * width}px)`;

            const progress = (index / (cards.length - 1)) * 100;
            fill.style.width = progress + "%";
        }

        function startAuto() {
            interval = setInterval(() => {
                index = (index + 1) % cards.length;
                updateSlider();
            }, 4000);
        }

        function stopAuto() {
            clearInterval(interval);
        }

        startAuto();

        next.addEventListener("click", () => {
            index = (index + 1) % cards.length;
            updateSlider();
            stopAuto();
            startAuto();
        });

        prev.addEventListener("click", () => {
            index = (index - 1 + cards.length) % cards.length;
            updateSlider();
            stopAuto();
            startAuto();
        });

        // swipe
        let startX = 0;

        track.addEventListener("touchstart", e => {
            startX = e.touches[0].clientX;
            stopAuto();
        });

        track.addEventListener("touchend", e => {
            let diff = e.changedTouches[0].clientX - startX;

            if (diff > 50) index--;
            else if (diff < -50) index++;

            index = (index + cards.length) % cards.length;

            updateSlider();
            startAuto();
        });

        // hover pause
        media.addEventListener("mouseenter", stopAuto);
        media.addEventListener("mouseleave", startAuto);
    }






    const section = document.querySelector(".summaries");

    if (section) {
        const items = section.querySelectorAll(".item");
        const img = section.querySelectorAll(".img");

        let index = 0;
        const duration = 4000;

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

            // 🔥 force reflow (important)
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
            showSlide(index);

            setTimeout(() => {
                index = (index + 1) % items.length;
                autoPlay();
            }, duration);
        }

        autoPlay();
    }

  const mobile_summaries = document.querySelector(".mobile-summaries");

if (mobile_summaries) {
    const track = mobile_summaries.querySelector(".track");
    const cards = mobile_summaries.querySelectorAll(".card");
    const next = mobile_summaries.querySelector(".next");
    const prev = mobile_summaries.querySelector(".prev");
    const dotsWrap = mobile_summaries.querySelector(".dots");

    let index = 0;
    const duration = 4000;
    let interval;

    // 🔥 CREATE DOTS (with inner progress)
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
        startProgress();

        interval = setTimeout(() => {
            index = (index + 1) % cards.length;
            updateSlider();
            autoPlay();
        }, duration);
    }

    function restart() {
        clearTimeout(interval);
        autoPlay();
    }

    // buttons
    next.onclick = () => {
        index = (index + 1) % cards.length;
        updateSlider();
        restart();
    };

    prev.onclick = () => {
        index = (index - 1 + cards.length) % cards.length;
        updateSlider();
        restart();
    };

    // dot click
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