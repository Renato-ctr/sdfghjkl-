// ========== FUNÇÕES PARA OS PROBLEMAS ==========
function toggleHint(problemNumber) {
    const hint = document.getElementById(`hint-${problemNumber}`);
    const button = event.target;
    
    if (hint.style.display === 'none') {
        hint.style.display = 'block';
        button.textContent = 'Ocultar Dica';
    } else {
        hint.style.display = 'none';
        button.textContent = 'Mostrar Dica';
    }
}

function toggleSolution(problemNumber) {
    const solution = document.getElementById(`solution-${problemNumber}`);
    const button = event.target;
    
    if (solution.style.display === 'none') {
        solution.style.display = 'block';
        button.textContent = 'Ocultar Solução';
    } else {
        solution.style.display = 'none';
        button.textContent = 'Mostrar Solução';
    }
}

// ========== ANIMAÇÃO DE FUNDO METÁLICO ==========
function createMetallicBackground() {
    const canvas = document.getElementById("backgroundAnimationCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleColors = [
        "rgba(184, 184, 184, 0.3)", // Metal claro
        "rgba(120, 120, 120, 0.3)", // Metal médio
        "rgba(70, 70, 70, 0.3)",    // Metal escuro
        "rgba(30, 99, 233, 0.1)"    // Toque azul
    ];
    const maxDistance = 100;
    let particleCount;

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particleCount = Math.floor((canvas.width * canvas.height) / 18000);
        if (particleCount > 120) particleCount = 120;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 1.5 + 0.5;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // Adicionar brilho metálico
            ctx.beginPath();
            ctx.arc(this.x - this.radius/3, this.y - this.radius/3, this.radius/2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.fill();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(120, 120, 120, ${0.1 * (1 - distance/maxDistance)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Adicionar gradiente de fundo metálico
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "rgba(20, 20, 20, 0.8)");
        gradient.addColorStop(0.5, "rgba(40, 40, 40, 0.6)");
        gradient.addColorStop(1, "rgba(20, 20, 20, 0.8)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        connect();
        requestAnimationFrame(animate);
    }

    window.addEventListener("resize", () => {
        setCanvasSize();
        init();
    });

    setCanvasSize();
    init();
    animate();
}

// ========== CÁLCULO DE ÁREAS ==========
// Círculo
document.getElementById("calcular-circulo").addEventListener("click", function () {
    const raioInput = document.getElementById("raio-circulo").value;
    const diametroInput = document.getElementById("diametro-circulo").value;
    const resultado = document.getElementById("resultado-circulo");
    const button = this;

    let raio;
    
    if (raioInput) {
        raio = parseFloat(raioInput);
    } else if (diametroInput) {
        raio = parseFloat(diametroInput) / 2;
    } else {
        resultado.innerHTML = '<p style="color: #ff6b6b;">⚠️ Por favor, insira o raio ou o diâmetro.</p>';
        resultado.style.display = "block";
        return;
    }

    if (isNaN(raio) || raio <= 0) {
        resultado.innerHTML = '<p style="color: #ff6b6b;">⚠️ Por favor, insira um valor válido para o raio ou diâmetro (número positivo).</p>';
        resultado.style.display = "block";
        return;
    }

    button.textContent = "Calculando...";
    button.disabled = true;

    setTimeout(() => {
        const area = Math.PI * raio * raio;
        resultado.innerHTML = `
            <p>● Área do círculo:</p>
            <p><strong>A = π × r²</strong></p>
            <p><strong>A = π × ${raio}² = ${area.toFixed(2)}</strong> unidades quadradas</p>
            <p><small>Usando π ≈ ${Math.PI.toFixed(5)}</small></p>
        `;
        resultado.style.display = "block";

        button.textContent = "Calcular Área";
        button.disabled = false;
    }, 500);
});

document.getElementById("limpar-circulo").addEventListener("click", function () {
    document.getElementById("raio-circulo").value = "";
    document.getElementById("diametro-circulo").value = "";
    document.getElementById("resultado-circulo").style.display = "none";
});

// Sincronizar raio e diâmetro
document.getElementById("raio-circulo").addEventListener("input", function() {
    if (this.value) {
        document.getElementById("diametro-circulo").value = parseFloat(this.value) * 2;
    }
});

document.getElementById("diametro-circulo").addEventListener("input", function() {
    if (this.value) {
        document.getElementById("raio-circulo").value = parseFloat(this.value) / 2;
    }
});

// Trapézio
document.getElementById("calcular-trapezio").addEventListener("click", function () {
    const baseMaiorInput = document.getElementById("base-maior").value;
    const baseMenorInput = document.getElementById("base-menor").value;
    const alturaInput = document.getElementById("altura-trapezio").value;
    const resultado = document.getElementById("resultado-trapezio");
    const button = this;

    const baseMaior = parseFloat(baseMaiorInput);
    const baseMenor = parseFloat(baseMenorInput);
    const altura = parseFloat(alturaInput);

    if (isNaN(baseMaior) || isNaN(baseMenor) || isNaN(altura) || 
        baseMaior <= 0 || baseMenor <= 0 || altura <= 0) {
        resultado.innerHTML = '<p style="color: #ff6b6b;">⚠️ Por favor, insira valores válidos para as bases e altura (números positivos).</p>';
        resultado.style.display = "block";
        return;
    }

    button.textContent = "Calculando...";
    button.disabled = true;

    setTimeout(() => {
        const area = (baseMaior + baseMenor) * altura / 2;
        resultado.innerHTML = `
            <p>● Área do trapézio:</p>
            <p><strong>A = (B + b) × h / 2</strong></p>
            <p><strong>A = (${baseMaior} + ${baseMenor}) × ${altura} / 2 = ${area.toFixed(2)}</strong> unidades quadradas</p>
        `;
        resultado.style.display = "block";

        button.textContent = "Calcular Área";
        button.disabled = false;
    }, 500);
});

document.getElementById("limpar-trapezio").addEventListener("click", function () {
    document.getElementById("base-maior").value = "";
    document.getElementById("base-menor").value = "";
    document.getElementById("altura-trapezio").value = "";
    document.getElementById("resultado-trapezio").style.display = "none";
});

// Permitir calcular com Enter
document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            const form = this.closest(".interactive-tool");
            const button = form.querySelector("button");
            button.click();
        }
    });
});

