## MODIFIED Requirements

### Requirement: Registration API Integration
The frontend SHALL integrate with the backend registration endpoint and handle all response scenarios appropriately.

#### Scenario: API call structure
- **WHEN** the registration form is submitted with valid data
- **THEN** a POST request is sent to `/auth/register` endpoint
- **AND** the request body contains `{ nombre: string, email: string, contraseña: string }`
- **AND** the request includes appropriate Content-Type headers

### Requirement: User Registration Form
The frontend SHALL provide a registration form that allows new users to create an account by entering their name, email, and password.

#### Scenario: Successful registration
- **WHEN** a user fills the registration form with valid data (name, valid email, password > 6 characters)
- **AND** the email is not already registered
- **THEN** the form submits to `POST /auth/register`
- **AND** upon successful response (201), the user is redirected to `/login`
- **AND** a success message or confirmation is displayed



