# Mert — Minimal Portfolio

Bu proje, XAMPP ile yerelde çalıştırılabilecek sade ve profesyonel bir statik portföy örneğidir.

Dosyalar
- `index.html` — ana sayfa
- `css/styles.css` — ana stil dosyası
- `css/styles.min.css` — minified stil (otomatik güncellenir)
- `js/main.js` — küçük interaktif scriptler
- `sections/*.html` — modular bölümler
- `contact.php` — basit form handler (PHP `mail()` kullanır)
- `scripts/minify.ps1` — Windows PowerShell ile CSS minify scripti

Çalıştırma
1. XAMPP kuruluysa `htdocs` altına kopyalayın (zaten burada). Tarayıcıda `http://localhost/mert/index.html` açın.
2. İletişim formunun çalışması için PHP mail() sunucu ayarları gerekir; XAMPP'de SMTP yapılandırması yapmadıysanız form gönderimi çalışmayabilir. Bunun yerine AJAX fallback veya Formspree kullanılabilir.

Minify
PowerShell ile CSS dosyasını minify etmek için:

```powershell
cd C:\xampp\htdocs\mert\scripts
.\minify.ps1 ..\css\styles.css ..\css\styles.min.css
```

Geliştirme notları
- Modal, hero dekor ve temel animasyonlar eklendi.
- Daha fazla görsel veya gerçek form backend isterseniz söyleyin; ekleyebilirim.
