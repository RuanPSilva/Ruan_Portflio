/* =========================================================
   main.js — comportamento compartilhado do portfólio
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initTypewriter();
  initHeroScrollFade();
  initRippleEffect();
  initBackToTop();
});

/* ---------- Menu mobile ---------- */
function initMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Fecha o menu ao clicar em um link (útil em navegação por âncora)
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Efeito de máquina de escrever alternando cargos ----------
   Digita cada texto, aguarda ~5s, apaga e digita o próximo, em loop.  */
function initTypewriter() {
  const el = document.querySelector("[data-typewriter]");
  if (!el) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const words = JSON.parse(el.dataset.typewriter);
  const holdTime = 3000; // tempo que o texto completo fica parado na tela
  const typeSpeed = 65;
  const eraseSpeed = 35;

  if (prefersReduced) {
    el.textContent = words[0];
    return;
  }

  const textNode = document.createElement("span");
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");
  el.append(textNode, cursor);

  let wordIndex = 0;

  function typeWord(word, callback) {
    let i = 0;
    (function step() {
      textNode.textContent = word.slice(0, i);
      i++;
      if (i <= word.length) {
        setTimeout(step, typeSpeed);
      } else {
        callback();
      }
    })();
  }

  function eraseWord(word, callback) {
    let i = word.length;
    (function step() {
      textNode.textContent = word.slice(0, i);
      i--;
      if (i >= 0) {
        setTimeout(step, eraseSpeed);
      } else {
        callback();
      }
    })();
  }

  function cycle() {
    const word = words[wordIndex];
    typeWord(word, () => {
      setTimeout(() => {
        eraseWord(word, () => {
          wordIndex = (wordIndex + 1) % words.length;
          cycle();
        });
      }, holdTime);
    });
  }

  cycle();
}

/* ---------- Fundo do hero se desfaz ao rolar a página ---------- */
function initHeroScrollFade() {
  const bg = document.querySelector(".hero-bg");
  const hero = document.querySelector(".hero");
  if (!bg || !hero) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  let ticking = false;

  function updateFade() {
    const heroHeight = hero.offsetHeight;
    const scrollY = window.scrollY;
    const progress = Math.min(scrollY / heroHeight, 1);

    bg.style.opacity = String(1 - progress);
    bg.style.transform = `scale(${1 + progress * 0.15})`;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateFade);
      ticking = true;
    }
  });

  updateFade();
}

/* ---------- Efeito visual de clique (ripple) em cards/links ---------- */
function initRippleEffect() {
  const elements = document.querySelectorAll(".ripple-el");

  elements.forEach((element) => {
    element.addEventListener("click", (event) => {
      const rect = element.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);

      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

      element.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
}

/* ---------- Botão voltar ao topo ---------- */
function initBackToTop() {
  const button = document.querySelector(".back-top");
  if (!button) return;

  window.addEventListener("scroll", () => {
    button.classList.toggle("visible", window.scrollY > 480);
  });

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// =========================================================
// EFEITO DE LUZ LARANJA SEGUINDO O CURSOR
// =========================================================

const cursorGlow = document.querySelector(".cursor-glow");

// Atualiza a posição da luz conforme o mouse se movimenta
document.addEventListener("mousemove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;

    // Mostra a luz quando o mouse está dentro da página
    cursorGlow.style.opacity = "1";
});

// Esconde a luz quando o mouse sai da página
document.addEventListener("mouseleave", () => {
    cursorGlow.style.opacity = "0";
});