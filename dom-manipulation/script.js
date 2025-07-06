let quotes = [];

// Load quotes from localStorage or set defaults
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
  populateCategories();
}

// Save quotes array to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show a single random quote (used by button)
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p><strong>${quote.category}:</strong> "${quote.text}"</p>`;
  sessionStorage.setItem('lastQuoteIndex', randomIndex);
}

// Add a new quote from form input
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories(); // refresh categories
    filterQuotes();       // show filtered list
    textInput.value = '';
    categoryInput.value = '';
    alert("Quote added!");
  } else {
    alert("Please fill in both fields.");
  }
}

// Create form to add new quote
function createAddQuoteForm() {
  const container = document.getElementById('addQuoteFormContainer');

  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.id = 'newQuoteText';
  textInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';

  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add Quote';
  addBtn.onclick = addQuote;

  container.appendChild(textInput);
  container.appendChild(categoryInput);
  container.appendChild(addBtn);
}

// Populate filter dropdown from categories
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

  // Restore last selected filter
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    select.value = savedFilter;
    filterQuotes();
  }
}

// Filter quotes by selected category
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes in this category.</p>";
    return;
  }

  filtered.forEach(q => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${q.category}:</strong> "${q.text}"`;
    quoteDisplay.appendChild(p);
  });
}

// Export quotes to JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import quotes from uploaded JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        const valid = imported.filter(q => q.text && q.category);
        quotes.push(...valid);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON file.");
      }
    } catch {
      alert("Error parsing JSON.");
    }
  };
  reader.readAsText(file);
}

// Initialize everything
function init() {
  loadQuotes();
  createAddQuoteForm();
  filterQuotes();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("exportQuotes").addEventListener("click", exportQuotes);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
}

window.onload = init;

