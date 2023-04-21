const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
});

const Item = mongoose.model('Item', itemSchema);

app.get('/', async (req, res) => {
  const items = await Item.find().populate('categroy');
  res.json({ items });
});

app.post('/add', async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.json({ message: 'Item added', item: newItem });
});

app.put('/update/:id', async (req, res) => {
  await Item.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Item updated' });
});

app.delete('/delete/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


const categorySchema = new mongoose.Schema({
  name: String,
});

const Category = mongoose.model('Category', categorySchema);


// Get all categories
app.get('/categories', async (req, res) => {
  const categories = await Category.find();
  res.json({ categories });
});

// Add a new category
app.post('/categories', async (req, res) => {
  const newCategory = new Category(req.body);
  await newCategory.save();
  res.json({ message: 'Category added', category: newCategory });
});

// Update an existing category
app.put('/categories/:id', async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Category updated' });
});

// Delete a category
app.delete('/categories/:id', async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted' });
});
