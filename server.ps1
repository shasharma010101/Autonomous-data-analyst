param (
    [int]$Port = 8000
)

$baseDir = $PSScriptRoot
if (-not $baseDir) { $baseDir = (Get-Location).Path }

$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $Port)

try {
    $listener.Start()
} catch {
    # If 8000 is taken, fall back to 8080
    $Port = 8080
    $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $Port)
    $listener.Start()
}

Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "        Autonomous Data Analyst - Local Web Server         " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host " Server URL : http://localhost:$Port/" -ForegroundColor Green
Write-Host " Local Path : $baseDir" -ForegroundColor Gray
Write-Host " Status     : Active & Listening for requests" -ForegroundColor Green
Write-Host " Stop Server: Press Ctrl+C anytime" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Yellow

# Auto-open browser
Start-Process "http://localhost:$Port/"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".csv"  = "text/csv; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".ico"  = "image/x-icon"
}

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
        $requestLine = $reader.ReadLine()

        if ($requestLine) {
            $parts = $requestLine.Split(" ")
            if ($parts.Length -ge 2) {
                $rawPath = $parts[1].Split("?")[0]
                if ($rawPath -eq "/" -or $rawPath -eq "") { $rawPath = "/index.html" }
                $relPath = [System.Uri]::UnescapeDataString($rawPath.TrimStart("/")).Replace("/", "\")
                $filePath = Join-Path $baseDir $relPath

                if (Test-Path $filePath -PathType Leaf) {
                    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                    $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                    $bytes = [System.IO.File]::ReadAllBytes($filePath)

                    $header = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    $stream.Write($bytes, 0, $bytes.Length)
                } else {
                    $body = "404 Not Found"
                    $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
                    $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($bodyBytes.Length)`r`nConnection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    $stream.Write($bodyBytes, 0, $bodyBytes.Length)
                }
            }
        }
        $stream.Close()
        $client.Close()
    }
} finally {
    $listener.Stop()
}
