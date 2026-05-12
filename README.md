# MaxVanDam — Aplicație Piese Auto

Aplicație web full-stack pentru gestiunea unui depozit de piese auto, construită cu .NET 8 (backend) și React + TypeScript + Vite (frontend).

## Arhitectură Backend

Backend-ul urmează o arhitectură în **4 straturi**, identică cu patternul clubHub:

```
MaxVanDam.API              ← Controllers (HTTP, routing, responses)
MaxVanDam.BusinessLayer    ← Factory + Logic + Actions + Security
MaxVanDam.DataAccessLayer  ← DbContexts + DbSession + Migrations
MaxVanDam.Domain           ← Entities + Models (DTOs) + ServiceResponse
```

### Fluxul unui request

```
Controller
  → new BusinessLogic().GetXxxLogic()   (factory, fără DI)
  → IXxxLogic.XxxMethod()               (interfață)
  → XxxLogic : XxxActions, IXxxLogic    (implementare — Core/)
  → XxxActions.XxxAction()              (acces DB — Structure/)
  → new XxxDbContext()                  (OnConfiguring cu DbSession.ConnectionString)
  → PostgreSQL
```

### Pattern-uri cheie

- **Factory fără DI**: `BusinessLogic` expune `GetXxxLogic()` — fiecare returnează `new XxxLogic()`
- **Moștenire dublă**: `XxxLogic : XxxActions, IXxxLogic`
- **ServiceResponse**: răspuns uniform `{ IsSuccess, Message, Data:object? }` — fără generics
- **DbContext per entitate**: `UserDbContext`, `ProductsDbContext`, `NotificationsDbContext`, `SubscriptionDbContext`, `MasterDbContext`
- **Fără DI în constructori**: contextele folosesc `OnConfiguring`, nu `AddDbContext`
- **Sincron**: fără `async/await` în BusinessLayer și DataAccessLayer
- **Securitate**: SHA512 + salt + pepper (`PasswordHasher`), JWT via `System.IdentityModel.Tokens.Jwt`
- **Env vars**: `DotNetEnv.Env.Load()` pe prima linie din `Program.cs`

## Structura proiectului

```
MaxVanDam/
├── backend/
│   ├── MaxVanDam.sln
│   ├── global.json                          # SDK 8.0, rollForward latestMinor
│   ├── .env                                 # variabile locale (ignorat local)
│   ├── .env.example                         # template cu chei, fără valori
│   ├── MaxVanDam.API/
│   │   ├── Controllers/
│   │   │   ├── HealthController.cs
│   │   │   ├── AuthController.cs
│   │   │   ├── ProductController.cs
│   │   │   ├── UserController.cs
│   │   │   ├── NotificationController.cs
│   │   │   └── SubscriptionController.cs
│   │   └── Program.cs
│   ├── MaxVanDam.BusinessLayer/
│   │   ├── BusinessLogic.cs                 # factory
│   │   ├── Core/                            # XxxLogic : XxxActions, IXxxLogic
│   │   ├── Structure/                       # XxxActions — acces direct DB
│   │   ├── Interfaces/                      # IXxxLogic
│   │   └── Security/
│   │       ├── PasswordHasher.cs
│   │       └── JwtGenerator.cs
│   ├── MaxVanDam.DataAccessLayer/
│   │   ├── DbSession.cs                     # citește CONNECTION_DEFAULT din env
│   │   ├── Context/
│   │   │   ├── MasterDbContext.cs
│   │   │   ├── UserDbContext.cs
│   │   │   ├── ProductsDbContext.cs
│   │   │   ├── NotificationsDbContext.cs
│   │   │   └── SubscriptionDbContext.cs
│   │   └── Migrations/
│   │       ├── Users/
│   │       ├── Products/
│   │       ├── Notifications/
│   │       └── Subscriptions/
│   └── MaxVanDam.Domain/
│       ├── Entities/
│       │   ├── User/UserEntity.cs
│       │   ├── Product/ProductEntity.cs
│       │   ├── InventoryNotification/InventoryNotificationEntity.cs
│       │   └── Subscription/SubscriptionEntity.cs
│       └── Models/
│           ├── Auth/         (LoginDto, RegisterDto, AuthResponseDto)
│           ├── Product/      (ProductCreateDto, ProductUpdateDto, ProductInfoDto)
│           ├── User/         (UserInfoDto, UserUpdateDto, UserUpdatePasswordDto, AdminUserUpdateDto)
│           ├── Notification/ (NotificationInfoDto)
│           ├── Subscription/ (CreateSubscriptionDto, SubscriptionInfoDto)
│           └── Service/      (ServiceResponse)
├── src/                                     # frontend React + TypeScript
├── docker-compose.yml                       # serviciu postgres
└── README.md
```