// ========== VISUALIZAÇÃO INTERATIVA ==========
function initCircleVisualization() {
    const canvas = document.getElementById("circle-canvas");
    const ctx = canvas.getContext("2d");
    const radiusSlider = document.getElementById("circle-radius");
    const radiusValue = document.getElementById("circle-radius-value");
    const areaValue = document.getElementById("circle-area-value");
    
    let radius = parseFloat(radiusSlider.value);
    
    function drawCircle() {
        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Configurações de desenho
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const visualRadius = radius * 15; // Escala para visualização
        
        // Desenhar círculo
        ctx.beginPath();
        ctx.arc(centerX, centerY, visualRadius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(30, 99, 233, 0.3)";
        ctx.fill();
        ctx.strokeStyle = "#2d7aff";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Desenhar raio
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + visualRadius, centerY);
        ctx.strokeStyle = "#2060ff";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Desenhar centro
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#2060ff";
        ctx.fill();
        
        // Adicionar rótulos
        ctx.fillStyle = "#fff";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        
        // Rótulo do raio
        ctx.fillText("r", centerX + visualRadius/2, centerY - 10);
        
        // Calcular e exibir área
        const area = Math.PI * radius * radius;
        areaValue.textContent = area.toFixed(2);
    }
    
    // Atualizar valores do slider
    radiusSlider.addEventListener("input", function() {
        radius = parseFloat(this.value);
        radiusValue.textContent = radius;
        drawCircle();
    });
    
    // Desenhar círculo inicial
    drawCircle();
}

