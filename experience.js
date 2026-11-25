(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lenis;
  let syncModalScroll = () => {};

  const ARCHIVE_BOOKS = [
    {
      code: "V01",
      title: "활은 화살을 소유하지 않는다",
      subtitle: "내 불안을 건네지 않고, 온전한 타인으로 사랑하는 법",
      axis: "부모 내면 · 불안 분리",
      cover: "assets/covers/v01.jpg",
      scene: "옆집 아이 진도 소식을 듣고 갑자기 우리 집 계획을 뒤엎고 싶어지는 저녁.",
      quote: "“내가 지금 바꾼 계획은 아이를 위한 것인가, 내 불안을 잠재우기 위한 것인가?”",
      url: "https://blog.naver.com/geek86/224435521217"
    },
    {
      code: "V02",
      title: "고전이 아이의 세계를 넓힌다",
      subtitle: "고전 원서를 읽으며 자기 생각을 시작하는 시간",
      axis: "독서 · 고전 원서",
      cover: "assets/covers/v02.jpg",
      scene: "책을 덮자마자 ‘줄거리 말해봐’로 대화가 끝나거나, 쉬운 만화만 반복할 때.",
      quote: "“너라면 그 순간 그 인물 앞에서 무엇을 가장 먼저 봤을까?”",
      url: "https://blog.naver.com/geek86/224435516773"
    },
    {
      code: "V03",
      title: "아이의 의지력 탓이 아니었습니다",
      subtitle: "의지력에 기대지 않고 스스로 시작하게 만드는 일상",
      axis: "환경 · 무마찰 루틴",
      cover: "assets/covers/v03.jpg",
      scene: "책상 앞에 앉혀도 30분째 연필만 굴리고, 지친 날이면 루틴이 통째로 무너질 때.",
      quote: "“아이를 다그치기 전에, 시작 앞의 마찰 하나를 먼저 치웠는가?”",
      url: "https://blog.naver.com/geek86/224435515552"
    },
    {
      code: "V04",
      title: "세상의 값을 읽는 아이",
      subtitle: "용돈과 일상의 선택으로 만나는 진짜 자본주의",
      axis: "경제 · 용돈과 선택",
      cover: "assets/covers/v04.jpg",
      scene: "마트나 쇼핑몰에서 장난감을 두고 실랑이가 벌어지고, 용돈이 하루 만에 사라질 때.",
      quote: "“이걸 지금 사면, 네가 포기해야 하는 다른 선택은 무엇일까?”",
      url: "https://blog.naver.com/geek86/224435514289"
    },
    {
      code: "V05",
      title: "흙을 밟고 AI를 다루는 아이",
      subtitle: "AI 시대, 몸의 감각과 자연 속에서 지키는 생각의 힘",
      axis: "운동 · 자연 · AI",
      cover: "assets/covers/v05.jpg",
      scene: "화면을 끄면 몸을 쓸 자리가 없고, AI 시대에 아이가 무엇을 길러야 할지 막막할 때.",
      quote: "“답을 내는 기계 옆에서, 질문을 설계하는 인간의 몸과 감각을 어떻게 지킬까?”",
      url: "https://blog.naver.com/geek86/224435513101"
    },
    {
      code: "V06",
      title: "영어가 차오르는 시간",
      subtitle: "이해되는 이야기와 그림책으로 스며드는 영어",
      axis: "영어 · 이해 가능한 입력",
      cover: "assets/covers/v06.jpg",
      scene: "영어 학원 숙제 때문에 울거나, 영어책만 펴면 고개를 돌려버리는 저녁.",
      quote: "“테스트와 암기를 치우고, 아이가 85% 이해하는 재미있는 이야기를 깔아두었는가?”",
      url: "https://blog.naver.com/geek86/224435510782"
    },
    {
      code: "V07",
      title: "아직 증거가 없어도 나는 너를 믿는다",
      subtitle: "성적표 앞에서 흔들리지 않는 삶의 방향과 사명",
      axis: "사명 · 선제적 신뢰",
      cover: "assets/covers/v07.jpg",
      scene: "당장 눈에 보이는 결과가 늦어 자꾸 답을 대신 주고 점검 횟수를 늘리게 될 때.",
      quote: "“결과가 나오기 전에 건네는 부모의 신뢰가 어떻게 아이의 안전마진이 되는가?”",
      url: "https://blog.naver.com/geek86/224436049534"
    },
    {
      code: "V08",
      title: "누가 내 돈의 가치를 결정하는가",
      subtitle: "화폐의 역사에서 스스로 지키는 돈의 주권까지",
      axis: "심화 · 화폐의 역사",
      cover: "assets/covers/v08.jpg",
      scene: "장기적인 자산과 화폐의 본질을 부모부터 단단히 이해하고 싶을 때.",
      quote: "“시간이 지날수록 가치가 녹는 돈과, 스스로 주권을 지키는 자산의 차이는 무엇인가?”",
      url: "https://blog.naver.com/geek86/224437145341"
    },
    {
      code: "V09",
      title: "다정한 호구로 키우지 마라",
      subtitle: "관계의 경계와 거절의 언어를 세우는 현실 수업",
      axis: "관계 · 건강한 경계",
      cover: "assets/covers/v09.jpg",
      scene: "부당한 부탁을 거절하지 못하거나, 가족·친구 사이에서 경계가 무너져 다툴 때.",
      quote: "“다정함을 잃지 않으면서도 ‘아니오’와 가능한 대안을 한 문장으로 말할 수 있는가?”",
      url: "https://blog.naver.com/geek86/224447499375"
    },
    {
      code: "경제서 4장",
      title: "학원 세 곳을 끊지 못하는 저녁",
      subtitle: "매몰비용 오류와 손실회피의 비대칭성 (114쪽 경제서 발췌)",
      axis: "매몰비용 · 사교육 판단",
      cover: "assets/covers/wealth.jpg",
      scene: "지금까지 낸 학원비가 아깝고 끊으면 뒤처질까 봐, 아이가 지치는데도 결정을 미룰 때.",
      quote: "“이미 지나간 매몰비용을 지우고, 오늘 새로 지불할 돈과 아이의 에너지만 놓고 본다면?”",
      url: "#workbench-section"
    }
  ];

  const ENV_MODES = {
    before: [
      { tag: "01 · 공간", title: "손이 닿지 않는 책장", desc: "영어책과 원서는 높은 책장에 꽂혀 있고, 거실 한가운데에는 리모컨과 태블릿이 놓여 있습니다." },
      { tag: "02 · 시작 직전", title: "하교 직후 바로 책상", desc: "전두엽 배터리가 방전된 상태에서 곧바로 숙제와 문제집을 펴니 30분째 실랑이가 이어집니다." },
      { tag: "03 · 부모의 첫 말", title: "줄거리·단어 확인 질문", desc: "“오늘 몇 쪽 읽었어? 이 단어 무슨 뜻이야?” — 평가받는 순간 아이의 뇌는 방어 모드로 닫힙니다." },
      { tag: "04 · 지친 날", title: "완벽주의와 작심삼일", desc: "야근하거나 컨디션이 나쁜 날 하루 빠지면 ‘이번에도 망했다’며 죄책감과 함께 루틴이 끊깁니다." }
    ],
    after: [
      { tag: "01 · 공간", title: "시선 높이 1권 펼침 배치", desc: "소파 옆 낮은 테이블에 아이 수준(i+1)에 맞는 그림책·영어 동화 딱 한 권만 펼쳐두고, 미디어는 시야 밖으로 치웁니다." },
      { tag: "02 · 시작 직전", title: "5분 뇌 깨우기 몸풀기", desc: "책상 앞에 앉기 전 5분만 함께 걷거나 몸을 움직여 BDNF와 기분을 깨운 뒤 첫 줄만 폅니다." },
      { tag: "03 · 부모의 첫 말", title: "관점을 여는 식탁 질문 1개", desc: "“너라면 그 장면에서 어떤 선택을 했을까?” — 정답 없는 질문 한 마디가 아이의 사고를 엽니다." },
      { tag: "04 · 지친 날", title: "10분 폭풍우 비상 모드", desc: "도저히 힘든 날에는 3분 영어 오디오북 한 편만 틀고 성공으로 기록합니다. 흐름이 안 끊기니 복리가 쌓입니다." }
    ]
  };

  function isPlainClick(event) {
    return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
  }

  function goToSection(id, tabName) {
    const section = document.getElementById(id);
    if (!section) return;

    const tab = tabName && section.querySelector(`[role="tab"][data-tab="${tabName}"]`);
    if (tab && tab.getAttribute("aria-selected") !== "true") tab.click();

    const hash = "#" + section.id;
    if (window.location.hash !== hash) history.pushState(history.state, "", hash);

    const heading = id === "top" ? document.getElementById("hero-title") : section.querySelector("h2");
    const focusTarget = tab || heading || section;
    if (!tab && !focusTarget.hasAttribute("tabindex")) focusTarget.tabIndex = -1;
    focusTarget.focus({ preventScroll: true });

    if (lenis) {
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const margin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
      lenis.scrollTo(id === "top" ? 0 : section, { offset: -padding - margin });
    } else {
      section.scrollIntoView({ block: "start", behavior: reducedMotion.matches ? "instant" : "smooth" });
    }
  }

  function initGalleryNavigation() {
    document.addEventListener("click", (event) => {
      if (!isPlainClick(event)) return;
      const link = event.target.closest?.('.hero a[href^="#"], a[data-workbench-tab][href^="#"]');
      const id = link?.hash.slice(1);
      if (!id || !document.getElementById(id)) return;
      event.preventDefault();
      goToSection(id, link.dataset.workbenchTab);
    });
  }

  /* 1. Scroll Progress Bar */
  function initScrollProgress() {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;
    const page = document.scrollingElement || document.documentElement;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = page.scrollHeight - page.clientHeight;
      const progress = max > 0 ? (page.scrollTop / max) * 100 : 0;
      bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(document.body);
    update();
  }

  /* 2. Dual-Curve Interactive 1% Compounding SVG */
  function initCompoundSlider() {
    const slider = document.getElementById("compound-days");
    const daysLabel = document.getElementById("compound-days-label");
    const multEl = document.getElementById("compound-multiplier");
    const hoursEl = document.getElementById("compound-hours");
    const pathComp = document.getElementById("curve-compound");
    const pathArea = document.getElementById("curve-compound-area");
    const pathWill = document.getElementById("curve-willpower");
    const guide = document.getElementById("curve-guide");
    const dot = document.getElementById("curve-dot");
    if (!slider || !daysLabel || !multEl || !hoursEl) return;

    const x0 = 16, x1 = 504, yBase = 150, yTop = 20;
    const maxVal = Math.pow(1.01, 365);

    const dayToX = (days) => x0 + days / 365 * (x1 - x0);
    // Plot actual multipliers on a linear value axis so daily compounding stays curved.
    const valToY = (value) => yBase - (value - 1) / (maxVal - 1) * (yBase - yTop);

    if (pathWill) {
      let dWill = `M ${x0} ${yBase}`;
      for (let day = 5; day <= 365; day += 5) {
        const cycle = day % 30;
        const bump = cycle < 10 ? (cycle / 10) * 26 : Math.max(0, 26 - (cycle - 10) * 2.2);
        dWill += ` L ${dayToX(day).toFixed(1)} ${(yBase - bump).toFixed(1)}`;
      }
      pathWill.setAttribute("d", dWill);
    }

    const update = () => {
      const days = Number(slider.value);
      const months = (days / 30).toFixed(1).replace(/\.0$/, "");
      const mult = Math.pow(1.01, days);
      const hours = Math.round((days * 20) / 60);
      daysLabel.textContent = days >= 365 ? "365일 (1년)" : `${days}일 (약 ${months}개월)`;
      multEl.textContent = `${mult.toFixed(2)}×`;
      hoursEl.textContent = `${hours}시간`;

      if (pathComp && pathArea && guide && dot) {
        let dLine = `M ${x0} ${yBase}`;
        for (let day = 5; day < days; day += 5) {
          dLine += ` L ${dayToX(day).toFixed(1)} ${valToY(Math.pow(1.01, day)).toFixed(1)}`;
        }
        const endX = dayToX(days);
        const endY = valToY(mult);
        dLine += ` L ${endX.toFixed(1)} ${endY.toFixed(1)}`;
        pathComp.setAttribute("d", dLine);
        pathArea.setAttribute("d", `${dLine} L ${endX.toFixed(1)} ${yBase} L ${x0} ${yBase} Z`);
        guide.setAttribute("x1", endX.toFixed(1));
        guide.setAttribute("x2", endX.toFixed(1));
        guide.setAttribute("y1", endY.toFixed(1));
        dot.setAttribute("cx", endX.toFixed(1));
        dot.setAttribute("cy", endY.toFixed(1));
      }
    };

    slider.addEventListener("input", update);
    update();
  }

  /* 3. Interactive Before / After Living Room Switch */
  function initEnvSwitch() {
    const grid = document.getElementById("env-switch-grid");
    const buttons = [...document.querySelectorAll("[data-env-mode]")];
    if (!grid || !buttons.length) return;

    grid.setAttribute("role", "tabpanel");
    grid.tabIndex = 0;
    const render = (mode) => {
      const items = ENV_MODES[mode] || ENV_MODES.after;
      grid.innerHTML = items.map((item) => `
        <article class="env-card env-card--${mode}">
          <span class="env-card__tag">${item.tag}</span>
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
        </article>
      `).join("");
      buttons.forEach((button) => {
        const active = button.dataset.envMode === mode;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
        if (active) grid.setAttribute("aria-labelledby", button.id);
      });
    };

    buttons.forEach((button, index) => {
      if (!button.id) button.id = "env-tab-" + button.dataset.envMode;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", grid.id);
      button.addEventListener("click", () => render(button.dataset.envMode));
      button.addEventListener("keydown", (event) => {
        let target;
        if (event.key === "ArrowLeft") target = buttons[(index + buttons.length - 1) % buttons.length];
        if (event.key === "ArrowRight") target = buttons[(index + 1) % buttons.length];
        if (event.key === "Home") target = buttons[0];
        if (event.key === "End") target = buttons[buttons.length - 1];
        if (!target) return;
        event.preventDefault();
        render(target.dataset.envMode);
        target.focus();
      });
    });
    render(buttons.find((button) => button.getAttribute("aria-selected") === "true")?.dataset.envMode || "after");
  }

  /* 4. Real 10-Cover 3D Hardcover Bookshelf + Detail Modal */
  function initBookshelfAndModal() {
    const grid = document.getElementById("bookshelf-grid");
    const modal = document.getElementById("book-modal");
    if (!grid || !modal) return;

    grid.innerHTML = ARCHIVE_BOOKS.map((b, idx) => `
      <button type="button" class="book-3d" data-book-idx="${idx}" aria-haspopup="dialog" aria-label="${b.code} ${b.title} 상세 보기">
        <div class="book-3d__cover book-3d__cover--img">
          <img src="${b.cover}" alt="${b.title} 표지" loading="lazy">
          <span class="book-3d__badge">${b.code}</span>
        </div>
        <div class="book-3d__caption">
          <strong>${b.title}</strong>
          <span>${b.axis}</span>
        </div>
      </button>
    `).join("");

    const coverEl = document.getElementById("modal-book-cover");
    const codeEl = document.getElementById("modal-book-code");
    const titleEl = document.getElementById("modal-book-title");
    const subEl = document.getElementById("modal-book-sub");
    const sceneEl = document.getElementById("modal-book-scene");
    const quoteEl = document.getElementById("modal-book-quote");
    const linkEl = document.getElementById("modal-book-link");
    const jumpEl = document.getElementById("modal-book-jump");
    const closeButton = modal.querySelector("button[data-close-modal]");
    let opener;
    let previousOverflow;

    const closeModal = (restoreFocus = true) => {
      if (modal.hidden) return;
      modal.hidden = true;
      document.body.style.overflow = previousOverflow;
      syncModalScroll();
      if (restoreFocus && opener?.isConnected) opener.focus({ preventScroll: true });
    };

    const openModal = (book, button) => {
      coverEl.src = book.cover;
      coverEl.alt = `${book.title} 표지`;
      codeEl.textContent = `${book.code} · ${book.axis}`;
      titleEl.textContent = book.title;
      subEl.textContent = book.subtitle;
      sceneEl.textContent = book.scene;
      quoteEl.textContent = book.quote;
      if (book.url.startsWith("http")) {
        linkEl.href = book.url;
        linkEl.target = "_blank";
        linkEl.textContent = "네이버 목차 열기 ↗";
      } else {
        linkEl.href = book.url;
        linkEl.removeAttribute("target");
        linkEl.textContent = "사교육 매몰비용 점검하기 ↓";
      }
      opener = button;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      modal.hidden = false;
      syncModalScroll();
      closeButton?.focus({ preventScroll: true });
    };

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-book-idx]");
      if (!btn) return;
      openModal(ARCHIVE_BOOKS[Number(btn.dataset.bookIdx)], btn);
    });

    modal.querySelectorAll("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", () => closeModal());
    });
    linkEl.addEventListener("click", (event) => {
      if (linkEl.getAttribute("href") !== "#workbench-section" || !isPlainClick(event)) return;
      event.preventDefault();
      closeModal(false);
      goToSection("workbench-section", "diagnosis");
    });
    jumpEl.addEventListener("click", () => {
      closeModal(false);
      goToSection("workbench-section", "diagnosis");
    });
    document.addEventListener("keydown", (e) => {
      if (modal.hidden) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      }
      if (e.key !== "Tab") return;
      const first = closeButton || linkEl;
      const last = jumpEl;
      const focused = document.activeElement;
      if (!modal.contains(focused) || (e.shiftKey ? focused === first : focused === last)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    });
  }

  /* 5. English Storybook Native Read-Aloud (Web Speech API) */
  function initStoryAudio() {
    const btn = document.getElementById("story-speak-btn");
    const cardsEl = document.getElementById("story-preview-cards");
    if (!btn || !cardsEl) return;
    const synthesis = window.speechSynthesis;
    if (!synthesis || typeof window.SpeechSynthesisUtterance !== "function") {
      btn.disabled = true;
      btn.title = "이 브라우저에서는 영어 낭독을 지원하지 않습니다.";
      return;
    }

    const idleLabel = btn.textContent;
    let current;

    const setPlaying = (playing) => {
      btn.textContent = playing ? "⏹ 낭독 멈추기" : idleLabel;
      btn.setAttribute("aria-pressed", String(playing));
    };

    const stop = () => {
      if (!current) return;
      current = undefined;
      setPlaying(false);
      synthesis.cancel();
    };

    setPlaying(false);
    btn.addEventListener("click", () => {
      if (current) {
        stop();
        return;
      }
      const englishLines = Array.from(cardsEl.querySelectorAll('.story-card p[lang|="en"]'), (paragraph) => (
        paragraph.textContent.trim()
      )).filter(Boolean);
      if (!englishLines.length) return;

      const utter = new SpeechSynthesisUtterance(englishLines.join(" "));
      utter.lang = "en-US";
      utter.rate = 0.88;
      utter.onend = utter.onerror = () => {
        if (current !== utter) return;
        current = undefined;
        setPlaying(false);
      };
      current = utter;
      setPlaying(true);
      try {
        synthesis.speak(utter);
      } catch {
        stop();
      }
    });
    const panel = cardsEl.closest('[role="tabpanel"]');
    const content = cardsEl.closest("#story-output");
    const observer = new MutationObserver((records) => {
      if (panel?.hidden || content?.hidden || records.some((record) => record.target === cardsEl)) stop();
    });
    observer.observe(cardsEl, { childList: true });
    if (panel) observer.observe(panel, { attributes: true, attributeFilter: ["hidden"] });
    if (content) observer.observe(content, { attributes: true, attributeFilter: ["hidden"] });
    window.addEventListener("pagehide", stop);
  }

  /* 6. Subtle 3D Tilt */
  function initSubtleTilt() {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    function track(wrap, inner, isHero) {
      let frame = 0;
      let pointerX;
      let pointerY;
      const originalTransform = inner.style.transform;

      const reset = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        inner.style.transform = originalTransform;
      };

      const move = () => {
        frame = 0;
        const rect = wrap.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = Math.min(1, Math.max(0, (pointerX - rect.left) / rect.width)) - 0.5;
        const y = Math.min(1, Math.max(0, (pointerY - rect.top) / rect.height)) - 0.5;
        inner.style.transform = isHero
          ? `translate3d(${(x * -7).toFixed(2)}px, ${(y * -5).toFixed(2)}px, 0) scale(1.03)`
          : `rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-3px)`;
      };

      wrap.addEventListener("pointermove", (event) => {
        if (reducedMotion.matches || !finePointer.matches || event.pointerType !== "mouse") return;
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!frame) frame = requestAnimationFrame(move);
      }, { passive: true });
      wrap.addEventListener("pointerleave", reset);
      wrap.addEventListener("pointercancel", reset);
      reducedMotion.addEventListener("change", reset);
      finePointer.addEventListener("change", reset);
    }

    const backdrop = document.querySelector(".hero .hero__bg");
    if (backdrop) track(backdrop.closest(".hero"), backdrop, true);
    document.querySelectorAll("[data-tilt]").forEach((wrap) => {
      const inner = wrap.querySelector(".hero__frame, img");
      if (inner && inner !== backdrop) track(wrap, inner, false);
    });
  }

  function initSectionMotion() {
    if (!("IntersectionObserver" in window) || typeof Element.prototype.animate !== "function") return;
    const sections = document.querySelectorAll(
      "#system-section .system__top, #library-section .section-head, " +
      "#workbench-section .section-head, #manifesto-section .manifesto__top"
    );
    const easing = getComputedStyle(document.documentElement).getPropertyValue("--ease").trim() ||
      "cubic-bezier(0.23, 1, 0.32, 1)";
    const animations = new Set();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (reducedMotion.matches) continue;
        const animation = entry.target.animate([
          { transform: "translateY(10px)", opacity: 0.86 },
          { transform: "translateY(0)", opacity: 1 }
        ], { duration: 450, easing });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
        animation.oncancel = animation.onfinish;
      }
    }, { rootMargin: "0px 0px -32px 0px", threshold: 0.12 });
    sections.forEach((section) => observer.observe(section));
    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches) animations.forEach((animation) => animation.cancel());
    });
  }

  function initArtworkReveals() {
    if (!("IntersectionObserver" in window) || typeof Element.prototype.animate !== "function" ||
        !window.CSS?.supports?.("clip-path", "inset(0)")) return;

    const apertures = [
      { picture: document.querySelector(".system__art > img"), start: "inset(13% 0 0 0)", duration: 620 },
      ...Array.from(document.querySelectorAll(".editorial-band__frame"), (picture, index) => ({
        picture,
        start: index % 2 ? "inset(0 0 0 10%)" : "inset(0 12% 0 0)",
        duration: 680
      }))
    ];
    const pending = new Map();
    const seen = new WeakSet();
    const easing = getComputedStyle(document.documentElement).getPropertyValue("--ease").trim() ||
      "cubic-bezier(0.23, 1, 0.32, 1)";
    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        const animation = pending.get(target);
        if (!isIntersecting || !animation) continue;
        observer.unobserve(target);
        seen.add(target);
        animation.play();
      }
    }, { threshold: 0.10, rootMargin: "0px 0px -16px" });

    function updatePreference() {
      for (const animation of pending.values()) animation.cancel();
      pending.clear();
      observer.disconnect();
      if (reducedMotion.matches) return;

      for (const { picture, start, duration } of apertures) {
        if (!picture || seen.has(picture)) continue;
        const { top, bottom } = picture.getBoundingClientRect();
        if (top < innerHeight && bottom > 0) {
          seen.add(picture);
          continue;
        }
        const animation = picture.animate([
          { clipPath: start },
          { clipPath: "inset(0 0 0 0)" }
        ], { duration, easing, fill: "both" });
        animation.pause();
        animation.currentTime = 0;
        animation.onfinish = () => {
          pending.delete(picture);
          animation.cancel();
        };
        pending.set(picture, animation);
        observer.observe(picture);
      }
    }

    reducedMotion.addEventListener("change", updatePreference);
    updatePreference();
  }

  function initPointerDetail() {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const ctaSelector = ".hero .hero__links > a";
    const bookSelector = "#bookshelf-grid .book-3d";
    const surfaces = new WeakMap();
    const moving = new Set();
    let active;
    let pointer;
    let frame = 0;
    let lastTime = 0;

    document.querySelectorAll(ctaSelector).forEach((button) => {
      const label = document.createElement("span");
      label.dataset.motionLabel = "";
      label.append(...button.childNodes);
      button.append(label);
      surfaces.set(button, {
        node: button, layer: label, book: false,
        x: 0, y: 0, targetX: 0, targetY: 0, alpha: 0, targetAlpha: 0
      });
    });

    function getSurface(node) {
      if (surfaces.has(node)) return surfaces.get(node);
      const cover = node.querySelector(".book-3d__cover");
      if (!cover) return;

      const mask = document.createElement("span");
      const light = document.createElement("span");
      mask.dataset.motionGlint = "";
      light.dataset.motionLight = "";
      mask.setAttribute("aria-hidden", "true");
      mask.append(light);
      cover.append(mask);
      const surface = {
        node, layer: light, book: true,
        x: 50, y: 50, targetX: 50, targetY: 50, alpha: 0, targetAlpha: 0
      };
      surfaces.set(node, surface);
      return surface;
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    function update(now) {
      frame = 0;
      const elapsed = lastTime ? Math.min(now - lastTime, 32) : 16;
      lastTime = now;

      if (active && pointer) {
        active.bounds ||= active.node.getBoundingClientRect();
        const { left, top, width, height } = active.bounds;
        const x = width ? Math.max(0, Math.min(1, (pointer.x - left) / width)) : 0.5;
        const y = height ? Math.max(0, Math.min(1, (pointer.y - top) / height)) : 0.5;
        active.targetX = active.book ? x * 100 : (x - 0.5) * 8;
        active.targetY = active.book ? y * 100 : (y - 0.5) * 6;
        if (active.book) {
          active.targetAlpha = 1;
          if (!active.alpha) {
            active.x = active.targetX;
            active.y = active.targetY;
          }
        }
      }

      for (const surface of moving) {
        const blend = 1 - Math.exp(-elapsed / (surface === active ? 43 : 53));
        surface.x += (surface.targetX - surface.x) * blend;
        surface.y += (surface.targetY - surface.y) * blend;
        surface.alpha += (surface.targetAlpha - surface.alpha) * blend;
        const settled = Math.abs(surface.x - surface.targetX) < 0.08 &&
          Math.abs(surface.y - surface.targetY) < 0.08 && Math.abs(surface.alpha - surface.targetAlpha) < 0.02;
        if (settled) {
          surface.x = surface.targetX;
          surface.y = surface.targetY;
          surface.alpha = surface.targetAlpha;
        }
        const unit = surface.book ? "%" : "px";
        if (surface !== active && settled) {
          surface.layer.style.removeProperty("transform");
          surface.layer.style.removeProperty("opacity");
          moving.delete(surface);
        } else {
          surface.layer.style.transform = `translate3d(${surface.x.toFixed(2)}${unit}, ${surface.y.toFixed(2)}${unit}, 0)`;
          if (surface.book) surface.layer.style.opacity = surface.alpha.toFixed(3);
        }
        if (!settled) schedule();
      }
      if (!frame) lastTime = 0;
    }

    function release() {
      if (!active) return;
      if (active.book) active.targetAlpha = 0;
      else active.targetX = active.targetY = 0;
      active.bounds = null;
      active = undefined;
      pointer = undefined;
      schedule();
    }

    function reset() {
      cancelAnimationFrame(frame);
      frame = lastTime = 0;
      for (const surface of moving) {
        surface.layer.style.removeProperty("transform");
        surface.layer.style.removeProperty("opacity");
        surface.x = surface.y = 0;
        surface.alpha = surface.targetAlpha = 0;
        surface.bounds = null;
      }
      moving.clear();
      active = pointer = undefined;
    }

    document.addEventListener("pointermove", (event) => {
      if (reducedMotion.matches || !finePointer.matches || event.pointerType !== "mouse") return;
      const node = event.target.closest?.(ctaSelector + ", " + bookSelector);
      if (active?.node !== node) {
        release();
        if (!node) return;
        active = getSurface(node);
        if (!active) return;
        moving.add(active);
      }
      if (!active) return;
      pointer = { x: event.clientX, y: event.clientY };
      schedule();
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", release);
    document.addEventListener("pointercancel", release);
    window.addEventListener("scroll", release, { passive: true });
    window.addEventListener("resize", release);
    window.addEventListener("blur", reset);
    finePointer.addEventListener("change", reset);
    reducedMotion.addEventListener("change", reset);
  }

  function connectLenis(gsap, ScrollTrigger) {
    if (typeof window.Lenis !== "function") return;
    const controller = new window.Lenis({
      lerp: 0.085,
      smoothWheel: true,
      autoRaf: false,
      prevent: (node) => node.matches?.("pre, textarea") && node.scrollHeight > node.clientHeight
    });
    lenis = controller;

    const tick = (seconds) => controller.raf(seconds * 1000);
    const modal = document.getElementById("book-modal");
    const card = modal?.querySelector(".book-modal__card");
    const hadPreventAttribute = card?.hasAttribute("data-lenis-prevent");
    card?.setAttribute("data-lenis-prevent", "");

    syncModalScroll = () => {
      if (!modal) return;
      if (!modal.hidden && !controller.isStopped) controller.stop();
      if (modal.hidden && controller.isStopped) controller.start();
    };
    const observer = new MutationObserver(syncModalScroll);
    if (modal) observer.observe(modal, { attributes: true, attributeFilter: ["hidden"] });
    syncModalScroll();

    function releaseForResult(event) {
      if (controller.isScrolling !== "smooth" ||
          !event.target.matches?.("#diag-result, #story-output, #coach-demo-output")) return;
      // app.js follows result focus with native scrollIntoView.
      controller.stop();
      controller.start();
    }
    document.addEventListener("focusin", releaseForResult);
    controller.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", releaseForResult);
      if (!hadPreventAttribute) card?.removeAttribute("data-lenis-prevent");
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      controller.off("scroll", ScrollTrigger.update);
      controller.destroy();
      lenis = undefined;
      syncModalScroll = () => {};
    };
  }

  function scrubHero(gsap) {
    const hero = document.querySelector(".hero");
    const media = hero?.querySelector(".hero-media__layer");
    if (!media) return;

    const scene = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        id: "hero-scroll",
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 0.8
      }
    });
    scene.fromTo(media, { scale: 1, yPercent: 0, transformOrigin: "42% 54%" }, {
      scale: 1.065,
      yPercent: 2.5,
      duration: 1
    }, 0);
    for (const [selector, start, rise] of [
      [".hero__masthead", 0.08, 9],
      [".hero__placard", 0.18, 20]
    ]) {
      const text = hero.querySelector(selector);
      if (text) {
        scene.fromTo(text, { opacity: 1, y: 0 }, {
          opacity: 0.14,
          y: -rise,
          duration: 1 - start
        }, start);
      }
    }
  }

  function scrubStory(story, gsap) {
    const stage = story?.querySelector(".scroll-story__stage");
    const panel = story?.querySelector(".scroll-story__panel");
    const beats = Array.from(story?.querySelectorAll(".story-beat[data-beat]") || []);
    const visuals = Array.from(story?.querySelectorAll(".story-visual[data-beat]") || []);
    if (!stage || !panel || beats.length !== 3 || visuals.length !== 3) return;

    const images = visuals.map((visual) => visual.querySelector("img"));
    const subtitles = beats.map((beat) => beat.querySelector(".story-beat__sub"));
    const layers = [story, panel, ...beats, ...visuals, ...images, ...subtitles].filter(Boolean);
    const originals = layers.map((layer) => layer.getAttribute("style"));
    const firstColor = gsap.utils.interpolate("#EFECE3", "#53655B");
    const lastColor = gsap.utils.interpolate("#53655B", "#132123");
    const ease = gsap.parseEase("sine.inOut");
    const firstCut = 0.33;
    const secondCut = 0.66;
    const phase = (progress, start, end) => ease(Math.min(1, Math.max(0, (progress - start) / (end - start))));
    const written = new WeakMap();
    const write = (node, property, value) => {
      if (!node) return;
      if (!written.has(node)) written.set(node, {});
      const values = written.get(node);
      if (values[property] === value) return;
      values[property] = value;
      node.style.setProperty(property, value);
    };
    let activeBeat = -1;
    let progressBefore = -1;

    function activate(index) {
      story.dataset.activeBeat = String(index);
      for (const group of [beats, visuals]) {
        group.forEach((layer, beat) => {
          layer.classList.toggle("is-active", beat === index);
          layer.setAttribute("aria-hidden", String(beat !== index));
          if (group === beats) layer.toggleAttribute("inert", beat !== index);
        });
      }
    }

    function paint(progress) {
      if (progressBefore === progress) return;
      progressBefore = progress;
      const index = progress < firstCut ? 0 : progress < secondCut ? 1 : 2;
      if (activeBeat !== index) {
        activeBeat = index;
        activate(index);
      }

      // Picture, tone and copy have separate beats so the cut has room to settle.
      const imageIn = (cut) => phase(progress, cut - 0.088, cut + 0.060);
      const toneIn = (cut) => phase(progress, cut - 0.060, cut + 0.044);
      const copyOut = (cut) => phase(progress, cut - 0.066, cut + 0.004);
      const copyIn = (cut) => phase(progress, cut + 0.001, cut + 0.075);
      const detailIn = (cut) => phase(progress, cut + 0.019, cut + 0.103);
      const pictureSecond = imageIn(firstCut);
      const pictureThird = imageIn(secondCut);
      const intoSage = toneIn(firstCut);
      const intoForest = toneIn(secondCut);
      const dark = intoSage >= 0.79;
      write(story, "--story-progress", String(progress));
      write(story, "--story-join", String(phase(progress, 0.84, 1)));
      write(panel, "--s-bg", intoForest ? lastColor(intoForest) : firstColor(intoSage));
      write(panel, "--s-sub", dark ? "#F2EFE6" : "#132123");
      write(panel, "--s-meta", dark ? "#DFC684" : "#263830");
      write(panel, "--s-line", dark ? "#A0AA9D" : "#67776C");

      const leaveFirst = copyOut(firstCut);
      const leaveSecond = copyOut(secondCut);
      const enterSecond = copyIn(firstCut);
      const enterThird = copyIn(secondCut);
      const copyOpacity = [1 - leaveFirst, enterSecond * (1 - leaveSecond), enterThird];
      const copyY = [-leaveFirst * 10, (1 - enterSecond - leaveSecond) * 12, (1 - enterThird) * 12];
      const details = [1, detailIn(firstCut), detailIn(secondCut)];
      const imageOpacity = [pictureSecond < 1 ? 1 : 0, pictureThird < 1 ? pictureSecond : 0, pictureThird];
      const zoom = [
        phase(progress, 0, 0.32),
        phase(progress, firstCut - 0.076, secondCut - 0.027),
        phase(progress, secondCut - 0.076, 0.97)
      ];

      beats.forEach((beat, i) => {
        write(beat, "opacity", copyOpacity[i].toFixed(4));
        write(beat, "transform", `translateY(${copyY[i].toFixed(2)}px)`);
        write(subtitles[i], "opacity", details[i].toFixed(4));
        write(subtitles[i], "transform", `translateY(${((1 - details[i]) * 5).toFixed(2)}px)`);
      });
      visuals.forEach((visual, i) => {
        const drift = (i === 1 ? -0.65 : 0.65) * (1 - zoom[i]);
        write(visual, "opacity", imageOpacity[i].toFixed(4));
        write(images[i], "transform", `translate3d(${drift.toFixed(3)}%, 0, 0) scale(${(1.038 - 0.038 * zoom[i]).toFixed(4)})`);
      });
    }

    story.dataset.scrollMode = "scrub";
    // Keep each headline on its own paper/ink pairing through the dissolve.
    beats.forEach((beat, index) => {
      beat.style.setProperty("--s-ink", index === 0 ? "#132123" : "#F7F4EC");
      beat.style.setProperty("--s-sub", index === 0 ? "#18282A" : "#F2EFE6");
      beat.style.setProperty("--s-meta", index === 0 ? "#3E4A43" : "#DFC684");
    });
    // Stack the incoming image above the outgoing one so the picture never dims through to the panel.
    visuals.forEach((visual, index) => { visual.style.zIndex = index + 1; });
    paint(0);
    const state = { progress: 0 };
    const needsPin = getComputedStyle(stage).position !== "sticky";
    gsap.to(state, {
      progress: 1,
      ease: "none",
      duration: 1,
      onUpdate: () => paint(state.progress),
      scrollTrigger: {
        id: "living-room-story",
        trigger: story,
        start: "top top",
        end: () => "+=" + Math.max(1, story.offsetHeight - stage.offsetHeight),
        scrub: true,
        pin: needsPin && stage,
        pinSpacing: false,
        onRefresh: (trigger) => paint(trigger.progress)
      }
    });

    return () => {
      activate(0);
      [...beats, ...visuals].forEach((layer) => layer.removeAttribute("aria-hidden"));
      beats.forEach((beat) => beat.removeAttribute("inert"));
      layers.forEach((layer, index) => {
        if (originals[index] === null) layer.removeAttribute("style");
        else layer.setAttribute("style", originals[index]);
      });
    };
  }

  function drawCompoundOnScroll(gsap) {
    const svg = document.getElementById("compound-svg");
    const paths = svg?.querySelectorAll("#curve-compound, #curve-compound-area, #curve-willpower");
    if (!paths?.length) return;

    const { x, y, width, height } = svg.viewBox.baseVal;
    const namespace = "http://www.w3.org/2000/svg";
    const clip = document.createElementNS(namespace, "clipPath");
    const rect = document.createElementNS(namespace, "rect");
    clip.id = "compound-scroll-clip";
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("height", height);
    rect.setAttribute("width", 0);
    clip.append(rect);
    (svg.querySelector("defs") || svg).append(clip);
    const attributes = Array.from(paths, (path) => path.getAttribute("clip-path"));
    paths.forEach((path) => path.setAttribute("clip-path", "url(#" + clip.id + ")"));

    let interacted = false;
    function draw(progress) {
      rect.setAttribute("width", String(width * (interacted ? 1 : progress)));
    }
    const slider = document.getElementById("compound-days");
    function showFullGraph() {
      interacted = true;
      draw(1);
    }
    slider?.addEventListener("input", showFullGraph, { once: true });

    const state = { progress: 0 };
    gsap.to(state, {
      progress: 1,
      ease: "none",
      duration: 1,
      onUpdate: () => draw(state.progress),
      scrollTrigger: {
        id: "compound-draw",
        trigger: svg,
        start: "top 96%",
        end: "bottom 58%",
        scrub: true,
        onRefresh: (trigger) => draw(trigger.progress)
      }
    });
    return () => {
      slider?.removeEventListener("input", showFullGraph);
      paths.forEach((path, index) => {
        if (attributes[index] === null) path.removeAttribute("clip-path");
        else path.setAttribute("clip-path", attributes[index]);
      });
      clip.remove();
    };
  }

  function scrubBooks(gsap) {
    const grid = document.getElementById("bookshelf-grid");
    const books = grid?.querySelectorAll(".book-3d");
    if (!books?.length) return;

    gsap.fromTo(books, {
      transformPerspective: 1000,
      rotationY: (index) => index % 2 ? 25 : -25,
      rotationX: 10,
      y: 44,
      scale: 0.94,
      opacity: 0.30
    }, {
      rotationY: 0,
      rotationX: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 0.42,
      stagger: 0.075,
      ease: "power3.out",
      scrollTrigger: {
        id: "archive-stagger",
        trigger: grid,
        start: "top 92%",
        end: "bottom 62%",
        scrub: 0.55
      }
    });
  }

  function scrubEditorial(gsap) {
    document.querySelectorAll(".editorial-band__frame").forEach((frame, index) => {
      const photo = frame.querySelector("img");
      if (!photo) return;

      const offset = index % 2 ? 1.5 : 2;
      gsap.fromTo(photo, { yPercent: -offset, scale: 1.05 }, {
        yPercent: offset,
        scale: 1.05,
        ease: "none",
        scrollTrigger: {
          id: "editorial-photo-" + (index + 1),
          trigger: frame,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.7
        }
      });
    });
  }

  function initScrollEffects() {
    const story = document.getElementById("scroll-story");
    const { gsap, ScrollTrigger } = window;
    if (!gsap || !ScrollTrigger) {
      if (story) story.dataset.scrollMode = "static";
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    let teardown;

    function applyPreference() {
      teardown?.();
      teardown = undefined;
      if (story) story.dataset.scrollMode = "static";
      if (reducedMotion.matches) return;

      let resetStory, resetGraph;
      const context = gsap.context(() => {
        scrubHero(gsap);
        resetStory = scrubStory(story, gsap);
        resetGraph = drawCompoundOnScroll(gsap);
        scrubBooks(gsap);
        scrubEditorial(gsap);
      });
      const disconnectLenis = connectLenis(gsap, ScrollTrigger);
      ScrollTrigger.refresh();
      teardown = () => {
        context.revert();
        resetStory?.();
        resetGraph?.();
        disconnectLenis?.();
      };
    }

    reducedMotion.addEventListener("change", applyPreference);
    applyPreference();
  }

  function installScrollStyles() {
    const style = document.createElement("style");
    style.textContent = `
      html.lenis.lenis-smooth { scroll-behavior: auto !important; }
      html.lenis.lenis-stopped { overflow: clip; }
      .lenis [data-lenis-prevent] { overscroll-behavior: contain; }
      .book-3d:focus-visible { opacity: 1 !important; }
      [data-motion-label] { display: inline-flex; align-items: center; pointer-events: none; }
      [data-motion-glint] {
        position: absolute; inset: 0; overflow: hidden; border-radius: inherit;
        pointer-events: none; z-index: 2;
      }
      [data-motion-light] {
        position: absolute; inset: -50% auto auto -50%; width: 100%; height: 100%;
        opacity: 0; pointer-events: none;
        background: radial-gradient(ellipse at center, rgba(255, 238, 199, .41),
          rgba(226, 180, 95, .16) 33%, transparent 68%);
      }
      @media (prefers-reduced-motion: reduce) {
        [data-motion-label] { transform: none !important; }
        [data-motion-glint] { display: none; }
      }

      #scroll-story[data-scroll-mode="scrub"] .scroll-story__stage { padding-bottom: 0; }
      #scroll-story[data-scroll-mode="scrub"] .scroll-story__panel {
        border-bottom-left-radius: calc(var(--r-xl, 22px) * (1 - var(--story-join, 0)));
        border-bottom-right-radius: calc(var(--r-xl, 22px) * (1 - var(--story-join, 0)));
      }
      #scroll-story[data-scroll-mode="scrub"] :is(
        .scroll-story__panel, .scroll-story__meta, .story-beat, .story-beat__num,
        .story-beat__title, .story-beat__sub, .story-visual, .story-visual img, .story-progress,
        .story-progress__bar
      ) { transition: none; }
      #scroll-story[data-scroll-mode="scrub"] :is(.story-beat, .story-visual) { filter: none; }
      #scroll-story[data-scroll-mode="scrub"] .story-visual { transform: none; }
      #scroll-story[data-scroll-mode="scrub"] .story-progress__bar { transform: scaleX(var(--story-progress)); }
      #scroll-story[data-scroll-mode="scrub"] + #system-section {
        margin-top: 0;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        background-color: #132123;
      }

      #scroll-story[data-scroll-mode="static"] { height: auto; }
      #scroll-story[data-scroll-mode="static"] .scroll-story__stage { position: static; height: auto; }
      #scroll-story[data-scroll-mode="static"] .scroll-story__panel { height: auto; }
      #scroll-story[data-scroll-mode="static"] .scroll-story__grid {
        grid-template-rows: none;
        align-items: center;
        padding-bottom: clamp(1.8rem, 4.5vw, 4.5rem);
      }
      #scroll-story[data-scroll-mode="static"] :is(.scroll-story__copy, .story-beats, .scroll-story__visuals) {
        display: contents;
      }
      #scroll-story[data-scroll-mode="static"] .scroll-story__meta { order: -1; grid-column: 1 / -1; margin: 0; }
      #scroll-story[data-scroll-mode="static"] :is(.story-beat, .story-visual) {
        grid-area: auto; opacity: 1; transform: none; filter: none; pointer-events: auto; transition: none;
      }
      #scroll-story[data-scroll-mode="static"] [data-beat="1"] { order: 1; }
      #scroll-story[data-scroll-mode="static"] [data-beat="2"] { order: 2; }
      #scroll-story[data-scroll-mode="static"] .story-visual { aspect-ratio: 16 / 9; }
      #scroll-story[data-scroll-mode="static"] .story-visual img { transform: none; transition: none; }
      #scroll-story[data-scroll-mode="static"] .story-progress { display: none; }
    `;
    document.head.append(style);
  }

  function boot() {
    initGalleryNavigation();
    initScrollProgress();
    initCompoundSlider();
    initEnvSwitch();
    initBookshelfAndModal();
    initStoryAudio();
    initSubtleTilt();
    initScrollEffects();
    initSectionMotion();
    initArtworkReveals();
    initPointerDetail();
  }

  installScrollStyles();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
