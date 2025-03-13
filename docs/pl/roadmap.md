### **Roadmapa**

Poniższa roadmapa dzieli projekt na **etapy**, każdy z nich zawiera kluczowe funkcjonalności do zaimplementowania. Kolejność została dobrana tak, aby jak najszybciej stworzyć działający prototyp i stopniowo rozbudowywać grę.

---

## **🟢 Etap 1: Podstawowy Prototyp (Minimalna grywalna wersja - MVP)**

**Cel**: Stworzenie działającego systemu zasobów i pracowników, który pozwala na podstawową rozgrywkę.

🟩 **1. Struktura projektu**

- Inicjalizacja repozytorium
- Podział plików zgodnie z zaprojektowaną strukturą

🟩 **2. Podstawowa logika gry**

- Implementacja systemu zasobów (tlen, żywność, energia, metale, nauka)
- System pracowników (przydzielanie do budynków, wpływ na wydajność)
- Logika produkcji zasobów

🟩 **3. Interfejs użytkownika**

- UI panelu zasobów
- UI listy budynków z możliwością ich budowy i przydzielania pracowników

🟩 **4. System zapisu i odczytu stanu gry**

- Zapisywanie postępu w `IndexedDB` (Dexie.js)
- Mechanizm ładowania stanu po ponownym uruchomieniu

---

## **🔴 Etap 2: Rozszerzenie mechanik i UX**

**Cel**: Poprawa interakcji, dodanie podstawowych ograniczeń i wizualizacji.

🔲 **5. System morale**

- Implementacja wartości morale
- Wpływ morale na wydajność

🟩 **6. Balans i ograniczenia**

- Wymagania pracowników do działania budynków
- Ustalanie kosztów budowy i zużycia zasobów

🟩 **7. Animacje i poprawa UI**

- Wykresy pokazujące zmiany w produkcji
- Lepsza wizualizacja zasobów i populacji

---

## **🔴 Etap 3: System wydarzeń i progresja**

**Cel**: Dodanie większej głębi i wyzwań do rozgrywki.

🔲 **8. Losowe wydarzenia**

- Implementacja systemu zdarzeń losowych (np. burza słoneczna, atak piratów)
- UI powiadomień o zdarzeniach

🔲 **9. Drzewko technologiczne**

- Implementacja podstawowych technologii
- Integracja technologii z budynkami

---

## **🔴 Etap 4: Zaawansowana rozgrywka i optymalizacja**

**Cel**: Rozszerzenie endgame’u, poprawa wydajności i user experience.

🔲 **10. Megastruktury**

- Implementacja systemu megastruktur
- Efekty megastruktur w ekonomii gry

🔲 **11. Optymalizacja wydajności**

- Redukcja liczby renderów
- Poprawa zarządzania pamięcią

🔲 **12. Testy i poprawki balansu**

- Beta testy i analiza balansu
- Poprawki pod feedback użytkowników
