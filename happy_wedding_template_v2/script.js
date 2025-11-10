// ===== Smooth scroll cho các link có data-scroll =====
document.querySelectorAll("[data-scroll]").forEach((el) => {
  el.addEventListener("click", (e) => {
    const targetSelector =
      el.getAttribute("href") || el.getAttribute("data-scroll");
    if (!targetSelector || !targetSelector.startsWith("#")) return;

    const target = document.querySelector(targetSelector);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ===== Hero background slideshow: fade + zoom, desktop nhân 3 ảnh =====
(function heroSlideshow() {
  const hero = document.querySelector(".hero");
  const heroBg = document.querySelector(".hero-bg");
  if (!hero || !heroBg) return;

  // Danh sách ảnh của bạn trong thư mục images/
  const images = [
    "images/anh cuoi 1.jpg",
    "images/anh cuoi 2.jpg",
    "images/anh cuoi 3.jpg",
    "images/anh cuoi 4.jpg"
  ];

  let currentIndex = 0;

  function applyBackground() {
    const img = images[currentIndex % images.length];
    const isMobile = window.innerWidth <= 768;

    // set ảnh
    heroBg.style.backgroundImage = `url("${img}")`;

    if (isMobile) {
      // MOBILE: 1 ảnh, cover
      heroBg.style.backgroundRepeat = "no-repeat";
      heroBg.style.backgroundSize = "cover";
      heroBg.style.backgroundPosition = "center center";
    } else {
      // DESKTOP: nhân 3 ngang (repeat-x)
      heroBg.style.backgroundRepeat = "repeat-x";
      heroBg.style.backgroundSize = "auto 100%";
      heroBg.style.backgroundPosition = "center center";
    }

    // kích hoạt fade + zoom
    // remove / add class để transition chạy lại
    heroBg.classList.remove("is-visible");
    // force reflow nhỏ để browser nhận thay đổi
    void heroBg.offsetWidth;
    heroBg.classList.add("is-visible");
  }

  function nextImage() {
    // fade out nhẹ rồi đổi ảnh
    heroBg.classList.remove("is-visible");
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % images.length;
      applyBackground();
    }, 900); // khớp với transition opacity 1.2s (fade out ~0.9s)
  }

  // Ảnh đầu tiên
  applyBackground();

  // tự đổi ảnh sau mỗi 6 giây
  setInterval(nextImage, 6000);

  // khi resize giữa mobile/desktop thì cập nhật lại repeat/size
  window.addEventListener("resize", applyBackground);
})();

// ===== Countdown đến ngày cưới =====
(function setupCountdown() {
  const weddingDate = new Date("2025-11-22T16:00:00+07:00").getTime();

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function updateCountdown() {
    const now = Date.now();
    const diff = weddingDate - now;

    if (diff <= 0) {
      daysEl.textContent = "0";
      hoursEl.textContent = "0";
      minutesEl.textContent = "0";
      secondsEl.textContent = "0";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
    const minutes = Math.floor((totalSeconds / 60) % 60);
    const seconds = Math.floor(totalSeconds % 60);

    daysEl.textContent = String(days);
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// ===== Modal Hộp mừng cưới =====
(function giftModal() {
  const modal = document.getElementById("gift-modal");
  const openBtn = document.getElementById("open-gift");
  const fabGiftBtn = document.getElementById("fab-open-gift");
  const closeBtn = document.getElementById("close-gift");

  if (!modal || !closeBtn) return;

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (fabGiftBtn) fabGiftBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-backdrop")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
})();

// ===== Form Sổ lưu bút (demo, không lưu DB) =====
(function guestbookForm() {
  const form = document.getElementById("guestbook-form");
  const list = document.getElementById("guestbook-list");
  const scrollBox = document.querySelector(".guestbook-messages");
  if (!form || !list) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const message = (fd.get("message") || "").toString().trim();
    if (!name || !message) return;

    const li = document.createElement("li");
    li.innerHTML = `<strong>${name}</strong><br>${message}`;

    // Queue: lời chúc mới nằm cuối danh sách
    list.append(li);

    // Auto scroll xuống cuối để thấy lời chúc mới
    if (scrollBox) {
      scrollBox.scrollTop = scrollBox.scrollHeight;
    }

    form.reset();
  });
})();

// ===== Form RSVP (demo: chỉ alert) =====
(function rsvpForm() {
  const form = document.getElementById("rsvp-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get("fullname") || "").toString().trim();
    const attend = fd.get("attend") || "";

    let msg = "Cảm ơn bạn đã gửi xác nhận tham dự!";
    if (attend === "yes") {
      msg = `Cảm ơn ${name || "bạn"} đã xác nhận tham dự. Hẹn gặp bạn trong ngày vui của chúng mình!`;
    } else if (attend === "no") {
      msg = `Cảm ơn ${name || "bạn"} đã phản hồi. Dù không tham dự được, mình vẫn rất trân trọng lời chúc của bạn!`;
    }

    alert(msg);
    form.reset();
  });
})();

// ===== Ẩn cụm nút tròn bên phải =====
(function floatingButtons() {
  const container = document.querySelector(".fab-container");
  const hideBtn = document.getElementById("fab-hide");
  if (!container || !hideBtn) return;

  hideBtn.addEventListener("click", () => {
    container.classList.add("is-hidden");
  });
})();

// ===== Couple story: click để mở/đóng info trên mobile =====
(function coupleStoryToggle() {
  const panels = document.querySelectorAll(".story-panel");
  if (!panels.length) return;

  const MOBILE_MAX = 600;

  panels.forEach((panel) => {
    panel.addEventListener("click", () => {
      // Chỉ xử lý khi đang ở mobile
      if (window.innerWidth > MOBILE_MAX) return;

      const isOpen = panel.classList.contains("is-open");

      // Đóng tất cả panel trước
      panels.forEach((p) => p.classList.remove("is-open"));

      // Nếu panel đang đóng thì mở, còn đang mở thì để đóng
      if (!isOpen) {
        panel.classList.add("is-open");
      }
    });
  });

  // Khi phóng to lại > mobile thì bỏ hết .is-open cho sạch
  window.addEventListener("resize", () => {
    if (window.innerWidth > MOBILE_MAX) {
      panels.forEach((p) => p.classList.remove("is-open"));
    }
  });
})();
