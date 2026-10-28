"use strict";

const PHONE_DISPLAY = "0773 282 692";
const PHONE_SECONDARY_DISPLAY = "0771 535 954";
const PHONE_WHATSAPP = "263773282692";
const ACCOUNT_KEY = "leekays.accounts.v1";
const SESSION_KEY = "leekays.session.v1";
const THEME_KEY = "leekays.theme.v1";
const NAV_ITEMS = [
  ["Home", "index.html", "home"],
  ["Our story", "about.html", "about"],
  ["Menu", "menu.html", "menu"],
  ["Bookings & orders", "bookings.html", "bookings"],
  ["Gallery", "gallery.html", "gallery"],
  ["Chef's game", "game.html", "game"],
  ["Contact", "contact.html", "contact"],
  ["Settings", "settings.html", "settings"]
];
const LUNCHBOX_WEEKS = [
  { week: "Week 1", days: [["Monday", "Hot dog, yoghurt"], ["Tuesday", "Roasted potato, chicken"], ["Wednesday", "Chicken pie, crisps"], ["Thursday", "Beef burger, juice"]] },
  { week: "Week 2", days: [["Monday", "Fresh chips, sausage"], ["Tuesday", "Chicken samoosas, fruit"], ["Wednesday", "Polony and cheese burger, yoghurt"], ["Thursday", "Toasted egg mayo sandwich, juice"]] },
  { week: "Week 3", days: [["Monday", "Sausage roll, juice"], ["Tuesday", "Scones, halfmoons"], ["Wednesday", "Egg roll, chicken"], ["Thursday", "Hot dog, fruit"]] },
  { week: "Week 4", days: [["Monday", "Cheese burger, yoghurt"], ["Tuesday", "Cupcakes, fruit"], ["Wednesday", "Chicken wraps"], ["Thursday", "Beef pie, crisps"]] }
];
const GALLERY = [
  ["food-1.jpg", "Freshly prepared savoury rolls and bites"],
  ["food-2.jpg", "Savoury snacks served with salad"],
  ["food-3.jpg", "Braised meat with vegetables"],
  ["food-4.jpg", "A hearty meat and rice dish"],
  ["food-5.jpg", "Grilled meat with a fresh salad"],
  ["food-6.jpg", "A cheeseburger with a fresh side salad"],
  ["food-7.jpg", "Golden fried fish with lemon"],
  ["food-8.jpg", "A buffet selection of rice and vegetables"],
  ["food-9.jpg", "A generous serving of comfort food"],
  ["food-10.jpg", "Colourful assorted sandwiches"],
  ["food-11.jpg", "A golden savoury bake"],
  ["food-12.jpg", "A platter of party bites"],
  ["food-13.jpg", "A colourful selection of savoury snacks"],
  ["food-14.jpg", "Creamy pasta with fresh vegetables"],
  ["food-15.jpg", "Chef Leekay preparing a buffet"],
  ["drinks-1.jpg", "A bright red fruit drink"],
  ["drinks-2.jpg", "A colourful layered fruit drink"],
  ["drinks-3.jpg", "A creamy chilled drink"],
  ["drinks-4.jpg", "A fruit-infused drink"]
];
const INGREDIENTS = [
  ["bread", "🍞", "Bread"],
  ["bacon", "🥓", "Bacon"],
  ["lettuce", "🥬", "Lettuce"],
  ["tomato", "🍅", "Tomato"],
  ["cheese", "🧀", "Cheese"],
  ["egg", "🍳", "Egg"],
  ["rice", "🍚", "Rice"],
  ["carrot", "🥕", "Carrot"],
  ["peas", "🫛", "Peas"],
  ["pasta", "🍝", "Pasta"],
  ["basil", "🌿", "Basil"],
  ["flatbread", "🫓", "Flatbread"],
  ["chicken", "🍗", "Chicken"]
];
const RECIPES = [
  { ingredients: ["bread", "bacon", "lettuce", "tomato"], name: "Classic BLT sandwich", detail: "Crispy bacon, lettuce and tomato on bread. No cheese in this classic!" },
  { ingredients: ["bread", "bacon", "egg", "cheese"], name: "Bacon, egg & cheese sandwich", detail: "A hearty breakfast stack with egg and melty cheese." },
  { ingredients: ["rice", "egg", "carrot", "peas"], name: "Egg fried rice", detail: "Rice tossed with egg, sweet peas and carrot." },
  { ingredients: ["flatbread", "tomato", "cheese", "basil"], name: "Margherita flatbread", detail: "Tomato, cheese and fragrant basil on a crisp flatbread." },
  { ingredients: ["pasta", "tomato", "cheese", "basil"], name: "Cheesy tomato pasta", detail: "A cosy pasta bowl with tomato, cheese and basil." },
  { ingredients: ["bread", "chicken", "lettuce", "tomato"], name: "Chicken garden sandwich", detail: "Chicken with crisp lettuce and tomato on bread." }
];

