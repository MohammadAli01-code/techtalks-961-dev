-- 961-Dev: Seed the approved Personal Portfolio (Easy) learning journey.
-- Source: existing src/app/projects/personal-portfolio/portfolio-missions.ts
-- Includes exactly 5 levels, 14 missions, and 79 detailed task instructions.
-- This migration does not insert learner progress or change existing progress.
-- Safety: abort instead of overwriting existing levels for this project.

begin;

-- Retain the solution language and completion checks from the original tutorial.
alter table public.missions
  add column if not exists solution_language text,
  add column if not exists success_criteria text,
  add column if not exists verification_check text;

do $seed$
declare
  v_project_id bigint;
  v_level_id bigint;
  v_mission_id bigint;
  v_level jsonb;
  v_mission jsonb;
  v_task text;
  v_task_number integer;
  v_levels_count integer;
  v_missions_count integer;
  v_tasks_count integer;
begin
  -- Identify the project by BOTH technology and slug, never by a guessed ID.
  select p.id into v_project_id
  from public.projects p
  join public.technologies t on t.id = p.technology_id
  where t.slug = 'html-css-js'
    and p.slug = 'personal-portfolio';

  if v_project_id is null then
    raise exception
      'Cannot seed: HTML/CSS/JS Personal Portfolio project was not found.';
  end if;

  -- Do not silently replace any manually seeded or existing level records.
  if exists (
    select 1 from public.levels l where l.project_id = v_project_id
  ) then
    raise exception
      'Personal Portfolio already has levels. Review them before seeding.';
  end if;

  -- Create the 5 levels with the approved Given and learning objectives.
  for v_level in
    select value
    from jsonb_array_elements($level_payload$
[
  {
    "number": 1,
    "title": "HTML Foundations",
    "description": "Create the HTML document, navigation, and hero introduction.",
    "objective": "Build the complete structural beginning of a personal portfolio. By the end of this level, a visitor can tell who the developer is, see the main navigation, and find clear actions to explore projects or make contact. Focus on meaningful HTML; appearance comes later.",
    "given": [
      "**Starting files:** Create three files in one folder: `index.html` (page content), `styles.css` (empty for now), and `script.js` (empty for now).",
      "**HTML tools:** `<!DOCTYPE html>`, `<html>`, `<head>`, `<meta>`, `<title>`, `<link>`, `<script>`, `<body>`, `<header>`, `<nav>`, `<main>`, `<section>`, `<h1>`, `<h2>`, `<p>`, `<a>`, `<button>`, `<div>`, and `<span>`.",
      "**How they help:** HTML creates structure; `id` provides a destination for page links; `class` names give us styling targets in later levels.",
      "**Starter content:** You may use the fictional developer name **Alex Morgan** throughout, or replace it consistently with your own name. No images or external packages are necessary."
    ]
  },
  {
    "number": 2,
    "title": "Meaningful Portfolio Content",
    "description": "Build the About, Skills, Projects, Contact, and Footer sections.",
    "objective": "Turn the opening screen into a useful, honest portfolio. A visitor should learn what the developer is practicing, see example work, and have a real way to get in touch.",
    "given": [
      "**Starting point:** Keep the `index.html` from Level 1. It already has a header, navigation, hero, `<main id=\"main-content\">`, and an empty footer. Do not erase previous missions.",
      "**HTML tools:** `<section>`, `<h2>`, `<h3>`, `<p>`, `<ul>`, `<li>`, `<article>`, `<div>`, `<span>`, and `<a href=\"mailto:...\">`.",
      "**How they help:** Sections organize a long page; lists group related skills; articles represent individual portfolio projects; `mailto:` can open an email app without a backend.",
      "**Content guideline:** The name, email, and project descriptions in the reference are **examples**. Change them to reflect real work before publishing the portfolio. Do not add broken \"Live Demo\" links or claim projects you haven't built."
    ]
  },
  {
    "number": 3,
    "title": "Professional CSS Styling",
    "description": "Establish the visual system and style the navigation and hero.",
    "objective": "Give the previously built HTML a coherent visual identity, beginning with reusable site-wide styles and finishing with a polished header and introduction area.",
    "given": [
      "**Starting point:** All content and class names from Levels 1 and 2 are present in `index.html`. Work in `styles.css`; leave the structure of `index.html` alone unless correcting a typo.",
      "**CSS tools:** selectors, `:root`, custom properties such as `--blue`, `var()`, typography, `margin`, `padding`, `background`, `border`, `border-radius`, `box-shadow`, `display: flex`, and `display: grid`.",
      "**How they help:** Reusing CSS variables keeps colors consistent; Flexbox arranges navigation and buttons; Grid makes the hero text and introduction card sit side by side.",
      "**Design direction:** A readable, clean blue-and-white portfolio. The initial color values are examples; no CSS framework is required."
    ]
  },
  {
    "number": 4,
    "title": "Responsive Design",
    "description": "Finish styling content and make the portfolio responsive.",
    "objective": "Finish styling the remaining portfolio sections and make the entire layout usable on both wide and narrow screens.",
    "given": [
      "**Starting point:** The HTML is complete and `styles.css` already contains the global styles, header, hero, and introduction-card rules from Level 3.",
      "**CSS tools:** reusable selectors, `display: flex`, `flex-wrap`, CSS Grid columns, responsive sizing, and `@media (max-width: 760px)`.",
      "**How they help:** Shared section styles reduce repetition; grid columns can collapse to one column on smaller screens; the media query reveals a compact navigation button on phones.",
      "**Suggested screens:** Check approximately **1280px** wide (desktop) and **375px** wide (phone) using your browser's device toolbar, then try an intermediate width."
    ]
  },
  {
    "number": 5,
    "title": "JavaScript and Final Touches",
    "description": "Add the mobile menu interactions and complete final checks.",
    "objective": "Add a small amount of JavaScript that solves actual user-experience problems and verify the complete portfolio.",
    "given": [
      "**Starting point:** Your HTML and CSS work from Levels 1–4 is complete. The HTML already includes `.menu-button`, `.navigation`, and `<span id=\"year\">`. `script.js` is ready to fill in.",
      "**JavaScript tools:** `document.querySelector()`, `querySelectorAll()`, `addEventListener()`, `classList.toggle()`, `classList.remove()`, `setAttribute()`, `textContent`, `new Date()`, and `getFullYear()`.",
      "**How they help:** DOM selection finds existing elements; click events respond to the visitor; changing the `.open` class reveals the mobile menu; updating `aria-expanded` communicates state to assistive technology.",
      "**Boundary:** No React, no libraries, no backend, no user accounts, and no form submission required. Keep the JavaScript short and understandable."
    ]
  }
]
$level_payload$::jsonb)
  loop
    insert into public.levels
      (project_id, level_number, title, description, objective, given_items)
    values
      (
        v_project_id,
        (v_level ->> 'number')::integer,
        v_level ->> 'title',
        v_level ->> 'description',
        v_level ->> 'objective',
        array(select jsonb_array_elements_text(v_level -> 'given'))
      );
  end loop;

  -- Create the 14 missions and all 79 individually numbered tasks.
  for v_mission in
    select value
    from jsonb_array_elements($mission_payload$
[
  {
    "number": 1,
    "level": 1,
    "title": "Create the page skeleton",
    "summary": "Create a valid HTML document and connect the stylesheet and script.",
    "purpose": "A portfolio cannot be styled or made interactive until the browser has a valid HTML document to display. In this mission you create the foundation that every later mission will build on.",
    "file_to_edit": "`index.html`. Create `styles.css` and `script.js` as empty files in the **same folder** so their links will work later.",
    "instructions": "`index.html`. Create `styles.css` and `script.js` as empty files in the **same folder** so their links will work later.\n\n1. Start `index.html` as an HTML5 document and declare that its content is in English. Include a `<head>` for information about the page and a `<body>` for everything visitors will see.\n2. Inside `<head>`, declare the UTF-8 character set, set the mobile viewport so the layout can adapt to phone screens later, add a meaningful browser-tab title, and include a short description of the portfolio.\n3. Link `styles.css` using a stylesheet `<link>` tag. Connect `script.js` using a `<script>` tag with `defer` so JavaScript can run after the HTML has been parsed.\n4. Inside `<body>`, add three landmarks in the correct order: an initially empty `<header>`, an empty `<main id=\"main-content\">`, and an empty `<footer>`. Give the header and footer the class names shown in the reference because later CSS will target them.\n5. Add a \"Skip to content\" link that points to `#main-content`, so keyboard users can jump directly to the page's main content.\n6. Save the files and open `index.html` in a browser. It is **normal for the page to look almost empty** at this stage; you are building structure, not design.",
    "success_criteria": "The browser tab shows \"Alex Morgan | Web Developer\" (or your chosen name), the page opens without an HTML error, the three semantic areas exist in the document, and the browser can find both linked files. Do not add navigation, portfolio sections, or CSS yet; they have their own missions.",
    "verification_check": "The browser tab says “Alex Morgan | Web Developer” and the page opens without an error.",
    "expected_result": "The browser tab says “Alex Morgan | Web Developer” and the page opens without an error.",
    "expected_image_path": null,
    "hint_1": "The `head` contains information about the page; visible content belongs inside `body`.",
    "hint_2": "Use `link rel=\"stylesheet\"` for the CSS file and `<script src=\"script.js\" defer>` for JavaScript. Put `header`, `main`, and `footer` inside `body`.",
    "final_answer": "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <meta name=\"description\" content=\"Alex Morgan's beginner web developer portfolio.\" />\n    <title>Alex Morgan | Web Developer</title>\n    <link rel=\"stylesheet\" href=\"styles.css\" />\n    <script src=\"script.js\" defer></script>\n  </head>\n  <body>\n    <a class=\"skip-link\" href=\"#main-content\">Skip to content</a>\n    <!-- Add the header in Mission 2. -->\n    <header class=\"site-header\"></header>\n    <!-- Add the hero and other sections later. -->\n    <main id=\"main-content\"></main>\n    <footer class=\"site-footer\"></footer>\n  </body>\n</html>",
    "solution_language": "html",
    "tasks": [
      "Start `index.html` as an HTML5 document and declare that its content is in English. Include a `<head>` for information about the page and a `<body>` for everything visitors will see.",
      "Inside `<head>`, declare the UTF-8 character set, set the mobile viewport so the layout can adapt to phone screens later, add a meaningful browser-tab title, and include a short description of the portfolio.",
      "Link `styles.css` using a stylesheet `<link>` tag. Connect `script.js` using a `<script>` tag with `defer` so JavaScript can run after the HTML has been parsed.",
      "Inside `<body>`, add three landmarks in the correct order: an initially empty `<header>`, an empty `<main id=\"main-content\">`, and an empty `<footer>`. Give the header and footer the class names shown in the reference because later CSS will target them.",
      "Add a \"Skip to content\" link that points to `#main-content`, so keyboard users can jump directly to the page's main content.",
      "Save the files and open `index.html` in a browser. It is **normal for the page to look almost empty** at this stage; you are building structure, not design."
    ]
  },
  {
    "number": 2,
    "level": 1,
    "title": "Add a navigation bar",
    "summary": "Build a header with a logo and four same-page navigation links.",
    "purpose": "Visitors need an obvious way to move between parts of a one-page portfolio. The header is the map they will use to explore your work.",
    "file_to_edit": "`index.html`, replacing the **empty `<header class=\"site-header\"></header>`** created in Mission 1. Keep the rest of the document unchanged.",
    "instructions": "`index.html`, replacing the **empty `<header class=\"site-header\"></header>`** created in Mission 1. Keep the rest of the document unchanged.\n\n1. Place a wrapper inside the header that can later center and align its contents; use the classes `container` and `header-content`.\n2. Add a short text logo (for example, \"Alex.\") and make it a link to `#home`. This takes the visitor back to the introductory hero section once it exists.\n3. Add a button that will eventually open a menu on mobile. Give it `type=\"button\"`, the class `menu-button`, and an understandable accessible label. Set `aria-controls` to the ID of your navigation and start `aria-expanded` as `false`.\n4. Add a `<nav>` with the class `navigation` and the ID `main-navigation`. Inside it, create exactly four clear links: **About**, **Skills**, **Projects**, and **Contact**. Point them to `#about`, `#skills`, `#projects`, and `#contact` respectively.\n5. Keep these link destinations consistent with the section IDs you will create in Level 2. Avoid pointing to made-up pages or using `href=\"#\"` as a placeholder.",
    "success_criteria": "The logo, menu button, and four labeled links exist in the header. They may appear as plain text and links because no CSS has been added. Some anchors will not scroll yet because their sections are built in later missions; the menu button will become functional in Level 5.",
    "verification_check": "The four links are visible as normal unstyled links for now.",
    "expected_result": "The four links are visible as normal unstyled links for now.",
    "expected_image_path": "/project-assets/personal-portfolio/mission-02-expected.png",
    "hint_1": "A same-page link uses `href=\"#section-id\"`, where the target section has the matching `id`.",
    "hint_2": "Create a `nav` element with About, Skills, Projects, Contact. Give the menu button `aria-controls=\"main-navigation\"` and `aria-expanded=\"false\"`.",
    "final_answer": "<header class=\"site-header\">\n      <div class=\"container header-content\">\n        <a class=\"logo\" href=\"#home\" aria-label=\"Alex Morgan, homepage\">Alex<span>.</span></a>\n        <button\n          class=\"menu-button\"\n          type=\"button\"\n          aria-controls=\"main-navigation\"\n          aria-expanded=\"false\"\n          aria-label=\"Open navigation menu\"\n        >\n          ☰\n        </button>\n        <nav class=\"navigation\" id=\"main-navigation\" aria-label=\"Main navigation\">\n          <a href=\"#about\">About</a>\n          <a href=\"#skills\">Skills</a>\n          <a href=\"#projects\">Projects</a>\n          <a class=\"nav-contact\" href=\"#contact\">Contact</a>\n        </nav>\n      </div>\n    </header>",
    "solution_language": "html",
    "tasks": [
      "Place a wrapper inside the header that can later center and align its contents; use the classes `container` and `header-content`.",
      "Add a short text logo (for example, \"Alex.\") and make it a link to `#home`. This takes the visitor back to the introductory hero section once it exists.",
      "Add a button that will eventually open a menu on mobile. Give it `type=\"button\"`, the class `menu-button`, and an understandable accessible label. Set `aria-controls` to the ID of your navigation and start `aria-expanded` as `false`.",
      "Add a `<nav>` with the class `navigation` and the ID `main-navigation`. Inside it, create exactly four clear links: **About**, **Skills**, **Projects**, and **Contact**. Point them to `#about`, `#skills`, `#projects`, and `#contact` respectively.",
      "Keep these link destinations consistent with the section IDs you will create in Level 2. Avoid pointing to made-up pages or using `href=\"#\"` as a placeholder."
    ]
  },
  {
    "number": 3,
    "level": 1,
    "title": "Introduce yourself in the hero",
    "summary": "Create the hero introduction, calls to action, and developer card.",
    "purpose": "The first screen should quickly tell a visitor **who you are, what you do, and what action they can take next**. A hero with clear information is more useful than a decorative heading alone.",
    "file_to_edit": "`index.html`, **inside `<main id=\"main-content\">`**, immediately after the opening `<main>` tag. Do not put the hero inside the header.",
    "instructions": "`index.html`, **inside `<main id=\"main-content\">`**, immediately after the opening `<main>` tag. Do not put the hero inside the header.\n\n1. Create a section with `id=\"home\"` and the classes `hero container`. This makes the logo's `#home` link meaningful and gives CSS a clear target.\n2. In a `hero-copy` container, add a short greeting such as \"HELLO, I'M ALEX\". Follow it with **one main `<h1>`** that describes what the developer builds, rather than just repeating the developer's name.\n3. Write a brief supporting paragraph identifying the developer as a beginner learning HTML, CSS, and JavaScript through practical projects. Keep it honest and easy to read.\n4. Add two action links inside a `hero-actions` group: **See My Projects** links to `#projects`, and **Contact Me** links to `#contact`. Use links rather than buttons because these actions navigate to page sections.\n5. Next to the introduction content, add an `intro-card` showing initials, a name, a learning role, and three small technology labels: HTML, CSS, and JavaScript. Group these parts so CSS can style them as one card later.\n6. Use class names consistently, including `hero-description`, `intro-card`, `avatar`, and `mini-skills`. They will matter in the CSS missions.",
    "success_criteria": "You can see a greeting, a meaningful page heading, a short introduction, both action links, and a separate information card with the person's name and technology labels. It is okay for the two areas to stack vertically before CSS. The Projects and Contact links will work once Level 2 creates those sections.",
    "verification_check": "The hero heading, two calls to action, and name card appear in the browser.",
    "expected_result": "The hero heading, two calls to action, and name card appear in the browser.",
    "expected_image_path": "/project-assets/personal-portfolio/mission-03-expected.png",
    "hint_1": "Use an `h1` for the main page title. Buttons that navigate to a section should be `<a>` links.",
    "hint_2": "Link “See My Projects” to `#projects`, “Contact Me” to `#contact`, and add an introductory card with your name and technology labels.",
    "final_answer": "<section class=\"hero container\" id=\"home\" aria-labelledby=\"hero-title\">\n        <div class=\"hero-copy\">\n          <p class=\"eyebrow\">HELLO, I'M ALEX 👋</p>\n          <h1 id=\"hero-title\">I build <span>simple, useful</span> websites.</h1>\n          <p class=\"hero-description\">\n            I'm Alex Morgan, an aspiring web developer learning HTML, CSS,\n            and JavaScript by creating real projects.\n          </p>\n          <div class=\"hero-actions\">\n            <a class=\"button button-primary\" href=\"#projects\">See My Projects</a>\n            <a class=\"button button-outline\" href=\"#contact\">Contact Me</a>\n          </div>\n        </div>\n        <div class=\"intro-card\" aria-label=\"Introduction card\">\n          <div class=\"avatar\" aria-hidden=\"true\">AM</div>\n          <p class=\"intro-label\">NICE TO MEET YOU</p>\n          <h2>Alex Morgan</h2>\n          <p>Aspiring Frontend Developer</p>\n          <div class=\"intro-divider\"></div>\n          <p class=\"intro-caption\">Currently building with</p>\n          <div class=\"mini-skills\" aria-label=\"Technologies I am learning\">\n            <span>HTML</span><span>CSS</span><span>JavaScript</span>\n          </div>\n        </div>\n      </section>",
    "solution_language": "html",
    "tasks": [
      "Create a section with `id=\"home\"` and the classes `hero container`. This makes the logo's `#home` link meaningful and gives CSS a clear target.",
      "In a `hero-copy` container, add a short greeting such as \"HELLO, I'M ALEX\". Follow it with **one main `<h1>`** that describes what the developer builds, rather than just repeating the developer's name.",
      "Write a brief supporting paragraph identifying the developer as a beginner learning HTML, CSS, and JavaScript through practical projects. Keep it honest and easy to read.",
      "Add two action links inside a `hero-actions` group: **See My Projects** links to `#projects`, and **Contact Me** links to `#contact`. Use links rather than buttons because these actions navigate to page sections.",
      "Next to the introduction content, add an `intro-card` showing initials, a name, a learning role, and three small technology labels: HTML, CSS, and JavaScript. Group these parts so CSS can style them as one card later.",
      "Use class names consistently, including `hero-description`, `intro-card`, `avatar`, and `mini-skills`. They will matter in the CSS missions."
    ]
  },
  {
    "number": 4,
    "level": 2,
    "title": "Write the About section",
    "summary": "Introduce the developer with a meaningful About section.",
    "purpose": "A portfolio needs context. Visitors should understand the developer's interests and learning direction before seeing a list of technologies or projects.",
    "file_to_edit": "`index.html`, **after the hero section and before the closing `</main>`**. Keep the hero untouched.",
    "instructions": "`index.html`, **after the hero section and before the closing `</main>`**. Keep the hero untouched.\n\n1. Create a new `<section>` with `id=\"about\"` so the About navigation link has a destination. Apply the existing section-related class names `section section-white`.\n2. Add a `container narrow` wrapper. This will help keep long paragraphs readable when CSS is introduced.\n3. Give the section a small label (such as \"01 / ABOUT\") and a clear `<h2>` heading such as \"A little about me\".\n4. Write one short paragraph, approximately three sentences, answering these questions in natural language: **What interests you about web development? What are you learning? What do you hope to build next?** You may use the reference text as a model; don't invent qualifications or experience.\n5. Make sure the section heading and the navigation target belong to this About section rather than another section.",
    "success_criteria": "The About section appears after the hero, its heading is easy to identify, and clicking **About** in the header moves to this section. The text should communicate something about the learner, not just display filler words.",
    "verification_check": "Clicking About in the navigation scrolls to the About section.",
    "expected_result": "Clicking About in the navigation scrolls to the About section.",
    "expected_image_path": "/project-assets/personal-portfolio/mission-04-expected.png",
    "hint_1": "Every main section should have its own unique `id` and a visible heading.",
    "hint_2": "Use `<section id=\"about\">`, a `<h2>` heading, and one readable paragraph of three sentences.",
    "final_answer": "<section class=\"section section-white\" id=\"about\" aria-labelledby=\"about-title\">\n        <div class=\"container narrow\">\n          <p class=\"section-label\">01 / ABOUT</p>\n          <h2 id=\"about-title\">A little about me</h2>\n          <p class=\"body-copy\">\n            I'm a curious learner who enjoys turning ideas into web pages.\n            I started with the basics and I'm improving one project at a time.\n            My goal is to create websites that are clear, accessible, and easy to use.\n          </p>\n        </div>\n      </section>",
    "solution_language": "html",
    "tasks": [
      "Create a new `<section>` with `id=\"about\"` so the About navigation link has a destination. Apply the existing section-related class names `section section-white`.",
      "Add a `container narrow` wrapper. This will help keep long paragraphs readable when CSS is introduced.",
      "Give the section a small label (such as \"01 / ABOUT\") and a clear `<h2>` heading such as \"A little about me\".",
      "Write one short paragraph, approximately three sentences, answering these questions in natural language: **What interests you about web development? What are you learning? What do you hope to build next?** You may use the reference text as a model; don't invent qualifications or experience.",
      "Make sure the section heading and the navigation target belong to this About section rather than another section."
    ]
  },
  {
    "number": 5,
    "level": 2,
    "title": "List your skills",
    "summary": "Display HTML, CSS, and JavaScript skills using a structured list.",
    "purpose": "Visitors want to see which tools the developer knows or is actively learning. A small, organized list is easier to scan than a long paragraph of technology names.",
    "file_to_edit": "`index.html`, **directly after the About section and still inside `<main>`**.",
    "instructions": "`index.html`, **directly after the About section and still inside `<main>`**.\n\n1. Create a Skills section with `id=\"skills\"` so the Skills navigation link works. Use a main `<h2>` for the section title and one short sentence introducing the list.\n2. Add an **unordered list** (`<ul>`) with the class `skill-list` because these skills have no ranking or required sequence.\n3. Add exactly three `<li>` items for the beginner portfolio: **HTML — Page structure**, **CSS — Layout and design**, and **JavaScript — Interactivity**. Each item should tell the visitor what the technology is used for, not just name it.\n4. Keep the list inside the Skills section, and do not use three disconnected `<p>` elements in place of list items.\n5. Use the class names from the reference so these items can become consistent visual skill chips in Level 4.",
    "success_criteria": "The page contains a clearly labeled Skills section, a list with three distinct skills and useful explanations, and the **Skills** navigation link scrolls to the correct section.",
    "verification_check": "The browser displays three clearly named skills.",
    "expected_result": "The browser displays three clearly named skills.",
    "expected_image_path": "/project-assets/personal-portfolio/mission-05-expected.png",
    "hint_1": "Use `ul` for a set of related items, and `li` for each skill.",
    "hint_2": "Add three skills: HTML for structure, CSS for design, and JavaScript for interactivity.",
    "final_answer": "<section class=\"section\" id=\"skills\" aria-labelledby=\"skills-title\">\n        <div class=\"container narrow\">\n          <p class=\"section-label\">02 / SKILLS</p>\n          <h2 id=\"skills-title\">What I'm learning</h2>\n          <p class=\"section-intro\">The tools I'm using to turn my ideas into websites.</p>\n          <ul class=\"skill-list\" aria-label=\"My web development skills\">\n            <li>HTML — Page structure</li>\n            <li>CSS — Layout and design</li>\n            <li>JavaScript — Interactivity</li>\n          </ul>\n        </div>\n      </section>",
    "solution_language": "html",
    "tasks": [
      "Create a Skills section with `id=\"skills\"` so the Skills navigation link works. Use a main `<h2>` for the section title and one short sentence introducing the list.",
      "Add an **unordered list** (`<ul>`) with the class `skill-list` because these skills have no ranking or required sequence.",
      "Add exactly three `<li>` items for the beginner portfolio: **HTML — Page structure**, **CSS — Layout and design**, and **JavaScript — Interactivity**. Each item should tell the visitor what the technology is used for, not just name it.",
      "Keep the list inside the Skills section, and do not use three disconnected `<p>` elements in place of list items.",
      "Use the class names from the reference so these items can become consistent visual skill chips in Level 4."
    ]
  },
  {
    "number": 6,
    "level": 2,
    "title": "Create two project cards",
    "summary": "Showcase two example projects with descriptive cards and tags.",
    "purpose": "A portfolio is strongest when it shows concrete work. Project cards give visitors a quick overview of what was built, what problem it addresses, and which technologies were used.",
    "file_to_edit": "`index.html`, **after the Skills section and before Contact** (Contact is created in the next mission).",
    "instructions": "`index.html`, **after the Skills section and before Contact** (Contact is created in the next mission).\n\n1. Add a section with `id=\"projects\"`, a small \"03 / PROJECTS\" label, and an `<h2>` heading. Include a short introductory sentence.\n2. Create a wrapper with the class `project-grid`. It will hold multiple project cards and become a two-column grid in Level 4.\n3. Inside it, add **two separate `<article class=\"project-card\">` elements**. Each card must be understandable by itself.\n4. For each card, include a small visual symbol, a project number, a descriptive `<h3>` title, a **one-sentence explanation of what the project does**, and small technology labels in a `project-tags` container.\n5. Use the example cards **Personal Portfolio** (HTML/CSS) and **To-Do List** (HTML/CSS/JavaScript) from the reference if you need practice content. If you are making a real portfolio, replace any example for a project you haven't actually built—do not claim a fictional To-Do List as completed work.\n6. Do **not** add \"View Demo\" or \"GitHub\" links unless you already have valid destinations. An honest informational card is better than a broken button.",
    "success_criteria": "Clicking **Projects** reaches the right section, exactly two cards appear, and each card explains a recognizable project and its technologies. They can stack for now; CSS Grid will arrange them later.",
    "verification_check": "The page shows exactly two project cards, both with titles and descriptions.",
    "expected_result": "The page shows exactly two project cards, both with titles and descriptions.",
    "expected_image_path": "/project-assets/personal-portfolio/mission-06-expected.png",
    "hint_1": "A self-contained item such as a project is a good use for `<article>`.",
    "hint_2": "Place both `<article class=\"project-card\">` items inside one `<div class=\"project-grid\">`. Don’t add dummy links.",
    "final_answer": "<section class=\"section section-white\" id=\"projects\" aria-labelledby=\"projects-title\">\n        <div class=\"container\">\n          <p class=\"section-label\">03 / PROJECTS</p>\n          <h2 id=\"projects-title\">Things I've built</h2>\n          <p class=\"section-intro\">A few practice projects that helped me learn.</p>\n          <div class=\"project-grid\">\n            <article class=\"project-card\">\n              <div class=\"project-symbol\" aria-hidden=\"true\">&lt;/&gt;</div>\n              <p class=\"project-number\">PROJECT 01</p>\n              <h3>Personal Portfolio</h3>\n              <p>A responsive page to introduce myself, share skills, and showcase my work.</p>\n              <div class=\"project-tags\"><span>HTML</span><span>CSS</span></div>\n            </article>\n            <article class=\"project-card\">\n              <div class=\"project-symbol\" aria-hidden=\"true\">✓</div>\n              <p class=\"project-number\">PROJECT 02</p>\n              <h3>To-Do List</h3>\n              <p>A simple practice app that helps users organize and complete daily tasks.</p>\n              <div class=\"project-tags\"><span>HTML</span><span>CSS</span><span>JavaScript</span></div>\n            </article>\n          </div>\n        </div>\n      </section>",
    "solution_language": "html",
    "tasks": [
      "Add a section with `id=\"projects\"`, a small \"03 / PROJECTS\" label, and an `<h2>` heading. Include a short introductory sentence.",
      "Create a wrapper with the class `project-grid`. It will hold multiple project cards and become a two-column grid in Level 4.",
      "Inside it, add **two separate `<article class=\"project-card\">` elements**. Each card must be understandable by itself.",
      "For each card, include a small visual symbol, a project number, a descriptive `<h3>` title, a **one-sentence explanation of what the project does**, and small technology labels in a `project-tags` container.",
      "Use the example cards **Personal Portfolio** (HTML/CSS) and **To-Do List** (HTML/CSS/JavaScript) from the reference if you need practice content. If you are making a real portfolio, replace any example for a project you haven't actually built—do not claim a fictional To-Do List as completed work.",
      "Do **not** add \"View Demo\" or \"GitHub\" links unless you already have valid destinations. An honest informational card is better than a broken button."
    ]
  },
  {
    "number": 7,
    "level": 2,
    "title": "Add Contact and Footer",
    "summary": "Add a working email contact link and an informative footer.",
    "purpose": "A visitor who likes your work needs a simple way to contact you. A footer also makes the portfolio feel complete and clearly identifies its author.",
    "file_to_edit": "`index.html`. Put **Contact at the end of `<main>`** after Projects. Then replace the empty `<footer class=\"site-footer\"></footer>` that sits **after `</main>`**.",
    "instructions": "`index.html`. Put **Contact at the end of `<main>`** after Projects. Then replace the empty `<footer class=\"site-footer\"></footer>` that sits **after `</main>`**.\n\n1. Create a section with `id=\"contact\"` and the usual section/container classes. Put a `contact-box` inside so it can be styled as a standout panel later.\n2. Include the label \"04 / CONTACT\", a friendly heading (for example, \"Have an idea? Let's talk.\"), and a brief invitation to connect.\n3. Add an **Email Me** link using a `mailto:` destination. Use `alex@example.com` only as a demonstration placeholder; replace it with an appropriate address before publishing a real portfolio. No contact form, server, or JavaScript email-sending code is required.\n4. After the closing `</main>` tag, fill in the existing footer. Include a copyright line, a `<span id=\"year\">` containing a temporary year, the developer's name, and a short credit such as \"Built with HTML, CSS, and JavaScript.\".\n5. Check that the **About**, **Skills**, **Projects**, and **Contact** navigation links now have matching section IDs. The two hero links should also land at the right sections.",
    "success_criteria": "Every same-page link reaches the right section, the Contact panel has an email action, and the footer is visible at the bottom. The year will become automatic in Level 5. Note that `mailto:` opens a configured email app; it does not submit a contact form.",
    "verification_check": "The email link has a mailto destination and every section link works.",
    "expected_result": "The email link has a mailto destination and every section link works.",
    "expected_image_path": "/project-assets/personal-portfolio/mission-07-expected.png",
    "hint_1": "A simple contact action can use an email link rather than a form.",
    "hint_2": "Use `<a href=\"mailto:alex@example.com\">Email Me</a>`, and a `<span id=\"year\">` for the year that JavaScript will update later.",
    "final_answer": "<section class=\"section\" id=\"contact\" aria-labelledby=\"contact-title\">\n        <div class=\"container\">\n          <div class=\"contact-box\">\n            <p class=\"section-label\">04 / CONTACT</p>\n            <h2 id=\"contact-title\">Have an idea? Let's talk.</h2>\n            <p>I'm always happy to connect and learn from others.</p>\n            <!-- Replace this example address with your real email. -->\n            <a class=\"button button-primary\" href=\"mailto:alex@example.com\">Email Me</a>\n          </div>\n        </div>\n      </section>\n\n<!-- Replace the empty footer after </main> with: -->\n    <footer class=\"site-footer\">\n      <div class=\"container footer-content\">\n        <p>© <span id=\"year\">2026</span> Alex Morgan</p>\n        <p>Built with HTML, CSS, and JavaScript.</p>\n      </div>\n    </footer>",
    "solution_language": "html",
    "tasks": [
      "Create a section with `id=\"contact\"` and the usual section/container classes. Put a `contact-box` inside so it can be styled as a standout panel later.",
      "Include the label \"04 / CONTACT\", a friendly heading (for example, \"Have an idea? Let's talk.\"), and a brief invitation to connect.",
      "Add an **Email Me** link using a `mailto:` destination. Use `alex@example.com` only as a demonstration placeholder; replace it with an appropriate address before publishing a real portfolio. No contact form, server, or JavaScript email-sending code is required.",
      "After the closing `</main>` tag, fill in the existing footer. Include a copyright line, a `<span id=\"year\">` containing a temporary year, the developer's name, and a short credit such as \"Built with HTML, CSS, and JavaScript.\".",
      "Check that the **About**, **Skills**, **Projects**, and **Contact** navigation links now have matching section IDs. The two hero links should also land at the right sections."
    ]
  },
  {
    "number": 8,
    "level": 3,
    "title": "Set up colors and page styles",
    "summary": "Set up reusable colors, typography, spacing, and base CSS.",
    "purpose": "Styling every element with separate random values makes a page difficult to maintain. You will create a reusable design foundation before decorating individual sections.",
    "file_to_edit": "`styles.css`, which is currently empty. **Do not paste CSS into `index.html`.**",
    "instructions": "`styles.css`, which is currently empty. **Do not paste CSS into `index.html`.**\n\n1. Define site-wide color values using CSS custom properties in `:root`, including a primary blue, darker blue, text color, muted text color, light background, white surface, border color, and a reusable border radius.\n2. Apply basic page rules: remove the body's default margin, select a readable system font, set comfortable line spacing, and use the light background and dark text colors you defined.\n3. Add a universal `box-sizing: border-box` rule so padding and borders are easier to reason about when sizing elements.\n4. Create reusable layout helpers: a centered `.container` with a maximum width and a narrower `.narrow` option for long text. These classes already appear in your HTML.\n5. Set sensible defaults for links and buttons. Add visible keyboard focus styles so visitors tabbing through links can see where they are.\n6. Style the existing `.skip-link` so it stays out of the normal view until it receives keyboard focus, when it becomes visible and usable.",
    "success_criteria": "The entire page uses consistent fonts, colors, and content width; it no longer has the browser's default body margin; and pressing Tab gives interactive elements a visible focus outline. The navigation and project cards will still need their specific designs in later missions.",
    "verification_check": "Background, typography, and spacing become consistent; keyboard focus is visible.",
    "expected_result": "Background, typography, and spacing become consistent; keyboard focus is visible.",
    "expected_image_path": "/project-assets/personal-portfolio/mission-08-expected.png",
    "hint_1": "`:root` is a convenient place for reusable colors such as `--blue` and `--ink`.",
    "hint_2": "Use `var(--blue)` when styling later elements, and `.container { width: min(1100px, 90%); margin: 0 auto; }` to center content.",
    "final_answer": "/* 1. Colors and reusable measurements */\n:root {\n  --blue: #0066ff;\n  --blue-dark: #004ec4;\n  --ink: #14213d;\n  --muted: #59677c;\n  --background: #f6f9ff;\n  --white: #ffffff;\n  --border: #e2e9f4;\n  --radius: 18px;\n}\n\n/* 2. Page basics */\n* { box-sizing: border-box; }\nhtml { scroll-behavior: smooth; }\nbody {\n  margin: 0;\n  background: var(--background);\n  color: var(--ink);\n  font-family: Arial, Helvetica, sans-serif;\n  line-height: 1.6;\n}\na { color: inherit; text-decoration: none; }\nbutton { font: inherit; }\n.container { width: min(1100px, 90%); margin: 0 auto; }\n.narrow { max-width: 760px; }\nsection { scroll-margin-top: 88px; }\n:focus-visible { outline: 3px solid var(--blue); outline-offset: 4px; }\n\n.skip-link { position: absolute; top: -60px; left: 12px; z-index: 10; padding: 8px 14px; background: var(--blue); color: white; border-radius: 6px; }\n.skip-link:focus { top: 12px; }",
    "solution_language": "css",
    "tasks": [
      "Define site-wide color values using CSS custom properties in `:root`, including a primary blue, darker blue, text color, muted text color, light background, white surface, border color, and a reusable border radius.",
      "Apply basic page rules: remove the body's default margin, select a readable system font, set comfortable line spacing, and use the light background and dark text colors you defined.",
      "Add a universal `box-sizing: border-box` rule so padding and borders are easier to reason about when sizing elements.",
      "Create reusable layout helpers: a centered `.container` with a maximum width and a narrower `.narrow` option for long text. These classes already appear in your HTML.",
      "Set sensible defaults for links and buttons. Add visible keyboard focus styles so visitors tabbing through links can see where they are.",
      "Style the existing `.skip-link` so it stays out of the normal view until it receives keyboard focus, when it becomes visible and usable."
    ]
  },
  {
    "number": 9,
    "level": 3,
    "title": "Style navigation and hero",
    "summary": "Style the navigation, hero layout, headings, and action buttons.",
    "purpose": "The header and hero are the first things visitors see. Good alignment and clear actions make the page easier to understand and more professional without complicated effects.",
    "file_to_edit": "`styles.css`, **below the global rules from Mission 8**. Use the class names that already exist in `index.html`; do not create a second hero or duplicate the HTML.",
    "instructions": "`styles.css`, **below the global rules from Mission 8**. Use the class names that already exist in `index.html`; do not create a second hero or duplicate the HTML.\n\n1. Style `.site-header` as a clean white bar with a subtle bottom border. Use Flexbox on `.header-content` to place the logo on one side and navigation on the other, vertically aligned.\n2. Give the logo a stronger type style, use blue as an accent, and space the navigation links evenly. Add a visible hover response to links.\n3. Set `.menu-button` to be hidden for larger screens for now. It will appear at mobile widths in Level 4, and its click behavior comes in Level 5.\n4. Turn the hero into a **two-column desktop layout**: larger copy area on the left and the introduction card on the right. Use CSS Grid to control the widths and spacing.\n5. Make the main heading prominent but readable, highlight the key words in blue, and style the description so its line length stays comfortable.\n6. Style the two action links as clear buttons: a filled blue primary action and a lighter outlined secondary action. They should have consistent padding and a clear hover state.",
    "success_criteria": "On a wide screen, the header feels organized, the hero appears as two balanced columns, and both action links stand out. The introduction card may still look basic; Mission 10 will style it. Mobile layout refinements come later.",
    "verification_check": "The hero becomes a two-column desktop layout with blue call-to-action styling.",
    "expected_result": "The hero becomes a two-column desktop layout with blue call-to-action styling.",
    "expected_image_path": "/project-assets/personal-portfolio/mission-09-expected.png",
    "hint_1": "Flexbox is useful for a row of nav links; Grid is useful for the two-column hero.",
    "hint_2": "Use `.header-content { display: flex; justify-content: space-between; }` and `.hero { display: grid; grid-template-columns: 1.2fr 0.8fr; }`.",
    "final_answer": "/* 3. Header and navigation */\n.site-header { background: var(--white); border-bottom: 1px solid var(--border); }\n.header-content { display: flex; align-items: center; justify-content: space-between; min-height: 76px; position: relative; }\n.logo { font-size: 1.6rem; font-weight: 800; letter-spacing: -1px; }\n.logo span { color: var(--blue); }\n.navigation { display: flex; align-items: center; gap: 28px; }\n.navigation a { font-size: 0.95rem; font-weight: 600; }\n.navigation a:hover { color: var(--blue); }\n.navigation .nav-contact { color: var(--blue); }\n.menu-button { display: none; background: none; border: 1px solid var(--border); border-radius: 10px; padding: 5px 12px; color: var(--ink); cursor: pointer; font-size: 1.4rem; }\n\n/* 4. Hero */\n.hero { display: grid; grid-template-columns: 1.2fr 0.8fr; align-items: center; gap: 60px; padding-top: 90px; padding-bottom: 90px; }\n.eyebrow, .section-label { color: var(--blue); font-size: 0.78rem; font-weight: 800; letter-spacing: 2px; }\nh1, h2, h3, p { margin-top: 0; }\nh1 { font-size: clamp(2.5rem, 5vw, 4.3rem); letter-spacing: -2px; line-height: 1.12; margin-bottom: 24px; }\nh1 span { color: var(--blue); }\n.hero-description { color: var(--muted); max-width: 520px; font-size: 1.08rem; }\n.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }\n.button { display: inline-block; border-radius: 10px; padding: 12px 22px; font-weight: 700; font-size: 0.95rem; }\n.button-primary { background: var(--blue); color: var(--white); }\n.button-primary:hover { background: var(--blue-dark); }\n.button-outline { border: 1px solid var(--border); background: var(--white); }\n.button-outline:hover { border-color: var(--blue); color: var(--blue); }",
    "solution_language": "css",
    "tasks": [
      "Style `.site-header` as a clean white bar with a subtle bottom border. Use Flexbox on `.header-content` to place the logo on one side and navigation on the other, vertically aligned.",
      "Give the logo a stronger type style, use blue as an accent, and space the navigation links evenly. Add a visible hover response to links.",
      "Set `.menu-button` to be hidden for larger screens for now. It will appear at mobile widths in Level 4, and its click behavior comes in Level 5.",
      "Turn the hero into a **two-column desktop layout**: larger copy area on the left and the introduction card on the right. Use CSS Grid to control the widths and spacing.",
      "Make the main heading prominent but readable, highlight the key words in blue, and style the description so its line length stays comfortable.",
      "Style the two action links as clear buttons: a filled blue primary action and a lighter outlined secondary action. They should have consistent padding and a clear hover state."
    ]
  },
  {
    "number": 10,
    "level": 3,
    "title": "Style the introduction card",
    "summary": "Style the developer introduction card and skill tags.",
    "purpose": "The introduction card gives visitors a compact summary of the developer. Its layout should visually separate the person's identity from the skills they are learning.",
    "file_to_edit": "`styles.css`, **below the header and hero rules from Mission 9**. The HTML card was already created in Mission 3—do not duplicate it.",
    "instructions": "`styles.css`, **below the header and hero rules from Mission 9**. The HTML card was already created in Mission 3—do not duplicate it.\n\n1. Style `.intro-card` as a distinct white panel with generous padding, a soft border, rounded corners, and a subtle shadow. Center the content inside it.\n2. Turn `.avatar` into a fixed-size initials block. Center its letters vertically and horizontally, and use a light-blue background with a darker blue text color.\n3. Make the person's name visually stronger than the role beneath it. Style the small \"Nice to meet you\" label so it reads as supporting information.\n4. Add space around `.intro-divider` and make it a thin line to separate the identity details from the technology summary.\n5. Lay out the three labels inside `.mini-skills` using Flexbox with gaps and wrapping, so they still fit if the card becomes narrow. Give each label a consistent chip-like appearance.\n6. Review spacing at normal desktop width. The card should be easy to scan without overwhelming the hero message.",
    "success_criteria": "The initials are centered, the name and role form a clear hierarchy, the divider is visible, and the HTML/CSS/JavaScript labels look like matching tags inside a balanced card.",
    "verification_check": "The introduction card has balanced spacing and recognizable skill tags.",
    "expected_result": "The introduction card has balanced spacing and recognizable skill tags.",
    "expected_image_path": "/project-assets/personal-portfolio/mission-10-expected.png",
    "hint_1": "Use `background`, `border`, `border-radius`, `padding`, and `box-shadow` on `.intro-card`.",
    "hint_2": "Give the initials square a fixed width and height and center its letters with `display: grid; place-items: center;`.",
    "final_answer": "/* 5. Intro card */\n.intro-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 38px 28px; box-shadow: 0 18px 50px rgba(17, 50, 102, 0.08); text-align: center; }\n.avatar { width: 108px; height: 108px; margin: 0 auto 22px; display: grid; place-items: center; border-radius: 28px; background: #eaf2ff; color: var(--blue); font-size: 2.3rem; font-weight: 800; }\n.intro-label { color: var(--blue); font-size: 0.75rem; font-weight: 800; letter-spacing: 2px; }\n.intro-card h2 { margin-bottom: 0; font-size: 1.6rem; }\n.intro-card > p:not(.intro-label) { color: var(--muted); }\n.intro-divider { height: 1px; background: var(--border); margin: 24px 0; }\n.intro-card .intro-caption { font-size: 0.88rem; }\n.mini-skills { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; }\n.mini-skills span, .project-tags span { padding: 5px 10px; background: #edf4ff; border-radius: 7px; color: var(--blue-dark); font-size: 0.78rem; font-weight: 700; }",
    "solution_language": "css",
    "tasks": [
      "Style `.intro-card` as a distinct white panel with generous padding, a soft border, rounded corners, and a subtle shadow. Center the content inside it.",
      "Turn `.avatar` into a fixed-size initials block. Center its letters vertically and horizontally, and use a light-blue background with a darker blue text color.",
      "Make the person's name visually stronger than the role beneath it. Style the small \"Nice to meet you\" label so it reads as supporting information.",
      "Add space around `.intro-divider` and make it a thin line to separate the identity details from the technology summary.",
      "Lay out the three labels inside `.mini-skills` using Flexbox with gaps and wrapping, so they still fit if the card becomes narrow. Give each label a consistent chip-like appearance.",
      "Review spacing at normal desktop width. The card should be easy to scan without overwhelming the hero message."
    ]
  },
  {
    "number": 11,
    "level": 4,
    "title": "Style sections and project cards",
    "summary": "Style the content sections, project cards, contact panel, and footer.",
    "purpose": "A professional page should feel like one connected design, not a polished hero followed by unfinished content. Here you'll give the rest of the portfolio the same visual quality.",
    "file_to_edit": "`styles.css`, **after the rules from Mission 10**. Do not change the HTML structure built in Level 2.",
    "instructions": "`styles.css`, **after the rules from Mission 10**. Do not change the HTML structure built in Level 2.\n\n1. Add shared styling for `.section` so About, Skills, Projects, and Contact have consistent vertical spacing. Use `.section-white` to create subtle contrast where needed, and keep heading/body typography consistent across sections.\n2. Change `.skill-list` from a default bulleted list into a flexible row of clearly separated skill chips. Remove default list spacing and bullets, add gaps, and allow wrapping.\n3. Style `.project-grid` as a **two-column grid on desktop** with enough gap for the cards to breathe. Each `.project-card` should have a consistent border, padding, background, and subtle shadow.\n4. Inside each project card, distinguish the symbol, project number, title, description, and technology tags. A visitor should be able to scan each card without reading every sentence.\n5. Make `.contact-box` a distinct, friendly call-to-action panel that draws attention to the **Email Me** link while using the same color palette.\n6. Style `.site-footer` and `.footer-content` so the copyright line and the technology credit are aligned and readable.",
    "success_criteria": "Every section looks intentionally styled, the skills appear as chips, the two projects sit side by side on a wide screen, the Contact panel stands out, and the footer has consistent spacing. Mobile behavior is handled in Mission 12.",
    "verification_check": "Two project cards sit side by side on desktop, and the contact panel is clearly visible.",
    "expected_result": "Two project cards sit side by side on desktop, and the contact panel is clearly visible.",
    "expected_image_path": "/project-assets/personal-portfolio/mission-11-expected.png",
    "hint_1": "Reuse shared `.section` and `.section-white` classes instead of styling each section independently.",
    "hint_2": "Use `grid-template-columns: repeat(2, 1fr)` for project cards and `.skill-list { display: flex; flex-wrap: wrap; }` for skills.",
    "final_answer": "/* 6. Content sections */\n.section { padding: 76px 0; }\n.section-white { background: var(--white); }\n.section h2 { margin-bottom: 14px; font-size: clamp(1.8rem, 3vw, 2.4rem); letter-spacing: -0.7px; }\n.body-copy, .section-intro { color: var(--muted); font-size: 1rem; }\n.skill-list { list-style: none; padding: 0; margin: 28px 0 0; display: flex; flex-wrap: wrap; gap: 12px; }\n.skill-list li { border: 1px solid var(--border); background: var(--white); border-radius: 10px; padding: 12px 16px; font-weight: 600; }\n.project-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 30px; }\n.project-card { border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; background: var(--white); box-shadow: 0 8px 24px rgba(17, 50, 102, 0.04); }\n.project-symbol { width: 54px; height: 54px; display: grid; place-items: center; border-radius: 14px; background: #edf4ff; color: var(--blue); font-weight: 800; font-size: 1.3rem; margin-bottom: 22px; }\n.project-number { color: var(--blue); letter-spacing: 1.6px; font-size: 0.73rem; font-weight: 800; }\n.project-card h3 { margin-bottom: 8px; font-size: 1.25rem; }\n.project-card > p:not(.project-number) { color: var(--muted); }\n.project-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }\n.contact-box { text-align: center; padding: 55px 20px; border: 1px solid #d7e6ff; background: #eaf3ff; border-radius: var(--radius); }\n.contact-box > p:not(.section-label) { color: var(--muted); }\n.contact-box .button { margin-top: 12px; }\n.site-footer { background: var(--white); border-top: 1px solid var(--border); }\n.footer-content { padding: 24px 0; display: flex; justify-content: space-between; gap: 12px; color: var(--muted); font-size: 0.86rem; }\n.footer-content p { margin: 0; }",
    "solution_language": "css",
    "tasks": [
      "Add shared styling for `.section` so About, Skills, Projects, and Contact have consistent vertical spacing. Use `.section-white` to create subtle contrast where needed, and keep heading/body typography consistent across sections.",
      "Change `.skill-list` from a default bulleted list into a flexible row of clearly separated skill chips. Remove default list spacing and bullets, add gaps, and allow wrapping.",
      "Style `.project-grid` as a **two-column grid on desktop** with enough gap for the cards to breathe. Each `.project-card` should have a consistent border, padding, background, and subtle shadow.",
      "Inside each project card, distinguish the symbol, project number, title, description, and technology tags. A visitor should be able to scan each card without reading every sentence.",
      "Make `.contact-box` a distinct, friendly call-to-action panel that draws attention to the **Email Me** link while using the same color palette.",
      "Style `.site-footer` and `.footer-content` so the copyright line and the technology credit are aligned and readable."
    ]
  },
  {
    "number": 12,
    "level": 4,
    "title": "Make the portfolio mobile-friendly",
    "summary": "Make the layout adapt cleanly to a narrow mobile viewport.",
    "purpose": "A page that works only on a desktop is incomplete. Users often open portfolios on phones, so the design must respond naturally to smaller screens.",
    "file_to_edit": "`styles.css`, **after all existing desktop styles**. Add a media query rather than changing every desktop rule.",
    "instructions": "`styles.css`, **after all existing desktop styles**. Add a media query rather than changing every desktop rule.\n\n1. Create a `@media (max-width: 760px)` block. These rules should apply when the browser viewport is 760 pixels wide or narrower.\n2. Reveal `.menu-button` on small screens. Hide the full `.navigation` by default and position it as a compact vertical panel below the header. Add a `.navigation.open` rule that displays the panel when JavaScript adds the `open` class in Level 5.\n3. Change `.hero` from two columns to one column, reduce its spacing, and keep the introduction card comfortably sized and centered.\n4. Change `.project-grid` from two columns to one, so project cards stack rather than become unreadably narrow. Reduce section padding where appropriate.\n5. Arrange `.footer-content` vertically and center it on small screens.\n6. Add a `prefers-reduced-motion` rule so users who request less motion don't get forced smooth scrolling.\n7. Test around **375px**, **760px**, and **1280px** in the browser. Look for cut-off text, horizontal scrolling, and overlapping sections.",
    "success_criteria": "The entire site fits on a narrow phone without sideways scrolling, project cards are stacked, and the menu button is visible. **Important:** The menu is expected to stay closed when clicked until Mission 13 adds the JavaScript behavior; don't treat that as a failure yet.",
    "verification_check": "At a narrow viewport the menu button appears, cards stack, and text remains readable.",
    "expected_result": "At a narrow viewport the menu button appears, cards stack, and text remains readable.",
    "expected_image_path": "/project-assets/personal-portfolio/mission-12-expected.png",
    "hint_1": "Put mobile-specific changes inside `@media (max-width: 760px)`.",
    "hint_2": "Change `.hero` and `.project-grid` to one column; hide the nav by default and display it when it receives the `.open` class.",
    "final_answer": "/* 7. Mobile layout */\n@media (max-width: 760px) {\n  .menu-button { display: block; }\n  .navigation { display: none; position: absolute; top: 69px; left: 0; right: 0; z-index: 2; flex-direction: column; align-items: stretch; gap: 0; background: var(--white); border: 1px solid var(--border); border-radius: 12px; padding: 10px; box-shadow: 0 10px 24px rgba(17, 50, 102, 0.08); }\n  .navigation.open { display: flex; }\n  .navigation a { padding: 10px 12px; }\n  .hero { grid-template-columns: 1fr; gap: 35px; padding-top: 55px; padding-bottom: 55px; }\n  h1 { letter-spacing: -1px; }\n  .intro-card { max-width: 460px; width: 100%; justify-self: center; }\n  .section { padding: 55px 0; }\n  .project-grid { grid-template-columns: 1fr; }\n  .footer-content { flex-direction: column; text-align: center; }\n}\n\n/* Respect accessibility preferences. */\n@media (prefers-reduced-motion: reduce) {\n  html { scroll-behavior: auto; }\n}",
    "solution_language": "css",
    "tasks": [
      "Create a `@media (max-width: 760px)` block. These rules should apply when the browser viewport is 760 pixels wide or narrower.",
      "Reveal `.menu-button` on small screens. Hide the full `.navigation` by default and position it as a compact vertical panel below the header. Add a `.navigation.open` rule that displays the panel when JavaScript adds the `open` class in Level 5.",
      "Change `.hero` from two columns to one column, reduce its spacing, and keep the introduction card comfortably sized and centered.",
      "Change `.project-grid` from two columns to one, so project cards stack rather than become unreadably narrow. Reduce section padding where appropriate.",
      "Arrange `.footer-content` vertically and center it on small screens.",
      "Add a `prefers-reduced-motion` rule so users who request less motion don't get forced smooth scrolling.",
      "Test around **375px**, **760px**, and **1280px** in the browser. Look for cut-off text, horizontal scrolling, and overlapping sections."
    ]
  },
  {
    "number": 13,
    "level": 5,
    "title": "Toggle the mobile navigation",
    "summary": "Toggle mobile navigation accessibly when the menu button is clicked.",
    "purpose": "On small screens, the navigation links are hidden to save space. JavaScript gives the menu button a real job: let visitors choose when to reveal or hide those links.",
    "file_to_edit": "`script.js`, which is empty so far. Your HTML already loads this file with `defer`, and your CSS already has `.navigation.open`.",
    "instructions": "`script.js`, which is empty so far. Your HTML already loads this file with `defer`, and your CSS already has `.navigation.open`.\n\n1. Use `document.querySelector()` to find the existing menu button with the `.menu-button` class and the navigation panel with the `.navigation` class. Do not create these elements again in JavaScript.\n2. Attach a `click` event listener to the menu button using `addEventListener()`.\n3. When the button is clicked, toggle the `open` class on the navigation panel. The mobile CSS should reveal it when the class is present and hide it when the class is removed.\n4. Keep the button's `aria-expanded` attribute synchronized with the menu state: `true` when open and `false` when closed. Update its accessible label to describe the next action.\n5. Save `script.js`, open the portfolio at a narrow viewport, and test clicking the button two times. Check the browser console if nothing happens.",
    "success_criteria": "The first click opens the mobile navigation, the second click closes it, and the button correctly communicates whether the menu is open. Desktop navigation should continue appearing normally. Do not try to implement menu-link closing or the footer year yet; those belong to Mission 14.",
    "verification_check": "On mobile, the button opens the navigation on the first click and closes it on the second.",
    "expected_result": "On mobile, the button opens the navigation on the first click and closes it on the second.",
    "expected_image_path": "/project-assets/personal-portfolio/mission-13-expected.png",
    "hint_1": "Use `document.querySelector()` to select the button and nav, and `addEventListener(\"click\", ...)` for interaction.",
    "hint_2": "Call `navigation.classList.toggle(\"open\")` and update `aria-expanded` to reflect the visible state.",
    "final_answer": "// Show or hide the navigation menu on small screens.\nconst menuButton = document.querySelector(\".menu-button\");\nconst navigation = document.querySelector(\".navigation\");\n\nmenuButton.addEventListener(\"click\", () => {\n  const isOpen = navigation.classList.toggle(\"open\");\n  menuButton.setAttribute(\"aria-expanded\", String(isOpen));\n  menuButton.setAttribute(\n    \"aria-label\",\n    isOpen ? \"Close navigation menu\" : \"Open navigation menu\"\n  );\n});",
    "solution_language": "javascript",
    "tasks": [
      "Use `document.querySelector()` to find the existing menu button with the `.menu-button` class and the navigation panel with the `.navigation` class. Do not create these elements again in JavaScript.",
      "Attach a `click` event listener to the menu button using `addEventListener()`.",
      "When the button is clicked, toggle the `open` class on the navigation panel. The mobile CSS should reveal it when the class is present and hide it when the class is removed.",
      "Keep the button's `aria-expanded` attribute synchronized with the menu state: `true` when open and `false` when closed. Update its accessible label to describe the next action.",
      "Save `script.js`, open the portfolio at a narrow viewport, and test clicking the button two times. Check the browser console if nothing happens."
    ]
  },
  {
    "number": 14,
    "level": 5,
    "title": "Close the menu and update the year",
    "summary": "Close the mobile menu after navigation and update the footer year.",
    "purpose": "Small finishing details make an interface feel reliable. When a visitor chooses a mobile menu item, the menu should get out of the way; the copyright date should also stay correct automatically.",
    "file_to_edit": "`script.js`, **below the working menu-toggle code from Mission 13**. Add to the file—do not replace or break the first event listener.",
    "instructions": "`script.js`, **below the working menu-toggle code from Mission 13**. Add to the file—do not replace or break the first event listener.\n\n1. Find all links **inside** the existing navigation using `navigation.querySelectorAll(\"a\")`.\n2. Attach a click listener to each navigation link. When a visitor chooses one, remove the `open` class from the navigation panel so the mobile menu closes before or while the page scrolls to the target section.\n3. Reset the menu button's `aria-expanded` value to `false` and change its accessible label back to \"Open navigation menu\". This keeps the code and accessibility information consistent.\n4. Find the footer's `#year` element and set its `textContent` to the current year using `new Date().getFullYear()`. This replaces the temporary year from Mission 7 without editing HTML every January.\n5. Test everything together: open the menu on a narrow screen, select Projects, confirm the menu closes, return to the top, open it again, and close it with the button. Confirm the footer year is current and the page still works after refresh.",
    "success_criteria": "Mobile navigation opens, closes, and dismisses after selecting a link; the footer year is automatic; the four navigation targets and both hero actions work; and the complete portfolio stays readable on desktop and phone. Congratulations—you now have a complete beginner portfolio built from your own HTML, CSS, and JavaScript.",
    "verification_check": "On mobile a nav link closes the menu; footer shows the current year. Test links, contrast, keyboard focus, and refresh.",
    "expected_result": "On mobile a nav link closes the menu; footer shows the current year. Test links, contrast, keyboard focus, and refresh.",
    "expected_image_path": "/project-assets/personal-portfolio/mission-14-expected.png",
    "hint_1": "You can attach a click listener to each navigation link using `querySelectorAll(\"a\").forEach(...)`.",
    "hint_2": "Remove the `.open` class in those listeners, then set `document.querySelector(\"#year\").textContent = new Date().getFullYear()`.",
    "final_answer": "// Close the mobile menu after choosing a section.\nnavigation.querySelectorAll(\"a\").forEach((link) => {\n  link.addEventListener(\"click\", () => {\n    navigation.classList.remove(\"open\");\n    menuButton.setAttribute(\"aria-expanded\", \"false\");\n    menuButton.setAttribute(\"aria-label\", \"Open navigation menu\");\n  });\n});\n\n// Keep the copyright year current.\ndocument.querySelector(\"#year\").textContent = new Date().getFullYear();",
    "solution_language": "javascript",
    "tasks": [
      "Find all links **inside** the existing navigation using `navigation.querySelectorAll(\"a\")`.",
      "Attach a click listener to each navigation link. When a visitor chooses one, remove the `open` class from the navigation panel so the mobile menu closes before or while the page scrolls to the target section.",
      "Reset the menu button's `aria-expanded` value to `false` and change its accessible label back to \"Open navigation menu\". This keeps the code and accessibility information consistent.",
      "Find the footer's `#year` element and set its `textContent` to the current year using `new Date().getFullYear()`. This replaces the temporary year from Mission 7 without editing HTML every January.",
      "Test everything together: open the menu on a narrow screen, select Projects, confirm the menu closes, return to the top, open it again, and close it with the button. Confirm the footer year is current and the page still works after refresh."
    ]
  }
]
$mission_payload$::jsonb)
  loop
    select l.id into v_level_id
    from public.levels l
    where l.project_id = v_project_id
      and l.level_number = (v_mission ->> 'level')::integer;

    if v_level_id is null then
      raise exception 'No level for mission %', v_mission ->> 'number';
    end if;

    if jsonb_array_length(v_mission -> 'tasks') = 0 then
      raise exception 'Mission % has no tasks', v_mission ->> 'number';
    end if;

    insert into public.missions
      (
        level_id, mission_number, title, summary, instructions,
        purpose, file_to_edit, expected_result, expected_image_path,
        hint_1, hint_2, final_answer, solution_language,
        success_criteria, verification_check
      )
    values
      (
        v_level_id,
        (v_mission ->> 'number')::integer,
        v_mission ->> 'title',
        v_mission ->> 'summary',
        v_mission ->> 'instructions',
        v_mission ->> 'purpose',
        v_mission ->> 'file_to_edit',
        v_mission ->> 'expected_result',
        v_mission ->> 'expected_image_path',
        v_mission ->> 'hint_1',
        v_mission ->> 'hint_2',
        v_mission ->> 'final_answer',
        v_mission ->> 'solution_language',
        v_mission ->> 'success_criteria',
        v_mission ->> 'verification_check'
      )
    returning id into v_mission_id;

    v_task_number := 0;
    for v_task in
      select value from jsonb_array_elements_text(v_mission -> 'tasks')
    loop
      v_task_number := v_task_number + 1;
      insert into public.mission_tasks
        (mission_id, task_number, instruction)
      values (v_mission_id, v_task_number, v_task);
    end loop;
  end loop;

  -- Verify the seed inside the transaction before committing anything.
  select count(*) into v_levels_count
  from public.levels l where l.project_id = v_project_id;

  select count(*) into v_missions_count
  from public.missions m
  join public.levels l on l.id = m.level_id
  where l.project_id = v_project_id;

  select count(*) into v_tasks_count
  from public.mission_tasks mt
  join public.missions m on m.id = mt.mission_id
  join public.levels l on l.id = m.level_id
  where l.project_id = v_project_id;

  if v_levels_count <> 5 or v_missions_count <> 14 or v_tasks_count <> 79 then
    raise exception
      'Portfolio seed count mismatch: % levels, % missions, % tasks',
      v_levels_count, v_missions_count, v_tasks_count;
  end if;
end;
$seed$;

commit;
