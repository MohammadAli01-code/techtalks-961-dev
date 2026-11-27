import type {
  PortfolioMission,
  PortfolioLevel,
} from "../personal-portfolio/portfolio-missions";

// Reuse the existing mission structure without modifying Portfolio.
export type QuizMission = PortfolioMission;
export type QuizLevel = PortfolioLevel;

// LEVELS: Learning objectives and preparation.
export const quizLevels: Record<number, QuizLevel> = {
  1: {
    name: "Project Setup & HTML Structure",
    goal: "Build the complete HTML structure of the quiz application.",
    given: [
      "Create index.html, styles.css, and script.js in one folder.",
      "Use semantic HTML elements.",
      "Learn how to connect HTML, CSS, and JavaScript.",
    ],
  },

  2: {
    name: "CSS Styling & Responsive Design",
    goal: "Create a modern, accessible, responsive quiz interface.",
    given: [
      "Keep the HTML structure from Level 1.",
      "Use CSS variables, Flexbox, and Grid.",
      "Test the interface on desktop and mobile.",
    ],
  },

  3: {
    name: "JavaScript & Quiz Logic",
    goal: "Display questions dynamically and handle answer selection.",
    given: [
      "Use JavaScript arrays and objects.",
      "Use DOM manipulation and event listeners.",
      "Keep the HTML and CSS from previous levels.",
    ],
  },

  4: {
    name: "Score & Quiz Navigation",
    goal: "Calculate scores and navigate between questions.",
    given: [
      "Use conditions, functions, and state variables.",
      "Prevent answering the same question twice.",
      "Update the question counter and progress bar.",
    ],
  },

  5: {
    name: "Final Results & Testing",
    goal: "Complete, restart, and test the quiz application.",
    given: [
      "Display the final score.",
      "Reset the quiz without refreshing the page.",
      "Test correct answers, incorrect answers, and mobile layouts.",
    ],
  },
};