const app = document.querySelector("#app");
const currentPage = app.dataset.page;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function getAccounts() {
  const stored = localStorage.getItem(ACCOUNT_KEY);
  if (stored === null) return [];
  const accounts = JSON.parse(stored);
  if (!Array.isArray(accounts)) throw new Error("The saved account list has an invalid format.");
  return accounts;
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
}

function getCurrentUser() {
  const email = sessionStorage.getItem(SESSION_KEY);
  if (email === null) return null;
  const account = getAccounts().find((item) => item.email === email);
  if (account === undefined) {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
  return account;
}

function getTheme() {
  return localStorage.getItem(THEME_KEY) || "cream";
}

function applyTheme(theme) {
  const themes = ["cream", "forest", "black"];
  if (!themes.includes(theme)) throw new Error("Choose one of the available colour themes.");
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === "cream" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, theme);
}

function showFeedback(container, message, isError = false) {
  container.innerHTML = `<div class="${isError ? "error-box" : "success-box"}" role="status">${escapeHTML(message)}</div>`;
}

function headerAndFooter() {
  document.querySelector("#site-nav").innerHTML = NAV_ITEMS.map(([label, href, page]) => (
    `<a href="${href}"${page === currentPage ? ' aria-current="page"' : ""}>${label}</a>`
  )).join("") + `<div class="nav-theme-picker" role="group" aria-label="Choose a colour theme"><button class="nav-theme-choice" type="button" data-theme-choice="cream" aria-label="Warm cream theme" title="Warm cream" aria-pressed="false"><span aria-hidden="true">☀️</span></button><button class="nav-theme-choice" type="button" data-theme-choice="forest" aria-label="Forest theme" title="Forest" aria-pressed="false"><span aria-hidden="true">🌲</span></button><button class="nav-theme-choice" type="button" data-theme-choice="black" aria-label="Black and gold theme" title="Black &amp; gold" aria-pressed="false"><span aria-hidden="true">⚫</span></button></div>`;
  const footer = document.querySelector("#site-footer");
  footer.className = "site-footer";
  footer.innerHTML = `<span>© ${new Date().getFullYear()} Leekay's Kitchen · Made with a little extra love.</span>`;
  const toggle = document.querySelector(".menu-toggle");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
    document.querySelector("#site-nav").classList.toggle("is-open", !open);
  });
}

function pageHead(eyebrow, title, description) {
  return `<div class="page-head"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></div>`;
}

function homePage() {
  return `<section class="hero"><div class="hero-copy"><p class="eyebrow">Welcome to Leekay's Kitchen</p><h1>A little taste of <em>home.</em></h1><p>Good food, made with care and served with a smile. Come by for a comforting favourite or let us bring lunch to your school.</p><div class="hero-actions"><a class="button button-accent" href="bookings.html">Order or book <span aria-hidden="true">↗</span></a><a class="button button-outline" href="menu.html">Lunchbox program</a></div></div></section>
    <section class="home-intro"><div class="intro-copy"><p class="eyebrow">Made with care</p><h2>Comfort food for the moments that matter.</h2><p>At Leekay's Kitchen, good food is about more than what's on the plate. We bring people together with familiar, freshly prepared favourites and a thoughtful school lunch program.</p><p>The Kitchen Lunchbox Program serves a four-week rotating menu, delivered to school every morning Monday to Friday. Please provide a lunchbag for your child.</p><a class="text-link" href="about.html">A little more about us <span aria-hidden="true">→</span></a></div><div class="intro-photo" role="img" aria-label="A bowl of grilled chicken and vegetables"></div></section>
    <section class="feature-band"><article class="feature"><span class="feature-icon" aria-hidden="true">🍱</span><h3>Four-week lunch menu</h3><p>A rotating selection of school lunchbox favourites.</p></article><article class="feature"><span class="feature-icon" aria-hidden="true">💵</span><h3>$110 per month</h3><p>Kitchen Lunchbox Program monthly price.</p></article><article class="feature"><span class="feature-icon" aria-hidden="true">🛵</span><h3>Weekday school delivery</h3><p>Delivered every morning, Monday to Friday. Please bring a lunchbag.</p></article></section>
    <section class="page"><div class="callout"><div><h3>Something delicious on your mind?</h3><p>View the four-week lunchbox menu or call Chef Leekay to ask about the program.</p></div><a class="button button-accent" href="menu.html">View lunchbox menu <span aria-hidden="true">→</span></a></div></section>`;
}

