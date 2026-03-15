$ErrorActionPreference = 'Stop'

$hugoBin = $env:HUGO_BIN
if (-not $hugoBin) {
  $hugoCmd = Get-Command hugo -ErrorAction SilentlyContinue
  if (-not $hugoCmd) {
    Write-Error "Hugo was not found in PATH."
    exit 1
  }
  $hugoBin = $hugoCmd.Source
}

Write-Output "Checking for publishable future-dated posts..."

$output = & $hugoBin list future
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

$rows = @()
if ($output) {
  $rows = $output | ConvertFrom-Csv
}

$violations = $rows | Where-Object {
  $_.path -like 'content/posts/*' `
    -and $_.kind -eq 'page' `
    -and $_.draft -eq 'false' `
    -and $_.path -notmatch '/_index\.md$' `
    -and $_.path -notmatch '/index\.md$'
}

if (-not $violations -or $violations.Count -eq 0) {
  Write-Output "Future post check passed: no publishable future-dated posts found."
  exit 0
}

Write-Error "Future post check failed: publishable posts scheduled in the future were found."
Write-Output ("Current time: " + (Get-Date).ToString("o"))
Write-Output ""

foreach ($row in $violations) {
  $publishField = if ($row.publishDate -and $row.publishDate -ne '0001-01-01T00:00:00Z') { 'publishDate' } else { 'date' }
  $publishValue = if ($publishField -eq 'publishDate') { $row.publishDate } else { $row.date }
  Write-Output ("- {0} ({1}={2})" -f $row.path, $publishField, $publishValue)
}

Write-Output ""
Write-Output "Set draft = true, or move date/publishDate to the present or an earlier time before deploying."
exit 1