function initTrapezoidVisualization() {
    const canvas = document.getElementById("trapezoid-canvas");
    const ctx = canvas.getContext("2d");
    const baseMaiorSlider = document.getElementById("trapezoid-base-maior");
    const baseMenorSlider = document.getElementById("trapezoid-base-menor");
    const heightSlider = document.getElementById("trapezoid-height");
    
    const baseMaiorValue = document.getElementById("trapezoid-base-maior-value");
    const baseMenorValue = document.getElementById("trapezoid-base-menor-value");
    const heightValue = document.getElementById("trapezoid-height-value");
    const areaValue = document.getElementById("trapezoid-area-value");
    
    let baseMaior = parseFloat(baseMaiorSlider.value);
    let baseMenor = parseFloat(baseMenorSlider.value);
    let height = parseFloat(heightSlider.value);
    
    function drawTrapezoid() {
        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Configurações de desenho
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Escalas para visualização
        const scale = 15;
        const visualBaseMaior = baseMaior * scale;
        const visualBaseMenor = baseMenor * scale;
        const visualHeight = height * scale;
        
        // Calcular pontos do trapézio
        const topWidth = visualBaseMenor;
        const bottomWidth = visualBaseMaior;
        const topX = centerX - topWidth / 2;
        const bottomX = centerX - bottomWidth / 2;
        const topY = centerY - visualHeight / 2;
        const bottomY = centerY + visualHeight / 2;
        
        // Desenhar trapézio
        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.lineTo(topX + topWidth, topY);
        ctx.lineTo(bottomX + bottomWidth, bottomY);
        ctx.lineTo(bottomX, bottomY);
        ctx.closePath();
        
        ctx.fillStyle = "rgba(30, 99, 233, 0.3)";
        ctx.fill();
        ctx.strokeStyle = "#2d7aff";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Desenhar altura
        ctx.beginPath();
        ctx.moveTo(centerX, topY);
        ctx.lineTo(centerX, bottomY);
        ctx.strokeStyle = "#2060ff";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Adicionar rótulos
        ctx.fillStyle = "#fff";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        
        // Rótulo da base menor
        ctx.fillText("b", centerX, topY - 10);
        
        // Rótulo da base maior
        ctx.fillText("B", centerX, bottomY + 20);
        
        // Rótulo da altura
        ctx.fillText("h", centerX + 15, centerY);
        
        // Calcular e exibir área
        const area = (baseMaior + baseMenor) * height / 2;
        areaValue.textContent = area.toFixed(2);
    }
    
    // Atualizar valores dos sliders
    baseMaiorSlider.addEventListener("input", function() {
        baseMaior = parseFloat(this.value);
        baseMaiorValue.textContent = baseMaior;
        drawTrapezoid();
    });
    
    baseMenorSlider.addEventListener("input", function() {
        baseMenor = parseFloat(this.value);
        baseMenorValue.textContent = baseMenor;
        drawTrapezoid();
    });
    
    heightSlider.addEventListener("input", function() {
        height = parseFloat(this.value);
        heightValue.textContent = height;
        drawTrapezoid();
    });
    
    // Desenhar trapézio inicial
    drawTrapezoid();
}

