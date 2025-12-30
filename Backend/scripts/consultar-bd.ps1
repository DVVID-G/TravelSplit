# Script PowerShell para consultar la base de datos TravelSplit
# Uso: .\consultar-bd.ps1

$DB_HOST = if ($env:DB_HOST) { $env:DB_HOST } else { "localhost" }
$DB_PORT = if ($env:DB_PORT) { $env:DB_PORT } else { "5432" }
$DB_USERNAME = if ($env:DB_USERNAME) { $env:DB_USERNAME } else { "postgres" }
$DB_PASSWORD = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { "postgres" }
$DB_NAME = if ($env:DB_NAME) { $env:DB_NAME } else { "travelsplit" }

# Verificar si Docker está corriendo
$containerRunning = docker ps --filter "name=travelsplit-postgres" --format "{{.Names}}"

if ($containerRunning -eq "travelsplit-postgres") {
    Write-Host "Conectando a PostgreSQL en Docker..." -ForegroundColor Green
    docker exec -it travelsplit-postgres psql -U $DB_USERNAME -d $DB_NAME
} else {
    Write-Host "Docker no está corriendo o el contenedor no existe." -ForegroundColor Yellow
    Write-Host "Asegúrate de tener PostgreSQL instalado localmente o ejecuta: docker-compose up -d" -ForegroundColor Yellow
    
    # Intentar conectar directamente si psql está disponible
    if (Get-Command psql -ErrorAction SilentlyContinue) {
        Write-Host "Conectando a PostgreSQL local..." -ForegroundColor Green
        $env:PGPASSWORD = $DB_PASSWORD
        psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME
    } else {
        Write-Host "psql no está instalado. Instala PostgreSQL o usa Docker." -ForegroundColor Red
    }
}

