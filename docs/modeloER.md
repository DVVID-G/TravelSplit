erDiagram
    %% ENTITIES
    User {
        uuid id PK
        string email UK "Unique, Indexado para búsquedas rápidas"
        string password_hash
        string first_name
        string last_name
        timestamp created_at
        timestamp updated_at
        boolean is_active "Default TRUE"
        timestamp deleted_at "Soft Delete"
        %% NOTA: No hay campo isAdmin. Los roles se manejan a nivel de viaje en TripParticipant
    }

    Trip {
        uuid id PK
        string name
        string description
        string invite_code UK "Código alfanumérico único"
        uuid created_by FK "Referencia al User creador original"
        timestamp created_at
        timestamp updated_at
        boolean is_active
        timestamp deleted_at
    }

    TripParticipant {
        uuid id PK
        uuid trip_id FK
        uuid user_id FK
        string role "Enum: CREATOR, MEMBER"
        timestamp joined_at
        boolean is_active
        %% Esta tabla resuelve la relación N:M entre User y Trip
        %% IMPORTANTE: Los roles son a nivel de viaje, no globales.
        %% - CREATOR: Usuario que creó el viaje. Puede editar/eliminar gastos y gestionar participantes.
        %% - MEMBER: Usuario invitado al viaje. Solo puede crear gastos propios (no editarlos tras crearlos).
        %% Un mismo usuario puede ser CREATOR en un viaje y MEMBER en otro.
    }

    ExpenseCategory {
        int id PK
        string name "Ej: Comida, Transporte"
        string icon "Referencia visual"
        boolean is_active
    }

    Expense {
        uuid id PK
        uuid trip_id FK
        uuid payer_id FK "User que pagó"
        int category_id FK
        string title
        decimal amount "Monto total en COP"
        string receipt_url "URL a S3/Cloudinary"
        date expense_date
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    ExpenseSplit {
        uuid id PK
        uuid expense_id FK
        uuid user_id FK "Usuario beneficiario del gasto"
        decimal amount_owed "Monto asignado a este usuario (Fair Share)"
        timestamp created_at
        %% Esta tabla permite saber quién debe qué de cada gasto
    }

    %% RELATIONSHIPS
    User ||--o{ TripParticipant : "participates in"
    User ||--o{ Expense : "pays"
    User ||--o{ ExpenseSplit : "owes in"
    User ||--o{ Trip : "creates (ownership)"

    Trip ||--|{ TripParticipant : "has"
    Trip ||--o{ Expense : "contains"

    ExpenseCategory ||--o{ Expense : "categorizes"

    Expense ||--|{ ExpenseSplit : "is divided into"