// ========== TABS DA VISUALIZAÇÃO ==========
function initVisualizationTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe active de todos os botões e conteúdos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            button.classList.add('active');
            
            // Mostrar o conteúdo correspondente
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// ========== QUIZ ==========
const quizQuestions = [
    {
        question: "Qual é a fórmula para calcular a área de um círculo?",
        options: [
            "A = 2 × π × r",
            "A = π × r²",
            "A = π × d",
            "A = (π × r) / 2"
        ],
        correct: 1
    },
    {
        question: "Se o raio de um círculo é 7 cm, qual é sua área?",
        options: [
            "≈ 43,98 cm²",
            "≈ 153,94 cm²",
            "≈ 21,99 cm²",
            "≈ 307,88 cm²"
        ],
        correct: 1
    },
    {
        question: "Qual é a fórmula para calcular a área de um trapézio?",
        options: [
            "A = B × b × h",
            "A = (B + b) × h / 2",
            "A = B + b + h",
            "A = (B × b) / h"
        ],
        correct: 1
    },
    {
        question: "Se o diâmetro de um círculo é 10 cm, qual é sua área?",
        options: [
            "≈ 31,42 cm²",
            "≈ 78,54 cm²",
            "≈ 15,71 cm²",
            "≈ 314,16 cm²"
        ],
        correct: 1
    },
    {
        question: "O que representa o símbolo π (pi)?",
        options: [
            "A área de um círculo unitário",
            "A razão entre a circunferência e o raio",
            "A razão entre a circunferência e o diâmetro",
            "O perímetro de um círculo"
        ],
        correct: 2
    },
    {
        question: "Se a área de um círculo é 50,27 cm², qual é aproximadamente seu raio?",
        options: [
            "4 cm",
            "6 cm",
            "8 cm",
            "10 cm"
        ],
        correct: 0
    },
    {
        question: "Qual é o valor aproximado de π?",
        options: [
            "2,71828",
            "3,14159",
            "1,61803",
            "1,41421"
        ],
        correct: 1
    },
    {
        question: "Se o raio de um círculo dobra, o que acontece com sua área?",
        options: [
            "Dobra",
            "Triplica",
            "Quadruplica",
            "Permanece a mesma"
        ],
        correct: 2
    },
    {
        question: "Qual é a área de um trapézio com base maior 12 cm, base menor 8 cm e altura 5 cm?",
        options: [
            "20 cm²",
            "50 cm²",
            "100 cm²",
            "200 cm²"
        ],
        correct: 1
    },
    {
        question: "Qual destas fórmulas NÃO calcula a área de um círculo?",
        options: [
            "A = π × r²",
            "A = (π × d²) / 4",
            "A = 2 × π × r",
            "A = π × (d/2)²"
        ],
        correct: 2
    },
    {
        question: "Se a circunferência de um círculo é 31,42 cm, qual é aproximadamente sua área?",
        options: [
            "≈ 25 cm²",
            "≈ 50 cm²",
            "≈ 78,5 cm²",
            "≈ 100 cm²"
        ],
        correct: 2
    },
    {
        question: "Qual é a área de um semicírculo com raio 6 cm?",
        options: [
            "≈ 56,55 cm²",
            "≈ 113,10 cm²",
            "≈ 37,70 cm²",
            "≈ 18,85 cm²"
        ],
        correct: 0
    },
    {
        question: "Quantas vezes a área de um círculo com raio 5 cm é maior que a área de um círculo com raio 2,5 cm?",
        options: [
            "2 vezes",
            "3 vezes",
            "4 vezes",
            "5 vezes"
        ],
        correct: 2
    },
    {
        question: "Se a área de um círculo é 100π cm², qual é seu raio?",
        options: [
            "5 cm",
            "10 cm",
            "20 cm",
            "50 cm"
        ],
        correct: 1
    },
    {
        question: "Qual destas afirmações sobre π é FALSA?",
        options: [
            "π é um número irracional",
            "π é a razão entre circunferência e diâmetro",
            "π pode ser escrito como uma fração exata",
            "π é aproximadamente 3,14159"
        ],
        correct: 2
    }
];

let currentQuestion = 0;
let userAnswers = Array(quizQuestions.length).fill(null);
let quizSubmitted = false;

function renderQuizQuestions() {
    const quizContainer = document.getElementById("quiz-questions");
    quizContainer.innerHTML = "";

    const q = quizQuestions[currentQuestion];
    const questionElement = document.createElement("div");
    questionElement.className = "question";
    questionElement.innerHTML = `
        <h4>${currentQuestion + 1}. ${q.question}</h4>
        <div class="options">
            ${q.options
                .map(
                    (option, i) => `
                    <div class="option ${userAnswers[currentQuestion] === i ? 'selected' : ''} 
                    ${quizSubmitted ? (i === q.correct ? 'correct-answer' : (userAnswers[currentQuestion] === i && userAnswers[currentQuestion] !== q.correct ? 'incorrect' : '')) : ''}" 
                    data-question="${currentQuestion}" data-option="${i}">
                        <span class="option-letter">${String.fromCharCode(65 + i)}</span>
                        ${option}
                    </div>
                `
                )
                .join("")}
        </div>
    `;
    quizContainer.appendChild(questionElement);

    updateQuizProgress();

    // Só adiciona event listeners se o quiz não foi submetido
    if (!quizSubmitted) {
        document.querySelectorAll(".option").forEach((option) => {
            option.addEventListener("click", function () {
                const questionIndex = parseInt(this.getAttribute("data-question"));
                const optionIndex = parseInt(this.getAttribute("data-option"));

                userAnswers[questionIndex] = optionIndex;

                document
                    .querySelectorAll(`.option[data-question="${questionIndex}"]`)
                    .forEach((opt) => {
                        opt.classList.remove("selected");
                    });

                this.classList.add("selected");
            });
        });
    }
}