function aboutPage() {
  return `<section class="page">${pageHead("Our story", "Good food feels like home.", "A kitchen built around care, comforting flavours and the joy of sharing a good meal.")}<div class="about-layout"><div class="about-copy"><p class="eyebrow">A warm welcome</p><h2>Food made to bring people together.</h2><img class="about-photo" src="assets/chef-hero-shot.jpg" alt="Chef Leekay, Leandrah Makaya, in her chef's jacket"><p>Leekay's Kitchen was created by Leandrah Makaya, aka Chef Leekay, from a love of familiar flavours, freshly prepared food and the joy of sharing a good meal.</p><p>The Kitchen Lunchbox Program offers a four-week rotating menu, with lunch delivered to school every morning Monday to Friday. Please provide a lunchbag for your child.</p><p>Whether you're planning ahead or just fancy something delicious, Chef Leekay would love to hear from you.</p><div class="note-card">“A little taste of home, made with a whole lot of heart.”</div><p style="margin-top:22px"><a class="text-link" href="menu.html">Explore the menu <span aria-hidden="true">→</span></a></p></div></div></section>`;
}

function menuPage() {
  return `<section class="page">${pageHead("School lunch, sorted", "Kitchen Lunchbox Program", "A four-week lunch menu delivered to school every morning, Monday to Friday.")}<div class="program-summary"><div><span class="program-summary-icon" aria-hidden="true">💵</span><strong>$110 per month</strong></div><p>For program enquiries, call 0773 282 692 or 0771 535 954. Please provide a lunchbag for your child.</p><a class="button" href="bookings.html">Enquire about the program <span aria-hidden="true">↗</span></a></div><div class="program-week-grid">${LUNCHBOX_WEEKS.map(({ week, days }) => `<section class="program-week"><h2>${week}</h2>${days.map(([day, meal]) => `<div class="program-day"><span>${day}</span><span>${meal}</span></div>`).join("")}</section>`).join("")}</div><p class="week-notice">Lunch is delivered to school every morning, Monday to Friday. Please provide a lunchbag for your child.</p></section>`;
}

function bookingsPage() {
  return `<section class="page">${pageHead("Let's make it delicious", "Bookings &amp; orders", "Send an enquiry straight to Chef Lee on WhatsApp. We'll help confirm the details with you.")}<div class="booking-grid"><form class="form-card" id="order-form"><h2>What can we prepare?</h2><p class="form-intro">Fill in what you know. Your message opens in WhatsApp so you can review and send it.</p><div class="form-grid"><div class="field"><label for="order-name">Your name</label><input id="order-name" name="name" autocomplete="name" required maxlength="60"></div><div class="field"><label for="order-phone">Your phone number</label><input id="order-phone" name="phone" type="tel" autocomplete="tel" required maxlength="25"></div><div class="field"><label for="order-type">I'm enquiring about</label><select id="order-type" name="type" required><option value="">Choose one</option><option>Placing a food order</option><option>Booking / gathering</option><option>School lunch delivery</option><option>Kitchen Lunchbox Program</option></select></div><div class="field"><label for="order-date">Preferred date</label><input id="order-date" name="date" type="date" required></div><div class="field"><label for="order-quantity">Number of meals / guests</label><input id="order-quantity" name="quantity" type="number" min="1" max="500" placeholder="e.g. 2"></div><div class="field"><label for="order-time">Preferred time</label><input id="order-time" name="time" type="time"></div><div class="field field-full"><label for="order-notes">Anything else Chef Lee should know?</label><textarea id="order-notes" name="notes" maxlength="500" placeholder="Menu choice, delivery details or a special request"></textarea></div></div><button class="button" type="submit">Continue in WhatsApp <span aria-hidden="true">↗</span></button><p class="form-footnote">Your enquiry is not confirmed until Chef Lee replies.</p><div class="form-result" id="order-result" aria-live="polite"></div></form><aside class="info-card"><p class="eyebrow">A quick hello</p><h2>Talk to Chef Lee.</h2><p>Give us a call or send a WhatsApp message to ask about the menu, deliveries or your booking.</p><div class="contact-line"><span>Call</span><a href="tel:+263773282692">${PHONE_DISPLAY}</a><a href="tel:+263771535954">${PHONE_SECONDARY_DISPLAY}</a></div><div class="contact-line"><span>WhatsApp</span><a href="https://wa.me/${PHONE_WHATSAPP}" target="_blank" rel="noopener noreferrer">Message Chef Lee ↗</a></div><div class="contact-line"><span>School lunch delivery</span><span>Monday to Friday mornings. Please provide a lunchbag for your child.</span></div></aside></div></section>`;
}

