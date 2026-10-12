
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

    if (closeButton) closeButton.focus();
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

    if (dialog) dialog.focus();
}

function hideBriefing() {
    if (!briefingModal) return;

    briefingModal.classList.remove("is-open");
    briefingModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("prebriefing-open");

    if (openBriefing) openBriefing.focus();
}

if (openBriefing && briefingModal && closeBriefingButton) {
    openBriefing.addEventListener("click", showBriefing);
    closeBriefingButton.addEventListener("click", hideBriefing);

    briefingModal.addEventListener("click", function (event) {
        if (event.target === briefingModal) hideBriefing();
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

    if (openProject) closeProjectModal(openProject);
});


/* 06 — PREPARAR O PEDIDO POR E-MAIL */

const prebriefingForm = document.querySelector("#prebriefing-form");

if (prebriefingForm) {
    prebriefingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!prebriefingForm.reportValidity()) return;

        const dados = new FormData(prebriefingForm);

        const campos = [
            ["Nome", "nome"],
            ["E-mail", "email"],
            ["Marca/empresa", "marca"],
            ["Serviço", "servico"],
            ["Fase do projeto", "fase"],
            ["Objetivo do projeto", "objetivo"],
            ["Público-alvo", "publico"],
            ["Estilo visual e referências", "estilo"],
            ["Materiais/aplicações", "materiais"],
            ["Prazo pretendido", "prazo"],
            ["Orçamento previsto", "orcamento"],
            ["Informações adicionais", "adicionais"]
        ];

        const corpo = campos.map(function ([titulo, chave]) {
            const valor = String(dados.get(chave) || "").trim();
            return titulo + ":\n" + (valor || "Não indicado");
        }).join("\n\n");

        const destinatario = "janine.consultor@outlook.pt";

        const assunto = encodeURIComponent(
            "Pré-briefing | Novo pedido de projeto"
        );

        const mensagem = encodeURIComponent(
            "PRÉ-BRIEFING\n" +
            "Waldênia Silva — Estúdio Criativo\n\n" +
            corpo
        );

        const feedback = document.querySelector("#form-feedback");

        if (feedback) {
            feedback.textContent =
                "O teu pedido foi preparado com sucesso. Para concluir o envio, " +
                "confirma e envia a mensagem no teu programa de e-mail. " +
                "Após receber o teu e-mail, responderei no prazo de 3 dias úteis " +
                "para confirmar a receção e indicar os próximos passos. " +
                "Obrigada pelo interesse no meu trabalho. — Waldênia Silva, " +
                "Estúdio Criativo";

            feedback.setAttribute("role", "status");
            feedback.setAttribute("aria-live", "polite");
        }

        window.location.href =
            "mailto:" + destinatario +
            "?subject=" + assunto +
            "&body=" + mensagem;
    });
}
