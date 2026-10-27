# Trả lời lý thuyết theo dự án Game CRUD

## 1. Sau khi gọi DELETE và xóa dữ liệu, danh sách được cập nhật bằng cách nào? Ưu và nhược điểm?

Dự án hiện dùng cách gọi lại API rồi render lại bảng:

```js
await api.delete(`/api/games/${encodeURIComponent(id)}`);
window.showMessage('Xóa game thành công.', 'success');
await loadGames();
```

Đoạn này nằm trong `views/games/index.ejs`, `loadGames()` gọi lại API và tạo lại nội dung của `tbody`.

**Ưu điểm:** Danh sách luôn đồng bộ với server và vẫn đúng khi tìm kiếm, lọc, phân trang hoặc dữ liệu thay đổi từ nhiều nơi.

**Nhược điểm:** Phải gọi thêm một request GET, tải lại danh sách và thường chậm hơn cách chỉ xóa dòng DOM. Tuy nhiên, cách này đơn giản và ít sai lệch với dữ liệu JSON Server.

## 2. `Xóa` và `Sửa` được gắn sự kiện bằng cách nào?

Dự án dùng hai cách:

- Nút `Sửa` và nút `Chi tiết` là thẻ `<a>` trỏ trực tiếp tới trang bằng thuộc tính `href`. Không cần JavaScript bắt sự kiện click.
- Nút `Xóa` được tạo động trong bảng và sử dụng event delegation:

```js
tbody.addEventListener('click', (event) => {
  const button = event.target.closest('.delete-game');
  if (button) deleteGame(button.dataset.gameId);
});
```

Vì các nút Xóa được render sau khi nhận API, sự kiện được gắn trên phần tử cha `tbody` thay vì gắn trực tiếp từng nút.

## 3. Dòng code gọi API lấy danh sách. URL đầy đủ là gì?

Dòng code trong `views/games/index.ejs`:

```js
const res = await api.get(`/api/games${window.location.search}`);
```

Ví dụ URL trình duyệt/API đầy đủ:

```text
http://localhost:3000/api/games?search=GTA&order=asc&page=1
```

Express nhận request tại `/api/games`, sau đó service backend gửi request tương ứng tới JSON Server tại cổng `3001`:

```js
http://localhost:3001/games?_sort=title&_order=asc&_page=1&_limit=3&q=GTA
```

## 4. Dòng code gọi API xóa, phương thức HTTP là gì?

```js
await api.delete(`/api/games/${encodeURIComponent(id)}`);
```

Phương thức HTTP là `DELETE`. Express định tuyến tại `DELETE /api/games/:id`, sau đó gọi JSON Server xóa bản ghi tương ứng trong `db.json`.

## 5. Dòng code gọi API thêm mới, dữ liệu gửi ở đâu trong request?

Trong `views/games/form.ejs`:

```js
const game = {
  id: id.value,
  title: title.value,
  price: Number(price.value),
  platform: platform.value,
  category: category.value,
  imageUrl: imageUrl.value || null
};

await api.post('/api/games', game);
```

Đối với Axios, dữ liệu nằm ở tham số thứ hai, tương ứng với `body` của request. Header `Authorization` được `api-client.js` tự thêm vào request:

```js
const token = getToken();
config.headers.Authorization = `Bearer ${token}`;
```

Nếu dùng `fetch`, dữ liệu tương ứng sẽ nằm trong `body`, thường được chuyển sang chuỗi JSON:

```js
body: JSON.stringify(game)
```

## 6. Dòng code gọi API cập nhật, dùng PUT hay PATCH?

Dự án dùng `PATCH`:

```js
await api.patch(`/api/games/${game.id}`, game);
```

`PATCH` được dùng để cập nhật một phần tài nguyên. Nếu dùng `PUT`, API sẽ thay thế tài nguyên theo dữ liệu gửi lên. Với dữ liệu game đầy đủ trong form, cả hai đều có thể dùng, nhưng dự án đã chọn `PATCH` để phù hợp với JSON Server và phần cập nhật từng trường.

## 7. `db.json` nằm đâu và dùng để làm gì?

`db.json` nằm ở thư mục gốc của dự án:

