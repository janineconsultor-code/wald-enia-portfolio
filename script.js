
/* ========================================
   WALDÊNIA SILVA — ESTÚDIO CRIATIVO
   JavaScript principal
======================================== */


/* 01 — FILTROS DO PORTFÓLIO */

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const filter = button.dataset.filter;

        filterButtons.forEach(function (item) {
            const active = item === button;

            item.classList.toggle("active", active);
            item.setAttribute("aria-pressed", String(active));
        });

        projectCards.forEach(function (card) {
            const category = card.dataset.category;
            const visible = filter === "todos" || category === filter;

            card.classList.toggle("is-hidden", !visible);
        });
    });
});


/* 02 — MODAIS DOS PROJETOS */

const projectModals = {
    veranum: document.querySelector("#project-modal"),
    origem: document.querySelector("#project-modal-origem")
};

let lastProjectTrigger = null;

function openProjectModal(modal, trigger) {
    if (!modal) return;

    lastProjectTrigger = trigger;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("project-modal-open");

    const closeButton = modal.querySelector(".project-modal-close");

    if (closeButton) {
        closeButton.focus();
    }
}

function closeProjectModal(modal) {
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    if (!document.querySelector(".project-modal.is-open")) {
        document.body.classList.remove("project-modal-open");
    }

    if (lastProjectTrigger) {
        lastProjectTrigger.focus();
        lastProjectTrigger = null;
    }
}

document.querySelectorAll(".project-link[data-project]").forEach(function (link) {
    link.addEventListener("click", function (event) {
        const modal = projectModals[link.dataset.project];

        if (!modal) return;

        event.preventDefault();
        openProjectModal(modal, link);
    });
});


/* 03 — FECHAR OS MODAIS DOS PROJETOS */

document.querySelectorAll(".project-modal-close").forEach(function (button) {
    button.addEventListener("click", function () {
        closeProjectModal(button.closest(".project-modal"));
    });
});

document.querySelectorAll(".project-modal-back").forEach(function (button) {
    button.addEventListener("click", function () {
        closeProjectModal(button.closest(".project-modal"));
    });
});

document.querySelectorAll(".project-modal").forEach(function (modal) {
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeProjectModal(modal);
        }
    });
});


/* 04 — MODAL DO PRÉ-BRIEFING */

const briefingModal = document.querySelector("#pre-briefing");
const openBriefing = document.querySelector("#open-prebriefing");

const closeBriefingButton = briefingModal
    ? briefingModal.querySelector(".prebriefing-close")
    : null;

function showBriefing() {
    if (!briefingModal) return;

    briefingModal.classList.add("is-open");
    briefingModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("prebriefing-open");

    const dialog = briefingModal.querySelector(".prebriefing-modal-content");

    if (dialog) {
        dialog.focus();
    }
}

function hideBriefing() {
    if (!briefingModal) return;

    briefingModal.classList.remove("is-open");
    briefingModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("prebriefing-open");

    if (openBriefing) {
        openBriefing.focus();
    }
}

if (openBriefing && briefingModal && closeBriefingButton) {
    openBriefing.addEventListener("click", showBriefing);

    closeBriefingButton.addEventListener("click", hideBriefing);

    briefingModal.addEventListener("click", function (event) {
        if (event.target === briefingModal) {
            hideBriefing();
        }
    });
}


/* 05 — FECHAR MODAIS COM ESCAPE */

document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;

    if (briefingModal && briefingModal.classList.contains("is-open")) {
        hideBriefing();
        return;
    }

    const openProject = document.querySelector(".project-modal.is-open");

    if (openProject) {
        closeProjectModal(openProject);
    }
});


/* 06 — FORMULÁRIO DE PRÉ-BRIEFING */

const prebriefingForm = document.querySelector("#prebriefing-form");
const formFeedback = document.querySelector("#form-feedback");

if (prebriefingForm) {
    prebriefingForm.addEventListener("submit", function (event) {
        if (!prebriefingForm.reportValidity()) {
            event.preventDefault();
            return;
        }

        if (formFeedback) {
            const currentLanguage = document.documentElement.lang;

            formFeedback.textContent = currentLanguage === "en"
                ? "Your form is being submitted. Please wait for confirmation before closing the page."
                : "O formulário está a ser enviado. Aguarde a confirmação antes de fechar a página.";

            formFeedback.setAttribute("role", "status");
            formFeedback.setAttribute("aria-live", "polite");
        }
    });
}


/* 07 — ALTERNÂNCIA DE IDIOMA PT / EN */

const languageButtons = document.querySelectorAll(".language-button");

function changeLanguage(language) {
    const isEnglish = language === "en";

    // Atualiza o idioma do documento.
    document.documentElement.lang = isEnglish ? "en" : "pt-PT";

    // Atualiza o estado visual e acessível dos botões.
    languageButtons.forEach(function (button) {
        const buttonLanguage = button.textContent.trim().toLowerCase();
        const isActive = buttonLanguage === language;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    // Troca os textos que tenham as duas versões no HTML.
    document.querySelectorAll("[data-pt][data-en]").forEach(function (element) {
        element.textContent = isEnglish
            ? element.dataset.en
            : element.dataset.pt;
    });

    // Traduz os placeholders dos campos, quando configurados.
    document.querySelectorAll(
        "[data-placeholder-pt][data-placeholder-en]"
    ).forEach(function (element) {
        element.placeholder = isEnglish
            ? element.dataset.placeholderEn
            : element.dataset.placeholderPt;
    });

    // Traduz os atributos title, quando configurados.
    document.querySelectorAll("[data-title-pt][data-title-en]").forEach(
        function (element) {
            element.title = isEnglish
                ? element.dataset.titleEn
                : element.dataset.titlePt;
        }
    );

    // Traduz os atributos aria-label, quando configurados.
    document.querySelectorAll("[data-aria-label-pt][data-aria-label-en]")
        .forEach(function (element) {
            element.setAttribute(
                "aria-label",
                isEnglish
                    ? element.dataset.ariaLabelEn
                    : element.dataset.ariaLabelPt
            );
        });
}

languageButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const language = button.textContent.trim().toLowerCase();

        if (language === "pt" || language === "en") {
            changeLanguage(language);
        }
    });
});

// Inicia o site em português.
changeLanguage("pt");
