const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "You only live once, but if you do it right, once is enough.", category: "Inspiration" }
];

// Rename function exactly to showRandomQuote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p><strong>${quote.category}:</strong> "${quote.text}"</p>`;
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text: text, category: category });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    showRandomQuote();
  } else {
    alert("Please fill in both fields.");
  }
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