```text
C:\high-js\on-thi\24-10\db.json
```

File chứa dữ liệu giả lập cho JSON Server gồm:

- `games`: danh sách game;
- `categories`: danh sách thể loại;
- `users`: tài khoản đăng ký.

JSON Server đọc và ghi file này, nên dữ liệu được duy trì sau khi reload.

## 8. Server JSON Server chạy cổng nào và lệnh chạy?

JSON Server chạy ở cổng `3001`, Express chạy ở cổng `3000`.

Lệnh trong `package.json`:

```json
"api": "json-server-auth db.json --watch --port 3001 -r routes.json"
```

Chạy riêng JSON Server:

```powershell
npm run api
```

Chạy cả web server và JSON Server:

```powershell
npm run dev
```

## 9. Đoạn code lấy giá trị người dùng nhập vào ô

Ví dụ trên form thêm/sửa game trong `views/games/form.ejs`:

```js
const title = document.getElementById('title');
const price = document.getElementById('price');
const platform = document.getElementById('platform');
const category = document.getElementById('category');

const game = {
  title: title.value.trim(),
  price: Number(price.value),
  platform: platform.value.trim(),
  category: category.value.trim(),
  imageUrl: imageUrl.value || null
};
```

Trường tìm kiếm tương ứng:

```js
search.value.trim()
```

## 10. Kiểm tra trường text trống ở đâu và thông báo lỗi hiện ở đâu?

Trong hàm submit của `views/games/form.ejs`, các trường được kiểm tra trước khi gọi API:

```js
if (!title.value.trim()) {
  titleError.textContent = 'Tên game là bắt buộc';
  isValid = false;
}
```

Thông báo lỗi được hiển thị bằng các phần tử trong form:

```html
<p class="text-danger" id="title-error"></p>
<p class="text-danger" id="platform-error"></p>
<p class="text-danger" id="category-error"></p>
```

Phần giá và thể loại cũng có kiểm tra tương ứng. Ngoài ra, overlay thông báo chung được điều khiển bởi `window.showMessage()` trong `views/layout.ejs`.

## 11. Đăng ký gửi dữ liệu tới URL nào?

```js
api.post(`/api/auth/${mode}`, {
  email: email.value.trim(),
  password: password.value,
});
```

Khi `mode = register`, request là:

```text
POST /api/auth/register
```

Express tiếp tục chuyển sang JSON Server qua service `services/auth.js`:

```text
POST http://localhost:3001/register
```

## 12. Đăng nhập thành công thì server trả về gì?

JSON Server-auth trả về object chứa:

```json
{
  "accessToken": "...",
  "user": {
    "email": "...",
    "id": 1
  }
}
```

Frontend lưu token:

```js
saveToken(response.data.accessToken);
```

Token được lưu bằng `localStorage` trong `public/js/auth-token.js`.

## 13. Dự án có bao nhiêu file HTML và JavaScript? Mỗi file làm gì?

Dự án không sử dụng file `.html`. Trang được dựng bằng **7 file EJS** nên số lượng HTML `.html` là `0`.

### Các file EJS

- `views/layout.ejs`: layout chung, thanh điều hướng và popup thông báo.
- `views/auth.ejs`: đăng nhập, đăng ký và validation form.
- `views/games/index.ejs`: danh sách, tìm kiếm, lọc, phân trang và xóa.
- `views/games/form.ejs`: thêm mới hoặc sửa game.
- `views/games/detail.ejs`: xem chi tiết một game.
- `views/games/ai.ejs`: giao diện trợ lý AI và lịch sử chat.
- `views/404.ejs`: trang không tìm thấy route.

### Các file JavaScript tĩnh trong `public/js`

- `api-client.js`: Axios instance và tự động thêm token Authorization.
- `auth-token.js`: đọc, lưu và xóa token khỏi localStorage.
- `auth-ui.js`: kiểm tra đăng nhập, bảo vệ route và xử lý đăng xuất.
- `list-state.js`: lưu và lấy URL trang danh sách để quay lại đúng trạng thái lọc/trang.

Ngoài ra, code xử lý từng trang cũng nằm trong thẻ `<script type="module">` của các file EJS.

