Param(
  [string]$input = "css/styles.css",
  [string]$output = "css/styles.min.css"
)

if(-not (Test-Path $input)){
  Write-Error "Girdi dosyası bulunamadı: $input"
  exit 1
}

$css = Get-Content $input -Raw
# Basit minify: yorumları kaldır, boş satırlar ve fazla boşlukları temizle
$min = $css -replace '/\*.*?\*/','' -replace '\r?\n',' ' -replace '\s{2,}',' '
Set-Content -Path $output -Value $min -Encoding UTF8
Write-Host "Minified $input -> $output"