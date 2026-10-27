# Game Catalog

Ứng dụng quản lý dữ liệu game bằng Express, EJS và JSON Server.

## Chạy dự án

Nếu cần cấu hình key cho trợ lý AI, tạo `.env` từ file mẫu trong lần chạy đầu tiên:

```powershell
Copy-Item .env.example .env
```

Sau đó chạy dự án:

```bash
npm install
npm run dev
```

Không ghi đè `.env` nếu đã có cấu hình riêng. File `.env` không được đưa lên Git; `db.json` được giữ trong repo làm database của dự án.

Express chạy tại `http://localhost:3000`; JSON Server chạy tại `http://localhost:3001`.

## Cấu hình

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `PORT` | `3000` | Cổng Express |
| `JSON_SERVER_URL` | `http://localhost:3001` | URL JSON Server |
| `GEMINI_API_KEY` | Không có | API key cho trợ lý AI, cấu hình trong `.env` |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Model Gemini dùng cho trợ lý AI |

## Game API

| Method | URL | Mô tả |
|---|---|---|
| GET | `/api/games?search=&order=asc&page=1` | Tìm và lấy danh sách game có phân trang; mặc định sắp xếp tên A-Z |
| GET | `/api/games/:id` | Lấy game theo ID |
| POST | `/api/games` | Tạo game từ JSON body |
| PATCH | `/api/games/:id` | Cập nhật một phần game |
| DELETE | `/api/games/:id` | Xóa game |

Các API game yêu cầu đăng nhập. Tạo tài khoản tại `/register` trước khi sử dụng.

`db.example.json` chứa dữ liệu mẫu công khai; khi chạy, JSON Server sử dụng bản sao cục bộ `db.json`. Service gọi JSON Server nằm ở `services/crud.js`; router Express nằm ở `routes/index.js`.