function galleryPage() {
  return `<section class="page">${pageHead("From our kitchen", "Good things look this good.", "Explore freshly prepared food and refreshing drinks from Leekay's Kitchen.")}<div class="gallery-grid">${GALLERY.map(([file, caption]) => `<figure class="gallery-item"><img src="assets/${file}" alt="${caption}" loading="lazy"><figcaption>${caption}</figcaption></figure>`).join("")}</div><div class="callout"><div><h3>Fancy a taste?</h3><p>Ask Chef Lee about today's menu or arrange a school lunch delivery.</p></div><a class="button button-accent" href="bookings.html">Order / book <span aria-hidden="true">↗</span></a></div></section>`;
}

function gamePage() {
  const user = getCurrentUser();
  if (!user) {
    sessionStorage.setItem("leekays.game.return", "game.html");
    return `<section class="page">${pageHead("A little kitchen fun", "The chef's game", "Learn a few favourite recipes, then test what you've picked up in the kitchen quiz.")}<div class="guest-gate"><span class="guest-gate-icon" aria-hidden="true">🔒</span><h2>Sign in to enter the kitchen.</h2><p>The chef's game is for signed-in account holders. You can keep browsing as a guest, or create an account to play.</p><div class="hero-actions"><a class="button" href="settings.html#account">Sign in or create an account</a><a class="button button-accent" href="index.html">Keep browsing as a guest</a></div></div></section>`;
  }
  const ingredientLabels = new Map(INGREDIENTS.map(([id, emoji, name]) => [id, `${emoji} ${name}`]));
  return `<section class="page"><div class="game-wrap">${pageHead("Welcome to the kitchen", "Learn a recipe. Then take the quiz.", `Hi ${escapeHTML(user.name)}! First, get to know these favourite combinations.`)}<section class="lesson-board" aria-labelledby="lesson-title"><p class="eyebrow">Lesson one</p><h2 id="lesson-title">A few kitchen classics</h2><p class="lesson-intro">Every good dish starts with ingredients that work well together. Study these recipes, then see what you remember.</p><div class="recipe-grid">${RECIPES.map((recipe) => `<article class="recipe-card"><h3>${recipe.name}</h3><p>${recipe.detail}</p><ul>${recipe.ingredients.map((ingredient) => `<li>${ingredientLabels.get(ingredient)}</li>`).join("")}</ul></article>`).join("")}</div><button class="button" id="start-quiz" type="button">I've got it — start the quiz <span aria-hidden="true">→</span></button></section><section class="game-board quiz-board" id="quiz-board" aria-label="Recipe quiz" hidden><div class="game-toolbar"><span id="game-progress"></span><span>Total score: <strong id="game-score">${user.score || 0}</strong></span></div><h2 id="quiz-question" tabindex="-1"></h2><div class="quiz-options" id="quiz-options"></div><p class="game-feedback" id="quiz-feedback" aria-live="polite"></p><div class="game-actions"><button class="button" id="next-question" type="button" hidden>Next question</button></div></section></div></section>`;
}

