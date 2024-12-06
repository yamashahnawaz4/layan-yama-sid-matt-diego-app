const SUPABASE_URL = 'https://iycbbgybrnnxegoirtcp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5Y2JiZ3licm5ueGVnb2lydGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzNTY1NDQsImV4cCI6MjA0ODkzMjU0NH0.kJdjbG8wFyqm9tLui7c30pO672bCpAF6hOZqEb_bxks';

document.getElementById('book-search-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = document.getElementById('search-query').value;
  const resultsDiv = document.getElementById('book-results');

  resultsDiv.innerHTML = '';

  // Fetch book data from Open Library API
  const response = await fetch(`https://openlibrary.org/search.json?q=${query}`);
  const data = await response.json();

  data.docs.slice(0, 10).forEach((book) => {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book';
    bookDiv.innerHTML = `
      <h3>${book.title}</h3>
      <p>Author: ${book.author_name?.[0] || 'Unknown'}</p>
      <button class="save-button" data-title="${book.title}" data-author="${book.author_name?.[0]}">Save</button>
    `;
    resultsDiv.appendChild(bookDiv);
  });

  // Add event listeners to save buttons
  document.querySelectorAll('.save-button').forEach((button) => {
    button.addEventListener('click', async () => {
      const title = button.getAttribute('data-title');
      const author = button.getAttribute('data-author');

      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/reading_list`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ title, author }),
        });

        if (response.ok) {
          alert(`${title} by ${author} added to your reading list!`);
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error saving the book:', error);
        alert('Failed to save the book. Please try again.');
      }
    });
  });
});






  
  
  