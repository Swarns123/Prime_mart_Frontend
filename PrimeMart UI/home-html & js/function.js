const themeToggle = document.querySelector(".theme-toggle");

function setTheme(theme) {
    document.body.dataset.theme = theme;
    localStorage.setItem("primeMartTheme", theme);

    if (themeToggle) {
        themeToggle.textContent = "";
        themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
    }
}

setTheme(localStorage.getItem("primeMartTheme") || document.body.dataset.theme || "light");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        setTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
    });
}

const testimonialCarousel = document.querySelector(".testimonial-carousel");
const testimonialTrack = document.querySelector(".testimonial-track");
const testimonialSlides = Array.from(document.querySelectorAll(".testimonial"));
const testimonialPrev = document.querySelector(".carousel-prev");
const testimonialNext = document.querySelector(".carousel-next");
const testimonialDots = document.querySelector(".carousel-dots");

if (testimonialCarousel && testimonialTrack && testimonialSlides.length > 0 && testimonialPrev && testimonialNext && testimonialDots) {
    let activeTestimonial = 0;
    let carouselTimer;

    testimonialSlides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
        dot.addEventListener("click", () => {
            showTestimonial(index);
            restartCarousel();
        });
        testimonialDots.appendChild(dot);
    });

    const dots = Array.from(testimonialDots.querySelectorAll("button"));

    function showTestimonial(index) {
        activeTestimonial = (index + testimonialSlides.length) % testimonialSlides.length;
        testimonialTrack.style.transform = `translateX(-${activeTestimonial * 100}%)`;

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("active", dotIndex === activeTestimonial);
            dot.setAttribute("aria-current", dotIndex === activeTestimonial ? "true" : "false");
        });
    }

    function nextTestimonial() {
        showTestimonial(activeTestimonial + 1);
    }

    function startCarousel() {
        carouselTimer = window.setInterval(nextTestimonial, 4200);
    }

    function stopCarousel() {
        window.clearInterval(carouselTimer);
    }

    function restartCarousel() {
        stopCarousel();
        startCarousel();
    }

    testimonialPrev.addEventListener("click", () => {
        showTestimonial(activeTestimonial - 1);
        restartCarousel();
    });

    testimonialNext.addEventListener("click", () => {
        nextTestimonial();
        restartCarousel();
    });

    testimonialCarousel.addEventListener("mouseenter", stopCarousel);
    testimonialCarousel.addEventListener("mouseleave", startCarousel);
    testimonialCarousel.addEventListener("focusin", stopCarousel);
    testimonialCarousel.addEventListener("focusout", startCarousel);

    showTestimonial(0);
    startCarousel();
}