// MISSIONS: Complete guided learning content.
export const quizMissions: QuizMission[] = [
  // LEVEL 1 - MISSION 1
  {
    number: 1,
    level: 1,
    levelTitle: quizLevels[1].name,

    title: "Set up the project files",

    why: "Organizing your files correctly creates a foundation for a maintainable web application.",

    workIn: "Create index.html, styles.css, and script.js in the same folder.",

    tasks: [
      "Create a folder named quiz-application.",
      "Create the three required files.",
      "Write a valid HTML5 document.",
      "Add the UTF-8 charset and viewport metadata.",
      "Connect styles.css and script.js.",
      "Open index.html in your browser.",
    ],

    completedWhen:
      "The browser opens the HTML document and displays the Developer Quiz page title.",

    hint1:
      "The head contains page information and links to external files.",

    hint2:
      "Use a link element for CSS and a script element with defer for JavaScript.",

    solutionLanguage: "html",

    solution: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
  <title>Developer Quiz</title>
  <link rel="stylesheet" href="styles.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main class="quiz-container">
    <h1>Developer Quiz</h1>
  </main>
</body>
</html>`,

    check:
      "The browser displays Developer Quiz without errors.",

    image: null,
  },

  // LEVEL 1 - MISSION 2
  {
    number: 2,
    level: 1,
    levelTitle: quizLevels[1].name,

    title: "Build the quiz interface",

    why: "The interface needs dedicated elements for questions, answers, feedback, and navigation.",

    workIn:
      "index.html. Replace the existing main element with the following structure.",

    tasks: [
      "Create the quiz header.",
      "Add question and score counters.",
      "Add a progress bar.",
      "Create a question heading.",
      "Create an answer container.",
      "Add feedback and navigation elements.",
      "Create a hidden results section.",
    ],

    completedWhen:
      "The page contains all the elements required by the future JavaScript logic.",

    hint1:
      "Give dynamic elements unique IDs so JavaScript can select them.",

    hint2:
      "Use question, answers, score, progress, and next-button as element IDs.",

    solutionLanguage: "html",

    solution: `<main class="quiz-container">
  <header class="quiz-header">
    <p class="eyebrow">WEB DEVELOPMENT</p>
    <h1>Developer Quiz</h1>
  </header>

  <section id="quiz-screen">
    <div class="quiz-info">
      <span id="question-counter">
        Question 1 of 5
      </span>
      <span>Score: <strong id="score">0</strong></span>
    </div>

    <div class="progress-track">
      <div id="progress"></div>
    </div>

    <h2 id="question">
      Which language adds interactivity to websites?
    </h2>

    <div id="answers">
      <button class="answer">HTML</button>
      <button class="answer">CSS</button>
      <button class="answer">JavaScript</button>
      <button class="answer">SQL</button>
    </div>

    <p id="feedback" aria-live="polite"></p>

    <button id="next-button" disabled>
      Next Question
    </button>
  </section>

  <section id="result-screen" hidden>
    <h2>Quiz Completed!</h2>
    <p id="final-score"></p>
    <button id="restart-button">
      Restart Quiz
    </button>
  </section>
</main>`,

    check:
      "The heading, four answer buttons, score, progress bar, and Next Question button appear.",

    image: "/projects/quiz-application/mission-02.png",
  },

  // LEVEL 2 - MISSION 3
  {
    number: 3,
    level: 2,
    levelTitle: quizLevels[2].name,

    title: "Style the quiz container",

    why: "A consistent visual foundation makes the application readable and professional.",

    workIn: "styles.css. Add the initial global styles.",

    tasks: [
      "Define reusable CSS color variables.",
      "Remove the default body margin.",
      "Center the quiz on the page.",
      "Style the main quiz container.",
      "Style the heading and score information.",
      "Create a visible progress bar.",
    ],

    completedWhen:
      "The quiz appears as a centered card with consistent colors, spacing, and typography.",

    hint1:
      "Use CSS custom properties inside :root.",

    hint2:
      "Use display: grid and place-items: center on the body.",

    solutionLanguage: "css",

    solution: `:root {
  --blue: #0066ff;
  --cyan: #22d3ee;
  --background: #080d1e;
  --surface: #151d34;
  --border: #334155;
  --text: #ffffff;
  --muted: #94a3b8;
  --success: #22c55e;
  --error: #ef4444;
}

* {
  box-sizing: border-box;
}

[hidden] {
  display: none !important;
}

body {
  margin: 0;
  min-height: 100vh;
  padding: 24px;
  display: grid;
  place-items: center;
  background: var(--background);
  color: var(--text);
  font-family: Arial, sans-serif;
}

.quiz-container {
  width: min(100%, 620px);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.eyebrow {
  color: var(--cyan);
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 2px;
}

h1 {
  margin: 8px 0 24px;
}

.quiz-info {
  display: flex;
  justify-content: space-between;
  color: var(--muted);
  font-size: 14px;
}

.progress-track {
  height: 8px;
  margin: 12px 0 24px;
  background: var(--border);
  border-radius: 10px;
  overflow: hidden;
}

#progress {
  width: 20%;
  height: 100%;
  background: var(--cyan);
}`,

    check:
      "The quiz card is centered with a dark background and blue/cyan accents.",

    image: null,
  },

  // LEVEL 2 - MISSION 4
  {
    number: 4,
    level: 2,
    levelTitle: quizLevels[2].name,

    title: "Design answer buttons and responsive layouts",

    why: "Clear buttons and responsive layouts help users interact with the quiz on different devices.",

    workIn:
      "styles.css. Append these rules below Mission 3.",

    tasks: [
      "Arrange answer buttons in a two-column grid.",
      "Style the answer buttons.",
      "Add hover and keyboard focus states.",
      "Create correct and incorrect answer styles.",
      "Style disabled buttons.",
      "Use a media query for smaller screens.",
    ],

    completedWhen:
      "The answer buttons are readable and the layout adapts to phone screens.",

    hint1:
      "CSS Grid can organize the answer buttons into equal columns.",

    hint2:
      "Use grid-template-columns: repeat(2, 1fr) and a mobile media query.",

    solutionLanguage: "css",

    solution: `#answers {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 20px;
}

button {
  font: inherit;
  cursor: pointer;
}

.answer {
  padding: 14px;
  background: var(--background);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 10px;
  text-align: left;
}

.answer:not(:disabled):hover {
  border-color: var(--cyan);
}

button:focus-visible {
  outline: 3px solid var(--cyan);
  outline-offset: 3px;
}

.answer.correct {
  border-color: var(--success);
  background: #14532d;
}

.answer.incorrect {
  border-color: var(--error);
  background: #7f1d1d;
}

#next-button,
#restart-button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: var(--blue);
  color: white;
  font-weight: bold;
}

