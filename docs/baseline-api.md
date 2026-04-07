# Baseline API

Endpoint ini menjalankan inferensi model ONNX baseline dan langsung melakukan `upsert` ke tabel `baseline` berdasarkan `userId` dari session login.

## Endpoints

- `GET /api/baseline`
  Mengambil hasil baseline yang tersimpan untuk user yang sedang login.
- `POST /api/baseline`
  Menjalankan inference pertama kali dan menyimpan hasil ke database.
- `PATCH /api/baseline`
  Menjalankan inference ulang dan menimpa hasil baseline lama di database.
- Auth: wajib login melalui Better Auth session.

## Request Body untuk POST/PATCH

Field `answers` wajib berupa array 8 elemen dengan urutan persis seperti di bawah:

```json
{
  "answers": [
    "Agree",
    "Disagree",
    "Disagree",
    "Disagree",
    "Yes",
    "Yes",
    "Yes",
    "Yes"
  ]
}
```

Urutan pertanyaan model:

1. `Children are safe among family members such as grandparents, uncles, aunts, cousins`
2. `Children are mainly abused by strangers in our society`
3. `Male children dont need sexual abuse prevention knowledge`
4. `Teaching sexual abuse prevention in school is not necessary. It will make children curious about sex`
5. `Do you know what child grooming is?`
6. `Do you know what signs to look for to identify if your child has been abused?`
7. `Do you think children need post abuse counseling for recovering?`
8. `Do you think you should take legal action against the abuser of your child?`

Format jawaban:

- Pertanyaan 1-4: `Agree` atau `Disagree`
- Pertanyaan 5-8: `Yes` atau `No`

## ONNX Details

- Model yang diload: `src/models/baseline_model.onnx`
- Nama input tensor: `raw_input`
- Dimensi input tensor: `[1, 8]`
- Mapping label:
  - `0 => Beginner`
  - `1 => Intermediate`

## Contoh Response GET

```json
{
  "success": true,
  "baseline": {
    "id": "clx...",
    "userId": "user_123",
    "isBeginner": false,
    "label": "Intermediate",
    "confidenceScore": 0.8272905349731445,
    "analyzedAt": "2026-04-03T12:00:00.000Z"
  }
}
```

## Contoh Response POST/PATCH

```json
{
  "success": true,
  "baseline": {
    "id": "clx...",
    "userId": "user_123",
    "isBeginner": false,
    "label": "Intermediate",
    "confidenceScore": 0.8272905349731445,
    "analyzedAt": "2026-04-03T12:00:00.000Z"
  },
  "prediction": {
    "labelIndex": 1,
    "label": "Intermediate",
    "isBeginner": false,
    "confidenceScore": 0.8272905349731445,
    "inputName": "raw_input"
  }
}
```

## UI Minimum

- Halaman uji baseline: `/baseline`
- Halaman profil akan memanggil `GET /api/baseline` untuk menampilkan badge `Beginner` atau `Intermediate`.

## Catatan Implementasi

- Route memakai runtime Node.js karena `onnxruntime-node` tidak bisa dijalankan di Edge Runtime.
- File model tunggal ada di `src/models/baseline_model.onnx` dan diikutkan ke trace build melalui `outputFileTracingIncludes` pada `next.config.ts`.
- Nilai `mlConfidenceScore` disimpan ke Prisma sebagai `Decimal`.