function updateQuizProgress() {
    const progressFill = document.getElementById("quiz-progress-fill");
    const progressText = document.getElementById("quiz-progress-text");
    
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Questão ${currentQuestion + 1} de ${quizQuestions.length}`;
}

document.getElementById("proxima-questao").addEventListener("click", function() {
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        renderQuizQuestions();
    }
});

document.getElementById("anterior-questao").addEventListener("click", function() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuizQuestions();
    }
});

document.getElementById("verificar-respostas").addEventListener("click", function () {
    // Verifica se todas as questões foram respondidas
    const unansweredQuestions = userAnswers.filter(answer => answer === null).length;
    
    if (unansweredQuestions > 0) {
        if (confirm(`Você não respondeu ${unansweredQuestions} questão(ões). Deseja verificar mesmo assim?`)) {
            checkAnswers();
        }
    } else {
        checkAnswers();
    }
});

function checkAnswers() {
    quizSubmitted = true;
    
    let score = 0;
    const totalQuestions = quizQuestions.length;

    // Contabiliza as respostas corretas
    quizQuestions.forEach((q, index) => {
        if (userAnswers[index] === q.correct) {
            score++;
        }
    });

    // Re-renderiza todas as questões para mostrar as cores corretas
    renderQuizQuestions();
    
    // Desabilita os botões de navegação
    document.getElementById("anterior-questao").disabled = true;
    document.getElementById("proxima-questao").disabled = true;
    document.getElementById("verificar-respostas").disabled = true;

    showQuizResults(score, totalQuestions);
}

function showQuizResults(score, total) {
    const results = document.getElementById("quiz-results");
    const scoreText = document.getElementById("score-text");
    const performanceMessage = document.getElementById("performance-message");
    const scoreCircle = document.getElementById("score-circle");
    const scorePercentage = document.getElementById("score-percentage");

    const percentage = (score / total) * 100;
    const circumference = 339.292; // 2 * π * 54
    const offset = circumference - (percentage / 100) * circumference;

    // Animação do círculo de progresso
    setTimeout(() => {
        scoreCircle.style.strokeDashoffset = offset;
        scorePercentage.textContent = `${percentage.toFixed(0)}%`;
    }, 100);

    scoreText.textContent = `Você acertou ${score} de ${total} questões! (${percentage.toFixed(1)}%)`;

    if (percentage >= 90) {
        performanceMessage.textContent = "🎉 Excelente! Você domina completamente o conteúdo sobre área do círculo e trapézio!";
        performanceMessage.style.color = "#00d4aa";
    } else if (percentage >= 70) {
        performanceMessage.textContent = "👍 Muito bom! Você tem um ótimo conhecimento sobre área do círculo e trapézio.";
        performanceMessage.style.color = "#2d7aff";
    } else if (percentage >= 50) {
        performanceMessage.textContent = "💡 Bom! Continue estudando para melhorar seu desempenho.";
        performanceMessage.style.color = "#ffb74d";
    } else {
        performanceMessage.textContent = "📚 Estude um pouco mais os conceitos de área do círculo e trapézio e tente novamente!";
        performanceMessage.style.color = "#ff6b6b";
    }

    results.style.display = "block";
    results.scrollIntoView({ behavior: "smooth" });
}

document.getElementById("reiniciar-quiz").addEventListener("click", function () {
    currentQuestion = 0;
    userAnswers = Array(quizQuestions.length).fill(null);
    quizSubmitted = false;
    
    // Reabilita os botões de navegação
    document.getElementById("anterior-questao").disabled = false;
    document.getElementById("proxima-questao").disabled = false;
    document.getElementById("verificar-respostas").disabled = false;

    // Remove todas as classes de estado das opções
    document.querySelectorAll(".option").forEach((option) => {
        option.classList.remove("selected", "correct", "incorrect", "correct-answer");
    });

    document.getElementById("quiz-results").style.display = "none";
    renderQuizQuestions();
    document.getElementById("quiz-questions").scrollIntoView({ behavior: "smooth" });
});

// ========== NAVEGAÇÃO SUAVE ==========
document.querySelectorAll("nav a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// ========== INICIALIZAÇÃO ==========
document.addEventListener("DOMContentLoaded", function () {
    createMetallicBackground();
    initCircleVisualization();
    initTrapezoidVisualization();
    initVisualizationTabs();
    renderQuizQuestions();
});
