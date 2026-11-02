# 07 – Authentication & Authorization

## Authentication

Gunakan:

```text
JWT
+
HTTP-only Cookie
```

Flow login:

```text
POST /api/auth/login
        ↓
Validate email/password
        ↓
Verify password
        ↓
Generate JWT / session token
        ↓
Set HTTP-only Cookie
        ↓
Authenticated client
```

Endpoint awal:

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## Authorization

Backend menggunakan dua role:

```text
ADMIN
STAFF
```

Contoh:

```text
authenticate
→ authorize("ADMIN")
```

Frontend hanya mengatur visibility UX. Keamanan sebenarnya harus ditegakkan oleh backend.

## Security Rules

- Password harus di-hash dengan bcrypt atau metode hashing yang setara.
- Refresh token yang disimpan sebagai hash harus dicari menggunakan hash token yang sesuai.
- User inactive tidak boleh login atau menerima session baru.
- Lindungi last active ADMIN dari deactivation/demotion yang membuat sistem tanpa admin.
- CSRF protection digunakan untuk endpoint mutasi bila architecture cookie-based auth mengharuskannya. Path cookie sebaiknya mencakup root `/`.
- Email dinormalisasi (trim/lowercase) secara konsisten.

## Warehouse Visibility

Staff dapat melihat semua warehouse. Jangan membuat authorization rule yang membatasi warehouse berdasarkan user kecuali requirement berubah.

## Stock Adjustment

Permission adjustment dapat ditentukan melalui business rules. Jangan menganggap hanya ADMIN yang boleh melakukan adjustment tanpa requirement yang disepakati.
