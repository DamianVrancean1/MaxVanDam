# Piese Auto - Aplicație React + TypeScript

Aplicație web pentru magazin de piese auto realizată folosind React și TypeScript pentru Laborator 1.

## 🚀 Caracteristici

### Cerințe Implementate

✅ **Proiect React cu TypeScript** - Inițializat cu Vite  
✅ **TypeScript** - Cod scris folosind interface și type  
✅ **Layout complet** - Header, Footer  
✅ **6 Pagini**:

- Home - pagina principală
- Products - listă produse cu filtrare
- ProductDetail - detalii produs
- Login - autentificare
- AdminDashboard - panou de control admin
- AddProduct - formular adăugare produs

✅ **Sistem de autentificare** - Mock users (admin și user)  
✅ **Routing** - React Router cu protecție rute admin  
✅ **Componente reutilizabile** - Button, Card, Input  
✅ **Mock Data** - Date simulate pentru users și produse  
✅ **Formulare cu validări** - Login și AddProduct  
✅ **Design Responsive** - Adaptat pentru mobile și desktop  
✅ **React Hooks** - useState, useEffect, useContext  
✅ **Funcții handling** - Pentru formulare, navigare, autentificare

## 📦 Instalare și Rulare

```bash
# Instalează dependințele
npm install

# Pornește serverul de development
npm run dev

# Build pentru producție
npm run build
```

Aplicația va rula pe `http://localhost:5173/`

## 🔑 Conturi de Test

### Admin

- Username: `admin`
- Password: `admin123`
- Acces: Toate paginile + Admin Dashboard + Adăugare produse

### User

- Username: `user`
- Password: `user123`
- Acces: Home, Products, ProductDetail

## 🏗️ Structura Proiectului

```
src/
├── components/
│   ├── common/          # Componente reutilizabile
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── layout/          # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── ProtectedRoute.tsx
├── context/
│   └── AuthContext.tsx  # Context pentru autentificare
├── data/
│   └── mockData.ts      # Date simulate
├── pages/               # Pagini aplicație
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   ├── Login.tsx
│   ├── AdminDashboard.tsx
│   └── AddProduct.tsx
├── types/
│   └── index.ts         # TypeScript interfaces și types
├── App.tsx
└── main.tsx
```

## 🛠️ Tehnologii Folosite

- **React 19** - Library UI
- **TypeScript** - Type safety
- **React Router DOM** - Navigare între pagini
- **Vite** - Build tool și dev server
- **CSS3** - Styling responsive

## 📝 Funcționalități Principale

### Pentru toți utilizatorii:

- Vizualizare listă produse
- Filtrare produse după categorie
- Căutare produse
- Vizualizare detalii produs

### Pentru Admin:

- Dashboard cu statistici
- Adăugare produse noi
- Formulare cu validări complete
- Gestionare inventar

## 🎨 Design

Design simplu și modern cu:

- Gradient backgrounds
- Cards cu hover effects
- Layout responsive
- Navigare intuitivă
- Footer informativ

## 📱 Responsive Design

Aplicația este complet responsive și se adaptează pentru:

- Desktop (> 768px)
- Tablet
- Mobile (< 768px)

## 🔐 Sistem de Autentificare

Aplicația folosește Context API pentru gestionarea autentificării:

- AuthContext - Provides user state
- ProtectedRoute - Component pentru protecția rutelor
- Login/Logout functionality
- Role-based access control (admin/user)

## ✨ Hooks Utilizate

- `useState` - State management
- `useEffect` - Side effects și data fetching
- `useContext` - Acces la AuthContext
- `useNavigate` - Navigare programatică
- `useParams` - Extragere parametri din URL

## 📊 Mock Data

Aplicația folosește date simulate pentru:

- **Users**: 2 utilizatori (admin și user)
- **Products**: 6 produse piese auto
- Funcții simulate pentru CRUD operations

## 🚧 Validări Formulare

### Login Form:

- Validare câmpuri goale
- Verificare credențiale

### Add Product Form:

- Validare nume produs (minim 3 caractere)
- Validare categorie
- Validare preț (> 0)
- Validare stoc (>= 0)
- Validare descriere (minim 10 caractere)
- Validare URL imagine

## 📄 Licență

Proiect educațional pentru Laborator 1 - Frontend Development
