const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add("active");
        }
    });
},{
    threshold:0.2
});

reveals.forEach(item=>{
    observer.observe(item);
});

const pageTransitionDuration = 500;
const bodyElement = document.body;
const countdownSeconds = 10;
const secondsElement = document.getElementById("seconds");
const timerElement = document.querySelector(".timer");
const startButton = document.getElementById("start-quiz");
let remainingSeconds = countdownSeconds;
let intervalId;

function updateCountdown() {
    if (!secondsElement) return;
    secondsElement.textContent = remainingSeconds.toString().padStart(2, "0");
}

function startCountdown() {
    if (!timerElement || !startButton) return;

    timerElement.classList.remove("hidden");
    startButton.disabled = true;
    startButton.textContent = "Contando...";
    updateCountdown();

    intervalId = setInterval(() => {
        remainingSeconds -= 1;
        updateCountdown();

        if (remainingSeconds <= 0) {
            clearInterval(intervalId);
            startButton.textContent = "Começou!";

            setTimeout(() => {
                bodyElement.classList.add("page-exit");
                setTimeout(() => {
                    window.location.href = "q1.html";
                }, pageTransitionDuration);
            }, 2000);
        }
    }, 1000);
}

function showPage() {
    bodyElement.classList.add("page-visible");
}

function fadeNavigation(event) {
    const link = event.currentTarget;
    const url = new URL(link.href, location.href);
    const sameOrigin = url.origin === location.origin;

    if (!sameOrigin) return;
    if (link.target && link.target !== "") return;
    if (link.getAttribute("href").startsWith("#")) return;
    if (url.pathname === location.pathname && url.search === location.search) return;

    event.preventDefault();
    bodyElement.classList.add("page-exit");

    setTimeout(() => {
        window.location.href = url.href;
    }, pageTransitionDuration);
}

const answerButtons = document.querySelectorAll(".answer-card");
const feedbackElement = document.querySelector(".feedback-message");

function getNextQuestionUrl() {
    const fileName = location.pathname.split("/").pop();
    const match = fileName.match(/^q(\d+)\.html$/i);
    if (!match) return null;
    const current = Number(match[1]);
    if (Number.isNaN(current) || current >= 10) return null;
    return `q${current + 1}.html`;
}

function resetFeedback() {
    if (!feedbackElement) return;
    feedbackElement.textContent = "";
    feedbackElement.classList.remove("correct", "wrong", "visible");
    answerButtons.forEach(button => {
        button.classList.remove("correct", "wrong");
    });
}

function handleAnswerClick(event) {
    const button = event.currentTarget;
    const isCorrect = button.dataset.correct === "true";
    if (!feedbackElement) return;

    resetFeedback();

    const currentFile = location.pathname.split("/").pop();
    const isQ10 = currentFile.toLowerCase() === "q10.html";

    if (isCorrect) {
        button.classList.add("correct");
        
        if (!isQ10) {
            feedbackElement.textContent = "Resposta correta! aí está uma memória ♥";
            feedbackElement.classList.add("correct", "visible");
        }

        const nextQuestionUrl = getNextQuestionUrl();
        if (!nextQuestionUrl) {
            setTimeout(() => {
                feedbackElement.textContent = "Quiz concluído! Obrigado por lembrar esses momentos.";
                feedbackElement.classList.add("visible");

                setTimeout(() => {
                    bodyElement.classList.add("page-exit");
                    setTimeout(() => {
                        window.location.href = "confessão.html";
                    }, pageTransitionDuration);
                }, 3000);
            }, 2000);
            return;
        }

        setTimeout(() => {
            bodyElement.classList.add("page-exit");
            setTimeout(() => {
                window.location.href = nextQuestionUrl;
            }, pageTransitionDuration);
        }, 2000);
    } else {
        button.classList.add("wrong");
        const wrongMessage = button.dataset.message || "Acho que não é isso, tente se lembrar...";
        feedbackElement.textContent = wrongMessage;
        feedbackElement.classList.add("wrong", "visible");
    }
}

function initPageTransitions() {
    showPage();

    document.querySelectorAll("a[href]").forEach(anchor => {
        anchor.addEventListener("click", fadeNavigation);
    });

    if (startButton) {
        startButton.addEventListener("click", startCountdown);
    }

    if (answerButtons.length) {
        answerButtons.forEach(button => {
            button.addEventListener("click", handleAnswerClick);
        });
    }

    initQ10Effects();
}

function initQ10Effects() {
    const q10Page = document.getElementById("q10-page");
    if (!q10Page) return;

    const allButtons = q10Page.querySelectorAll(".answer-card");
    const wrongButton = Array.from(allButtons).find(btn => btn.getAttribute("data-correct") === "false");
    
    if (!wrongButton) return;

    wrongButton.addEventListener("mouseenter", () => {
        wrongButton.remove();
    });
}

document.addEventListener("DOMContentLoaded", initPageTransitions);

