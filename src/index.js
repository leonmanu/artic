require('dotenv').config(); // Esto debe ser lo PRIMERO en tu archivo
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET); // Para verificar

const app = require('./app')

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});