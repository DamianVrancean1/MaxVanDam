# Întrebări de Control - Laborator 1

## 1. Ce este React?

React este o bibliotecă JavaScript open-source dezvoltată de Facebook pentru construirea interfețelor de utilizator (
UI). Este folosită pentru a crea aplicații web interactive și componente UI reutilizabile. React folosește un Virtual
DOM pentru a optimiza performanța și permite dezvoltarea de aplicații Single Page (SPA).

## 2. Ce înseamnă SPA?

SPA (Single Page Application) este o aplicație web care se încarcă o singură dată și apoi actualizează dinamic
conținutul paginii fără a reîncărca întreaga pagină. Navigarea între diferite "pagini" se face prin JavaScript, oferind
o experiență mai fluidă și mai rapidă pentru utilizator.

## 3. Ce este TypeScript și ce avantaje oferă față de JavaScript?

TypeScript este un superset al JavaScript care adaugă tipuri statice și alte funcționalități. Avantajele:

- **Type Safety**: Detectează erori la compilare în loc de runtime
- **Autocomplete**: IDE-urile oferă sugestii mai bune
- **Refactoring**: Modificarea codului este mai sigură
- **Documentație**: Tipurile servesc ca documentație
- **Scalabilitate**: Codul este mai ușor de întreținut în proiecte mari

## 4. Ce este JSX / TSX?

JSX (JavaScript XML) / TSX (TypeScript XML) este o extensie de sintaxă care permite scrierea de cod asemănător cu HTML
în JavaScript/TypeScript. Este transpilat în JavaScript obișnuit și face codul React mai ușor de citit și scris.

Exemplu:

```tsx
const element = <h1>Hello, World!</h1>;
```

## 5. Ce sunt props și care este rolul lor într-o componentă React?

Props (properties) sunt argumente transmise componentelor React, similare cu atributele HTML. Ele sunt read-only și
permit transmiterea de date de la componente părinte către componente copil.

Exemplu din proiect:

```tsx
<Card product={product} />
```

## 6. Ce este state-ul într-o componentă React?

State-ul este un obiect care conține date care pot fi modificate în timp și care influențează comportamentul și afișarea
componentei. Când state-ul se schimbă, componenta se re-renderizează automat.

## 7. Ce este un hook?

Hook-urile sunt funcții speciale care permit "conectarea" la funcționalitățile React (state, lifecycle, context) din
componente funcționale. Hook-urile încep întotdeauna cu prefixul "use".

## 8. Ce este hook-ul useState și când se utilizează?

useState este un hook care permite adăugarea de state în componente funcționale. Returnează o pereche: valoarea curentă
a state-ului și o funcție pentru a-l actualiza.

Exemplu din proiect:

```tsx
const [products, setProducts] = useState<Product[]>([]);
```

## 9. Ce este hook-ul useEffect și care sunt cazurile principale de utilizare?

useEffect este un hook folosit pentru efecte secundare (side effects) în componente funcționale. Cazuri de utilizare:

- Fetch data de la API
- Subscripții (event listeners)
- Manipulare DOM
- Timers
- Cleanup după unmount

Exemplu din proiect:

```tsx
useEffect(() => {
  const allProducts = getProducts();
  setProducts(allProducts);
}, []);
```

## 10. Ce este un Context în React?

Context este un mecanism care permite transmiterea de date prin arborele de componente fără a trebui să transmitem props
manual la fiecare nivel. Este util pentru date "globale" precum tema, limba, utilizatorul autentificat.

## 11. Ce este un Provider și care este rolul lui?

Provider-ul este o componentă din Context API care "furnizează" valoarea context-ului către toate componentele
descendent. Orice componentă copil poate accesa această valoare folosind useContext.

Exemplu din proiect:

```tsx
<AuthProvider>
  <App />
</AuthProvider>
```

## 12. Ce este hook-ul useContext?

useContext este un hook care permite accesarea valorii unui Context într-o componentă funcțională fără a folosi
Consumer.

Exemplu din proiect:

```tsx
const { user, login, logout } = useAuth();
```

## 13. Ce sunt controlled components în React?

Controlled components sunt elemente de formular (input, textarea, select) ale căror valoare este controlată de React
state. React devine "single source of truth" pentru valoarea inputului.

Exemplu din proiect:

```tsx
<input
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>
```

## 14. Ce sunt mock data și de ce sunt folosite în acest laborator?

Mock data sunt date simulate/fictive folosite în dezvoltare pentru a testa funcționalitatea aplicației înainte de a
integra un backend real. În acest laborator:

- Permit dezvoltarea frontend-ului independent
- Simulează răspunsuri de la API
- Facilitează testarea diferitelor scenarii

Exemple din proiect: mockUsers, mockProducts

## 15. Ce este un formular controlat/necontrolat în React?

**Formular controlat**: Valorile câmpurilor sunt gestionate de React state. React controlează complet datele
formularului.

**Formular necontrolat**: Valorile sunt gestionate de DOM. Se folosesc ref-uri pentru a accesa valorile când este
necesar.

În proiectul nostru folosim formulare controlate (Login, AddProduct).

## 16. Ce este o componentă reutilizabilă?

O componentă reutilizabilă este o componentă generică care poate fi folosită în multiple locuri din aplicație cu
configurații diferite prin props. Beneficii:

- Reduce duplicarea codului
- Mentenanță mai ușoară
- Consistență în design

Exemple din proiect: Button, Card, Input

## 17. Care este diferența dintre frontend și backend?

**Frontend**:

- Interfața cu care utilizatorul interacționează
- Rulează în browser
- Tehnologii: HTML, CSS, JavaScript, React
- Vizualizare date, interacțiune utilizator

**Backend**:

- Partea server a aplicației
- Procesare date, logică business
- Tehnologii: Node.js, Python, Java, etc.
- Baze de date, autentificare, API-uri

În acest laborator am creat doar frontend-ul cu mock data, simulând backend-ul.
