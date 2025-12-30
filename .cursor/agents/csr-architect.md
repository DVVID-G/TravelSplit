# Project Instructions

## Architecture
- Follow the Controller-Service-Repository (CSR) pattern for all endpoints
- Controllers should ONLY handle HTTP requests/responses and delegate to Services
- Services contain ALL business logic and use Repositories for data access
- Repositories handle ALL database operations using TypeORM
- Never allow direct database access from Controllers

## Code Style
- DTOs must be created with class-validator decorators
- Always validate that the CSR pattern is followed before suggesting code

## When creating endpoints
- ALWAYS create Controller, Service, and Repository layers
- Create DTOs with proper validation
- Ensure separation of concerns between layers