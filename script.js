/* ========================================
   WALDÊNIA SILVA — ESTÚDIO CRIATIVO
   JavaScript principal
   Idioma: Português (Portugal)
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
            const visible =
                filter === "todos" || card.dataset.category === filter;

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


/* 06 — CAMPOS CONDICIONAIS DO PRÉ-BRIEFING */

const serviceSelect = document.querySelector("#servico");
const conditionalGroups = document.querySelectorAll("[data-service-group]");

function isElementVisible(element) {
    let current = element;
    while (current && current !== document.body) {
        if (current.hidden) return false;
        current = current.parentElement;
    }
    return true;
}

function updateNestedConditionalFields() {
    document.querySelectorAll("[data-show-when]").forEach(function (wrapper) {
        const condition = wrapper.dataset.showWhen.split(":");
        const source = document.getElementById(condition[0]);
        const acceptedValues = condition[1].split("|");
        const parentVisible = isElementVisible(wrapper.parentElement);
        const conditionMet = source && acceptedValues.includes(source.value);
        const visible = Boolean(parentVisible && conditionMet);
        wrapper.hidden = !visible;
        wrapper.querySelectorAll("input, select, textarea").forEach(function (field) {
            field.required = Boolean(visible && field.dataset.required === "true");
        });
    });
}

function updateConditionalBriefingFields() {
    if (!serviceSelect) return;
    conditionalGroups.forEach(function (group) {
        const active = group.dataset.serviceGroup === serviceSelect.value;
        group.hidden = !active;
        group.querySelectorAll("input, select, textarea").forEach(function (field) {
            field.required = Boolean(active && field.dataset.required === "true");
        });
    });
    updateNestedConditionalFields();
}

if (serviceSelect) {
    serviceSelect.addEventListener("change", updateConditionalBriefingFields);
    document.querySelectorAll("[data-show-when]").forEach(function (wrapper) {
        const sourceId = wrapper.dataset.showWhen.split(":")[0];
        const source = document.getElementById(sourceId);
        if (source) source.addEventListener("change", updateNestedConditionalFields);
    });
    updateConditionalBriefingFields();
}


/* 07 — FORMULÁRIO DE PRÉ-BRIEFING */

const prebriefingForm = document.querySelector("#prebriefing-form");
const formFeedback = document.querySelector("#form-feedback");

if (prebriefingForm) {
    prebriefingForm.addEventListener("submit", function (event) {
        // Cada grupo de caixas visível exige pelo menos uma escolha,
        // sem obrigar o cliente a selecionar uma opção específica.
        let invalidCheckboxGroup = null;
        prebriefingForm.querySelectorAll("[data-required-group]").forEach(function (fieldset) {
            const visible = isElementVisible(fieldset);
            const checked = fieldset.querySelector('input[type="checkbox"]:checked');
            if (visible && !checked && !invalidCheckboxGroup) invalidCheckboxGroup = fieldset;
        });

        if (invalidCheckboxGroup) {
            event.preventDefault();
            const firstCheckbox = invalidCheckboxGroup.querySelector('input[type="checkbox"]');
            if (firstCheckbox) firstCheckbox.focus();
            invalidCheckboxGroup.scrollIntoView({ behavior: "smooth", block: "center" });
            if (formFeedback) {
                formFeedback.textContent = document.documentElement.lang === "en"
                    ? "Please select at least one option in each required group."
                    : "Seleciona pelo menos uma opção em cada grupo obrigatório.";
                formFeedback.setAttribute("role", "alert");
                formFeedback.setAttribute("aria-live", "assertive");
            }
            return;
        }

        if (!prebriefingForm.reportValidity()) {
            event.preventDefault();
            return;
        }

        if (formFeedback) {
            formFeedback.textContent =
                "O formulário está a ser enviado. Aguarde a confirmação antes de fechar a página.";

            formFeedback.setAttribute("role", "status");
            formFeedback.setAttribute("aria-live", "polite");
        }
    });
}


/* 08 — IDIOMA DO SITE */

(function () {
    const languageButtons = document.querySelectorAll(".language-button");
    const translatableElements = document.querySelectorAll("[data-pt][data-en]");

    function setLanguage(language) {
        const isEnglish = language === "en";

        document.documentElement.lang = isEnglish ? "en" : "pt-PT";

        translatableElements.forEach(function (element) {
            const translation = isEnglish ? element.dataset.en : element.dataset.pt;

            if (translation === undefined) return;

            // Traduz texto sem substituir elementos filhos, como links e ícones.
            if (element.children.length === 0) {
                element.textContent = translation;
            }

            // Traduz também as opções de listas suspensas.
            if (element.tagName === "SELECT") {
                element.querySelectorAll("option[data-pt][data-en]").forEach(function (option) {
                    option.textContent = language === "en" ? option.dataset.en : option.dataset.pt;
                });
            }

            const placeholder = isEnglish
                ? element.dataset.placeholderEn
                : element.dataset.placeholderPt;
            const title = isEnglish ? element.dataset.titleEn : element.dataset.titlePt;
            const ariaLabel = isEnglish
                ? element.dataset.ariaLabelEn
                : element.dataset.ariaLabelPt;
            const alt = isEnglish ? element.dataset.altEn : element.dataset.altPt;

            if (placeholder !== undefined) element.setAttribute("placeholder", placeholder);
            if (title !== undefined) element.setAttribute("title", title);
            if (ariaLabel !== undefined) element.setAttribute("aria-label", ariaLabel);
            if (alt !== undefined) element.setAttribute("alt", alt);
        });

        // Traduz as opções dos campos select, que não fazem parte de translatableElements.
        document.querySelectorAll("select option[data-pt][data-en]").forEach(function (option) {
            option.textContent = isEnglish ? option.dataset.en : option.dataset.pt;
        });

        languageButtons.forEach(function (button) {
            const active = button.textContent.trim().toLowerCase() === language;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        try {
            localStorage.setItem("portfolio-language", language);
        } catch (error) {
            // O site continua a funcionar se o armazenamento local estiver bloqueado.
        }
    }

    languageButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const language = button.textContent.trim().toLowerCase();
            if (language === "pt" || language === "en") {
                setLanguage(language);
            }
        });
    });

    let savedLanguage = "pt";
    try {
        savedLanguage = localStorage.getItem("portfolio-language") || "pt";
    } catch (error) {
        // Usa português como idioma inicial se o armazenamento não estiver disponível.
    }

    setLanguage(savedLanguage === "en" ? "en" : "pt");
})();
