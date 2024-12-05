require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

// App setup
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Supabase setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);


// In-memory reading list (if needed for fallback)
let readingList = [];

// Fetch reading list from Supabase
app.get('/reading-list', async (req, res) => {
  const { data, error } = await supabase.from('reading_list').select('*');
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// Add book to reading list in Supabase
app.post('/reading-list', async (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }

  const { data, error } = await supabase
    .from('reading_list')
    .insert([{ title, author }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

// In-memory fallback for `/reading-list` (if Supabase fails)
app.post('/fallback-reading-list', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: 'Invalid book data' });
  }

  const newBook = { id: readingList.length + 1, title, author };
  readingList.push(newBook);
  res.status(201).json({ message: 'Book added to in-memory reading list!', newBook });
});

app.get('/fallback-reading-list', (req, res) => {
  res.status(200).json(readingList);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});