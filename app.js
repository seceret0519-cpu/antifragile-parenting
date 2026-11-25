(() => {
  "use strict";

  function init() {
    const data = window.ParentingData;
    const byId = (id) => document.getElementById(id);
    const won = new Intl.NumberFormat("ko-KR");
    let toastTimer;

    function makeElement(tag, className, content) {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (content !== undefined) element.textContent = content;
      return element;
    }

    function showToast(message) {
      const toast = byId("toast");
      clearTimeout(toastTimer);
      toast.textContent = message;
      toast.hidden = false;
      toast.classList.add("show");
      toastTimer = window.setTimeout(() => {
        toast.classList.remove("show");
        toast.hidden = true;
      }, 2000);
    }

    async function copyText(value, notify = true) {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const previousFocus = document.activeElement;
        const buffer = makeElement("textarea");
        buffer.value = value;
        buffer.readOnly = true;
        buffer.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
        document.body.append(buffer);
        buffer.select();
        buffer.setSelectionRange(0, value.length);
        let copied;
        try {
          copied = document.execCommand("copy");
        } catch {
          copied = false;
        } finally {
          buffer.remove();
          previousFocus?.focus({ preventScroll: true });
        }
        if (!copied) {
          if (notify) showToast("복사하지 못했어요. 잠시 후 다시 시도해 주세요.");
          return false;
        }
      }
      if (notify) showToast("클립보드에 복사했어요.");
      return true;
    }

    function setActive(button, active) {
      button.classList.toggle("active", active);
      button.classList.toggle("is-active", active);
      const state = button.getAttribute("role") === "tab" || button.hasAttribute("aria-selected")
        ? "aria-selected"
        : "aria-pressed";
      button.setAttribute(state, String(active));
    }

    const tabs = [...document.querySelectorAll("[data-tab]")].filter(
      (tab) => byId("panel-" + tab.dataset.tab)
    );
    const tabBar = tabs[0]?.closest("nav");
    function openTab(selected) {
      for (const tab of tabs) {
        const active = tab === selected;
        const panel = byId("panel-" + tab.dataset.tab);
        setActive(tab, active);
        tab.tabIndex = active ? 0 : -1;
        panel.hidden = !active;
        panel.classList.toggle("active", active);
      }
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => openTab(tab));
      tab.addEventListener("keydown", (event) => {
        const targets = {
          ArrowLeft: (index - 1 + tabs.length) % tabs.length,
          ArrowRight: (index + 1) % tabs.length,
          Home: 0,
          End: tabs.length - 1
        };
        if (!Object.hasOwn(targets, event.key)) return;
        const target = tabs[targets[event.key]];
        event.preventDefault();
        openTab(target);
        target.focus();
      });
    });
    function tabFromHash() {
      const name = window.location.hash.slice(1);
      return tabs.find((tab) => tab.dataset.tab === name);
    }

    const initialTab = tabFromHash() || tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0];
    if (initialTab) openTab(initialTab);
    window.addEventListener("hashchange", () => {
      const requestedTab = tabFromHash();
      if (requestedTab) openTab(requestedTab);
    });

    function onAction(button, handler, allowSubmit = true) {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        handler();
      });
      if (allowSubmit && button.form) {
        button.form.addEventListener("submit", (event) => {
          if (event.submitter && event.submitter !== button) return;
          event.preventDefault();
          handler();
        });
      }
    }

    function reveal(section) {
      section.hidden = false;
      if (!section.hasAttribute("tabindex")) section.tabIndex = -1;
      section.style.scrollMarginTop = ((tabBar?.offsetHeight || 0) + 16) + "px";
      section.focus({ preventScroll: true });
      section.scrollIntoView({ block: "start" });
    }

    function getOpenChatUrl(value) {
      if (!value) return null;
      try {
        const url = new URL(value);
        if (
          !url.username &&
          !url.password &&
          ((url.origin === "https://open.kakao.com" && /^\/o\/[\w-]+\/?$/.test(url.pathname)) ||
            (url.origin === "https://invite.kakao.com" && /^\/tc\/[\w-]+\/?$/.test(url.pathname)))
        ) return url.href;
      } catch {
        return null;
      }
      return null;
    }

    function bindInlineCopy(button, value, success, failure) {
      const originalLabel = button.textContent;
      let resetLabel;
      onAction(button, async () => {
        if (button.hasAttribute("aria-busy")) return;
        button.setAttribute("aria-busy", "true");
        clearTimeout(resetLabel);
        try {
          const copied = await copyText(value, false);
          button.textContent = copied ? success : failure;
          resetLabel = window.setTimeout(() => {
            button.textContent = originalLabel;
          }, 2500);
        } finally {
          button.removeAttribute("aria-busy");
        }
      }, false);
    }

    function initResultBridges() {
      const { openChatUrl, openChatName, shareMessages } = data.community;
      const roomUrl = getOpenChatUrl(openChatUrl);

      for (const bridge of document.querySelectorAll("[data-result-bridge]")) {
        const tab = bridge.dataset.resultBridge;
        const shareButton = bridge.querySelector(".result-bridge__action[data-share-result]");
        if (shareButton && Object.hasOwn(shareMessages, tab)) {
          const shareUrl = new URL(window.location.href);
          shareUrl.search = "";
          shareUrl.hash = tab;
          bindInlineCopy(
            shareButton,
            shareMessages[tab] + "\n\n" + shareUrl.href,
            "복사되었습니다 · 편한 대화창에 붙여 넣으세요",
            "복사하지 못했습니다 · 잠시 후 다시 시도하세요"
          );
        }

        const roomButton = bridge.querySelector(".result-bridge__action[data-copy-openchat]");
        if (!roomButton) continue;
        if (roomUrl) {
          const label = "무소음 서재 ‘" + openChatName + "’ 입장하기";
          const link = makeElement("a", roomButton.className, label + " ↗");
          link.href = roomUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.setAttribute("aria-label", label + " (새 탭)");
          roomButton.replaceWith(link);
        } else {
          bindInlineCopy(
            roomButton,
            openChatName,
            "방 이름이 복사되었습니다 · 오픈채팅에서 검색하세요",
            "복사하지 못했습니다 · 방 이름을 직접 검색하세요"
          );
        }
      }
    }

    initResultBridges();

    const promptById = new Map(data.prompts.map((prompt) => [prompt.id, prompt]));

    const scenesList = byId("diag-scenes-list");
    const diagnosisResult = byId("diag-result");
    const grade = byId("diag-grade");
    const costs = ["english", "reading", "other"].map((axis) => byId("diag-cost-" + axis));
    const initialGrade = grade.value;
    const initialCosts = costs.map((field) => field.value);
    const bookLink = byId("res-book-link");
    const bookLinkLabel = bookLink.textContent;
    let diagnosisPrompt = "";

    const sceneCards = data.diagnosisScenes.map((scene) => {
      const label = makeElement("label", "choice scene-option");
      const radio = makeElement("input", "scene-radio");
      radio.type = "radio";
      radio.name = "diagnosis-scene";
      radio.value = scene.id;
      label.append(radio, makeElement("span", "choice__text", scene.label));
      return label;
    });
    scenesList.replaceChildren(...sceneCards);

    scenesList.addEventListener("change", () => {
      for (const card of sceneCards) {
        const radio = card.firstElementChild;
        radio.setCustomValidity("");
        card.classList.toggle("active", radio.checked);
        card.classList.toggle("is-active", radio.checked);
      }
    });

    function renderDiagnosis() {
      if (!grade.reportValidity()) return;
      if (!grade.value) {
        showToast("아이의 학년을 골라 주세요.");
        grade.focus();
        return;
      }
      for (const field of costs) {
        if (!field.reportValidity()) return;
        if (field.value !== "" && (!Number.isFinite(field.valueAsNumber) || field.valueAsNumber < 0)) {
          showToast("월 사교육비는 0 이상의 숫자로 적어 주세요.");
          field.focus();
          return;
        }
      }
      const selection = scenesList.querySelector("input:checked");
      if (!selection) {
        const firstScene = sceneCards[0].firstElementChild;
        firstScene.setCustomValidity("가장 자주 반복되는 장면을 하나 골라 주세요.");
        firstScene.reportValidity();
        return;
      }

      const scene = data.diagnosisScenes.find((entry) => entry.id === selection.value);
      const book = data.books[scene.book];
      const prompt = promptById.get(scene.prompt);
      // The form accepts 만원 and the results display 원.
      const monthly = costs.reduce((total, field) => total + (field.valueAsNumber || 0), 0) * 10_000;
      const gradeLabel = grade.selectedOptions[0].textContent.trim();
      diagnosisPrompt = scene.book === "economy-ch4"
        ? prompt.body.replace("[예: 초3]", gradeLabel)
        : "참고할 아이 학년: " + gradeLabel + "\n\n" + prompt.body;

      byId("res-scene").textContent = scene.label;
      byId("res-cost-monthly").textContent = won.format(monthly) + "원";
      byId("res-cost-5yr").textContent = won.format(monthly * 60) + "원";
      byId("res-cost-10yr").textContent = won.format(monthly * 120) + "원";
      byId("res-condition").textContent = scene.condition;
      byId("res-book-title").textContent = book.title;
      byId("res-book-sub").textContent = book.subtitle;
      bookLink.href = book.url;
      bookLink.textContent = book.linkLabel || bookLinkLabel;
      byId("res-prompt-title").textContent = prompt.title;
      byId("res-prompt-body").textContent = diagnosisPrompt;
      reveal(diagnosisResult);
    }

    onAction(byId("diag-submit"), renderDiagnosis);
    onAction(byId("res-copy-prompt"), () => {
      if (diagnosisPrompt) copyText(diagnosisPrompt);
    }, false);
    onAction(byId("res-reset"), () => {
      diagnosisPrompt = "";
      grade.value = initialGrade;
      costs.forEach((field, index) => {
        field.value = initialCosts[index];
      });
      for (const card of sceneCards) {
        const radio = card.firstElementChild;
        radio.checked = false;
        radio.setCustomValidity("");
        card.classList.remove("active", "is-active");
      }
      diagnosisResult.hidden = true;
      grade.focus();
    }, false);

    const storyName = byId("story-name");
    const storyAge = byId("story-age");
    const storyLevel = byId("story-level");
    const storyImagination = byId("story-imagination");
    const storyTheme = byId("story-theme");
    const storyOutput = byId("story-output");
    storyAge.required = true;
    let storyPrompt = "";

    function renderStory() {
      for (const field of [storyName, storyAge, storyLevel, storyImagination, storyTheme]) {
        if (!field.reportValidity()) return;
      }
      const name = storyName.value.trim();
      const age = storyAge.value.trim();
      const imagination = storyImagination.value.trim();
      const theme = storyTheme.value.trim() || "신나는 모험";
      const levelNumber = storyLevel.value.match(/[1-4]/)?.[0];
      const level = data.storyLevels[levelNumber];
      const missingField = [[storyName, name], [storyAge, age], [storyLevel, level], [storyImagination, imagination]]
        .find(([, value]) => !value);
      if (missingField) {
        showToast("아이 이름, 나이, 영어 단계, 상상을 모두 적어 주세요.");
        missingField[0].focus();
        return;
      }

      const backcover = "이 동화는 " + name + "의 상상으로 만들어졌습니다 — 안티프래질 페어런팅";
      storyPrompt = data.storyTemplate + "\n\n" + [
        "[우리 아이 동화에 사용할 정보]",
        "- 아이 이름(별명): " + name,
        "- 나이: " + age + (storyAge.type === "number" ? "살" : ""),
        "- 영어 단계: " + level.description,
        "- 좋아하는 것과 넣고 싶은 상상: " + imagination,
        "- 생활 주제: " + theme,
        "",
        "위 정보가 모두 제공되었습니다. 바로 8페이지 동화 풀패키지를 만들어 주세요.",
        "뒷표지 마지막 줄에 다음 크레딧을 넣어 주세요.",
        backcover
      ].join("\n");

      const promptBox = byId("story-prompt-box");
      if (promptBox.matches("textarea, input")) {
        promptBox.value = storyPrompt;
      } else {
        promptBox.textContent = storyPrompt;
      }

      const pages = level.pages(name, imagination).map((paragraph, index) => {
        const card = makeElement("article", "story-card");
        const body = makeElement("p", "story-card__text", paragraph);
        body.lang = "en";
        card.append(makeElement("h3", "story-card__page", "Page " + (index + 1)), body);
        return card;
      });
      byId("story-preview-cards").replaceChildren(...pages);
      const questions = byId("story-questions");
      const list = questions.matches("ol, ul") ? questions : makeElement("ol", "story-question-list");
      list.replaceChildren(...data.storyQuestions.map(([korean, english]) => {
        const item = makeElement("li", "story-question", korean);
        const translation = makeElement("span", "story-question-en", english);
        translation.lang = "en";
        item.append(document.createElement("br"), translation);
        return item;
      }));
      if (list !== questions) questions.replaceChildren(list);
      const attribution = byId("story-backcover").querySelector("[data-story-attribution]");
      if (attribution) {
        attribution.textContent = "이 이야기는 " + name + "의 상상으로 지어졌습니다 · 안티프래질 페어런팅 거실 동화 공방";
      }
      reveal(storyOutput);
    }

    onAction(byId("story-submit"), renderStory);
    onAction(byId("story-copy-prompt"), () => {
      if (storyPrompt) copyText(storyPrompt);
    }, false);
    onAction(byId("story-print-btn"), () => {
      if (storyPrompt) window.print();
    }, false);

    const filterButtons = [...byId("prompt-filters").querySelectorAll("[data-axis]")];
    const promptGrid = byId("prompt-grid");
    function renderPrompts(axis) {
      const cards = data.prompts
        .filter((prompt) => axis === "all" || prompt.axis === axis)
        .map((prompt) => {
          const card = makeElement("article", "prompt-card");
          const title = makeElement("h3", "prompt-card__title", prompt.title);
          const situation = makeElement("p", "prompt-card__situation", prompt.situation);
          const details = makeElement("details", "prompt-details");
          const copy = makeElement("button", "btn btn--ghost prompt-copy", "프롬프트 복사");
          copy.type = "button";
          copy.setAttribute("aria-label", prompt.title + " 프롬프트 복사");
          copy.addEventListener("click", () => copyText(prompt.body));
          details.append(
            makeElement("summary", "", "프롬프트 전문 보기"),
            makeElement("pre", "prompt-box prompt-body", prompt.body)
          );
          card.append(title, situation, details, copy);
          return card;
        });
      promptGrid.replaceChildren(...cards);
      for (const button of filterButtons) {
        setActive(button, button.dataset.axis === axis);
      }
    }

    for (const button of filterButtons) {
      onAction(button, () => renderPrompts(button.dataset.axis), false);
    }
    renderPrompts("all");

    const coachInput = byId("coach-input");
    const coachOutput = byId("coach-demo-output");
    const coachResponse = coachOutput.querySelector("[data-coach-response]") || coachOutput;
    const coachButtons = data.coachScenarios.map((scenario, index) => {
      const chip = makeElement("button", "chip coach-chip", data.coachExamples[index].label);
      chip.type = "button";
      chip.setAttribute("aria-pressed", "false");
      chip.addEventListener("click", () => {
        coachInput.value = scenario;
        coachButtons.forEach((button) => setActive(button, button === chip));
        coachInput.focus();
      });
      return chip;
    });
    byId("coach-scenarios").replaceChildren(...coachButtons);
    coachInput.addEventListener("input", () => {
      coachButtons.forEach((chip, index) => setActive(
        chip, coachInput.value.trim() === data.coachScenarios[index]
      ));
    });

    function renderCoach() {
      if (!coachInput.reportValidity()) return;
      const entry = coachInput.value.trim();
      if (!entry) {
        showToast("오늘 막혔던 장면을 적어 주세요.");
        coachInput.focus();
        return;
      }
      const selected = data.coachScenarios.indexOf(entry);
      const example = selected >= 0
        ? data.coachExamples[selected]
        : data.coachExamples.find((example) => example.matches.test(entry)) || data.coachFallback;
      const steps = [
        ["먼저 숨 고르기", example.pause],
        ["거실 조건 진단", example.condition],
        ["내일 바꿀 조건 딱 1가지", example.action, example.backup],
        ["내일 아이에게 건넬 한 문장", example.line]
      ];
      const list = makeElement("ol", "coach-steps");
      for (const [heading, paragraph, backup] of steps) {
        const step = makeElement("li", "coach-step");
        step.append(makeElement("h3", "", heading), makeElement("p", "", paragraph));
        if (backup) step.append(makeElement("p", "coach-backup", "10분 폭풍우 비상 모드 · " + backup));
        list.append(step);
      }
      coachResponse.replaceChildren(
        makeElement("p", "coach-demo-note", "거실 설계사 응답 예시"),
        list
      );
      reveal(coachOutput);
    }

    onAction(byId("coach-try-btn"), renderCoach);
    onAction(byId("coach-copy-system-prompt"), () => copyText(data.coachSystemPrompt), false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