button:disabled {
  cursor: not-allowed;
}

#next-button:disabled {
  opacity: 0.5;
}

#feedback {
  min-height: 24px;
  font-size: 14px;
}

@media (max-width: 480px) {
  body {
    padding: 12px;
  }

  .quiz-container {
    padding: 18px;
  }

  #answers {
    grid-template-columns: 1fr;
  }

  h2 {
    font-size: 18px;
  }
}`,

    check:
      "Answers appear in two columns on desktop and one column on mobile.",

    image: "/projects/quiz-application/mission-04.png",
  },

  // LEVEL 3 - MISSION 5
  {
    number: 5,
    level: 3,
    levelTitle: quizLevels[3].name,

    title: "Create the questions array",

    why: "Storing questions as objects separates application data from presentation and makes the quiz easier to maintain.",

    workIn: "script.js. Add the questions array.",

    tasks: [
      "Create an array named questions.",
      "Represent every question as an object.",
      "Add a question property.",
      "Add an options array containing four answers.",
      "Store the correct answer index.",
      "Create five web development questions.",
    ],

    completedWhen:
      "The questions array contains five valid question objects.",

    hint1:
      "An array can store multiple objects with the same structure.",

    hint2:
      "Array indexes start at zero. The third option has index 2.",

    solutionLanguage: "javascript",

    solution: `const questions = [
  {
    question: "Which language adds interactivity to websites?",
    options: ["HTML", "CSS", "JavaScript", "SQL"],
    correct: 2
  },
  {
    question: "Which HTML element creates a hyperlink?",
    options: ["<p>", "<a>", "<div>", "<h1>"],
    correct: 1
  },
  {
    question: "Which CSS property changes text color?",
    options: ["background", "font-size", "margin", "color"],
    correct: 3
  },
  {
    question: "Which method selects an element by its ID?",
    options: [
      "getElementById()",
      "push()",
      "split()",
      "parseInt()"
    ],
    correct: 0
  },
  {
    question: "What is the index of the first array element?",
    options: ["1", "2", "0", "-1"],
    correct: 2
  }
];`,

    check:
      "Typing questions.length in the browser console returns 5.",

    image: null,
  },

  // LEVEL 3 - MISSION 6
  {
    number: 6,
    level: 3,
    levelTitle: quizLevels[3].name,

    title: "Display questions dynamically",

    why: "Dynamic rendering allows one interface to display multiple questions without creating separate HTML pages.",

    workIn:
      "script.js. Append the following code below the questions array.",

    tasks: [
      "Create a current question index.",
      "Select the question and answer elements.",
      "Create a function named showQuestion.",
      "Read the current question from the array.",
      "Clear previously displayed answers.",
      "Generate answer buttons dynamically.",
      "Call showQuestion when the page loads.",
    ],

    completedWhen:
      "The first question and its four answers are generated from the JavaScript array.",

    hint1:
      "Use questions[currentQuestion] to access the current object.",

    hint2:
      "Use forEach and document.createElement to create answer buttons.",

    solutionLanguage: "javascript",

    solution: `let currentQuestion = 0;
let score = 0;
let answered = false;

const questionElement =
  document.getElementById("question");

const answersElement =
  document.getElementById("answers");

const nextButton =
  document.getElementById("next-button");

const feedback =
  document.getElementById("feedback");

function showQuestion() {
  answered = false;
  nextButton.disabled = true;
  feedback.textContent = "";

  const current = questions[currentQuestion];

  questionElement.textContent = current.question;
  answersElement.innerHTML = "";

  current.options.forEach((option, index) => {
    const button = document.createElement("button");

    button.className = "answer";
    button.type = "button";
    button.textContent = option;
    button.dataset.index = index;

    answersElement.appendChild(button);
  });
}

