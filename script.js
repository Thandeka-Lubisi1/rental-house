// DOM elements
const loginSection = document.getElementById("login-section");
const signupSection = document.getElementById("signup-section");
const welcomeSection = document.getElementById("welcome");
const landlordDashboard = document.getElementById("landlord-dashboard");
const listingsSection = document.getElementById("listings-section");
const listingContainer = document.getElementById("listingContainer");
const nav = document.getElementById("main-nav");

// Helper: Show/hide sections
function hideAllSections() {
  loginSection.style.display = "none";
  signupSection.style.display = "none";
  welcomeSection.style.display = "none";
  landlordDashboard.style.display = "none";
  listingsSection.style.display = "none";
}

// Password validator
function isValidPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
}

// Signup logic
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const role = document.getElementById("signupRole").value;

  if (!isValidPassword(password)) {
    alert("Password must be at least 8 characters with uppercase, lowercase, number, and symbol.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some(user => user.username === username)) {
    alert("Username already exists!");
    return;
  }

  users.push({ username, password, role });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful! Please login.");
  showLogin();
});

// Login logic
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const role = document.getElementById("loginRole").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.username === username && u.password === password && u.role === role);

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    loadDashboard(user.role);
  } else {
    alert("Invalid login credentials.");
  }
});

// Load dashboard based on role
function loadDashboard(role) {
  hideAllSections();
  nav.style.display = "block";

  if (role === "landlord") {
    landlordDashboard.style.display = "block";
  } else {
    listingsSection.style.display = "block";
    renderListings();
  }
}

// Listing submission
document.getElementById("listingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("propertyTitle").value.trim();
  const location = document.getElementById("propertyLocation").value.trim();
  const contact = document.getElementById("propertyContact").value.trim();
  const imageFiles = document.getElementById("propertyImages").files;

  const readerPromises = Array.from(imageFiles).map(file => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  });

  Promise.all(readerPromises).then(imageData => {
    const listings = JSON.parse(localStorage.getItem("listings")) || [];
    listings.push({ title, location, contact, images: imageData });
    localStorage.setItem("listings", JSON.stringify(listings));
    alert("Listing added!");
    document.getElementById("listingForm").reset();
  });
});

// Display listings
function renderListings() {
  listingContainer.innerHTML = "";
  const listings = JSON.parse(localStorage.getItem("listings")) || [];

  listings.forEach(listing => {
    const card = document.createElement("div");
    card.className = "listing-card";

    const title = document.createElement("h3");
    title.textContent = listing.title;
    card.appendChild(title);

    listing.images.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      card.appendChild(img);
    });

    const location = document.createElement("p");
    location.textContent = "📍 " + listing.location;
    card.appendChild(location);

    const contact = document.createElement("p");
    contact.textContent = "📞 " + listing.contact;
    card.appendChild(contact);

    listingContainer.appendChild(card);
  });
}

// Navigation helpers
function showLogin() {
  hideAllSections();
  loginSection.style.display = "block";
}

function showSignup() {
  hideAllSections();
  signupSection.style.display = "block";
}

function showDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    loadDashboard(currentUser.role);
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  nav.style.display = "none";
  hideAllSections();
  welcomeSection.style.display = "block";
}

// Auto-login if already logged in
window.addEventListener("load", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    loadDashboard(currentUser.role);
  } else {
    showWelcome();
  }
});

function showWelcome() {
  hideAllSections();
  welcomeSection.style.display = "block";
}
function showLogin() {
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('signup-section').style.display = 'none';
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('landlord-dashboard').style.display = 'none';
  document.getElementById('listings-section').style.display = 'none';
}

function showSignup() {
  document.getElementById('signup-section').style.display = 'block';
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('landlord-dashboard').style.display = 'none';
  document.getElementById('listings-section').style.display = 'none';
}

function showDashboard() {
  document.getElementById('landlord-dashboard').style.display = 'block';
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('signup-section').style.display = 'none';
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('listings-section').style.display = 'none';
}

function logout() {
  document.getElementById('welcome').style.display = 'block';
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('signup-section').style.display = 'none';
  document.getElementById('landlord-dashboard').style.display = 'none';
  document.getElementById('listings-section').style.display = 'none';
}