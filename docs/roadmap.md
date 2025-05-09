# DeepvoidGate Roadmap — System Frakcji: Eventy i UI

## Etap rozwoju: Mid / Late Alpha

---

## 🧩 1. Dynamiczne eventy frakcyjne (modale co 1–3h)

### 🎯 Cel
Wprowadzenie systemu fabularnych wydarzeń związanych z napięciami/frakcjami, wpływających na lojalność, produkcję, zasoby i przyszłe zdarzenia.

### ✅ Wymagania wstępne
- System frakcji i lojalności musi działać.
- Minimum jedna frakcja odblokowana.
- Mechanika offline / online tickowania czasu obecna.

### 🔧 Funkcjonalności

- [ ] Event scheduler: co 1–3h, aktywowany online lub push offline.
- [ ] Warunki pojawienia: np. dominacja frakcji, stan lojalności, konflikty.
- [ ] Parser eventów (format JSON/TS): tytuł, opis, wybory, efekty.
- [ ] System efektów: boosty tymczasowe, zmiany zasobów, follow-upy.
- [ ] Narracyjny engine: event chaining, tagi (np. {ryzyko}, {zysk krótkoterminowy}).
- [ ] Min. 10 gotowych eventów fabularnych.

### 📝 Przykład JSON eventu

```json
{
  "id": "tech_vs_bio_energy_offer",
  "title": "Technokratyczny Cień",
  "description": "Syndykat Technokratów oferuje wsparcie w optymalizacji energii...",
  "options": [
    {
      "text": "Przyjmij pomoc",
      "effects": {
        "loyalty": {"Technocrats": 300, "Biogenesis": -150},
        "boosts": {"EnergyProduction": 0.05, "duration": 3600}
      }
    },
    {
      "text": "Zignoruj",
      "effects": {"loyalty": {"Biogenesis": 100}}
    }
  ]
}
