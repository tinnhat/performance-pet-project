# React List Rendering Performance Notes

## Mục Đích Project

Project này dùng để kiểm tra hiệu năng khi render một danh sách lớn trong React.

Dataset hiện tại gồm 10.000 items. Mỗi item được render thành một row gồm các thông tin như ID, họ tên, ngày sinh, số điện thoại, email, vai trò, avatar, và trạng thái.

Mục tiêu chính:

- Hiểu chi phí khi render 10.000 items trực tiếp vào DOM.
- So sánh việc render inline với việc tách component.
- Kiểm tra tác động của `React.memo`.
- Thử các giải pháp virtualization như `react-window` và `@tanstack/react-virtual`.
- Rút ra hướng tối ưu phù hợp khi làm việc với list lớn trong React.

## Các Cách Đã Thử

### 1. Render trực tiếp danh sách

Ban đầu, toàn bộ 10.000 rows được render trực tiếp.

Kết quả profiler:

```json
{
  "id": "MainTable",
  "phase": "mount",
  "actualDuration": "448.80ms",
  "baseDuration": "252.20ms"
}
```

Nhận xét:

- React phải tạo và reconcile toàn bộ 10.000 rows.
- Browser phải giữ toàn bộ DOM nodes.
- Initial render nặng.
- Đây là baseline để so sánh các cách tối ưu khác.

### 2. Tách component

Danh sách được tách thành các component nhỏ hơn:

- `Main`
- `HeaderTable`
- `ItemTable`
- `ImageCus`

Kết quả profiler:

```json
{
  "id": "MainTable",
  "phase": "mount",
  "actualDuration": "488.60ms",
  "baseDuration": "273.40ms"
}
```

Nhận xét:

- Code dễ đọc và dễ maintain hơn.
- Initial render chậm hơn một chút so với render trực tiếp.
- Lý do là React phải xử lý thêm nhiều component function và Fiber nodes.
- `React.memo` không giúp nhiều ở lần mount đầu tiên, vì tất cả component vẫn phải render lần đầu.

Kết luận:

- Tách component tốt cho maintainability.
- Tách component không phải là tối ưu performance cho initial render.
- Với list rất lớn, component overhead bị nhân lên theo số lượng rows.

### 3. Dùng `react-window`

`react-window` được dùng để chỉ render những rows đang nằm trong viewport.

Kết quả profiler:

```json
{
  "id": "MainTable",
  "phase": "nested-update",
  "actualDuration": "0.10ms",
  "baseDuration": "5.40ms"
}
```

Nhận xét:

- DOM nhẹ hơn nhiều vì không render toàn bộ 10.000 rows.
- Chỉ các rows visible được render.
- Các rows ngoài viewport không tồn tại trong DOM.
- Update sau mount rất nhanh.

Lưu ý:

- Số liệu trên là `nested-update`, không phải `mount`.
- Để so sánh công bằng, cần đo thêm `phase: "mount"` cho version `react-window`.

### 4. Dùng `@tanstack/react-virtual`

TanStack Virtual được dùng để tự quản lý virtual rows bằng hook `useVirtualizer`.

Kết quả profiler:

```json
{
  "id": "TanStackTable",
  "phase": "nested-update",
  "actualDuration": "12.40ms",
  "baseDuration": "9.90ms"
}
```

Nhận xét:

- TanStack Virtual là headless solution.
- Nó không render UI sẵn như `react-window`.
- Nó chỉ tính toán item nào cần render, tổng scroll height, và vị trí của từng virtual item.
- UI được tự render bằng `div`, `position: absolute`, và `transform: translateY(...)`.

Kết luận:

- TanStack Virtual linh hoạt hơn `react-window`.
- Code dài hơn một chút.
- Phù hợp khi cần custom table, grid, dynamic height, sticky header, hoặc tích hợp sâu với UI riêng.

## Kết Quả Đạt Được

Project đã chứng minh được các điểm chính:

- Render 10.000 rows trực tiếp gây chi phí lớn ở initial render.
- Tách component giúp code rõ hơn nhưng không làm initial render nhanh hơn.
- `React.memo` không giải quyết vấn đề mount lớn.
- Virtualization giúp giảm số lượng DOM nodes thực tế.
- `react-window` đơn giản, dễ dùng cho list cố định.
- `@tanstack/react-virtual` linh hoạt hơn, phù hợp khi cần custom behavior.

## Bài Học Rút Ra

### 1. Bottleneck chính là số lượng DOM nodes

Khi render 10.000 rows, vấn đề không chỉ nằm ở React. Browser cũng phải xử lý:

- DOM creation
- style calculation
- layout
- paint
- memory

Dù component có được tối ưu bằng `memo`, nếu vẫn render đủ 10.000 DOM rows thì chi phí vẫn lớn.

### 2. Component split không đồng nghĩa với performance optimization

Tách component giúp code dễ hiểu hơn, nhưng có overhead.

Với list lớn, mỗi component nhỏ bị gọi hàng nghìn lần. Overhead nhỏ có thể trở nên đáng kể.

Tách component nên phục vụ readability và maintainability trước. Performance cần đo riêng.

### 3. `React.memo` chủ yếu giúp update, không giúp mount

`React.memo` có thể skip re-render khi props không đổi.

Nhưng ở lần render đầu tiên, mọi component vẫn phải render. Vì vậy `memo` không giải quyết vấn đề initial mount của list 10.000 items.

### 4. Virtualization là hướng tốt nhất khi cần scroll list lớn

Nếu yêu cầu là:

- Data có rất nhiều items.
- User cần scroll như đang xem toàn bộ list.
- DOM không được chứa toàn bộ items cùng lúc.

Thì virtualization là giải pháp phù hợp nhất.

Virtualization giữ data trong memory nhưng chỉ render phần visible vào DOM.

### 5. Pagination vẫn là lựa chọn tốt nếu không cần scroll liên tục

Nếu product là admin table hoặc data table thông thường, pagination/server-side pagination vẫn rất hợp lý.

Pagination tránh render toàn bộ DOM và còn giảm network payload nếu backend chỉ trả từng page.

### 6. Infinite scroll không tự giải quyết vấn đề DOM

Nếu infinite scroll chỉ append thêm items, DOM vẫn tăng dần:

```txt
100 rows
200 rows
300 rows
...
10.000 rows
```

Cuối cùng vẫn gặp lại vấn đề ban đầu.

Infinite scroll chỉ thực sự scale tốt khi kết hợp cleanup/windowing, tức là gần giống virtualization.

### 7. Chunked rendering chỉ cải thiện cảm giác ban đầu

Chunked rendering chia nhỏ việc render theo batch.

Nó giúp UI đỡ bị freeze lúc đầu, nhưng cuối cùng DOM vẫn có thể chứa 10.000 rows.

Vì vậy đây không phải giải pháp triệt để cho list rất lớn.

## Kết Luận

Với bài toán render list 10.000 items trong React, cách tối ưu phụ thuộc vào UX mong muốn.

Nếu cần scroll mượt qua toàn bộ danh sách, virtualization là hướng tốt nhất.

Nếu không cần scroll liên tục, pagination hoặc server-side pagination có thể còn tốt hơn vì giảm cả DOM, memory, và network payload.

Trong project này, virtualization là bài học quan trọng nhất: không nên render mọi thứ chỉ vì data có sẵn. UI chỉ nên render phần user thật sự nhìn thấy.