## Pornire locală

### Cerințe

- .NET 8 SDK
- Node.js 18+
- Docker
- EF Core CLI: `dotnet tool install --global dotnet-ef`

### 1. Configurare variabile de mediu

```bash
# din rădăcina proiectului
cp backend/.env.example backend/.env
# editează backend/.env cu valorile tale
```

### 2. Pornire bază de date

```bash
docker-compose up -d postgres
```

### 3. Migrații EF Core

```bash
cd backend

# încarcă env vars în shell
set -a && source .env && set +a

dotnet ef database update --context UserDbContext          -p MaxVanDam.DataAccessLayer -s MaxVanDam.API
dotnet ef database update --context ProductsDbContext      -p MaxVanDam.DataAccessLayer -s MaxVanDam.API
dotnet ef database update --context NotificationsDbContext -p MaxVanDam.DataAccessLayer -s MaxVanDam.API
dotnet ef database update --context SubscriptionDbContext  -p MaxVanDam.DataAccessLayer -s MaxVanDam.API
```

### 4. Backend

```bash
cd backend
dotnet run --project MaxVanDam.API
# API:     https://localhost:7xxx
# Swagger: https://localhost:7xxx/swagger
```

### 5. Frontend

```bash
# din rădăcina proiectului
npm install
npm run dev
# UI: http://localhost:5173
```

## Variabile de mediu (`backend/.env`)

| Variabilă | Descriere |
|---|---|
| `CONNECTION_DEFAULT` | Connection string PostgreSQL complet |
| `AUTH_PEPPER` | Pepper secret pentru hashing parole (SHA512) |
| `JWT_SECRET` | Secret minim 32 caractere pentru semnare JWT |
| `JWT_ISSUER` | Issuer token JWT (ex: `MaxVanDam`) |
| `JWT_AUDIENCE` | Audience token JWT (ex: `MaxVanDam`) |
| `JWT_EXPIRY_MINUTES` | Durata de viață a token-ului în minute (ex: `60`) |
| `POSTGRES_PASSWORD` | Parola PostgreSQL — folosită de `docker-compose.yml` |

## Endpoint-uri API

### Health — `/api/health`
| Metodă | Rută | Descriere |
|---|---|---|
| GET | `/api/health` | Stare aplicație |

### Auth — `/api/auth`
| Metodă | Rută | Descriere |
|---|---|---|
| POST | `/api/auth/register` | Înregistrare utilizator nou |
| POST | `/api/auth/login` | Autentificare, returnează JWT |

### Products — `/api/products`
| Metodă | Rută | Descriere |
|---|---|---|
| GET | `/api/products/list` | Listă toate produsele |
| GET | `/api/products/{id}` | Detalii produs |
| POST | `/api/products/create` | Adaugă produs |
| PUT | `/api/products/{id}` | Actualizează produs |
| DELETE | `/api/products/{id}` | Șterge produs |

### Users — `/api/users`
| Metodă | Rută | Descriere |
|---|---|---|
| GET | `/api/users/list` | Listă utilizatori |
| POST | `/api/users/create` | Crează utilizator |
| PUT | `/api/users/{id}/role` | Actualizează rol utilizator |
| DELETE | `/api/users/{id}` | Șterge utilizator |

### Notifications — `/api/notifications`
| Metodă | Rută | Descriere |
|---|---|---|
| GET | `/api/notifications/list` | Listă toate notificările |
| GET | `/api/notifications/unread` | Notificări necitite |
| PATCH | `/api/notifications/{id}/read` | Marchează ca citită |
| POST | `/api/notifications/create` | Crează notificare pentru produs |

### Subscriptions — `/api/subscriptions`
| Metodă | Rută | Descriere |
|---|---|---|
| POST | `/api/subscriptions/create` | Crează abonament nou |
| GET | `/api/subscriptions/list` | Listă abonamente |
| GET | `/api/subscriptions/{id}` | Detalii abonament |
| POST | `/api/subscriptions/{id}/cancel` | Anulează abonament |
| GET | `/api/subscriptions/stats` | Statistici abonamente |

## Tehnologii

### Backend
- **.NET 8** / C# 12
- **Entity Framework Core 8** + Npgsql (PostgreSQL)
- **System.IdentityModel.Tokens.Jwt** 8.16.0
- **DotNetEnv** 3.1.1
- **Swashbuckle** (Swagger UI)

### Frontend
- **React 19** + **TypeScript**
- **Vite** (dev server + build)
- **React Router DOM**
