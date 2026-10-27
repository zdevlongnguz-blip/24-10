import 'dotenv/config'; // nạp .env (phải import đầu tiên)
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'node:url';
import routes from './routes/index.js';

const app = express();

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout'); // master layout: views/layout.ejs

app.use(
  '/vendor/bootstrap',
  express.static(fileURLToPath(new URL('./node_modules/bootstrap/dist', import.meta.url)))
);
app.use(express.static(fileURLToPath(new URL('./public', import.meta.url))));
app.use(express.json());
app.use('/', routes);

// Chuyển tiếp lỗi route và giữ nguyên status từ JSON Server.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.response?.status || 500).json(err.response?.data || { error: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Web: http://localhost:${port}`));
