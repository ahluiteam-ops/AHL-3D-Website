param(
  [Parameter(Mandatory = $true)]
  [string]$VideoPath,

  [Parameter(Mandatory = $true)]
  [string]$OutputDirectory,

  [double[]]$Times = @(0.5, 2, 4, 6, 8, 10, 12)
)

Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName WindowsBase

$resolvedVideo = (Resolve-Path -LiteralPath $VideoPath).Path
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputDirectory)
[System.IO.Directory]::CreateDirectory($resolvedOutput) | Out-Null

$player = [System.Windows.Media.MediaPlayer]::new()
$opened = $false
$failed = $false
$player.add_MediaOpened({ $script:opened = $true })
$player.add_MediaFailed({ $script:failed = $true })
$player.Open([System.Uri]::new($resolvedVideo))

function Invoke-DispatcherUntil([DateTime]$deadline) {
  while ([DateTime]::UtcNow -lt $deadline) {
    [System.Windows.Threading.Dispatcher]::CurrentDispatcher.Invoke(
      [System.Windows.Threading.DispatcherPriority]::Render,
      [Action]{}
    )
    Start-Sleep -Milliseconds 25
  }
}

Invoke-DispatcherUntil ([DateTime]::UtcNow.AddMilliseconds(900))
$deadline = [DateTime]::UtcNow.AddSeconds(15)
while (-not $opened -and -not $failed -and [DateTime]::UtcNow -lt $deadline) {
  Invoke-DispatcherUntil ([DateTime]::UtcNow.AddMilliseconds(80))
}

if (-not $opened -or $player.NaturalVideoWidth -le 0) {
  $player.Close()
  throw 'Windows Media Foundation could not open reference recording.'
}

$width = $player.NaturalVideoWidth
$height = $player.NaturalVideoHeight
$duration = if ($player.NaturalDuration.HasTimeSpan) {
  $player.NaturalDuration.TimeSpan.TotalSeconds
} else {
  0
}
$player.Volume = 0

foreach ($time in $Times) {
  if ($duration -gt 0 -and $time -ge $duration) { continue }

  $player.Position = [TimeSpan]::FromSeconds($time)
  $player.Play()
  Invoke-DispatcherUntil ([DateTime]::UtcNow.AddMilliseconds(950))

  $visual = [System.Windows.Media.DrawingVisual]::new()
  $drawing = $visual.RenderOpen()
  $drawing.DrawVideo($player, [System.Windows.Rect]::new(0, 0, $width, $height))
  $drawing.Close()

  $bitmap = [System.Windows.Media.Imaging.RenderTargetBitmap]::new(
    $width,
    $height,
    96,
    96,
    [System.Windows.Media.PixelFormats]::Pbgra32
  )
  $bitmap.Render($visual)

  $encoder = [System.Windows.Media.Imaging.PngBitmapEncoder]::new()
  $encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($bitmap))
  $filename = 'frame-{0:0000}.png' -f [int]($time * 100)
  $stream = [System.IO.File]::Create((Join-Path $resolvedOutput $filename))
  try {
    $encoder.Save($stream)
  } finally {
    $stream.Dispose()
  }

  $player.Pause()
}

$player.Close()

[PSCustomObject]@{
  Width = $width
  Height = $height
  DurationSeconds = $duration
  OutputDirectory = $resolvedOutput
}