showQuestion();`,

    check:
      "Changing the first question in the array changes the displayed question after refresh.",

    image: null,
  },

  // LEVEL 3 - MISSION 7
  {
    number: 7,
    level: 3,
    levelTitle: quizLevels[3].name,

    title: "Handle answer selection",

    why: "The application must respond to user clicks, validate answers, and prevent repeated submissions.",

    workIn:
      "script.js. Append the answer selection logic below the existing code.",

    tasks: [
      "Listen for clicks inside the answers container.",
      "Identify the selected answer button.",
      "Compare its index with the correct answer.",
      "Display correct or incorrect feedback.",
      "Highlight the correct answer.",
      "Disable all answers after selection.",
      "Enable the Next Question button.",
    ],

    completedWhen:
      "Selecting an answer displays feedback and prevents a second answer submission.",

    hint1:
      "Use an event listener on the answers container.",

    hint2:
      "Compare Number(button.dataset.index) with questions[currentQuestion].correct.",

    solutionLanguage: "javascript",

    solution: `answersElement.addEventListener("click", (event) => {
  const button = event.target.closest(".answer");

  if (!button || answered) return;

  answered = true;

  const selected = Number(button.dataset.index);
  const correct = questions[currentQuestion].correct;

  if (selected === correct) {
    button.classList.add("correct");
    feedback.textContent = "Correct answer!";
  } else {
    button.classList.add("incorrect");
    feedback.textContent = "Incorrect answer.";
  }

  answersElement.querySelectorAll(".answer")
    .forEach((answerButton) => {
      answerButton.disabled = true;

      if (Number(answerButton.dataset.index) === correct) {
        answerButton.classList.add("correct");
      }
    });

  nextButton.disabled = false;
});`,

    check:
      "Correct answers turn green, incorrect answers turn red, and repeated clicks are prevented.",

    image: "/projects/quiz-application/mission-07.png",
  },

  // LEVEL 4 - MISSION 8
  {
    number: 8,
    level: 4,
    levelTitle: quizLevels[4].name,

    title: "Implement score calculation",

    why: "A quiz needs an accurate score that increases only once for each correct answer.",

    workIn:
      "script.js. Add updateScore before the existing answer click listener. Inside the correct-answer branch, call updateScore().",

    tasks: [
      "Select the score element.",
      "Create an updateScore function.",
      "Increase the score for correct answers only.",
      "Update the visible score.",
      "Keep the answered guard from Mission 7.",
      "Test that incorrect answers do not increase the score.",
    ],

    completedWhen:
      "The score increases exactly once when a correct answer is selected.",

    hint1:
      "The score variable already exists from Mission 6.",

    hint2:
      "Increment score using score += 1 and update textContent.",

    solutionLanguage: "javascript",

    solution: `// Add this function before the click listener.
const scoreElement =
  document.getElementById("score");

function updateScore() {
  score += 1;
  scoreElement.textContent = score;
}

