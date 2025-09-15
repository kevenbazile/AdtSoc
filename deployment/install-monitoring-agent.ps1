# Business Jarvis Monitoring Agent Installer
Write-Host "Installing Business Jarvis Monitoring Agent..." -ForegroundColor Green

# Create agent directory
$agentPath = "C:\Program Files\BusinessJarvis\Agent"
New-Item -ItemType Directory -Force -Path $agentPath

# Copy agent files
Copy-Item -Path ".\agent\*" -Destination $agentPath -Recurse -Force

# Install agent as Windows service
$serviceName = "BusinessJarvisAgent"
$serviceDisplayName = "Business Jarvis Monitoring Agent"
$serviceDescription = "Monitors system security and performance for Business Jarvis"
$servicePath = "$agentPath\agent.exe"

# Create the service
New-Service -Name $serviceName -BinaryPathName $servicePath -DisplayName $serviceDisplayName -Description $serviceDescription -StartupType Automatic

# Start the service
Start-Service -Name $serviceName

Write-Host "Business Jarvis Monitoring Agent installed successfully!" -ForegroundColor Green
Write-Host "Service Status:" -ForegroundColor Yellow
Get-Service -Name $serviceName
