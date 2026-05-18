import type { Review } from '../types';

// Mock reviews for products 1–20.
// Products map to (based on mockData.ts generation logic):
//   1  Filtru aer BMW Seria 3          9  Amortizor față BMW X3
//   2  Filtru ulei Audi A3            10  Amortizor spate Audi A6
//   3  Filtru combustibil MB C-Class  11  Arc suspensie MB GLC
//   4  Filtru habitaclu VW Golf       12  Kit ambreiaj VW Tiguan
//   5  Plăcuțe frână față BMW Seria 5 13  Baterie BMW X5
//   6  Plăcuțe frână spate Audi A4    14  Bujii Audi Q5
//   7  Discuri frână față MB E-Class  15  Bobine inducție MB GLE
//   8  Discuri frână spate VW Passat  16  Pompa de apă VW Touareg
//                                    17  Pompa combustibil BMW Seria 3
//                                    18  Radiator Audi A3
//                                    19  Curea distribuție MB C-Class
//                                    20  Curea accesorii VW Golf

export const mockReviews: Review[] = [

  // ── Product 1 — Filtru aer BMW Seria 3 ─────────────────────────────────
  { id: 1,  productId: 1, authorName: 'Alexandru Pop',     rating: 5, title: 'Identic cu originalul',         body: 'Se potrivește perfect la BMW-ul meu E90. Dimensiunile sunt identice cu filtrul Mahle original. L-am montat în 5 minute fără probleme de etanșeitate.',              date: '2025-03-15', verified: true,  helpful: 18 },
  { id: 2,  productId: 1, authorName: 'Maria Ionescu',     rating: 4, title: 'Bun raport calitate-preț',      body: 'Nu e original, dar e printre cele mai bune aftermarket-uri. Motorul pare că respiră ceva mai bine după schimbare. Recomand.',                                    date: '2025-02-10', verified: true,  helpful: 11 },
  { id: 3,  productId: 1, authorName: 'Bogdan Munteanu',   rating: 5, title: 'A treia comandă, același produs', body: 'L-am folosit la 3 BMW-uri de-a lungul timpului. Niciun caz de probleme. Calitate constantă și fitment impecabil.',                                          date: '2025-01-05', verified: true,  helpful: 24 },
  { id: 4,  productId: 1, authorName: 'Cristian Dănilă',   rating: 3, title: 'OK dar se murdărește repede',   body: 'Face treabă, dar la drum de țară se înfundă cam repede. La 8.000 km era deja mai încărcat decât mă așteptam. Decent pentru prețul ăsta.',                       date: '2024-11-20', verified: false, helpful: 6  },
  { id: 5,  productId: 1, authorName: 'Elena Stan',        rating: 5, title: 'Livrat rapid, calitate bună',   body: 'Comandat luni, primit miercuri. Filtrul arată excelent și s-a potrivit perfect. Prețul e mult mai bun decât la dealer.',                                         date: '2025-04-01', verified: true,  helpful: 9  },

  // ── Product 2 — Filtru ulei Audi A3 ───────────────────────────────────
  { id: 6,  productId: 2, authorName: 'Florin Radu',       rating: 5, title: 'Etanșeitate perfectă',          body: 'Nu a picurat deloc după montare. Am schimbat uleiul singur acasă și filtrul a mers excelent. Compatibil 100% cu Audi A3 1.6 TDI.',                              date: '2025-03-22', verified: true,  helpful: 15 },
  { id: 7,  productId: 2, authorName: 'Ioana Popescu',     rating: 4, title: 'Mulțumit de produs',            body: 'Calitate bună, demontare ușoară la schimbul următor. Puțin mai scump față de alte branduri, dar merită.',                                                        date: '2025-01-18', verified: true,  helpful: 7  },
  { id: 8,  productId: 2, authorName: 'Mihai Popa',        rating: 4, title: 'Se strânge ușor, nu se rupe',   body: 'Filetul este bun, nu a necesitat cheie specială. La schimbul uleiului următor a ieșit fără probleme.',                                                          date: '2024-12-03', verified: false, helpful: 5  },
  { id: 9,  productId: 2, authorName: 'Laura Marin',       rating: 2, title: 'Garnitura s-a deformat',        body: 'După 3 schimburi de ulei filtrul era greu de scos — garnitura s-a lipit. Nu am întâmpinat scurgeri, dar experiența nu a fost plăcută.',                          date: '2024-10-14', verified: true,  helpful: 13 },

  // ── Product 3 — Filtru combustibil Mercedes-Benz C-Class ──────────────
  { id: 10, productId: 3, authorName: 'Gabriel Stan',      rating: 5, title: 'Presiunea combustibilului OK',  body: 'Avusesem probleme cu pornirea la rece — după schimbarea filtrului totul e perfect. Compatibilitate verificată cu C200 CDI.',                                     date: '2025-02-27', verified: true,  helpful: 20 },
  { id: 11, productId: 3, authorName: 'Raluca Pop',        rating: 4, title: 'Montare ușoară',               body: 'Vine cu garnituri incluse, fără probleme la montare. Motorul merge mai lin.',                                                                                     date: '2025-01-30', verified: true,  helpful: 8  },
  { id: 12, productId: 3, authorName: 'Andrei Ionescu',    rating: 5, title: 'Calitate OEM la preț bun',     body: 'Îl folosesc de 2 ani pe MB-ul meu și nu am avut nicio problemă. Vin complet asamblat, gata de montare.',                                                         date: '2024-09-15', verified: false, helpful: 12 },

  // ── Product 4 — Filtru habitaclu Volkswagen Golf ──────────────────────
  { id: 13, productId: 4, authorName: 'Daniel Matei',      rating: 5, title: 'Nu mai miroase a praf',        body: 'Diferența se simte imediat după montare — aerul din habitaclu e mult mai curat, fără miros. L-am schimbat anual de acum.',                                       date: '2025-03-10', verified: true,  helpful: 22 },
  { id: 14, productId: 4, authorName: 'Ana Moldovan',      rating: 5, title: 'Foarte simplu de montat',      body: 'Am schimbat singură, fără mecanic. A durat 3 minute. Calitate bună și preț corect.',                                                                               date: '2025-02-14', verified: true,  helpful: 16 },
  { id: 15, productId: 4, authorName: 'Emil Nistor',       rating: 4, title: 'Bun, dar puțin subțire',       body: 'Face treabă, dar media de filtrare pare mai subțire decât cel Mann original. Prețul compensează.',                                                               date: '2024-11-08', verified: false, helpful: 4  },
  { id: 16, productId: 4, authorName: 'Cristina Radu',     rating: 3, title: 'Mediu',                        body: 'Nici prea bun, nici rău. Dacă aveți alergie sau copii mici, merită să investiți în un filtru cu cărbune activ.',                                                 date: '2024-10-01', verified: true,  helpful: 9  },

  // ── Product 5 — Plăcuțe frână față BMW Seria 5 ───────────────────────
  { id: 17, productId: 5, authorName: 'Silviu Vasile',     rating: 5, title: 'Excelente! Distanța s-a redus', body: 'Le-am montat pe BMW F10 530d. Prima frânare a fost surprinzătoare — mult mai ferme decât cele uzate. Nu scârțâie, nu lasă praf negru pe jante.',               date: '2025-04-05', verified: true,  helpful: 31 },
  { id: 18, productId: 5, authorName: 'Paul Bălan',        rating: 4, title: 'Bune, după rodaj se îmbunătățesc', body: 'Primii 200 km au fost mai slabi, dar după rodaj complet sunt excelente. Uzura pare mică față de originale.',                                               date: '2025-03-01', verified: true,  helpful: 17 },
  { id: 19, productId: 5, authorName: 'Radu Moldovan',     rating: 5, title: 'A doua achiziție, same result', body: 'Le-am mai folosit acum 2 ani pe același model. Constanță în calitate. Prețul e corect față de EBC sau Brembo.',                                                date: '2025-01-22', verified: true,  helpful: 14 },
  { id: 20, productId: 5, authorName: 'Diana Tudor',       rating: 3, title: 'OK, dar praf pe jante',         body: 'Frânează bine, dar lasă mai mult praf negru decât mă așteptam. Pentru mașini sport sau jante albe aș recomanda altceva.',                                     date: '2024-12-15', verified: false, helpful: 8  },
  { id: 21, productId: 5, authorName: 'Ionuț Tudor',       rating: 4, title: 'Preț bun pentru calitate',     body: 'Față de plăcuțele originale BMW care costă dublu, acestea oferă 90% din performanță. Mulțumit.',                                                                 date: '2024-11-30', verified: true,  helpful: 11 },

  // ── Product 6 — Plăcuțe frână spate Audi A4 ──────────────────────────
  { id: 22, productId: 6, authorName: 'Marian Stoica',     rating: 4, title: 'Montaj ușor, rezultat bun',    body: 'Vin cu instrucțiuni clare. Montaj ușor dacă ai un lift. Frânele spate ale A4-ului meu sunt acum mult mai eficiente.',                                            date: '2025-03-18', verified: true,  helpful: 13 },
  { id: 23, productId: 6, authorName: 'Mihaela Constantin', rating: 5, title: 'Plăcuțe de calitate',        body: 'Nu scârțâie, nu vibrează, frânare progresivă. Foarte mulțumită față de calitate vs preț.',                                                                       date: '2025-02-05', verified: true,  helpful: 19 },
  { id: 24, productId: 6, authorName: 'Cosmin Dumitrescu', rating: 5, title: 'Recomand',                    body: 'Am luat și față și spate de la MaxVanDam. Ambele seturi sunt excelente. Frânarea e uniformă și sigură.',                                                           date: '2024-12-20', verified: true,  helpful: 10 },
  { id: 25, productId: 6, authorName: 'Victor Georgescu',  rating: 2, title: 'S-au uzat repede',            body: 'Față de așteptări, s-au uzat la ~25.000 km. Originalele Ate au ținut 45.000 km. Poate mă așteptam prea mult.',                                                   date: '2024-09-07', verified: false, helpful: 16 },

  // ── Product 7 — Discuri frână față Mercedes-Benz E-Class ─────────────
  { id: 26, productId: 7, authorName: 'Petru Cojocaru',    rating: 5, title: 'Discuri perfect echilibrate', body: 'Nicio vibrație la frânare de mare viteză. Le-am montat pe E220d și rezultatele sunt perfecte. Balamat cu atenție.',                                              date: '2025-04-08', verified: true,  helpful: 25 },
  { id: 27, productId: 7, authorName: 'Sebastian Vasile',  rating: 4, title: 'Calitate solidă',             body: 'Discuri groase, finisaj bun, nu au ruginit în primele săptămâni (ceea ce se întâmplă des cu chinezăriile). Recomand.',                                            date: '2025-02-20', verified: true,  helpful: 12 },
  { id: 28, productId: 7, authorName: 'Sorin Bălan',       rating: 4, title: 'Bune pentru uz normal',       body: 'Nu mă aștept la performanță de circuit, dar pentru uz stradal zilnic sunt excelente. Uzura pare normală după 15.000 km.',                                        date: '2024-12-28', verified: false, helpful: 7  },
  { id: 29, productId: 7, authorName: 'Liviu Constantin',  rating: 3, title: 'Medie',                       body: 'Fac față, dar comparativ cu Zimmermann nu e la același nivel. Prețul e avantajos, dar obții ce plătești.',                                                         date: '2024-10-22', verified: true,  helpful: 9  },

  // ── Product 8 — Discuri frână spate Volkswagen Passat ────────────────
  { id: 30, productId: 8, authorName: 'Marcel Georgescu',  rating: 5, title: 'Fără vibrații, fără zgomot',  body: 'Am montat odată cu plăcuțele noi. Combinația e excelentă — frânare fermă și silențioasă. Passat-ul meu B7 e ca nou.',                                           date: '2025-03-25', verified: true,  helpful: 21 },
  { id: 31, productId: 8, authorName: 'Roxana Nistor',     rating: 4, title: 'Calitate bună',               body: 'Potrivire perfectă, nu am trebuit să modific nimic. Prețul e corect pentru ce oferă.',                                                                              date: '2025-01-12', verified: true,  helpful: 8  },
  { id: 32, productId: 8, authorName: 'Nicolae Cojocaru',  rating: 5, title: 'Discuri excelente',           body: 'Sunt deja al doilea set de la MaxVanDam. Calitate identică, fără surprize neplăcute. Livrare rapidă.',                                                            date: '2024-11-15', verified: true,  helpful: 14 },

  // ── Product 9 — Amortizor față BMW X3 ────────────────────────────────
  { id: 33, productId: 9, authorName: 'Adrian Pop',        rating: 5, title: 'Diferență enormă față de uzați', body: 'X3-ul meu era aproape imposibil de condus pe drum prost. După montarea amortizorilor noi, e ca o altă mașină. Investiție care merită.',                     date: '2025-04-02', verified: true,  helpful: 34 },
  { id: 34, productId: 9, authorName: 'Bogdan Nistor',     rating: 4, title: 'Confort îmbunătățit semnificativ', body: 'Montaj la service, ~2h. Confortul în oraș s-a îmbunătățit mult. Puțin mai rigizi decât originalele OEM, dar handling-ul e mai precis.',                  date: '2025-02-08', verified: true,  helpful: 18 },
  { id: 35, productId: 9, authorName: 'Ioana Matei',       rating: 3, title: 'OK pentru preț',               body: 'Se simte diferența față de uzați, dar după 30.000 km deja au pierdut din caracteristici. Aș investi în ceva mai bun data viitoare.',                            date: '2024-10-30', verified: false, helpful: 11 },
  { id: 36, productId: 9, authorName: 'Florin Munteanu',   rating: 5, title: 'Recomand mecanic bun',         body: 'Produsul e excelent. Atenție la montaj — aveți nevoie de presă pentru bucșe. Odată montate corect, sunt perfecte.',                                             date: '2024-09-18', verified: true,  helpful: 16 },

  // ── Product 10 — Amortizor spate Audi A6 ─────────────────────────────
  { id: 37, productId: 10, authorName: 'Cosmin Radu',      rating: 4, title: 'Rezistentă și confortabile',   body: 'Le-am montat pe A6 C7 în combinație cu arcuri noi. Confort excelent, handling stabil. Prețul e corect față de Bilstein.',                                       date: '2025-03-05', verified: true,  helpful: 13 },
  { id: 38, productId: 10, authorName: 'Elena Vasile',     rating: 5, title: 'Excelente pe șoselele din Moldova', body: 'Cum știm, drumurile nu sunt tocmai netede. Acești amortizori absorb gropile impresionant de bine. Recomand!',                                              date: '2025-01-25', verified: true,  helpful: 27 },
  { id: 39, productId: 10, authorName: 'Paul Stoica',      rating: 4, title: 'Buni, montaj ușor',            body: 'Nu au necesitat adaptoare speciale. Montaj relativ ușor pentru un mecanic obișnuit. Mulțumit de produs.',                                                        date: '2024-12-10', verified: false, helpful: 7  },

  // ── Product 11 — Arc suspensie Mercedes-Benz GLC ─────────────────────
  { id: 40, productId: 11, authorName: 'Tudor Moldovan',   rating: 5, title: 'Înălțimea corespunde exact',   body: 'Am verificat cu laser nivelul după montare — identic cu specificațiile Mercedes. Mașina stă drept, fără diferențe de înălțime.',                               date: '2025-02-22', verified: true,  helpful: 19 },
  { id: 41, productId: 11, authorName: 'Daniela Stan',     rating: 4, title: 'Calitate bună',                body: 'Arcuri rigide, bine prelucrate. S-au montat fără probleme. Suspensie mai fermă decât originalele, ceea ce prefer.',                                              date: '2025-01-08', verified: true,  helpful: 10 },
  { id: 42, productId: 11, authorName: 'Victor Dumitrescu', rating: 3, title: 'Ușor mai josă față de original', body: 'Mașina este cu ~5mm mai josă față de cum era cu arcurile originale. Nu mă deranjează, dar nu mă așteptam.',                                                 date: '2024-11-02', verified: false, helpful: 8  },

  // ── Product 12 — Kit ambreiaj Volkswagen Tiguan ───────────────────────
  { id: 43, productId: 12, authorName: 'Gheorghe Popa',    rating: 5, title: 'Schimbare completă reușită',   body: 'Am montat kitul complet (disc + presă + rulment). Acuplarea e lină, pedala are cursă perfectă. Tiguan-ul pare nou.',                                            date: '2025-03-28', verified: true,  helpful: 32 },
  { id: 44, productId: 12, authorName: 'Mirela Ionescu',   rating: 4, title: 'Bun, dar necesită rodaj',      body: 'Primele 500km cu atenție la rodaj — nu forțați ambreiajul. Acum, după rodaj complet, este excelent. Vibrații zero.',                                            date: '2025-01-15', verified: true,  helpful: 22 },
  { id: 45, productId: 12, authorName: 'Vasile Radu',      rating: 5, title: 'Recomandat de mecanic',        body: 'Mecanicul meu de încredere a confirmat că e calitate OEM. S-a montat simplu și s-a reglat bine de prima dată.',                                                  date: '2024-10-05', verified: true,  helpful: 15 },

  // ── Product 13 — Baterie BMW X5 ───────────────────────────────────────
  { id: 46, productId: 13, authorName: 'Alexandru Marin',  rating: 5, title: 'Pornire excelentă la -15°C',   body: 'Am testat în iarna asta când au fost -15 grade. Mașina a pornit instant. Bateria veche murea deja la temperaturi normale.',                                    date: '2025-02-15', verified: true,  helpful: 41 },
  { id: 47, productId: 13, authorName: 'Sorin Georgescu',  rating: 4, title: 'Potrivire perfectă',           body: 'Am verificat codificarea după montare — compatibilă cu sistemul iDrive fără resetare suplimentară. Capacitate conform specificații.',                             date: '2025-01-03', verified: true,  helpful: 18 },
  { id: 48, productId: 13, authorName: 'Ana Constantin',   rating: 5, title: 'Calitate premium',             body: 'O baterie AGM de calitate. Se vede diferența față de bateriile ieftine. Recomand pentru orice BMW cu sistem stop-start.',                                        date: '2024-12-05', verified: false, helpful: 14 },
  { id: 49, productId: 13, authorName: 'Marian Popescu',   rating: 3, title: 'Bună dar scumpă',              body: 'Nu am ce comenta la calitate, dar față de alte mărci cu aceleași specificații, prețul mi se pare puțin mare. Face treabă.',                                    date: '2024-09-20', verified: true,  helpful: 6  },

  // ── Product 14 — Bujii Audi Q5 ────────────────────────────────────────
  { id: 50, productId: 14, authorName: 'Sebastian Radu',   rating: 5, title: 'Pornire instant, consum scăzut', body: 'Am simțit diferența la consumul de carburant după schimbul bujiilor. Pornirea e mai rapidă și mersul mai lin. Recomand schimbul la timp!',                   date: '2025-04-10', verified: true,  helpful: 29 },
  { id: 51, productId: 14, authorName: 'Elena Pop',        rating: 5, title: 'Originale la preț bun',        body: 'Bujii originale NGK la un preț mult mai bun decât la dealer Audi. Fitment perfect, fără coduri de eroare.',                                                     date: '2025-02-28', verified: true,  helpful: 23 },
  { id: 52, productId: 14, authorName: 'Bogdan Stan',      rating: 4, title: 'OK, fac treabă',               body: 'Nici prea mult de zis — bujii standard, fac ce trebuie. Ușor de montat dacă ai cheia corectă.',                                                                  date: '2024-11-12', verified: false, helpful: 5  },

  // ── Product 15 — Bobine inducție Mercedes-Benz GLE ───────────────────
  { id: 53, productId: 15, authorName: 'Cristian Matei',   rating: 5, title: 'Rezolvat misfire-ul',          body: 'Aveam P0351 la scanner. Am schimbat bobinele și codul a dispărut instant. Motorul merge acum fără trepidații.',                                                 date: '2025-03-12', verified: true,  helpful: 36 },
  { id: 54, productId: 15, authorName: 'Laura Stoica',     rating: 4, title: 'Potrivire perfectă',           body: 'Fiecare bobină a intrat fără forță, conector perfect. Am schimbat toate 6 deodată — diferența în putere e sesizabilă.',                                         date: '2025-01-20', verified: true,  helpful: 14 },
  { id: 55, productId: 15, authorName: 'Radu Dănilă',      rating: 5, title: 'Calitate OEM, preț corect',   body: 'Am comparat cu cele de la dealeri oficial — identice vizual și funcțional. De ce să plătești de 3 ori mai mult?',                                                date: '2024-12-18', verified: true,  helpful: 21 },

  // ── Product 16 — Pompa de apă Volkswagen Touareg ─────────────────────
  { id: 56, productId: 16, authorName: 'Florin Tudor',     rating: 5, title: 'Schimb preventiv reușit',      body: 'Am schimbat pompa odată cu kit-ul de distribuție. Calitate bună, nu s-a scurs un strop de lichid de răcire.',                                                   date: '2025-04-03', verified: true,  helpful: 17 },
  { id: 57, productId: 16, authorName: 'Ioana Bălan',      rating: 4, title: 'Bună și silențioasă',          body: 'Nu face zgomot, temperatura motorului e stabilă. Bine să schimbi pompa la intervalul recomandat.',                                                               date: '2025-02-16', verified: false, helpful: 9  },
  { id: 58, productId: 16, authorName: 'Mihai Moldovan',   rating: 3, title: 'Montare complicată',           body: 'Produsul e ok, dar la Touareg 3.0 TDI accesul la pompă e dificil. A durat 6h la service. Nu e vina produsului, dar să știți.',                                 date: '2024-10-25', verified: true,  helpful: 12 },

  // ── Product 17 — Pompa combustibil BMW Seria 3 ───────────────────────
  { id: 59, productId: 17, authorName: 'Cosmin Vasile',    rating: 5, title: 'Rezolvat problema de presiune', body: 'BMW-ul meu E46 nu pornea la rece din cauza presiunii scăzute. Pompa nouă a rezolvat complet problema. Recomand să verificați și filtrul odată.',               date: '2025-03-08', verified: true,  helpful: 28 },
  { id: 60, productId: 17, authorName: 'Maria Dumitrescu', rating: 4, title: 'Livrare rapidă',               body: 'Comandat vineri seara, livrat luni dimineața. Pompa s-a potrivit perfect și funcționează fără zgomot.',                                                          date: '2025-01-28', verified: true,  helpful: 11 },
  { id: 61, productId: 17, authorName: 'Tudor Popa',       rating: 5, title: 'Calitate neașteptată',         body: 'Față de ce am mai comandat online, asta e la alt nivel. Conexiunile sunt precise, materialul pare durabil.',                                                     date: '2024-11-22', verified: false, helpful: 8  },

  // ── Product 18 — Radiator Audi A3 ────────────────────────────────────
  { id: 62, productId: 18, authorName: 'Sorin Constantin', rating: 4, title: 'Temperatura motorului stabilă', body: 'Am înlocuit radiatorul original crăpat. Noul radiator menține temperatura perfect la 90°C. Potrivire exactă.',                                                 date: '2025-03-20', verified: true,  helpful: 15 },
  { id: 63, productId: 18, authorName: 'Roxana Georgescu', rating: 5, title: 'Etanș, fără scurgeri',        body: 'L-am montat acum 6 luni și nici o scurgere. Sudurile par solide. Prețul e jumătate față de original Valeo.',                                                    date: '2025-01-10', verified: true,  helpful: 19 },
  { id: 64, productId: 18, authorName: 'Adrian Matei',     rating: 3, title: 'OK dar conexiunile sunt puțin rigide', body: 'Radiatorul funcționează bine, dar tubulatura a necesitat puțin efort la conectare. Nu e un defect major.',                                             date: '2024-09-28', verified: false, helpful: 7  },

  // ── Product 19 — Curea distribuție Mercedes-Benz C-Class ─────────────
  { id: 65, productId: 19, authorName: 'Gabriel Radu',     rating: 5, title: 'Kit complet, calitate excelentă', body: 'Vine cu rol, tensionerul și curea — tot ce ai nevoie. Marcaj clar pentru sincronizare. Mecanicul a confirmat că e calitate OEM.',                           date: '2025-04-07', verified: true,  helpful: 38 },
  { id: 66, productId: 19, authorName: 'Elena Cojocaru',   rating: 5, title: 'Nu riscați cu curea ieftina',   body: 'Am cumpărat înainte o curea mai ieftină și s-a rupt la 30.000 km. Aceasta arată și se simte mult mai solidă. Nu faceți economii la distribuție.',               date: '2025-02-05', verified: true,  helpful: 45 },
  { id: 67, productId: 19, authorName: 'Marian Nistor',    rating: 4, title: 'Bun, dar necesită service',     body: 'Produsul e excelent, dar dacă nu ai experiență cu distribuțiile, mergi la service. Nu e o lucrare de acasă.',                                                  date: '2024-12-22', verified: true,  helpful: 20 },
  { id: 68, productId: 19, authorName: 'Vasile Stan',      rating: 5, title: 'Marcat și ușor de aliniat',    body: 'Curea vine cu marcaje clare pe dinți. Alinierea la punctele de referință a fost simplă. Recomand cu încredere.',                                                date: '2024-11-05', verified: false, helpful: 16 },

  // ── Product 20 — Curea accesorii Volkswagen Golf ──────────────────────
  { id: 69, productId: 20, authorName: 'Bogdan Georgescu', rating: 4, title: 'Schimb simplu și ieftin',      body: 'La Golf 7 1.5 TSI accesul e ușor. Curea s-a montat în 20 minute. Funcționează perfect, fără scârțâituri.',                                                     date: '2025-03-14', verified: true,  helpful: 12 },
  { id: 70, productId: 20, authorName: 'Diana Ionescu',    rating: 5, title: 'Calitate bună, preț mic',      body: 'Față de cureaua Gates sau Continental, asta costă mai puțin dar ține la fel. Schimb preventiv recomandat la 60.000 km.',                                        date: '2025-01-06', verified: true,  helpful: 9  },
  { id: 71, productId: 20, authorName: 'Paul Moldovan',    rating: 3, title: 'Medie',                        body: 'Face treabă, dar după 40.000 km a început să scârțâie ușor. Originalul ContiTech a ținut 65.000 km. Depinde ce așteptări aveți.',                               date: '2024-10-08', verified: false, helpful: 11 },
  { id: 72, productId: 20, authorName: 'Cristina Stoica',  rating: 5, title: 'Livrare rapidă, produs conform', body: 'Livrat în 24h. Curea identică ca dimensiuni cu originalul. Montaj simplu, mulțumită de achiziție.',                                                          date: '2024-09-12', verified: true,  helpful: 7  },
];
