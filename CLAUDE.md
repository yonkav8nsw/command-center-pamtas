# COMMAND CENTER PAMTAS

This project is a mission-critical operational dashboard.

Primary Priority:

1. Availability
2. Reliability
3. Data Accuracy
4. Security
5. Performance
6. Maintainability
7. New Features

Assume the system is expected to operate continuously during active operations.

Before implementing any change:

* Evaluate operational impact.
* Evaluate failure scenarios.
* Evaluate rollback strategy.
* Evaluate monitoring coverage.
* Evaluate data accuracy implications.
* Evaluate real-time update reliability.

Focus on:

* Operational visibility
* Situational awareness
* Personnel status accuracy
* Incident reporting integrity
* Map and location accuracy
* Dashboard responsiveness
* System uptime
* Failure recovery

When reviewing code:

Inspect for:

* Data synchronization issues
* Real-time update failures
* State consistency problems
* API reliability issues
* Security vulnerabilities
* Authentication flaws
* Authorization flaws
* Performance bottlenecks
* Memory leaks
* Race conditions
* Failure recovery gaps
* Monitoring gaps

For every major recommendation:

1. Explain why.
2. Explain operational impact.
3. Explain risks.
4. Explain rollback strategy.

Assume that:

* Users may operate under pressure.
* Internet connectivity may be unstable.
* Servers may fail unexpectedly.
* Data feeds may become unavailable.
* Human operators may make mistakes.

Prioritize operational continuity over visual enhancements.

Treat all operational, personnel, incident, and monitoring data as mission-critical.

## Session & Checkpoint Rules (WAJIB)

1. **Checkpointing:** Selalu buat file checkpoint di `docs/milestones/CHECKPOINT-*.md` saat mulai pekerjaan signifikan. Include: fase saat ini, langkah selanjutnya, file yang berubah. Update setiap selesai langkah.

2. **Maximal Effort:** Kerja sampai SELESAI, bukan "cukup bisa jalan". Investigasi root cause, bukan hanya gejala. Verifikasi dengan build + test sebelum melaporkan selesai.

3. **Session Continuity:** Baca `memory/MEMORY.md` di awal sesi untuk understand context. Jangan ulangi kerjaan user yang sudah selesai.

4. **User Communication:** Laporkan progress jelas dengan status indicators. Jika blocked, jelaskan kenapa dan suggest alternatives.

## Git & Credential Safety (WAJIB — berlaku untuk semua model/sesi)

Aturan ini bersifat permanen dan mengikat lintas sesi dan lintas model (Opus, Sonnet, atau lainnya).

* JANGAN PERNAH menaruh token/password di dalam URL git (`https://user:TOKEN@github.com/...`).
  Token di URL bocor ke shell history, `git config`, dan log. Ini kebocoran kredensial.
* Cara push yang benar: gunakan `git push` polos dan biarkan Git Credential Manager
  (`git config --global credential.helper manager`) yang menyimpan kredensial terenkripsi
  di Windows Credential Manager.
* Untuk autentikasi GitHub di Windows tanpa `gh`: aktifkan `credential.helper manager`,
  lalu `git push` akan memunculkan login browser sekali; sesudah itu kredensial tersimpan.
* JANGAN gunakan `credential.helper store` kecuali terpaksa — helper itu menulis token
  plaintext ke `~/.git-credentials` (tidak terenkripsi).
* Personal Access Token: minta scope seminimal mungkin (untuk push cukup `repo`),
  set masa berlaku, dan perlakukan sebagai rahasia.
* Jika sebuah token sempat ter-expose (di URL, screenshot, paste, log), perlakukan sebagai
  COMPROMISED: segera ingatkan user untuk MENCABUT/REVOKE token tersebut di
  https://github.com/settings/tokens, lalu buat token baru. Jangan tunda.
* Jangan pernah meng-echo, mencetak ulang, atau mengulang nilai token/secret di respons.
  Rujuk dengan nama (mis. "token PAT"), bukan nilainya.
* Jangan commit file rahasia (.env, kredensial, kunci). Stage file spesifik, hindari `git add .`
  yang membabi buta jika ada file sensitif di working tree.
* Push ke branch baru, bukan langsung ke main/master, kecuali user secara eksplisit memintanya.
* Operasi git destruktif (force push, reset --hard, clean -f, branch -D) butuh izin eksplisit user.
