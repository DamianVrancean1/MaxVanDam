# Instrucțiuni Git și GitHub

## Inițializare Git și Upload pe GitHub

### 1. Inițializează repository-ul Git local

```bash
# Navighează în directorul proiectului
cd piese-auto-app

# Inițializează git
git init

# Adaugă toate fișierele
git add .

# Creează primul commit
git commit -m "Initial commit - Aplicație Piese Auto React + TypeScript"
```

### 2. Creează repository pe GitHub

1. Mergi pe [GitHub.com](https://github.com)
2. Click pe butonul "+" din dreapta sus și selectează "New repository"
3. Completează:
   - **Repository name**: `piese-auto-app` (sau alt nume)
   - **Description**: "Aplicație web pentru magazin piese auto - React + TypeScript"
   - **Public** sau **Private** (recomandat Public pentru laborator)
   - **NU** bifa "Initialize with README" (avem deja)
4. Click "Create repository"

### 3. Conectează local la remote și push

```bash
# Adaugă remote repository (înlocuiește USERNAME cu username-ul tău GitHub)
git remote add origin https://github.com/USERNAME/piese-auto-app.git

# Verifică remote-ul
git remote -v

# Push la GitHub
git branch -M main
git push -u origin main
```

### 4. Verificare

Deschide link-ul repository-ului pe GitHub și verifică că toate fișierele sunt încărcate corect.

## Comenzi Git Utile

### Adaugă modificări noi
```bash
git add .
git commit -m "Descriere modificare"
git push
```

### Verifică status
```bash
git status
```

### Vezi istoricul commit-urilor
```bash
git log --oneline
```

### Creează branch nou (opțional)
```bash
git checkout -b feature/nume-feature
```

## Structura Repository-ului

Repository-ul va conține:
```
piese-auto-app/
├── src/                    # Codul sursă
├── public/                 # Fișiere statice
├── node_modules/           # Dependințe (ignorat de git)
├── .gitignore              # Fișiere ignorate
├── package.json            # Dependințe și scripturi
├── tsconfig.json           # Configurare TypeScript
├── vite.config.ts          # Configurare Vite
├── README.md               # Documentație proiect
└── INTREBARI_CONTROL.md    # Răspunsuri întrebări
```

## Link-uri Utile

- [Documentație Git](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Markdown Guide](https://www.markdownguide.org/)

## Notă Importantă

Asigură-te că:
- ✅ Toate fișierele sunt commitate
- ✅ `.gitignore` ignoră `node_modules/` și `dist/`
- ✅ README.md conține instrucțiuni clare
- ✅ Repository-ul este Public (pentru evaluare laborator)
- ✅ Ai testat că aplicația rulează corect cu `npm run dev`
