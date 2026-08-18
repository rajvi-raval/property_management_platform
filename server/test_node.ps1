$files = Get-ChildItem -Path "C:\", "D:\" -Filter "node.exe" -Recurse -ErrorAction SilentlyContinue
foreach ($f in $files) {
  Write-Host "FOUND EXECUTABLE: $($f.FullName)"
}