function contactPage() {
  return `<section class="page">${pageHead("We'd love to hear from you", "Say hello to Chef Lee.", "Questions about the menu, school delivery or a booking? Get in touch and we'll be happy to help.")}<div class="contact-grid"><article class="contact-card"><div class="contact-card-icon" aria-hidden="true">☎</div><h3>Call Chef Lee</h3><p>Talk directly about today's menu, an order or delivery.</p><a href="tel:+263773282692">${PHONE_DISPLAY} ↗</a><a href="tel:+263771535954">${PHONE_SECONDARY_DISPLAY} ↗</a></article><article class="contact-card"><div class="contact-card-icon" aria-hidden="true">💬</div><h3>WhatsApp</h3><p>Send us a message and let us know what you're looking for.</p><a href="https://wa.me/${PHONE_WHATSAPP}" target="_blank" rel="noopener noreferrer">Message on WhatsApp ↗</a></article><article class="contact-card"><div class="contact-card-icon" aria-hidden="true">f</div><h3>Facebook</h3><p>Find Leekay's Kitchen and stay in the loop.</p><a href="https://www.facebook.com/ChefLeekay/" target="_blank" rel="noopener noreferrer">Facebook · @ChefLeekay ↗</a></article><article class="contact-card"><div class="contact-card-icon" aria-hidden="true">◎</div><h3>Instagram</h3><p>Follow along for a little inspiration from the kitchen.</p><a href="https://www.instagram.com/leekays_kitchen/" target="_blank" rel="noopener noreferrer">Instagram · @leekays_kitchen ↗</a></article><article class="contact-card"><div class="contact-card-icon" aria-hidden="true">♪</div><h3>TikTok</h3><p>Catch more from Leekay's Kitchen.</p><a href="https://www.tiktok.com/@leekays_kitchen" target="_blank" rel="noopener noreferrer">TikTok · @leekays_kitchen ↗</a></article></div><div class="callout"><div><h3>School lunch? We've got you.</h3><p>The Kitchen Lunchbox Program delivers to school every morning, Monday to Friday. Call Chef Lee to ask about it.</p></div><a class="button button-accent" href="bookings.html">Send an enquiry <span aria-hidden="true">↗</span></a></div></section>`;
}

function settingsPage() {
  const user = getCurrentUser();
  const appearance = `<section class="settings-card"><h3>Appearance</h3><p>Choose the colour palette that's easiest on your eyes.</p><div class="theme-choices"><button class="theme-choice" type="button" data-theme-choice="cream"><span aria-hidden="true">☀️</span> Warm cream</button><button class="theme-choice" type="button" data-theme-choice="forest"><span aria-hidden="true">🌲</span> Forest</button><button class="theme-choice" type="button" data-theme-choice="black"><span aria-hidden="true">⚫</span> Black &amp; gold</button></div></section>`;
  if (user) {
    return `<section class="page">${pageHead("Your kitchen corner", "Account &amp; settings", "Manage this browser's demo account and choose your site appearance.")}<div class="account-layout"><div><section class="settings-card"><p class="eyebrow">Signed in</p><h2>Welcome, ${escapeHTML(user.name)}.</h2><p>Account: ${escapeHTML(user.email)}</p><p>Your best chef's game score: <strong>${user.score || 0}</strong></p><button class="button button-small" id="sign-out" type="button">Sign out</button></section>${appearance}</div><section class="settings-card"><h3>About account data</h3><p>This site is a standalone front-end demo. Account details and preferences are saved in this browser only and are not connected to a restaurant server.</p><p class="account-note">Do not use a password you use on other sites. For real customer accounts, connect a production authentication service before publishing.</p></section></div></section>`;
  }
  return `<section class="page" id="account">${pageHead("Your kitchen corner", "Sign in or join us.", "Browsing is open to everyone. Make an account if you'd like to play the chef's game.")}<div class="account-layout"><div class="auth-forms"><form class="auth-card" id="sign-in-form"><p class="eyebrow">Welcome back</p><h3>Sign in</h3><div class="field"><label for="login-email">Email address</label><input id="login-email" name="email" type="email" autocomplete="email" required></div><div class="field"><label for="login-password">Password</label><input id="login-password" name="password" type="password" autocomplete="current-password" required></div><button class="button button-small" type="submit">Sign in</button><div class="form-result" id="login-result" aria-live="polite"></div></form><form class="auth-card" id="create-account-form"><p class="eyebrow">First time here?</p><h3>Create an account</h3><div class="field"><label for="signup-name">Your name</label><input id="signup-name" name="name" autocomplete="name" maxlength="50" required></div><div class="field"><label for="signup-email">Email address</label><input id="signup-email" name="email" type="email" autocomplete="email" required></div><div class="field"><label for="signup-password">Choose a password</label><input id="signup-password" name="password" type="password" autocomplete="new-password" minlength="10" required aria-describedby="password-hint"><span class="form-footnote" id="password-hint">Use at least 10 characters. Don't reuse a password from another site.</span></div><button class="button button-small" type="submit">Create account</button><div class="form-result" id="signup-result" aria-live="polite"></div></form></div><div>${appearance}<section class="settings-card"><h3>Guest mode</h3><p>You're welcome to explore the menu, gallery and contact details without signing in. Restaurant bookings and orders don't require an account.</p><p class="account-note">Account data stays in this browser in this demo. It isn't a production sign-in service.</p></section></div></div></section>`;
}

