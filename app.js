const express = require('express');
const cors = require('cors');
const app = express();
const provider = require('./src/routes/provider');
app.use(cors());
app.use(express.json({ extended: false }));

app.use('/provider', provider);
app.get('*', (req, res) => {
  res.send('App Working');
});
const PORT = process.env.PORT || 4500;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