## 14. File nào chứa phần gọi API, file nào xử lý giao diện?

- Gọi API phía server: `services/crud.js`, `services/auth.js`, `routes/index.js`.
- Gọi API phía browser: các file trang trong `views/*.ejs` dùng `api-client.js`.
- Xử lý giao diện: phần `<script>` và phần HTML trong các file `views/games/*.ejs`.
- Cấu hình Axios chung và bảo vệ route: `public/js/api-client.js`, `public/js/auth-ui.js`.

Luồng API điển hình:

```text
Nút trong views/games/index.ejs
 -> Axios /api/games trong api-client.js
 -> routes/index.js
 -> services/crud.js
 -> JSON Server ở localhost:3001
 -> db.json
```

## 15. Cài thư viện bằng lệnh nào? Thư mục `node_modules` là gì?

Cài hoặc đồng bộ phụ thuộc:

```powershell
npm install
```

Nếu chỉ cài một thư viện mới:

```powershell
npm install ten-thu-vien
```

Hoặc dùng `--save-dev` cho thư viện phát triển:

```powershell
npm install ten-thu-vien --save-dev
```

`node_modules` là thư mục chứa code của các thư viện đã được npm tải xuống. Thư mục này không nên chỉnh tay và thường không được commit lên Git.

## 16. Lệnh chạy JSON Server cùng json-server-auth

Không cần gọi riêng nếu đã cấu hình trong `package.json`; chạy:

```powershell
npm run api
```

Hoặc chạy trực tiếp:

```powershell
npx json-server-auth db.json --watch --port 3001 -r routes.json
```

Chạy đồng thời frontend/backend:

```powershell
npm run dev
```

---

# Phần thực hành

## 17. Đổi tiêu đề cột đầu tiên thành “Tên”

Trong bảng của `views/games/index.ejs`, tìm dòng tiêu đề và đổi:

```html
<th>Tên</th>
```

## 18. Thông báo thêm thành công thành “Đã thêm game mới”

Trong `routes/index.js`, trong hàm tạo game có thể đổi message thành:

```js
const message = 'Đã thêm game mới';
```

Hoặc để giữ tên game cụ thể:

```js
const message = `Đã thêm game mới: "${createdGame.title}"`;
```

Sau đó popup thành công trong `views/games/form.ejs` sẽ hiển thị `res.data.message`:

```js
window.showMessage(res.data.message, 'success', goToGamesList);
```

## 19. In dữ liệu nhận từ API bằng `console.log`

Trong `views/games/index.ejs`, sau khi nhận response:

```js
const res = await api.get(`/api/games${window.location.search}`);
console.log('Dữ liệu danh sách game nhận từ API:', res.data);
```

Sau đó mở DevTools bằng `F12`, chọn **Console** để xem object `games`, `total`, `page` và `totalPages`.

## 20. Tab Network chỉ request GET danh sách và mã trạng thái

1. Mở DevTools bằng `F12`, chọn tab **Network**.
2. Reload trang chủ `http://localhost:3000/`.
3. Chọn request tên `games?...`, hoặc request có URL chứa `/api/games`.
4. Request thành công thường có status **200 OK**.
5. Trong phần **Response**, kiểm tra object JSON có các game và thông tin phân trang.

Lưu ý dự án có hai lớp server nên request trình duyệt gọi:

```text
GET http://localhost:3000/api/games?...  -> 200
```

Express sau đó gọi JSON Server ở cổng 3001.

## 21. Tìm kiếm và kiểm tra dấu nhắc tìm kiếm

Dự án gửi tham số tìm kiếm `search` tới Express, sau đó service chuyển thành `q` để JSON Server tìm nhiều trường:

```js
if (search.trim()) params.q = search.trim();
```

Luồng thực hành:

1. Gõ từ khóa vào ô tìm kiếm.
2. Nhấn **Lọc** hoặc Enter.
3. URL chuyển sang dạng `/?search=...&order=asc&page=1`.
4. `loadGames()` nhận URL và gọi API.
5. Xóa ô tìm kiếm và bấm Lọc để load lại danh sách đầy đủ.

JSON Server hỗ trợ tìm kiếm kiểu full-text bằng tham số `q`, ví dụ:

