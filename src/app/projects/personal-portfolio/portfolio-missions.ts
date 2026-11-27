// Content is derived from our approved Personal Portfolio (Easy) tutorial.
// The UI consumes this data; replacing it with Supabase records later won't
// require rebuilding the Mission Workspace.

export type PortfolioMission = {
  number: number;
  level: number;
  levelTitle: string;
  title: string;
  why: string;
  workIn: string;
  tasks: string[];
  completedWhen: string;
  hint1: string;
  hint2: string;
  solutionLanguage: string;
  solution: string;
  check: string;
  image: string | null;
};

export type PortfolioLevel = {
  name: string;
  goal: string;
  given: string[];
};

export const portfolioLevels: Record<number, PortfolioLevel> = {
  "1": {
    "name": "HTML Foundations",
    "goal": "Build the complete structural beginning of a personal portfolio. By the end of this level, a visitor can tell who the developer is, see the main navigation, and find clear actions to explore projects or make contact. Focus on meaningful HTML; appearance comes later.",
    "given": [
      "**Starting files:** Create three files in one folder: `index.html` (page content), `styles.css` (empty for now), and `script.js` (empty for now).",
      "**HTML tools:** `<!DOCTYPE html>`, `<html>`, `<head>`, `<meta>`, `<title>`, `<link>`, `<script>`, `<body>`, `<header>`, `<nav>`, `<main>`, `<section>`, `<h1>`, `<h2>`, `<p>`, `<a>`, `<button>`, `<div>`, and `<span>`.",
      "**How they help:** HTML creates structure; `id` provides a destination for page links; `class` names give us styling targets in later levels.",
      "**Starter content:** You may use the fictional developer name **Alex Morgan** throughout, or replace it consistently with your own name. No images or external packages are necessary."
    ]
  },
  "2": {
    "name": "Meaningful Portfolio Content",
    "goal": "Turn the opening screen into a useful, honest portfolio. A visitor should learn what the developer is practicing, see example work, and have a real way to get in touch.",
    "given": [
      "**Starting point:** Keep the `index.html` from Level 1. It already has a header, navigation, hero, `<main id=\"main-content\">`, and an empty footer. Do not erase previous missions.",
      "**HTML tools:** `<section>`, `<h2>`, `<h3>`, `<p>`, `<ul>`, `<li>`, `<article>`, `<div>`, `<span>`, and `<a href=\"mailto:...\">`.",
      "**How they help:** Sections organize a long page; lists group related skills; articles represent individual portfolio projects; `mailto:` can open an email app without a backend.",
      "**Content guideline:** The name, email, and project descriptions in the reference are **examples**. Change them to reflect real work before publishing the portfolio. Do not add broken \"Live Demo\" links or claim projects you haven't built."
    ]
  },
  "3": {
    "name": "Professional CSS Styling",
    "goal": "Give the previously built HTML a coherent visual identity, beginning with reusable site-wide styles and finishing with a polished header and introduction area.",
    "given": [
      "**Starting point:** All content and class names from Levels 1 and 2 are present in `index.html`. Work in `styles.css`; leave the structure of `index.html` alone unless correcting a typo.",
      "**CSS tools:** selectors, `:root`, custom properties such as `--blue`, `var()`, typography, `margin`, `padding`, `background`, `border`, `border-radius`, `box-shadow`, `display: flex`, and `display: grid`.",
      "**How they help:** Reusing CSS variables keeps colors consistent; Flexbox arranges navigation and buttons; Grid makes the hero text and introduction card sit side by side.",
      "**Design direction:** A readable, clean blue-and-white portfolio. The initial color values are examples; no CSS framework is required."
    ]
  },
  "4": {
    "name": "Responsive Design",
    "goal": "Finish styling the remaining portfolio sections and make the entire layout usable on both wide and narrow screens.",
    "given": [
      "**Starting point:** The HTML is complete and `styles.css` already contains the global styles, header, hero, and introduction-card rules from Level 3.",
      "**CSS tools:** reusable selectors, `display: flex`, `flex-wrap`, CSS Grid columns, responsive sizing, and `@media (max-width: 760px)`.",
      "**How they help:** Shared section styles reduce repetition; grid columns can collapse to one column on smaller screens; the media query reveals a compact navigation button on phones.",
      "**Suggested screens:** Check approximately **1280px** wide (desktop) and **375px** wide (phone) using your browser's device toolbar, then try an intermediate width."
    ]
  },
  "5": {
    "name": "JavaScript and Final Touches",
    "goal": "Add a small amount of JavaScript that solves actual user-experience problems and verify the complete portfolio.",
    "given": [
      "**Starting point:** Your HTML and CSS work from Levels 1–4 is complete. The HTML already includes `.menu-button`, `.navigation`, and `<span id=\"year\">`. `script.js` is ready to fill in.",
      "**JavaScript tools:** `document.querySelector()`, `querySelectorAll()`, `addEventListener()`, `classList.toggle()`, `classList.remove()`, `setAttribute()`, `textContent`, `new Date()`, and `getFullYear()`.",
      "**How they help:** DOM selection finds existing elements; click events respond to the visitor; changing the `.open` class reveals the mobile menu; updating `aria-expanded` communicates state to assistive technology.",
      "**Boundary:** No React, no libraries, no backend, no user accounts, and no form submission required. Keep the JavaScript short and understandable."
    ]
  }
};

