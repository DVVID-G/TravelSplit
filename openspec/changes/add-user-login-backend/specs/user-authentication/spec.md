## ADDED Requirements

### Requirement: User Authentication with JWT
The system SHALL provide an endpoint for registered users to authenticate with their credentials and receive a JWT access token.

#### Scenario: Successful login with valid credentials
- **WHEN** a POST request is made to `/auth/login` with valid email and password
- **AND** the user exists in the database
- **AND** the provided password matches the stored password hash
- **THEN** the system returns HTTP 200 (OK)
- **AND** the response contains a valid JWT token in the `accessToken` field
- **AND** the response contains user information (id, nombre, email, createdAt) in the `user` field
- **AND** the JWT token payload includes `sub` (user ID) and `email` fields
- **AND** the JWT token is signed with the configured secret
- **AND** the JWT token has an expiration time as configured

#### Scenario: Login fails with non-existent email
- **WHEN** a POST request is made to `/auth/login` with an email that does not exist in the database
- **THEN** the system returns HTTP 401 (Unauthorized)
- **AND** the response indicates that the credentials are invalid
- **AND** no JWT token is returned

#### Scenario: Login fails with incorrect password
- **WHEN** a POST request is made to `/auth/login` with a valid email
- **AND** the user exists in the database
- **BUT** the provided password does not match the stored password hash
- **THEN** the system returns HTTP 401 (Unauthorized)
- **AND** the response indicates that the credentials are invalid
- **AND** no JWT token is returned

#### Scenario: Login fails with invalid email format
- **WHEN** a POST request is made to `/auth/login` with an invalid email format
- **THEN** the system returns HTTP 400 (Bad Request)
- **AND** the response includes validation error messages
- **AND** no authentication attempt is made

#### Scenario: Login fails with missing required fields
- **WHEN** a POST request is made to `/auth/login` with missing email or password
- **THEN** the system returns HTTP 400 (Bad Request)
- **AND** the response includes validation error messages indicating required fields
- **AND** no authentication attempt is made

### Requirement: Password Validation
The system SHALL securely compare the provided password with the stored password hash using bcrypt.

#### Scenario: Password comparison uses bcrypt
- **WHEN** a login request is made with valid credentials
- **THEN** the system uses `bcrypt.compare()` to verify the password
- **AND** the comparison is performed against the `passwordHash` field stored in the database
- **AND** the plain text password is never stored or logged

### Requirement: JWT Token Generation
The system SHALL generate JWT tokens using the configured secret and expiration time.

#### Scenario: JWT token contains required claims
- **WHEN** a successful login occurs
- **THEN** the generated JWT token includes the `sub` claim set to the user's ID
- **AND** the JWT token includes the `email` claim set to the user's email
- **AND** the JWT token is signed with the `JWT_SECRET` from environment variables
- **AND** the JWT token expiration is set according to `JWT_EXPIRES_IN` from environment variables

