const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();



const app = express();

// Set up handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));



// Connect to MongoDB Atlas
mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  

// Create the item schema and model
const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
});

const Item = mongoose.model('Item', itemSchema);

// Define the routes
app.get('/', async (req, res) => {
  const items = await Item.find();
  res.render('home', { items });
});

app.post('/add', express.urlencoded({ extended: true }), async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.redirect('/');
});

app.post('/update', express.urlencoded({ extended: true }), async (req, res) => {
  await Item.findByIdAndUpdate(req.body.id, req.body);
  res.redirect('/');
});

app.post('/delete', express.urlencoded({ extended: true }), async (req, res) => {
  await Item.findByIdAndDelete(req.body.id);
  res.redirect('/');
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
