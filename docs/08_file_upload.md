# 08 – Image & Cloudinary

## Storage

Gunakan Cloudinary untuk image storage.

Database PostgreSQL menyimpan referensi, bukan binary file.

Minimal:

```text
image URL
```

Bila dibutuhkan untuk replacement/deletion:

```text
public_id
```

## Product Image

Product dapat memiliki image optional.

Validasi upload:

- file type.
- file size.
- filename/key yang aman.
- replacement behavior.
- deletion behavior.

## Update Product

Saat mengganti image:

1. Upload image baru.
2. Simpan referensi baru di DB.
3. Pastikan kegagalan update DB tidak meninggalkan asset yang tidak terkelola.

Saat Product hanya di-deactivate:

```text
is_active = false
```

**Jangan menghapus image Cloudinary** hanya karena Product inactive. Image mungkin diperlukan ketika Product diaktifkan kembali.
