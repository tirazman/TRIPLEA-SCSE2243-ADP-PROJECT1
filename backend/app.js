const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');  
const reportRoutes = require('./routes/reportRoutes'); 
const compileReportRoutes = require('./routes/compileReportRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/reports', reportRoutes); 
app.use('/api/compile-reports', compileReportRoutes);

module.exports = app;