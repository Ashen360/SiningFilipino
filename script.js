// Slideshow Functions
function updateHeaderStyle() {
  const header = document.querySelector(".header");
  const slideshow = document.querySelector(".slideshow-container");
  const slideshowHeight = slideshow.offsetHeight;
  const scrollPosition = window.scrollY;

  if (scrollPosition > slideshowHeight - header.offsetHeight) {
    header.classList.add("scrolled");
    setHeaderTextColor("dark");
  } else {
    header.classList.remove("scrolled");
    const activeSlide = document.querySelector(".slide.active");
    const textColor = activeSlide?.dataset?.textColor || "dark";
    setHeaderTextColor(textColor);
  }
}

function setHeaderTextColor(color) {
  const header = document.querySelector(".header");
  header.classList.remove("light-text", "dark-text");
  if (color === "light" || color === "dark") {
    header.classList.add(`${color}-text`);
  }
}

function startSlideshow() {
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  function nextSlide() {
    // Remove active class from current slide
    slides[currentSlide].classList.remove("active");

    // Update current slide index
    currentSlide = (currentSlide + 1) % slides.length;

    // Add active class to new slide
    slides[currentSlide].classList.add("active");

    // Update header text color if in slideshow view
    if (
      window.scrollY <=
      document.querySelector(".slideshow-container").offsetHeight
    ) {
      const textColor = slides[currentSlide].dataset.textColor || "dark";
      setHeaderTextColor(textColor);
    }
  }

  // Set longer interval to give more time to read
  setInterval(nextSlide, 7000);

  // Ensure first slide is visible on load
  slides[0].classList.add("active");
}

// Scroll Animations
const artists = document.querySelectorAll(".artist");
const periodIntros = document.querySelectorAll(".period-intro");
let activeArtists = [...artists];
let activeIntros = [...periodIntros];

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.top <= window.innerHeight * 0.9 && rect.bottom >= 0; // Adjusted viewport threshold
}

function handleScroll() {
  requestAnimationFrame(() => {
    updateHeaderStyle();

    activeIntros.forEach((intro) => {
      if (isInViewport(intro)) {
        intro.classList.add("visible");
      }
    });

    activeArtists.forEach((artist) => {
      if (isInViewport(artist)) {
        artist.classList.add("visible");
        animateArtistContent(artist);
      }
    });
  });
}

function handleParallax() {
  const scrolled = window.pageYOffset;
  activeArtists.forEach((artist) => {
    const speed = 0.05;
    const yPos = -(scrolled * speed);
    artist.style.transform = `translateY(${yPos}px)`;
  });
}

function animateArtistContent(artist) {
  const elements = artist.querySelectorAll(
    ".artist-year, .artist-name, .artist-movement, .artist-desc"
  );
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, index * 100);
  });
}

// Filter by Period
function filterArtists(period) {
  document.querySelector(".timeline").dataset.activePeriod = period;

  if (period === "all") {
    periodIntros.forEach((intro) => {
      intro.style.display = "block";
      intro.classList.remove("visible");
    });
    artists.forEach((artist) => {
      artist.style.display = "flex";
      artist.classList.remove("visible");
    });
    activeIntros = [...periodIntros];
    activeArtists = [...artists];
  } else {
    periodIntros.forEach((intro) => {
      intro.style.display = intro.dataset.period === period ? "block" : "none";
      intro.classList.remove("visible");
    });
    artists.forEach((artist) => {
      artist.style.display = artist.dataset.period === period ? "flex" : "none";
      artist.classList.remove("visible");
    });
    activeIntros = [
      ...document.querySelectorAll(`.period-intro[data-period="${period}"]`),
    ];
    activeArtists = [
      ...document.querySelectorAll(`.artist[data-period="${period}"]`),
    ];
  }

  updateNavbarColor(period);
  setTimeout(handleScroll, 100);
}

function updateNavbarColor(period) {
  const root = document.documentElement;
  const colors = {
    indigenous: ["#553A1D", "#3A2812"],
    modern: ["#2B3F55", "#1A2A3B"],
    contemporary: ["#333333", "#000000"],
    default: ["#333333", "#000000"],
  };

  const [textColor, hoverColor] = colors[period] || colors.default;
  root.style.setProperty("--navbar-text-color", textColor);
  root.style.setProperty("--navbar-text-hover-color", hoverColor);
}

// Modal Handling
function openModal(src, caption) {
  const modalImage = document.getElementById("modal-image");
  const modalCaption = document.getElementById("modal-caption");

  modalImage.src = src;
  modalCaption.textContent = caption;
  document.getElementById("modal").classList.add("open");

  // Ensure modal image is loaded
  modalImage.onload = () => {
    modalImage.style.opacity = "1";
  };
}

function closeModal() {
  document.getElementById("modal").classList.remove("open");
}

function initializeModal() {
  const modal = document.getElementById("modal");
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Dropdown Behavior
function initializeDropdown() {
  const dropdown = document.querySelector(".dropdown");
  let timeoutId;

  dropdown.addEventListener("mouseenter", () => {
    clearTimeout(timeoutId);
    dropdown.classList.add("active");
  });

  dropdown.addEventListener("mouseleave", () => {
    timeoutId = setTimeout(() => {
      dropdown.classList.remove("active");
    }, 200);
  });
}

// Smooth Scroll
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleScrollToTopButton() {
  const scrollToTopButton = document.getElementById("scrollToTop");
  if (window.scrollY > 300) {
    scrollToTopButton.classList.add("visible");
  } else {
    scrollToTopButton.classList.remove("visible");
  }
}

// Progress Bar
function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  document.getElementById("progressBar").style.width = `${progress}%`;
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  startSlideshow();
  initializeDropdown();
  updateHeaderStyle();
  handleScroll();
  initializeModal();
  initializeLazyLoading();

  // Add scroll listener
  window.addEventListener("scroll", () => {
    requestAnimationFrame(handleScroll);
  });

  // Initialize timeline period
  document.querySelector(".timeline").dataset.activePeriod = "all";
});

// Add scroll listener for the button
window.addEventListener("scroll", handleScrollToTopButton);
window.addEventListener("scroll", updateProgressBar);

// Lazy Loading Images
function initializeLazyLoading() {
  const lazyImages = document.querySelectorAll("img.lazy");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add("loaded");
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: "50px 0px",
      }
    );

    lazyImages.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
      img.classList.add("loaded");
    });
  }
}
