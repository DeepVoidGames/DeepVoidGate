### **Game Design Document (GDD): DeepvoidGate**

**Gatunek**: Przeglądarkowa Space Idle/Management Game  
**Platforma**: Przeglądarka, ewentualnie mobilna.  
**Cel**: Połączenie głębokiego grindingu, strategicznego zarządzania kolonią i klimatu walki o przetrwanie bez systemu prestiżowego resetu.

---

### **1. Ogólny Opis**

- **Fabuła**: Ludzkość kolonizuje ostatnią planetę **Nowa Nadzieja** po zagładzie Ziemi. Gracz zarządza zasobami, ludnością i technologią, by odbudować cywilizację i odkrywać kosmos.
- **Kluczowe Motywy**: Przetrwanie, etyczne wybory, eksploracja, długoterminowe inwestycje.
- **Ton**: Mroczny sci-fi z nutą nadziei (np. holograficzne wspomnienia Ziemi).

---

### **2. Podstawowe Mechaniki**

#### **Zasoby**

1. **Podstawowe**:

   - **Tlen (O₂)**: Utrzymuje populację. Produkowany przez generatory.
   - **Żywność (Food)**: Hodowana w farmach hydroponicznych.
   - **Energia (Energy)**: Z reaktorów słonecznych/geotermalnych.
   - **Metale (Metals)**: Wydobywane z asteroid i planet.
   - **Nauka (Science)**: Generowana przez laboratoria, odblokowuje technologie.

2. **Ludność**:
   - **Pracownicy**: Przydzielani do budynków, by utrzymać 100% wydajności.
   - **Maksymalna populacja**: Zwiększana przez schroniska.

#### **System Pracowników**

- Każdy budynek ma **wymaganą liczbę pracowników** (np. kopalnia: 5).
- **Wydajność**: `min(1, przypisani_pracownicy / wymagani_pracownicy)`.
- **Kary za niedobór**:
  - <100% pracowników → spada wydajność (np. 3/5 → 60%).
  - Długotrwały niedobór → awarie (–20% wydajności).

#### **Budynki i Produkcja**

- **Przykłady budynków**:  
  | **Nazwa** | **Funkcja** | **Koszt** (wzór) |  
  |-----------------|---------------------------------------|------------------------------------|  
  | Generator O₂ | Produkuje tlen | `100 * 1.6ⁿ metali + 20n energii` |  
  | Kopalnia metali | Wydobywa metale | `50 * 1.8ⁿ metali + 10 * 2ⁿ energii` |  
  | Holograficzny Teatr | Zwiększa morale | `200 metali + 50 energii` |

- **Globalne bonusy**: Każdy zakupiony budynek daje stały +0.1% do produkcji danego zasobu.

---

### **3. Progresja i Endgame**

#### **Wieczne Cele**

- **Megastruktury**:  
  | **Nazwa** | **Efekt** | **Koszt** |  
  |-----------------|---------------------------------------|----------------------|  
  | Dyson Sphere | +50% energii na zawsze | 1e18 Energy + 1e15 Metals |  
  | Arka | Odblokuj nowe planety | 5e16 Science |

#### **Technologie**

- Drzewko technologiczne z **mnożnikowymi bonusami** (np. +20% do wydajności farm).
- **Przykładowe gałęzie**:
  - **Automatyzacja**: Redukuje wymaganą liczbę pracowników o 10% na poziom.
  - **Kolonizacja**: Odblokuj nowe planety z unikalnymi zasobami.

#### **Morale**

- Wpływa na **maksymalną wydajność budynków** i szanse na **krytyczną produkcję**.
- **Zwiększaj przez**:
  - Budynki kulturalne (teatry, stadiony).
  - Eventy (koncerty, święta).

---

### **4. Wydarzenia i Wyzwania**

- **Losowe eventy** (co 15-60 minut):  
  | **Typ** | **Efekt** |  
  |-----------------|---------------------------------------|  
  | Burza słoneczna | +200% energii, –50% O₂ przez 1h |  
  | Atak piratów | Kradzież 20% metali, ale +5% do obrony |  
  | Epidemia | Wybierz: kwarantanna (–30% produkcji) lub ryzyko rozprzestrzenienia |

---

### **5. Warstwa Wizualna i UI**

- **Styl artystyczny**:
  - **Planeta**: Mroczne, industrialne habitaty z neonowymi akcentami.
  - **Kosmos**: Minimalistyczne, proceduralne generowanie gwiazd/planet.
- **Interfejs**:
  - **Panel główny**: Lista budynków z paskami wydajności i przypisanymi pracownikami.
  - **Mapa galaktyki**: Klikalne planety/asteroidy z informacjami o zasobach.
  - **Wykresy**: Dla hardcorowych graczy (np. produkcja O₂ w czasie).

---

### **6. Monetyzacja i Społeczność**

- **Kosmetyki**: Skóry budynków (np. "Retro-Ziemia") za rzeczywiste pieniądze.
- **Kooperacja**: Wspólne projekty z innymi graczami (np. budowa mostu nadprzestrzennego).
- **Ethical DLC**: Fabularne rozszerzenia (np. "Prawo dla AI" z nowymi dylematami).

---

### [**7. Roadmapa**](/docs/pl/roadmap.md)

---

### **Podsumowanie**

Ten GDD koncentruje się na:

- **Głębokim grindzie** bez resetów, z wiecznymi celami.
- **Strategicznym zarządzaniu** pracownikami i morale.
- **Klimatycznej narracji** o ostatniej kolonii ludzkości.
