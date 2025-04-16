# Szyfr Kosmicznych Kolonistów

## Wprowadzenie

W świecie gry "DeepvoidGate" komunikacja międzyplanetarna jest kluczowym elementem przetrwania kolonii. Z powodu zagrożeń ze strony piratów kosmicznych i wrogich frakcji, koloniści opracowali unikalny system szyfrowania wiadomości, znany jako "Szyfr Kosmicznych Kolonistów" (SKK). Ten dokument przedstawia zasady działania szyfru, który gracze będą musieli rozszyfrowywać podczas eksploracji opuszczonych stacji, odblokowywania tajnych dokumentów czy komunikacji z innymi frakcjami.

## Podstawy szyfru

Szyfr Kosmicznych Kolonistów łączy w sobie elementy kilku klasycznych metod szyfrowania z futurystycznym kontekstem kosmicznym.

### 1. Galaktyczna Tabela Podstawień

Podstawą szyfru jest 6x6 tabela podstawień, zawierająca litery alfabetu łacińskiego oraz cyfry:

```
    | 1 | 2 | 3 | 4 | 5 | 6 |
----|---|---|---|---|---|---|
  1 | A | B | C | D | E | F |
  2 | G | H | I | J | K | L |
  3 | M | N | O | P | Q | R |
  4 | S | T | U | V | W | X |
  5 | Y | Z | 0 | 1 | 2 | 3 |
  6 | 4 | 5 | 6 | 7 | 8 | 9 |
```

Każda litera/cyfra jest reprezentowana przez parę współrzędnych w tabeli. Na przykład:

- "A" = 11 (rząd 1, kolumna 1)
- "P" = 34 (rząd 3, kolumna 4)
- "7" = 64 (rząd 6, kolumna 4)

### 2. Kluczowanie Orbitalne

Każda wiadomość jest szyfrowana przy użyciu "klucza orbitalnego", który jest sekwencją liczb od 1 do 6, reprezentującą orbity planet w systemie gwiezdnym kolonii.

Przykładowy klucz orbitalny: `3-1-5-2-4-6`

Klucz orbitalny wpływa na szyfrowanie w następujący sposób:

1. Pierwsza liczba z klucza (w tym przypadku 3) jest dodawana do pierwszej współrzędnej pierwszego znaku
2. Druga liczba z klucza (1) jest dodawana do drugiej współrzędnej pierwszego znaku
3. Proces jest powtarzany dla kolejnych znaków, cyklicznie wykorzystując klucz

Jeśli po dodaniu suma przekracza 6, wracamy do 1 (operacja modulo 6, ale z wartością 6 zamiast 0).

### 3. Gwiazdowe Przekształcenie

Po przekształceniu wszystkich znaków, dodajemy specjalne symbole gwiazdowe między parami cyfr:

- ⋆ (gwiazdka) - między cyframi tego samego znaku
- ≋ (potrójny znak równości) - między różnymi znakami
- ⊛ (gwiazdka w kółku) - co 5 znaków, dla ułatwienia odczytu

## Przykład szyfrowania

Zaszyfrujmy słowo "BASE" używając klucza orbitalnego `3-1-5-2-4-6`:

1. B = 12 (rząd 1, kolumna 2)

   - Dodajemy pierwszy element klucza (3,1): 1+3=4, 2+1=3
   - B → 43

2. A = 11 (rząd 1, kolumna 1)

   - Dodajemy drugi element klucza (5,2): 1+5=6, 1+2=3
   - A → 63

3. S = 41 (rząd 4, kolumna 1)

   - Dodajemy trzeci element klucza (4,6): 4+4=8→2 (przekroczenie 6), 1+6=7→1
   - S → 21

4. E = 15 (rząd 1, kolumna 5)
   - Dodajemy czwarty element klucza (2,4): 1+2=3, 5+4=9→3 (przekroczenie 6)
   - E → 33

Po dodaniu symboli gwiazdowych:
`4⋆3≋6⋆3≋2⋆1≋3⋆3`

A z dodatkowym symbolem co 5 znaków dla czytelności:
`4⋆3≋6⋆3⊛≋2⋆1≋3⋆3`

## Zastosowanie w grze

### Tajne dokumenty

Gracze będą napotykać zaszyfrowane wiadomości w opuszczonych stacjach badawczych, które zawierają cenne informacje o rzadkich surowcach, technologiach lub koordynatach ukrytych kolonii.

### System misji

Niektóre zadania będą wymagały rozszyfrowania wiadomości, aby odkryć lokalizację celu misji lub istotne detale.

### Interakcje z frakcjami

Przy nawiązywaniu pierwszego kontaktu z nieznanymi frakcjami, komunikacja początkowo będzie szyfrowana. Rozszyfrowanie wiadomości pomoże zrozumieć intencje i uzyskać dyplomatyczną przewagę.

### Elementy rozgrywki

- Gracze mogą zdobywać fragmenty kluczy orbitalnych podczas eksploracji
- Specjalni członkowie załogi (kryptografowie) mogą przyspieszać proces deszyfrowania
- Ulepszenia centrum komunikacyjnego kolonii odblokowują automatyczne narzędzia deszyfrujące

## Mechanika zdobywania kluczy

Klucze orbitalne można zdobyć poprzez:

1. Badanie starożytnych artefaktów
2. Analizę wzorców orbitalnych w nieznanych systemach gwiezdnych
3. Hackowaniem komputerów wrogich frakcji
4. Wymianę dyplomatyczną z przyjaznymi koloniami

## Implementacja w interfejsie gry

Gdy gracz napotka zaszyfrowaną wiadomość, interfejs gry powinien:

1. Wyświetlić zaszyfrowany tekst z odpowiednimi symbolami gwiazdowymi
2. Udostępnić pole do wprowadzenia klucza orbitalnego (jeśli gracz go posiada)
3. Pokazać proces deszyfracji po wprowadzeniu poprawnego klucza
4. Opcjonalnie: zaoferować podpowiedzi za określoną cenę zasobów

---

_Niniejszy dokument jest własnością intelektualną twórców gry "DeepvoidGate". Wykorzystanie systemu szyfrowania poza grą jest dozwolone pod warunkiem uznania autorstwa._
