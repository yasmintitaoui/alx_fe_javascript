let quotes = [];

// Load from localStorage
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "You only live once, but if you do it right, once is enough.", category: "Inspiration" }
    ];
    saveQuotes();
  }
}

// Save to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show random quote
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p><strong>${quote.category}:</strong> "${quote.text}"</p>`;
}

// Add quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Quote added!");

    // POST to server mock
    postQuoteToServer(newQuote);
  } else {
    alert("Please fill in both fields.");
  }
}

// POST to server (mock)
function postQuoteToServer(quote) {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: quote.category,
      body: quote.text
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log("Posted to server:", data);
    })
    .catch(error => {
      console.error("Error posting to server:", error);
    });
}

// Filter system
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  select.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  const last = localStorage.getItem("selectedCategory");
  if (last) {
    select.value = last;
    filterQuotes();
  }
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);

  filtered.forEach(q => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${q.category}:</strong> "${q.text}"`;
    quoteDisplay.appendChild(p);
  });
}

// ✅ Required: syncQuotes function that fetches + resolves conflicts
function syncQuotes() {
  fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
    .then(res => res.json())
    .then(serverQuotes => {
      const formatted = serverQuotes.map(q => ({
        text: q.body,
        category: q.title
      }));

      const existingTexts = new Set(quotes.map(q => q.text));
      const newQuotes = formatted.filter(q => !existingTexts.has(q.text));

      if (newQuotes.length > 0) {
        quotes.push(...newQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        notifyUser(`Synced ${newQuotes.length} new quote(s) from server.`);
      }
    })
    .catch(err => {
      console.error("Error syncing from server:", err);
    });
}

// ✅ Periodic sync
setInterval(syncQuotes, 30000);

// ✅ Notification element
function notifyUser(message) {
  let notification = document.getElementById("notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.id = "notification";
    notification.style.background = "#dff0d8";
    notification.style.color = "#3c763d";
    notification.style.padding = "10px";
    notification.style.margin = "10px 0";
    notification.style.border = "1px solid #3c763d";
    document.body.insertBefore(notification, document.body.firstChild);
  }
  notification.textContent = message;
  setTimeout(() => (notification.textContent = ""), 4000);
}

// INIT
window.onload = function () {
  loadQuotes();
  populateCategories();
  filterQuotes();
  document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
};

