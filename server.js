require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const notFound = require('./middleware/notFound');
// Connect DB
connectDB();
const app = express();

app.use(morgan('common'));
app.use(cors({
  origin: process.env.CORS_ORIGIN,
}));
app.use(helmet());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/public', require('./routes/public'));
app.use('/api/user', require('./routes/user'));

app.use(errorHandler);
app.use(notFound);

app.use(express.static('./client/build'));
app.get('*', (req, res)=> {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// eslint-disable-next-line no-unused-vars
process.on('unhandledRejection', (err, promise) => {
  console.log(`Logged Error: ${err}`);
  server.close(() => process.exit(1));
});