const PAGE_RENDERERS = {
  home: homePage,
  about: aboutPage,
  menu: menuPage,
  bookings: bookingsPage,
  gallery: galleryPage,
  game: gamePage,
  contact: contactPage,
  settings: settingsPage
};

function openWhatsApp(message) {
  return `https://wa.me/${PHONE_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

function wireOrderForm() {
  const form = document.querySelector("#order-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const details = [
      "Hello Chef Lee! I'd like to make an enquiry.",
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `Enquiry: ${data.get("type")}`,
      `Preferred date: ${data.get("date")}`,
      data.get("quantity") ? `Number of meals / guests: ${data.get("quantity")}` : "",
      data.get("time") ? `Preferred time: ${data.get("time")}` : "",
      data.get("notes") ? `Notes: ${data.get("notes")}` : ""
    ].filter(Boolean).join("\n");
    const result = document.querySelector("#order-result");
    result.innerHTML = `<div class="success-box">Your message is ready. Open WhatsApp to review and send your enquiry: <a href="${openWhatsApp(details)}" target="_blank" rel="noopener noreferrer">Continue to WhatsApp ↗</a></div>`;
  });
  const date = form.querySelector('[name="date"]');
  date.min = new Date().toISOString().slice(0, 10);
}

function bytesToHex(bytes) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password, saltHex) {
  if (!crypto.subtle) throw new Error("Secure browser cryptography isn't available. Open this page over HTTPS or localhost to use accounts.");
  const salt = Uint8Array.from(saltHex.match(/.{2}/g), (byte) => Number.parseInt(byte, 16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const result = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 310000, hash: "SHA-256" }, key, 256);
  return bytesToHex(result);
}

function redirectAfterSignIn() {
  const returnPage = sessionStorage.getItem("leekays.game.return");
  if (returnPage === "game.html") {
    sessionStorage.removeItem("leekays.game.return");
    window.location.assign("game.html");
    return;
  }
  window.location.assign("settings.html");
}

function wireAuthForms() {
  const loginForm = document.querySelector("#sign-in-form");
  if (loginForm) loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
    const result = document.querySelector("#login-result");
    try {
      const email = String(data.get("email")).trim().toLowerCase();
      const account = getAccounts().find((item) => item.email === email);
      if (!account || await hashPassword(String(data.get("password")), account.salt) !== account.passwordHash) {
        showFeedback(result, "That email and password don't match an account in this browser.", true);
        return;
      }
      sessionStorage.setItem(SESSION_KEY, email);
      redirectAfterSignIn();
    } catch (error) {
      showFeedback(result, error.message || "We couldn't sign you in. Please try again.", true);
    }
  });

  const createForm = document.querySelector("#create-account-form");
  if (createForm) createForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(createForm);
    const result = document.querySelector("#signup-result");
    try {
      const name = String(data.get("name")).trim();
      const email = String(data.get("email")).trim().toLowerCase();
      const password = String(data.get("password"));
      if (name.length === 0 || email.length === 0) {
        showFeedback(result, "Enter your name and email address to create an account.", true);
        return;
      }
      const accounts = getAccounts();
      if (accounts.some((item) => item.email === email)) {
        showFeedback(result, "An account with that email already exists in this browser. Try signing in instead.", true);
        return;
      }
      const salt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
      const passwordHash = await hashPassword(password, salt);
      accounts.push({ name, email, salt, passwordHash, score: 0 });
      saveAccounts(accounts);
      sessionStorage.setItem(SESSION_KEY, email);
      redirectAfterSignIn();
    } catch (error) {
      showFeedback(result, error.message || "We couldn't create your account. Please try again.", true);
    }
  });

  const signOut = document.querySelector("#sign-out");
  if (signOut) signOut.addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.assign("settings.html");
  });
}

function wireThemeChoices() {
  const selected = getTheme();
  applyTheme(selected);
  document.querySelectorAll("[data-theme-choice]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeChoice === selected));
    button.addEventListener("click", () => {
      applyTheme(button.dataset.themeChoice);
      document.querySelectorAll("[data-theme-choice]").forEach((choice) => {
        choice.setAttribute("aria-pressed", String(choice.dataset.themeChoice === button.dataset.themeChoice));
      });
    });
  });
}

function wireGame() {
  const lesson = document.querySelector(".lesson-board");
  if (!lesson) return;
  const quiz = document.querySelector("#quiz-board");
  const question = document.querySelector("#quiz-question");
  const options = document.querySelector("#quiz-options");
  const progress = document.querySelector("#game-progress");
  const feedback = document.querySelector("#quiz-feedback");
  const nextButton = document.querySelector("#next-question");
  let questionIndex = 0;
  let runScore = 0;
  let answered = false;
  let completed = false;

  const renderQuestion = () => {
    const recipe = RECIPES[questionIndex];
    answered = false;
    completed = false;
    progress.textContent = `Question ${questionIndex + 1} of ${RECIPES.length}`;
    question.textContent = `Which meal uses ${recipe.ingredients.map((ingredient) => INGREDIENTS.find(([id]) => id === ingredient)[2].toLowerCase()).join(", ")}?`;
    options.innerHTML = RECIPES.map((option, index) => (
      `<button class="quiz-option" type="button" data-recipe-answer="${index}">${option.name}</button>`
    )).join("");
    feedback.textContent = "";
    nextButton.hidden = true;
    nextButton.textContent = questionIndex === RECIPES.length - 1 ? "Finish quiz" : "Next question";
  };

  document.querySelector("#start-quiz").addEventListener("click", () => {
    lesson.hidden = true;
    quiz.hidden = false;
    renderQuestion();
    question.focus();
  });

  options.addEventListener("click", (event) => {
    const answer = event.target.closest("[data-recipe-answer]");
    if (!answer || answered || completed) return;
    answered = true;
    options.querySelectorAll("button").forEach((button, index) => {
      button.disabled = true;
      if (index === questionIndex) button.dataset.result = "correct";
      else if (button === answer) button.dataset.result = "incorrect";
    });
    if (Number(answer.dataset.recipeAnswer) === questionIndex) {
      runScore += 1;
      const accounts = getAccounts();
      const email = sessionStorage.getItem(SESSION_KEY);
      const account = accounts.find((item) => item.email === email);
      if (!account) {
        window.location.assign("settings.html");
        return;
      }
      account.score = (account.score || 0) + 1;
      saveAccounts(accounts);
      document.querySelector("#game-score").textContent = String(account.score);
      feedback.textContent = `Correct! ${RECIPES[questionIndex].detail}`;
    } else {
      feedback.textContent = `Not quite. ${RECIPES[questionIndex].name}: ${RECIPES[questionIndex].detail}`;
    }
    nextButton.hidden = false;
  });

  nextButton.addEventListener("click", () => {
    if (completed) {
      questionIndex = 0;
      runScore = 0;
      renderQuestion();
      return;
    }
    if (questionIndex < RECIPES.length - 1) {
      questionIndex += 1;
      renderQuestion();
      question.focus();
      return;
    }
    completed = true;
    progress.textContent = "Quiz complete";
    question.textContent = "How did you do?";
    options.innerHTML = "";
    feedback.textContent = `You answered ${runScore} of ${RECIPES.length} correctly. Review the lesson and try again to improve your score.`;
    nextButton.textContent = "Try again";
  });
}

try {
  headerAndFooter();
  app.innerHTML = PAGE_RENDERERS[currentPage]();
  wireThemeChoices();
  wireOrderForm();
  wireAuthForms();
  wireGame();
} catch (error) {
  app.innerHTML = `<section class="page"><div class="error-box" role="alert">We couldn't load this page's saved settings: ${escapeHTML(error.message || "Please reload the page.")}</div></section>`;
}
