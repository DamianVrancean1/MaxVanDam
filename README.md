# MaxVanDam — Aplicație Piese Auto

Aplicație web full-stack pentru un magazin de piese auto, construită cu .NET 8 (backend) și React + TypeScript + Vite (frontend).

## Arhitectură Backend

Backend-ul urmează o arhitectură în **4 straturi**:

```
MaxVanDam.API              ← Controllers (HTTP, routing, responses)
MaxVanDam.BusinessLayer    ← Factory + Logic + Actions (business rules)
MaxVanDam.DataAccessLayer  ← DbContexts + Migrations (EF Core + PostgreSQL)
MaxVanDam.Domain           ← Entities + DTOs + Interfaces
```

### Fluxul unui request

```
Controller
  → new BusinessLogic().GetXxxLogic()   (factory, fără DI)
  → IXxxLogic.XxxMethod()               (interfață)
  → XxxLogic : XxxActions, IXxxLogic    (implementare)
  → XxxActions.XxxAction()              (acces la DB)
  → new XxxDbContext()                  (OnConfiguring cu CONNECTION_DEFAULT)
  → PostgreSQL
```

### Pattern-uri cheie

- **Factory**: `BusinessLogic` expune `GetAuthLogic()`, `GetProductLogic()`, `GetUserLogic()`, `GetNotificationLogic()`
- **Moștenire**: `XxxLogic : XxxActions, IXxxLogic`
- **ServiceResponse**: răspuns uniform `{ IsSuccess, Message, Data }`
- **DbContexts per entitate**: `UserDbContext`, `ProductsDbContext`, `NotificationsDbContext`, `MasterDbContext`
- **Fără DI în constructori**: contextele folosesc `OnConfiguring`, nu `AddDbContext`
- **Sincron**: fără `async/await` în BusinessLayer și DataAccessLayer
- **Securitate**: SHA512 + salt + pepper (custom `PasswordHasher`), JWT via `System.IdentityModel.Tokens.Jwt`
- **Env vars**: `DotNetEnv` încarcă `.env` la startup

## Structura proiectului

```
MaxVanDam/
├── backend/
│   ├── MaxVanDam.sln
│   ├── global.json                          # SDK 8.0, rollForward latestMinor
│   ├── .env                                 # variabile locale (git-ignored)
│   ├── .env.example                         # template fără valori
│   ├── MaxVanDam.API/
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs
│   │   │   ├── ProductController.cs
│   │   │   ├── UserController.cs
│   │   │   └── NotificationController.cs
│   │   └── Program.cs
│   ├── MaxVanDam.BusinessLayer/
│   │   ├── BusinessLogic.cs                 # factory
│   │   ├── Core/                            # XxxLogic : XxxActions, IXxxLogic
│   │   ├── Structure/                       # XxxActions (acces DB)
│   │   └── Security/
│   │       ├── PasswordHasher.cs
│   │       └── JwtGenerator.cs
│   ├── MaxVanDam.DataAccessLayer/
│   │   ├── DbSession.cs                     # CONNECTION_DEFAULT
│   │   ├── Context/
│   │   │   ├── MasterDbContext.cs
│   │   │   ├── UserDbContext.cs
│   │   │   ├── ProductsDbContext.cs
│   │   │   └── NotificationsDbContext.cs
│   │   └── Migrations/
│   │       ├── Users/
│   │       ├── Products/
│   │       └── Notifications/
│   └── MaxVanDam.Domain/
│       ├── Entities/
│       │   ├── User/UserEntity.cs
│       │   ├── Product/ProductEntity.cs
│       │   └── Notification/InventoryNotificationEntity.cs
│       ├── DTOs/
│       │   ├── Auth/
│       │   ├── Product/
│       │   └── Notification/
│       ├── Interfaces/
│       │   ├── IAuthLogic.cs
│       │   ├── IProductLogic.cs
│       │   ├── IUserLogic.cs
│       │   └── INotificationLogic.cs
│       └── ServiceResponse.cs
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── types/
│   └── package.json
└── docker-compose.yml
```

## Pornire locală

### Cerințe
- .NET 8 SDK
- Node.js 18+
- Docker (pentru PostgreSQL)
- EF Core CLI: `dotnet tool install --global dotnet-ef`

### 1. Baza de date (Docker)

```bash
# din rădăcina proiectului
cp backend/.env.example backend/.env
# editează backend/.env cu valorile tale (parole, secrete JWT etc.)

docker-compose up -d
```

### 2. Migrări EF Core

```bash
cd backend

# încarcă env vars în shell
set -a && source .env && set +a

dotnet ef database update --project MaxVanDam.DataAccessLayer --startup-project MaxVanDam.API --context UserDbContext
dotnet ef database update --project MaxVanDam.DataAccessLayer --startup-project MaxVanDam.API --context ProductsDbContext
dotnet ef database update --project MaxVanDam.DataAccessLayer --startup-project MaxVanDam.API --context NotificationsDbContext
```

### 3. Backend (.NET API)

```bash
cd backend/MaxVanDam.API
dotnet run
# API: http://localhost:5000
# Swagger: http://localhost:5000/swagger
```

### 4. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
# UI: http://localhost:5173
```

## Variabile de mediu (`.env`)

| Variabilă | Descriere |
|---|---|
| `CONNECTION_DEFAULT` | Connection string PostgreSQL |
| `AUTH_PEPPER` | Pepper secret pentru hashing parole |
| `JWT_SECRET` | Secret minim 32 caractere pentru JWT |
| `JWT_ISSUER` | Issuer token JWT |
| `JWT_AUDIENCE` | Audience token JWT |
| `JWT_EXPIRY_MINUTES` | Durata de viață a token-ului (minute) |
| `POSTGRES_PASSWORD` | Parola PostgreSQL (folosită de docker-compose) |

## Endpoint-uri API

### Auth — `/api/auth`
| Metodă | Rută | Descriere |
|---|---|---|
| POST | `/api/auth/register` | Înregistrare utilizator |
| POST | `/api/auth/login` | Autentificare, returnează JWT |

### Products — `/api/products`
| Metodă | Rută | Descriere |
|---|---|---|
| GET | `/api/products/list` | Listă toate produsele |
| GET | `/api/products/{id}` | Detalii produs |
| POST | `/api/products/create` | Adaugă produs |
| PUT | `/api/products/{id}/update` | Actualizează produs |
| DELETE | `/api/products/{id}/delete` | Șterge produs |

### Users — `/api/users`
| Metodă | Rută | Descriere |
|---|---|---|
| GET | `/api/users/list` | Listă utilizatori |
| GET | `/api/users/{id}` | Detalii utilizator |
| PUT | `/api/users/{id}/update` | Actualizează utilizator |
| DELETE | `/api/users/{id}/delete` | Șterge utilizator |

### Notifications — `/api/notifications`
| Metodă | Rută | Descriere |
|---|---|---|
| GET | `/api/notifications/list` | Listă notificări inventar |
| POST | `/api/notifications/create` | Crează notificare |
| DELETE | `/api/notifications/{id}/delete` | Șterge notificare |

## Tehnologii

### Backend
- **.NET 8** / C# 12
- **Entity Framework Core** + Npgsql (PostgreSQL)
- **System.IdentityModel.Tokens.Jwt** 8.16.0
- **DotNetEnv** 3.1.1

### Frontend
- **React 19** + **TypeScript**
- **Vite** (dev server + build)
- **React Router DOM**