// Inside the existing correct-answer branch,
// add the updateScore() call:
//
// if (selected === correct) {
//   button.classList.add("correct");
//   feedback.textContent = "Correct answer!";
//   updateScore();
// }
//
// Keep the remaining listener unchanged.`,

    check:
      "Selecting a correct answer changes the score from 0 to 1. Repeated clicks do not increase it.",

    image: "/projects/quiz-application/mission-08.png",
  },

  // LEVEL 4 - MISSION 9
  {
    number: 9,
    level: 4,
    levelTitle: quizLevels[4].name,

    title: "Add question navigation and progress",

    why: "Learners need to move through the quiz and understand how many questions remain.",

    workIn:
      "script.js. Append the navigation code. Call updateProgress() after showQuestion() when navigating or restarting.",

    tasks: [
      "Select the question counter and progress bar.",
      "Create a function to update progress.",
      "Display the current question number.",
      "Listen for Next Question clicks.",
      "Advance the question index.",
      "Prevent navigation beyond the last question.",
      "Show the result screen after the last answer.",
    ],

    completedWhen:
      "The learner can navigate through all five questions in order without accessing an invalid array index.",

    hint1:
      "The displayed question number is currentQuestion + 1.",

    hint2:
      "Compare currentQuestion + 1 with questions.length before advancing.",

    solutionLanguage: "javascript",

    solution: `const counterElement =
  document.getElementById("question-counter");

const progressElement =
  document.getElementById("progress");

function updateProgress() {
  counterElement.textContent =
    "Question " + (currentQuestion + 1) +
    " of " + questions.length;

  progressElement.style.width =
    ((currentQuestion + 1) / questions.length) *
    100 + "%";

  nextButton.textContent =
    currentQuestion === questions.length - 1
      ? "Finish Quiz"
      : "Next Question";
}

nextButton.addEventListener("click", () => {
  if (!answered) return;

  if (currentQuestion + 1 < questions.length) {
    currentQuestion += 1;
    showQuestion();
    updateProgress();
  } else {
    document.getElementById("quiz-screen").hidden = true;
    document.getElementById("result-screen").hidden = false;

    document.getElementById("final-score").textContent =
      "Your score: " + score + " / " + questions.length;
  }
});

updateProgress();

// Keep updateProgress() after every showQuestion()
// call when navigating or restarting.`,

    check:
      "The question counter and progress bar update, and Finish Quiz appears on the last question.",

    image: "/projects/quiz-application/mission-09.png",
  },

  // LEVEL 5 - MISSION 10
  {
    number: 10,
    level: 5,
    levelTitle: quizLevels[5].name,

    title: "Display final results and restart the quiz",

    why: "A complete application should provide a meaningful result and allow users to try again.",

    workIn:
      "script.js. Append the restart logic. Keep the result display from Mission 9.",

    tasks: [
      "Select the quiz and result sections.",
      "Select the restart button.",
      "Create a restartQuiz function.",
      "Reset the question index and score.",
      "Hide the result screen.",
      "Show the quiz screen again.",
      "Render the first question and reset progress.",
    ],

    completedWhen:
      "The learner can complete the quiz, view the final score, and restart without refreshing.",

    hint1:
      "Reset all state variables to their initial values.",

    hint2:
      "Set currentQuestion and score to zero, then call showQuestion and updateProgress.",

    solutionLanguage: "javascript",

    solution: `const quizScreen =
  document.getElementById("quiz-screen");

const resultScreen =
  document.getElementById("result-screen");

const restartButton =
  document.getElementById("restart-button");

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = false;

  scoreElement.textContent = "0";

  resultScreen.hidden = true;
  quizScreen.hidden = false;

  showQuestion();
  updateProgress();
}

restartButton.addEventListener(
  "click",
  restartQuiz
);`,

    check:
      "Restart Quiz returns to Question 1 with a score of zero.",

    image: "/projects/quiz-application/mission-10.png",
  },

  // LEVEL 5 - MISSION 11
  {
    number: 11,
    level: 5,
    levelTitle: quizLevels[5].name,

    title: "Test and improve the application",

    why: "Testing verifies that the complete application behaves correctly under different user interactions.",

    workIn:
      "index.html, styles.css, script.js, and browser Developer Tools.",

    tasks: [
      "Complete the quiz with all correct answers.",
      "Verify that the final score is 5 out of 5.",
      "Complete the quiz with all incorrect answers.",
      "Verify that the final score is 0 out of 5.",
      "Verify that repeated answer clicks cannot increase the score.",
      "Verify that Next Question is disabled before answering.",
      "Restart the quiz and check all initial values.",
      "Test the layout at mobile and desktop widths.",
      "Test keyboard navigation.",
      "Check the browser console for JavaScript errors.",
    ],

    completedWhen:
      "The quiz runs correctly, scores accurately, restarts successfully, and remains usable on different screen sizes.",

    hint1:
      "Test both successful and unsuccessful user interactions.",

    hint2:
      "Use the browser console and responsive device toolbar to identify problems.",

    solutionLanguage: "javascript",

    solution: `// Optional development checks.
// Run these in the browser console.

console.assert(
  questions.length === 5,
  "There should be five questions."
);

console.assert(
  questions.every((question) =>
    question.options.length === 4 &&
    Number.isInteger(question.correct) &&
    question.correct >= 0 &&
    question.correct < question.options.length
  ),
  "Every question must have four options and a valid answer index."
);

// Manual testing is still required:
// 1. All correct answers: 5/5.
// 2. All incorrect answers: 0/5.
// 3. No repeated scoring.
// 4. Restart resets all values.
// 5. Mobile layout has no horizontal overflow.
// 6. Keyboard navigation remains accessible.`,

    check:
      "All functional tests pass and no unexpected JavaScript errors appear.",

    image: null,
  },
];
