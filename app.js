// app.js

/**
 * Sound Engine Class
 * Synthesizes sound using Web Audio API to avoid requiring external files
 */
class SoundEngine {
    constructor() {
        this.enabled = true;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    playTone(freq, type, duration) {
        if (!this.enabled) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + duration);
        osc.stop(this.ctx.currentTime + duration);
    }

    playCorrect() {
        this.playTone(600, 'sine', 0.1);
        setTimeout(() => this.playTone(800, 'sine', 0.2), 100);
    }

    playWrong() {
        this.playTone(300, 'sawtooth', 0.3);
        setTimeout(() => this.playTone(250, 'sawtooth', 0.4), 150);
    }
}

/**
 * Leaderboard Manager Class
 * Handles LocalStorage persistence
 */
class LeaderboardManager {
    constructor(storageKey = 'devQuizScores') {
        this.storageKey = storageKey;
    }

    saveScore(category, score, percentage) {
        const scores = this.getScores();
        const date = new Date().toLocaleDateString();
        scores.push({ category, score, percentage, date });
        scores.sort((a, b) => b.percentage - a.percentage); // Sort highest first
        localStorage.setItem(this.storageKey, JSON.stringify(scores.slice(0, 5))); // Keep top 5
    }

    getScores() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }
}

/**
 * Main Quiz Application Class
 * Manages state and DOM interactions
 */
class QuizApp {
    constructor(database) {
        this.database = database;
        this.soundEngine = new SoundEngine();
        this.leaderboard = new LeaderboardManager();
        
        // State Variables
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timer = null;
        this.timeLeft = 15;
        this.category = null;

        this.initDOM();
        this.attachEventListeners();
    }

    initDOM() {
        // Screens
        this.screens = {
            welcome: document.getElementById('welcome-screen'),
            category: document.getElementById('category-screen'),
            quiz: document.getElementById('quiz-screen'),
            result: document.getElementById('result-screen')
        };

        // Quiz Elements
        this.elQuestionText = document.getElementById('question-text');
        this.elOptionsContainer = document.getElementById('options-container');
        this.elQuestionTracker = document.getElementById('question-tracker');
        this.elTimeLeft = document.getElementById('time-left');
        this.elProgressBar = document.getElementById('progress-bar');

        // Results Elements
        this.elFinalScore = document.getElementById('final-score');
        this.elPerfMsg = document.getElementById('performance-msg');
        this.elCorrectCount = document.getElementById('correct-count');
        this.elIncorrectCount = document.getElementById('incorrect-count');
        this.elLeaderboardList = document.getElementById('leaderboard-list');
    }

    attachEventListeners() {
        // App Controls
        document.getElementById('theme-toggle').addEventListener('click', () => {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
            document.getElementById('theme-toggle').textContent = isDark ? '🌙' : '☀️';
        });

        document.getElementById('sound-toggle').addEventListener('click', (e) => {
            const isEnabled = this.soundEngine.toggle();
            e.target.textContent = isEnabled ? '🔊' : '🔇';
        });

        // Flow Buttons
        document.getElementById('start-btn').addEventListener('click', () => {
            this.switchScreen('category');
        });

        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.startQuiz(e.target.getAttribute('data-category'));
            });
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            this.switchScreen('category');
        });
    }

    switchScreen(screenName) {
        Object.values(this.screens).forEach(screen => screen.classList.remove('active'));
        this.screens[screenName].classList.add('active');
    }

    startQuiz(category) {
        this.category = category;
        // Filter, copy, and randomize questions
        let filtered = this.database.filter(q => q.category === category);
        this.currentQuestions = this.shuffleArray([...filtered]);
        
        this.currentQuestionIndex = 0;
        this.score = 0;
        
        this.switchScreen('quiz');
        this.loadQuestion();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    loadQuestion() {
        clearInterval(this.timer);
        this.timeLeft = 15;
        this.elTimeLeft.textContent = this.timeLeft;
        
        const q = this.currentQuestions[this.currentQuestionIndex];
        const total = this.currentQuestions.length;

        // Update UI Text
        this.elQuestionTracker.textContent = `Question: ${this.currentQuestionIndex + 1}/${total}`;
        this.elQuestionText.textContent = q.question;
        
        // Update Progress Bar
        const progress = ((this.currentQuestionIndex) / total) * 100;
        this.elProgressBar.style.width = `${progress}%`;

        // Render Options
        this.elOptionsContainer.innerHTML = '';
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => this.handleAnswer(index, btn));
            this.elOptionsContainer.appendChild(btn);
        });

        this.startTimer();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.elTimeLeft.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleTimeout();
            }
        }, 1000);
    }

    handleAnswer(selectedIndex, btnElement) {
        clearInterval(this.timer);
        const q = this.currentQuestions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === q.answer;

        // Disable all buttons
        const buttons = this.elOptionsContainer.querySelectorAll('.option-btn');
        buttons.forEach(btn => btn.disabled = true);

        if (isCorrect) {
            btnElement.classList.add('correct');
            this.score++;
            this.soundEngine.playCorrect();
        } else {
            btnElement.classList.add('wrong');
            // Highlight the actual correct answer
            buttons[q.answer].classList.add('correct');
            this.soundEngine.playWrong();
        }

        setTimeout(() => this.nextQuestion(), 1500);
    }

    handleTimeout() {
        this.soundEngine.playWrong();
        const q = this.currentQuestions[this.currentQuestionIndex];
        const buttons = this.elOptionsContainer.querySelectorAll('.option-btn');
        
        buttons.forEach(btn => btn.disabled = true);
        buttons[q.answer].classList.add('correct'); // Show what they missed
        
        setTimeout(() => this.nextQuestion(), 1500);
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.currentQuestions.length) {
            this.loadQuestion();
        } else {
            this.endQuiz();
        }
    }

    endQuiz() {
        const total = this.currentQuestions.length;
        const percentage = Math.round((this.score / total) * 100);
        
        // Update Result Screen UI
        this.elFinalScore.textContent = `${percentage}%`;
        this.elCorrectCount.textContent = this.score;
        this.elIncorrectCount.textContent = total - this.score;

        if (percentage === 100) this.elPerfMsg.textContent = "Perfect Score! Master Developer!";
        else if (percentage >= 70) this.elPerfMsg.textContent = "Great job! You know your stuff.";
        else this.elPerfMsg.textContent = "Keep learning! Practice makes perfect.";

        // Save and display Leaderboard
        this.leaderboard.saveScore(this.category, this.score, percentage);
        this.renderLeaderboard();

        this.switchScreen('result');
    }

    renderLeaderboard() {
        const scores = this.leaderboard.getScores();
        this.elLeaderboardList.innerHTML = '';
        
        if (scores.length === 0) {
            this.elLeaderboardList.innerHTML = '<li>No scores yet!</li>';
            return;
        }

        scores.forEach(s => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${s.category.toUpperCase()} - ${s.date}</span> <strong>${s.percentage}%</strong>`;
            this.elLeaderboardList.appendChild(li);
        });
    }
}

// Initialize Application once DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp(quizDatabase);
});