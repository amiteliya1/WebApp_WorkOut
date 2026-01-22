# PowerShell Test Commands for Workout API
# Base URL: http://localhost:3002

# A) Login to get token
Write-Host "`n=== A) Login to get token ===" -ForegroundColor Cyan
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3002/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody

$token = $loginResponse.data.token
Write-Host "Token received: $($token.Substring(0, 20))..." -ForegroundColor Green
Write-Host "User: $($loginResponse.data.user.email)" -ForegroundColor Green

# B) Create a workout with Authorization: Bearer <token>
Write-Host "`n=== B) Create a workout ===" -ForegroundColor Cyan
$workoutBody = @{
    title = "Morning Run"
    duration = 30
    notes = "5km run in the park"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$createResponse = Invoke-RestMethod -Uri "http://localhost:3002/api/workouts" `
    -Method POST `
    -Headers $headers `
    -Body $workoutBody

Write-Host "Workout created:" -ForegroundColor Green
$createResponse.data | ConvertTo-Json

# C) GET workouts (should return only that user's workouts)
Write-Host "`n=== C) Get all workouts (user-specific) ===" -ForegroundColor Cyan
$getResponse = Invoke-RestMethod -Uri "http://localhost:3002/api/workouts" `
    -Method GET `
    -Headers @{ "Authorization" = "Bearer $token" }

Write-Host "Total workouts for this user: $($getResponse.count)" -ForegroundColor Green
$getResponse.data | ConvertTo-Json