```text
http://localhost:3001/games?q=GTA
```

## 22. Trạng thái đang tải, lỗi server và danh sách rỗng

Dự án đã có trạng thái đang tải:

```html
<div id="loading-message" class="alert alert-info">
  Đang tải danh sách game...
</div>
```

Trạng thái lỗi server:

```js
window.showMessage('Có lỗi xảy ra khi tải danh sách game.');
```

Trạng thái danh sách rỗng trong code:

```js
loadingMessage.textContent = search.value.trim()
  ? 'Không tìm thấy game phù hợp.'
  : 'Danh sách game trống.';
```

Có thể đổi dòng cuối thành chính xác hơn như đề bài yêu cầu:

```js
loadingMessage.textContent = 'Chưa có dữ liệu';
```

## 23. Thông báo thành công tự biến mất sau 2-3 giây

Dự án đã cấu hình thông báo tự đóng sau 3 giây trong `views/layout.ejs`:

```js
messageTimer = setTimeout(closeMessage, 3000);
```

Nếu muốn nhanh hơn 2 giây:

```js
messageTimer = setTimeout(closeMessage, 2000);
```

Có thể dùng `2000`, `2500` hoặc `3000`, tùy yêu cầu giám khảo.

## 24. Sau đăng nhập hiện email và nút Đăng xuất; đăng xuất xóa token

Giao diện navbar được xử lý trong `public/js/auth-ui.js`:

```js
if (authenticated) {
  loginLink.hidden = true;
  logoutButton.hidden = false;
}
```

Email có thể lấy từ user đã lưu hoặc đơn giản hiển thị trên một phần tử navbar sau đăng nhập:

```js
mainNavigation.hidden = !authenticated;
```

Đăng xuất hiện tại:

```js
logoutButton.addEventListener('click', () => {
  clearToken();
  window.location.assign('/login');
});
```

`clearToken()` trong `auth-token.js` xóa token bằng:

```js
localStorage.removeItem(tokenKey);
```

## 25. Phân trang 5 dòng/trang, nút Trước/Sau và trang hiện tại

Dự án hiện dùng 3 dòng mỗi trang:

```js
const limit = 3;
```

Để đáp ứng yêu cầu 5 dòng, sửa thành:

```js
const limit = 5;
```

JSON Server được gọi với `params`:

```js
const params = {
  _sort: 'title',
  _order: order,
  _page: page,
  _limit: limit,
};
```

Frontend có:

- Nút **Trước**: `id="previous-page"`;
- ô trang hiện tại: `id="page-number"`;
- nút **Sau**: `id="next-page"`;
- nhãn trang: `${page}/${totalPages}`.

Nút Trước bị vô hiệu ở trang đầu:

```js
previousPage.disabled = page <= 1;
```

Tương tự, nút Sau bị vô hiệu ở trang cuối:

```js
nextPage.disabled = page >= totalPages;
```

---

## Tổng kết luồng CRUD của dự án

```text
User thao tác trên trang EJS
 -> api-client.js gửi Axios request, kèm Authorization
 -> routes/index.js nhận route /api/... và kiểm tra token
 -> services/crud.js gọi JSON Server
 -> JSON Server đọc/ghi db.json
 -> routes/index.js trả JSON cho browser
 -> views/*.ejs render hoặc cập nhật giao diện
```

## Điểm cần lưu ý khi bảo vệ

1. Đề lý thuyết có thể gọi entity là `{entities}`, `{F_text}` hoặc `{entity}`; trong dự án thực tế entity tương ứng là `game` và collection là `games`.
2. Dự án dùng Axios thay vì `fetch`, vì thư viện này đã được cấu hình trong `api-client.js`.
3. Dự án không có `.html`; giao diện server-side được viết bằng EJS để Express render.
4. CRUD phía browser gọi API Express ở `/api/games`, không gọi trực tiếp JSON Server ở `localhost:3001` để thống nhất xác thực và xử lý lỗi.
5. Trạng thái danh sách đang lưu trong `localStorage` bằng key `games-list-url`, giúp trang xem, thêm, sửa và AI quay lại đúng tìm kiếm, thứ tự, số trang đã chọn.
