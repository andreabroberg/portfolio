const QUOTES = [
  {
    quote: "Growth is never by mere chance; it is the result of forces working together.",
    author: "James Cash Penney",
  },
  {
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
  },
  {
    quote: "Quality is not an act, it is a habit.",
    author: "Aristotle",
  },
  {
    quote: "What gets measured gets managed.",
    author: "Peter Drucker",
  },
  {
    quote: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
  },
  {
    quote: "Done is better than perfect, if you learn from it.",
    author: "Anonymous",
  },
  {
    quote: "You can't improve what you don't inspect.",
    author: "Anonymous",
  },
];

function getUtcDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function quoteIndexForDate(dateKey) {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i += 1) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  return hash % QUOTES.length;
}

module.exports = (req, res) => {
  const dateKey = getUtcDateKey();
  const quote = QUOTES[quoteIndexForDate(dateKey)];

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");

  res.status(200).json({
    date: dateKey,
    ...quote,
  });
};