export const portfolioMissions: PortfolioMission[] = [
  {
    "number": 1,
    "level": 1,
    "levelTitle": "HTML Foundations",
    "title": "Create the page skeleton",
    "why": "A portfolio cannot be styled or made interactive until the browser has a valid HTML document to display. In this mission you create the foundation that every later mission will build on.",
    "workIn": "`index.html`. Create `styles.css` and `script.js` as empty files in the **same folder** so their links will work later.",
    "tasks": [
      "Start `index.html` as an HTML5 document and declare that its content is in English. Include a `<head>` for information about the page and a `<body>` for everything visitors will see.",
      "Inside `<head>`, declare the UTF-8 character set, set the mobile viewport so the layout can adapt to phone screens later, add a meaningful browser-tab title, and include a short description of the portfolio.",
      "Link `styles.css` using a stylesheet `<link>` tag. Connect `script.js` using a `<script>` tag with `defer` so JavaScript can run after the HTML has been parsed.",
      "Inside `<body>`, add three landmarks in the correct order: an initially empty `<header>`, an empty `<main id=\"main-content\">`, and an empty `<footer>`. Give the header and footer the class names shown in the reference because later CSS will target them.",
      "Add a \"Skip to content\" link that points to `#main-content`, so keyboard users can jump directly to the page's main content.",
      "Save the files and open `index.html` in a browser. It is **normal for the page to look almost empty** at this stage; you are building structure, not design."
    ],
    "completedWhen": "The browser tab shows \"Alex Morgan | Web Developer\" (or your chosen name), the page opens without an HTML error, the three semantic areas exist in the document, and the browser can find both linked files. Do not add navigation, portfolio sections, or CSS yet; they have their own missions.",
    "hint1": "The `head` contains information about the page; visible content belongs inside `body`.",
    "hint2": "Use `link rel=\"stylesheet\"` for the CSS file and `<script src=\"script.js\" defer>` for JavaScript. Put `header`, `main`, and `footer` inside `body`.",
    "solutionLanguage": "html",
    "solution": "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <meta name=\"description\" content=\"Alex Morgan's beginner web developer portfolio.\" />\n    <title>Alex Morgan | Web Developer</title>\n    <link rel=\"stylesheet\" href=\"styles.css\" />\n    <script src=\"script.js\" defer></script>\n  </head>\n  <body>\n    <a class=\"skip-link\" href=\"#main-content\">Skip to content</a>\n    <!-- Add the header in Mission 2. -->\n    <header class=\"site-header\"></header>\n    <!-- Add the hero and other sections later. -->\n    <main id=\"main-content\"></main>\n    <footer class=\"site-footer\"></footer>\n  </body>\n</html>",
    "check": "The browser tab says “Alex Morgan | Web Developer” and the page opens without an error.",
    "image": null
  },
  {
    "number": 2,
    "level": 1,
    "levelTitle": "HTML Foundations",
    "title": "Add a navigation bar",
    "why": "Visitors need an obvious way to move between parts of a one-page portfolio. The header is the map they will use to explore your work.",
    "workIn": "`index.html`, replacing the **empty `<header class=\"site-header\"></header>`** created in Mission 1. Keep the rest of the document unchanged.",
    "tasks": [
      "Place a wrapper inside the header that can later center and align its contents; use the classes `container` and `header-content`.",
      "Add a short text logo (for example, \"Alex.\") and make it a link to `#home`. This takes the visitor back to the introductory hero section once it exists.",
      "Add a button that will eventually open a menu on mobile. Give it `type=\"button\"`, the class `menu-button`, and an understandable accessible label. Set `aria-controls` to the ID of your navigation and start `aria-expanded` as `false`.",
      "Add a `<nav>` with the class `navigation` and the ID `main-navigation`. Inside it, create exactly four clear links: **About**, **Skills**, **Projects**, and **Contact**. Point them to `#about`, `#skills`, `#projects`, and `#contact` respectively.",
      "Keep these link destinations consistent with the section IDs you will create in Level 2. Avoid pointing to made-up pages or using `href=\"#\"` as a placeholder."
    ],
    "completedWhen": "The logo, menu button, and four labeled links exist in the header. They may appear as plain text and links because no CSS has been added. Some anchors will not scroll yet because their sections are built in later missions; the menu button will become functional in Level 5.",
    "hint1": "A same-page link uses `href=\"#section-id\"`, where the target section has the matching `id`.",
    "hint2": "Create a `nav` element with About, Skills, Projects, Contact. Give the menu button `aria-controls=\"main-navigation\"` and `aria-expanded=\"false\"`.",
    "solutionLanguage": "html",
    "solution": "<header class=\"site-header\">\n      <div class=\"container header-content\">\n        <a class=\"logo\" href=\"#home\" aria-label=\"Alex Morgan, homepage\">Alex<span>.</span></a>\n        <button\n          class=\"menu-button\"\n          type=\"button\"\n          aria-controls=\"main-navigation\"\n          aria-expanded=\"false\"\n          aria-label=\"Open navigation menu\"\n        >\n          ☰\n        </button>\n        <nav class=\"navigation\" id=\"main-navigation\" aria-label=\"Main navigation\">\n          <a href=\"#about\">About</a>\n          <a href=\"#skills\">Skills</a>\n          <a href=\"#projects\">Projects</a>\n          <a class=\"nav-contact\" href=\"#contact\">Contact</a>\n        </nav>\n      </div>\n    </header>",
    "check": "The four links are visible as normal unstyled links for now.",
    "image": "/project-assets/personal-portfolio/mission-02-expected.png"
  },
  {
    "number": 3,
    "level": 1,
    "levelTitle": "HTML Foundations",
    "title": "Introduce yourself in the hero",
    "why": "The first screen should quickly tell a visitor **who you are, what you do, and what action they can take next**. A hero with clear information is more useful than a decorative heading alone.",
    "workIn": "`index.html`, **inside `<main id=\"main-content\">`**, immediately after the opening `<main>` tag. Do not put the hero inside the header.",
    "tasks": [
      "Create a section with `id=\"home\"` and the classes `hero container`. This makes the logo's `#home` link meaningful and gives CSS a clear target.",
      "In a `hero-copy` container, add a short greeting such as \"HELLO, I'M ALEX\". Follow it with **one main `<h1>`** that describes what the developer builds, rather than just repeating the developer's name.",
      "Write a brief supporting paragraph identifying the developer as a beginner learning HTML, CSS, and JavaScript through practical projects. Keep it honest and easy to read.",
      "Add two action links inside a `hero-actions` group: **See My Projects** links to `#projects`, and **Contact Me** links to `#contact`. Use links rather than buttons because these actions navigate to page sections.",
      "Next to the introduction content, add an `intro-card` showing initials, a name, a learning role, and three small technology labels: HTML, CSS, and JavaScript. Group these parts so CSS can style them as one card later.",
      "Use class names consistently, including `hero-description`, `intro-card`, `avatar`, and `mini-skills`. They will matter in the CSS missions."
    ],
    "completedWhen": "You can see a greeting, a meaningful page heading, a short introduction, both action links, and a separate information card with the person's name and technology labels. It is okay for the two areas to stack vertically before CSS. The Projects and Contact links will work once Level 2 creates those sections.",
    "hint1": "Use an `h1` for the main page title. Buttons that navigate to a section should be `<a>` links.",
    "hint2": "Link “See My Projects” to `#projects`, “Contact Me” to `#contact`, and add an introductory card with your name and technology labels.",
    "solutionLanguage": "html",
    "solution": "<section class=\"hero container\" id=\"home\" aria-labelledby=\"hero-title\">\n        <div class=\"hero-copy\">\n          <p class=\"eyebrow\">HELLO, I'M ALEX 👋</p>\n          <h1 id=\"hero-title\">I build <span>simple, useful</span> websites.</h1>\n          <p class=\"hero-description\">\n            I'm Alex Morgan, an aspiring web developer learning HTML, CSS,\n            and JavaScript by creating real projects.\n          </p>\n          <div class=\"hero-actions\">\n            <a class=\"button button-primary\" href=\"#projects\">See My Projects</a>\n            <a class=\"button button-outline\" href=\"#contact\">Contact Me</a>\n          </div>\n        </div>\n        <div class=\"intro-card\" aria-label=\"Introduction card\">\n          <div class=\"avatar\" aria-hidden=\"true\">AM</div>\n          <p class=\"intro-label\">NICE TO MEET YOU</p>\n          <h2>Alex Morgan</h2>\n          <p>Aspiring Frontend Developer</p>\n          <div class=\"intro-divider\"></div>\n          <p class=\"intro-caption\">Currently building with</p>\n          <div class=\"mini-skills\" aria-label=\"Technologies I am learning\">\n            <span>HTML</span><span>CSS</span><span>JavaScript</span>\n          </div>\n        </div>\n      </section>",
    "check": "The hero heading, two calls to action, and name card appear in the browser.",
    "image": "/project-assets/personal-portfolio/mission-03-expected.png"
  },
  {
    "number": 4,
    "level": 2,
    "levelTitle": "Meaningful Portfolio Content",
    "title": "Write the About section",
    "why": "A portfolio needs context. Visitors should understand the developer's interests and learning direction before seeing a list of technologies or projects.",
    "workIn": "`index.html`, **after the hero section and before the closing `</main>`**. Keep the hero untouched.",
    "tasks": [
      "Create a new `<section>` with `id=\"about\"` so the About navigation link has a destination. Apply the existing section-related class names `section section-white`.",
      "Add a `container narrow` wrapper. This will help keep long paragraphs readable when CSS is introduced.",
      "Give the section a small label (such as \"01 / ABOUT\") and a clear `<h2>` heading such as \"A little about me\".",
      "Write one short paragraph, approximately three sentences, answering these questions in natural language: **What interests you about web development? What are you learning? What do you hope to build next?** You may use the reference text as a model; don't invent qualifications or experience.",
      "Make sure the section heading and the navigation target belong to this About section rather than another section."
    ],
    "completedWhen": "The About section appears after the hero, its heading is easy to identify, and clicking **About** in the header moves to this section. The text should communicate something about the learner, not just display filler words.",
    "hint1": "Every main section should have its own unique `id` and a visible heading.",
    "hint2": "Use `<section id=\"about\">`, a `<h2>` heading, and one readable paragraph of three sentences.",
    "solutionLanguage": "html",
    "solution": "<section class=\"section section-white\" id=\"about\" aria-labelledby=\"about-title\">\n        <div class=\"container narrow\">\n          <p class=\"section-label\">01 / ABOUT</p>\n          <h2 id=\"about-title\">A little about me</h2>\n          <p class=\"body-copy\">\n            I'm a curious learner who enjoys turning ideas into web pages.\n            I started with the basics and I'm improving one project at a time.\n            My goal is to create websites that are clear, accessible, and easy to use.\n          </p>\n        </div>\n      </section>",
    "check": "Clicking About in the navigation scrolls to the About section.",
    "image": "/project-assets/personal-portfolio/mission-04-expected.png"
  },
  {
    "number": 5,
    "level": 2,
    "levelTitle": "Meaningful Portfolio Content",
    "title": "List your skills",
    "why": "Visitors want to see which tools the developer knows or is actively learning. A small, organized list is easier to scan than a long paragraph of technology names.",
    "workIn": "`index.html`, **directly after the About section and still inside `<main>`**.",
    "tasks": [
      "Create a Skills section with `id=\"skills\"` so the Skills navigation link works. Use a main `<h2>` for the section title and one short sentence introducing the list.",
      "Add an **unordered list** (`<ul>`) with the class `skill-list` because these skills have no ranking or required sequence.",
      "Add exactly three `<li>` items for the beginner portfolio: **HTML — Page structure**, **CSS — Layout and design**, and **JavaScript — Interactivity**. Each item should tell the visitor what the technology is used for, not just name it.",
      "Keep the list inside the Skills section, and do not use three disconnected `<p>` elements in place of list items.",
      "Use the class names from the reference so these items can become consistent visual skill chips in Level 4."
    ],
    "completedWhen": "The page contains a clearly labeled Skills section, a list with three distinct skills and useful explanations, and the **Skills** navigation link scrolls to the correct section.",
    "hint1": "Use `ul` for a set of related items, and `li` for each skill.",
    "hint2": "Add three skills: HTML for structure, CSS for design, and JavaScript for interactivity.",
    "solutionLanguage": "html",
    "solution": "<section class=\"section\" id=\"skills\" aria-labelledby=\"skills-title\">\n        <div class=\"container narrow\">\n          <p class=\"section-label\">02 / SKILLS</p>\n          <h2 id=\"skills-title\">What I'm learning</h2>\n          <p class=\"section-intro\">The tools I'm using to turn my ideas into websites.</p>\n          <ul class=\"skill-list\" aria-label=\"My web development skills\">\n            <li>HTML — Page structure</li>\n            <li>CSS — Layout and design</li>\n            <li>JavaScript — Interactivity</li>\n          </ul>\n        </div>\n      </section>",
    "check": "The browser displays three clearly named skills.",
    "image": "/project-assets/personal-portfolio/mission-05-expected.png"
  },
  {
    "number": 6,
    "level": 2,
    "levelTitle": "Meaningful Portfolio Content",
    "title": "Create two project cards",
    "why": "A portfolio is strongest when it shows concrete work. Project cards give visitors a quick overview of what was built, what problem it addresses, and which technologies were used.",
    "workIn": "`index.html`, **after the Skills section and before Contact** (Contact is created in the next mission).",
    "tasks": [
      "Add a section with `id=\"projects\"`, a small \"03 / PROJECTS\" label, and an `<h2>` heading. Include a short introductory sentence.",
      "Create a wrapper with the class `project-grid`. It will hold multiple project cards and become a two-column grid in Level 4.",
      "Inside it, add **two separate `<article class=\"project-card\">` elements**. Each card must be understandable by itself.",
      "For each card, include a small visual symbol, a project number, a descriptive `<h3>` title, a **one-sentence explanation of what the project does**, and small technology labels in a `project-tags` container.",
      "Use the example cards **Personal Portfolio** (HTML/CSS) and **To-Do List** (HTML/CSS/JavaScript) from the reference if you need practice content. If you are making a real portfolio, replace any example for a project you haven't actually built—do not claim a fictional To-Do List as completed work.",
      "Do **not** add \"View Demo\" or \"GitHub\" links unless you already have valid destinations. An honest informational card is better than a broken button."
    ],
    "completedWhen": "Clicking **Projects** reaches the right section, exactly two cards appear, and each card explains a recognizable project and its technologies. They can stack for now; CSS Grid will arrange them later.",
    "hint1": "A self-contained item such as a project is a good use for `<article>`.",
    "hint2": "Place both `<article class=\"project-card\">` items inside one `<div class=\"project-grid\">`. Don’t add dummy links.",
    "solutionLanguage": "html",
    "solution": "<section class=\"section section-white\" id=\"projects\" aria-labelledby=\"projects-title\">\n        <div class=\"container\">\n          <p class=\"section-label\">03 / PROJECTS</p>\n          <h2 id=\"projects-title\">Things I've built</h2>\n          <p class=\"section-intro\">A few practice projects that helped me learn.</p>\n          <div class=\"project-grid\">\n            <article class=\"project-card\">\n              <div class=\"project-symbol\" aria-hidden=\"true\">&lt;/&gt;</div>\n              <p class=\"project-number\">PROJECT 01</p>\n              <h3>Personal Portfolio</h3>\n              <p>A responsive page to introduce myself, share skills, and showcase my work.</p>\n              <div class=\"project-tags\"><span>HTML</span><span>CSS</span></div>\n            </article>\n            <article class=\"project-card\">\n              <div class=\"project-symbol\" aria-hidden=\"true\">✓</div>\n              <p class=\"project-number\">PROJECT 02</p>\n              <h3>To-Do List</h3>\n              <p>A simple practice app that helps users organize and complete daily tasks.</p>\n              <div class=\"project-tags\"><span>HTML</span><span>CSS</span><span>JavaScript</span></div>\n            </article>\n          </div>\n        </div>\n      </section>",
    "check": "The page shows exactly two project cards, both with titles and descriptions.",
    "image": "/project-assets/personal-portfolio/mission-06-expected.png"
  },
  {
    "number": 7,
    "level": 2,
    "levelTitle": "Meaningful Portfolio Content",
    "title": "Add Contact and Footer",
    "why": "A visitor who likes your work needs a simple way to contact you. A footer also makes the portfolio feel complete and clearly identifies its author.",
    "workIn": "`index.html`. Put **Contact at the end of `<main>`** after Projects. Then replace the empty `<footer class=\"site-footer\"></footer>` that sits **after `</main>`**.",
    "tasks": [
      "Create a section with `id=\"contact\"` and the usual section/container classes. Put a `contact-box` inside so it can be styled as a standout panel later.",
      "Include the label \"04 / CONTACT\", a friendly heading (for example, \"Have an idea? Let's talk.\"), and a brief invitation to connect.",
      "Add an **Email Me** link using a `mailto:` destination. Use `alex@example.com` only as a demonstration placeholder; replace it with an appropriate address before publishing a real portfolio. No contact form, server, or JavaScript email-sending code is required.",
      "After the closing `</main>` tag, fill in the existing footer. Include a copyright line, a `<span id=\"year\">` containing a temporary year, the developer's name, and a short credit such as \"Built with HTML, CSS, and JavaScript.\".",
      "Check that the **About**, **Skills**, **Projects**, and **Contact** navigation links now have matching section IDs. The two hero links should also land at the right sections."
    ],
    "completedWhen": "Every same-page link reaches the right section, the Contact panel has an email action, and the footer is visible at the bottom. The year will become automatic in Level 5. Note that `mailto:` opens a configured email app; it does not submit a contact form.",
    "hint1": "A simple contact action can use an email link rather than a form.",
    "hint2": "Use `<a href=\"mailto:alex@example.com\">Email Me</a>`, and a `<span id=\"year\">` for the year that JavaScript will update later.",
    "solutionLanguage": "html",
    "solution": "<section class=\"section\" id=\"contact\" aria-labelledby=\"contact-title\">\n        <div class=\"container\">\n          <div class=\"contact-box\">\n            <p class=\"section-label\">04 / CONTACT</p>\n            <h2 id=\"contact-title\">Have an idea? Let's talk.</h2>\n            <p>I'm always happy to connect and learn from others.</p>\n            <!-- Replace this example address with your real email. -->\n            <a class=\"button button-primary\" href=\"mailto:alex@example.com\">Email Me</a>\n          </div>\n        </div>\n      </section>\n\n<!-- Replace the empty footer after </main> with: -->\n    <footer class=\"site-footer\">\n      <div class=\"container footer-content\">\n        <p>© <span id=\"year\">2026</span> Alex Morgan</p>\n        <p>Built with HTML, CSS, and JavaScript.</p>\n      </div>\n    </footer>",
    "check": "The email link has a mailto destination and every section link works.",
    "image": "/project-assets/personal-portfolio/mission-07-expected.png"
  },
  {
    "number": 8,
    "level": 3,
    "levelTitle": "Professional CSS Styling",
    "title": "Set up colors and page styles",
    "why": "Styling every element with separate random values makes a page difficult to maintain. You will create a reusable design foundation before decorating individual sections.",
    "workIn": "`styles.css`, which is currently empty. **Do not paste CSS into `index.html`.**",
    "tasks": [
      "Define site-wide color values using CSS custom properties in `:root`, including a primary blue, darker blue, text color, muted text color, light background, white surface, border color, and a reusable border radius.",
      "Apply basic page rules: remove the body's default margin, select a readable system font, set comfortable line spacing, and use the light background and dark text colors you defined.",
      "Add a universal `box-sizing: border-box` rule so padding and borders are easier to reason about when sizing elements.",
      "Create reusable layout helpers: a centered `.container` with a maximum width and a narrower `.narrow` option for long text. These classes already appear in your HTML.",
      "Set sensible defaults for links and buttons. Add visible keyboard focus styles so visitors tabbing through links can see where they are.",
      "Style the existing `.skip-link` so it stays out of the normal view until it receives keyboard focus, when it becomes visible and usable."
    ],
    "completedWhen": "The entire page uses consistent fonts, colors, and content width; it no longer has the browser's default body margin; and pressing Tab gives interactive elements a visible focus outline. The navigation and project cards will still need their specific designs in later missions.",
    "hint1": "`:root` is a convenient place for reusable colors such as `--blue` and `--ink`.",
    "hint2": "Use `var(--blue)` when styling later elements, and `.container { width: min(1100px, 90%); margin: 0 auto; }` to center content.",
    "solutionLanguage": "css",
    "solution": "/* 1. Colors and reusable measurements */\n:root {\n  --blue: #0066ff;\n  --blue-dark: #004ec4;\n  --ink: #14213d;\n  --muted: #59677c;\n  --background: #f6f9ff;\n  --white: #ffffff;\n  --border: #e2e9f4;\n  --radius: 18px;\n}\n\n/* 2. Page basics */\n* { box-sizing: border-box; }\nhtml { scroll-behavior: smooth; }\nbody {\n  margin: 0;\n  background: var(--background);\n  color: var(--ink);\n  font-family: Arial, Helvetica, sans-serif;\n  line-height: 1.6;\n}\na { color: inherit; text-decoration: none; }\nbutton { font: inherit; }\n.container { width: min(1100px, 90%); margin: 0 auto; }\n.narrow { max-width: 760px; }\nsection { scroll-margin-top: 88px; }\n:focus-visible { outline: 3px solid var(--blue); outline-offset: 4px; }\n\n.skip-link { position: absolute; top: -60px; left: 12px; z-index: 10; padding: 8px 14px; background: var(--blue); color: white; border-radius: 6px; }\n.skip-link:focus { top: 12px; }",
    "check": "Background, typography, and spacing become consistent; keyboard focus is visible.",
    "image": "/project-assets/personal-portfolio/mission-08-expected.png"
  },
  {
    "number": 9,
    "level": 3,
    "levelTitle": "Professional CSS Styling",
    "title": "Style navigation and hero",
    "why": "The header and hero are the first things visitors see. Good alignment and clear actions make the page easier to understand and more professional without complicated effects.",
    "workIn": "`styles.css`, **below the global rules from Mission 8**. Use the class names that already exist in `index.html`; do not create a second hero or duplicate the HTML.",
    "tasks": [
      "Style `.site-header` as a clean white bar with a subtle bottom border. Use Flexbox on `.header-content` to place the logo on one side and navigation on the other, vertically aligned.",
      "Give the logo a stronger type style, use blue as an accent, and space the navigation links evenly. Add a visible hover response to links.",
      "Set `.menu-button` to be hidden for larger screens for now. It will appear at mobile widths in Level 4, and its click behavior comes in Level 5.",
      "Turn the hero into a **two-column desktop layout**: larger copy area on the left and the introduction card on the right. Use CSS Grid to control the widths and spacing.",
      "Make the main heading prominent but readable, highlight the key words in blue, and style the description so its line length stays comfortable.",
      "Style the two action links as clear buttons: a filled blue primary action and a lighter outlined secondary action. They should have consistent padding and a clear hover state."
    ],
    "completedWhen": "On a wide screen, the header feels organized, the hero appears as two balanced columns, and both action links stand out. The introduction card may still look basic; Mission 10 will style it. Mobile layout refinements come later.",
    "hint1": "Flexbox is useful for a row of nav links; Grid is useful for the two-column hero.",
    "hint2": "Use `.header-content { display: flex; justify-content: space-between; }` and `.hero { display: grid; grid-template-columns: 1.2fr 0.8fr; }`.",
    "solutionLanguage": "css",
    "solution": "/* 3. Header and navigation */\n.site-header { background: var(--white); border-bottom: 1px solid var(--border); }\n.header-content { display: flex; align-items: center; justify-content: space-between; min-height: 76px; position: relative; }\n.logo { font-size: 1.6rem; font-weight: 800; letter-spacing: -1px; }\n.logo span { color: var(--blue); }\n.navigation { display: flex; align-items: center; gap: 28px; }\n.navigation a { font-size: 0.95rem; font-weight: 600; }\n.navigation a:hover { color: var(--blue); }\n.navigation .nav-contact { color: var(--blue); }\n.menu-button { display: none; background: none; border: 1px solid var(--border); border-radius: 10px; padding: 5px 12px; color: var(--ink); cursor: pointer; font-size: 1.4rem; }\n\n/* 4. Hero */\n.hero { display: grid; grid-template-columns: 1.2fr 0.8fr; align-items: center; gap: 60px; padding-top: 90px; padding-bottom: 90px; }\n.eyebrow, .section-label { color: var(--blue); font-size: 0.78rem; font-weight: 800; letter-spacing: 2px; }\nh1, h2, h3, p { margin-top: 0; }\nh1 { font-size: clamp(2.5rem, 5vw, 4.3rem); letter-spacing: -2px; line-height: 1.12; margin-bottom: 24px; }\nh1 span { color: var(--blue); }\n.hero-description { color: var(--muted); max-width: 520px; font-size: 1.08rem; }\n.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }\n.button { display: inline-block; border-radius: 10px; padding: 12px 22px; font-weight: 700; font-size: 0.95rem; }\n.button-primary { background: var(--blue); color: var(--white); }\n.button-primary:hover { background: var(--blue-dark); }\n.button-outline { border: 1px solid var(--border); background: var(--white); }\n.button-outline:hover { border-color: var(--blue); color: var(--blue); }",
    "check": "The hero becomes a two-column desktop layout with blue call-to-action styling.",
    "image": "/project-assets/personal-portfolio/mission-09-expected.png"
  },
  {
    "number": 10,
    "level": 3,
    "levelTitle": "Professional CSS Styling",
    "title": "Style the introduction card",
    "why": "The introduction card gives visitors a compact summary of the developer. Its layout should visually separate the person's identity from the skills they are learning.",
    "workIn": "`styles.css`, **below the header and hero rules from Mission 9**. The HTML card was already created in Mission 3—do not duplicate it.",
    "tasks": [
      "Style `.intro-card` as a distinct white panel with generous padding, a soft border, rounded corners, and a subtle shadow. Center the content inside it.",
      "Turn `.avatar` into a fixed-size initials block. Center its letters vertically and horizontally, and use a light-blue background with a darker blue text color.",
      "Make the person's name visually stronger than the role beneath it. Style the small \"Nice to meet you\" label so it reads as supporting information.",
      "Add space around `.intro-divider` and make it a thin line to separate the identity details from the technology summary.",
      "Lay out the three labels inside `.mini-skills` using Flexbox with gaps and wrapping, so they still fit if the card becomes narrow. Give each label a consistent chip-like appearance.",
      "Review spacing at normal desktop width. The card should be easy to scan without overwhelming the hero message."
    ],
    "completedWhen": "The initials are centered, the name and role form a clear hierarchy, the divider is visible, and the HTML/CSS/JavaScript labels look like matching tags inside a balanced card.",
    "hint1": "Use `background`, `border`, `border-radius`, `padding`, and `box-shadow` on `.intro-card`.",
    "hint2": "Give the initials square a fixed width and height and center its letters with `display: grid; place-items: center;`.",
    "solutionLanguage": "css",
    "solution": "/* 5. Intro card */\n.intro-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 38px 28px; box-shadow: 0 18px 50px rgba(17, 50, 102, 0.08); text-align: center; }\n.avatar { width: 108px; height: 108px; margin: 0 auto 22px; display: grid; place-items: center; border-radius: 28px; background: #eaf2ff; color: var(--blue); font-size: 2.3rem; font-weight: 800; }\n.intro-label { color: var(--blue); font-size: 0.75rem; font-weight: 800; letter-spacing: 2px; }\n.intro-card h2 { margin-bottom: 0; font-size: 1.6rem; }\n.intro-card > p:not(.intro-label) { color: var(--muted); }\n.intro-divider { height: 1px; background: var(--border); margin: 24px 0; }\n.intro-card .intro-caption { font-size: 0.88rem; }\n.mini-skills { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; }\n.mini-skills span, .project-tags span { padding: 5px 10px; background: #edf4ff; border-radius: 7px; color: var(--blue-dark); font-size: 0.78rem; font-weight: 700; }",
    "check": "The introduction card has balanced spacing and recognizable skill tags.",
    "image": "/project-assets/personal-portfolio/mission-10-expected.png"
  },
  {
    "number": 11,
    "level": 4,
    "levelTitle": "Responsive Design",
    "title": "Style sections and project cards",
    "why": "A professional page should feel like one connected design, not a polished hero followed by unfinished content. Here you'll give the rest of the portfolio the same visual quality.",
    "workIn": "`styles.css`, **after the rules from Mission 10**. Do not change the HTML structure built in Level 2.",
    "tasks": [
      "Add shared styling for `.section` so About, Skills, Projects, and Contact have consistent vertical spacing. Use `.section-white` to create subtle contrast where needed, and keep heading/body typography consistent across sections.",
      "Change `.skill-list` from a default bulleted list into a flexible row of clearly separated skill chips. Remove default list spacing and bullets, add gaps, and allow wrapping.",
      "Style `.project-grid` as a **two-column grid on desktop** with enough gap for the cards to breathe. Each `.project-card` should have a consistent border, padding, background, and subtle shadow.",
      "Inside each project card, distinguish the symbol, project number, title, description, and technology tags. A visitor should be able to scan each card without reading every sentence.",
      "Make `.contact-box` a distinct, friendly call-to-action panel that draws attention to the **Email Me** link while using the same color palette.",
      "Style `.site-footer` and `.footer-content` so the copyright line and the technology credit are aligned and readable."
    ],
    "completedWhen": "Every section looks intentionally styled, the skills appear as chips, the two projects sit side by side on a wide screen, the Contact panel stands out, and the footer has consistent spacing. Mobile behavior is handled in Mission 12.",
    "hint1": "Reuse shared `.section` and `.section-white` classes instead of styling each section independently.",
    "hint2": "Use `grid-template-columns: repeat(2, 1fr)` for project cards and `.skill-list { display: flex; flex-wrap: wrap; }` for skills.",
    "solutionLanguage": "css",
    "solution": "/* 6. Content sections */\n.section { padding: 76px 0; }\n.section-white { background: var(--white); }\n.section h2 { margin-bottom: 14px; font-size: clamp(1.8rem, 3vw, 2.4rem); letter-spacing: -0.7px; }\n.body-copy, .section-intro { color: var(--muted); font-size: 1rem; }\n.skill-list { list-style: none; padding: 0; margin: 28px 0 0; display: flex; flex-wrap: wrap; gap: 12px; }\n.skill-list li { border: 1px solid var(--border); background: var(--white); border-radius: 10px; padding: 12px 16px; font-weight: 600; }\n.project-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 30px; }\n.project-card { border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; background: var(--white); box-shadow: 0 8px 24px rgba(17, 50, 102, 0.04); }\n.project-symbol { width: 54px; height: 54px; display: grid; place-items: center; border-radius: 14px; background: #edf4ff; color: var(--blue); font-weight: 800; font-size: 1.3rem; margin-bottom: 22px; }\n.project-number { color: var(--blue); letter-spacing: 1.6px; font-size: 0.73rem; font-weight: 800; }\n.project-card h3 { margin-bottom: 8px; font-size: 1.25rem; }\n.project-card > p:not(.project-number) { color: var(--muted); }\n.project-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }\n.contact-box { text-align: center; padding: 55px 20px; border: 1px solid #d7e6ff; background: #eaf3ff; border-radius: var(--radius); }\n.contact-box > p:not(.section-label) { color: var(--muted); }\n.contact-box .button { margin-top: 12px; }\n.site-footer { background: var(--white); border-top: 1px solid var(--border); }\n.footer-content { padding: 24px 0; display: flex; justify-content: space-between; gap: 12px; color: var(--muted); font-size: 0.86rem; }\n.footer-content p { margin: 0; }",
    "check": "Two project cards sit side by side on desktop, and the contact panel is clearly visible.",
    "image": "/project-assets/personal-portfolio/mission-11-expected.png"
  },
  {
    "number": 12,
    "level": 4,
    "levelTitle": "Responsive Design",
    "title": "Make the portfolio mobile-friendly",
    "why": "A page that works only on a desktop is incomplete. Users often open portfolios on phones, so the design must respond naturally to smaller screens.",
    "workIn": "`styles.css`, **after all existing desktop styles**. Add a media query rather than changing every desktop rule.",
    "tasks": [
      "Create a `@media (max-width: 760px)` block. These rules should apply when the browser viewport is 760 pixels wide or narrower.",
      "Reveal `.menu-button` on small screens. Hide the full `.navigation` by default and position it as a compact vertical panel below the header. Add a `.navigation.open` rule that displays the panel when JavaScript adds the `open` class in Level 5.",
      "Change `.hero` from two columns to one column, reduce its spacing, and keep the introduction card comfortably sized and centered.",
      "Change `.project-grid` from two columns to one, so project cards stack rather than become unreadably narrow. Reduce section padding where appropriate.",
      "Arrange `.footer-content` vertically and center it on small screens.",
      "Add a `prefers-reduced-motion` rule so users who request less motion don't get forced smooth scrolling.",
      "Test around **375px**, **760px**, and **1280px** in the browser. Look for cut-off text, horizontal scrolling, and overlapping sections."
    ],
    "completedWhen": "The entire site fits on a narrow phone without sideways scrolling, project cards are stacked, and the menu button is visible. **Important:** The menu is expected to stay closed when clicked until Mission 13 adds the JavaScript behavior; don't treat that as a failure yet.",
    "hint1": "Put mobile-specific changes inside `@media (max-width: 760px)`.",
    "hint2": "Change `.hero` and `.project-grid` to one column; hide the nav by default and display it when it receives the `.open` class.",
    "solutionLanguage": "css",
    "solution": "/* 7. Mobile layout */\n@media (max-width: 760px) {\n  .menu-button { display: block; }\n  .navigation { display: none; position: absolute; top: 69px; left: 0; right: 0; z-index: 2; flex-direction: column; align-items: stretch; gap: 0; background: var(--white); border: 1px solid var(--border); border-radius: 12px; padding: 10px; box-shadow: 0 10px 24px rgba(17, 50, 102, 0.08); }\n  .navigation.open { display: flex; }\n  .navigation a { padding: 10px 12px; }\n  .hero { grid-template-columns: 1fr; gap: 35px; padding-top: 55px; padding-bottom: 55px; }\n  h1 { letter-spacing: -1px; }\n  .intro-card { max-width: 460px; width: 100%; justify-self: center; }\n  .section { padding: 55px 0; }\n  .project-grid { grid-template-columns: 1fr; }\n  .footer-content { flex-direction: column; text-align: center; }\n}\n\n/* Respect accessibility preferences. */\n@media (prefers-reduced-motion: reduce) {\n  html { scroll-behavior: auto; }\n}",
    "check": "At a narrow viewport the menu button appears, cards stack, and text remains readable.",
    "image": "/project-assets/personal-portfolio/mission-12-expected.png"
  },
  {
    "number": 13,
    "level": 5,
    "levelTitle": "JavaScript and Final Touches",
    "title": "Toggle the mobile navigation",
    "why": "On small screens, the navigation links are hidden to save space. JavaScript gives the menu button a real job: let visitors choose when to reveal or hide those links.",
    "workIn": "`script.js`, which is empty so far. Your HTML already loads this file with `defer`, and your CSS already has `.navigation.open`.",
    "tasks": [
      "Use `document.querySelector()` to find the existing menu button with the `.menu-button` class and the navigation panel with the `.navigation` class. Do not create these elements again in JavaScript.",
      "Attach a `click` event listener to the menu button using `addEventListener()`.",
      "When the button is clicked, toggle the `open` class on the navigation panel. The mobile CSS should reveal it when the class is present and hide it when the class is removed.",
      "Keep the button's `aria-expanded` attribute synchronized with the menu state: `true` when open and `false` when closed. Update its accessible label to describe the next action.",
      "Save `script.js`, open the portfolio at a narrow viewport, and test clicking the button two times. Check the browser console if nothing happens."
    ],
    "completedWhen": "The first click opens the mobile navigation, the second click closes it, and the button correctly communicates whether the menu is open. Desktop navigation should continue appearing normally. Do not try to implement menu-link closing or the footer year yet; those belong to Mission 14.",
    "hint1": "Use `document.querySelector()` to select the button and nav, and `addEventListener(\"click\", ...)` for interaction.",
    "hint2": "Call `navigation.classList.toggle(\"open\")` and update `aria-expanded` to reflect the visible state.",
    "solutionLanguage": "javascript",
    "solution": "// Show or hide the navigation menu on small screens.\nconst menuButton = document.querySelector(\".menu-button\");\nconst navigation = document.querySelector(\".navigation\");\n\nmenuButton.addEventListener(\"click\", () => {\n  const isOpen = navigation.classList.toggle(\"open\");\n  menuButton.setAttribute(\"aria-expanded\", String(isOpen));\n  menuButton.setAttribute(\n    \"aria-label\",\n    isOpen ? \"Close navigation menu\" : \"Open navigation menu\"\n  );\n});",
    "check": "On mobile, the button opens the navigation on the first click and closes it on the second.",
    "image": "/project-assets/personal-portfolio/mission-13-expected.png"
  },
  {
    "number": 14,
    "level": 5,
    "levelTitle": "JavaScript and Final Touches",
    "title": "Close the menu and update the year",
    "why": "Small finishing details make an interface feel reliable. When a visitor chooses a mobile menu item, the menu should get out of the way; the copyright date should also stay correct automatically.",
    "workIn": "`script.js`, **below the working menu-toggle code from Mission 13**. Add to the file—do not replace or break the first event listener.",
    "tasks": [
      "Find all links **inside** the existing navigation using `navigation.querySelectorAll(\"a\")`.",
      "Attach a click listener to each navigation link. When a visitor chooses one, remove the `open` class from the navigation panel so the mobile menu closes before or while the page scrolls to the target section.",
      "Reset the menu button's `aria-expanded` value to `false` and change its accessible label back to \"Open navigation menu\". This keeps the code and accessibility information consistent.",
      "Find the footer's `#year` element and set its `textContent` to the current year using `new Date().getFullYear()`. This replaces the temporary year from Mission 7 without editing HTML every January.",
      "Test everything together: open the menu on a narrow screen, select Projects, confirm the menu closes, return to the top, open it again, and close it with the button. Confirm the footer year is current and the page still works after refresh."
    ],
    "completedWhen": "Mobile navigation opens, closes, and dismisses after selecting a link; the footer year is automatic; the four navigation targets and both hero actions work; and the complete portfolio stays readable on desktop and phone. Congratulations—you now have a complete beginner portfolio built from your own HTML, CSS, and JavaScript.",
    "hint1": "You can attach a click listener to each navigation link using `querySelectorAll(\"a\").forEach(...)`.",
    "hint2": "Remove the `.open` class in those listeners, then set `document.querySelector(\"#year\").textContent = new Date().getFullYear()`.",
    "solutionLanguage": "javascript",
    "solution": "// Close the mobile menu after choosing a section.\nnavigation.querySelectorAll(\"a\").forEach((link) => {\n  link.addEventListener(\"click\", () => {\n    navigation.classList.remove(\"open\");\n    menuButton.setAttribute(\"aria-expanded\", \"false\");\n    menuButton.setAttribute(\"aria-label\", \"Open navigation menu\");\n  });\n});\n\n// Keep the copyright year current.\ndocument.querySelector(\"#year\").textContent = new Date().getFullYear();",
    "check": "On mobile a nav link closes the menu; footer shows the current year. Test links, contrast, keyboard focus, and refresh.",
    "image": "/project-assets/personal-portfolio/mission-14-expected.png"
  }
];
