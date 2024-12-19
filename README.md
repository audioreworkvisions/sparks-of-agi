# AVA-App

## Projektbeschreibung

Die **AVA-App** ist eine Desktop-Anwendung, die Electron, Vue.js und Python integriert, um eine vielseitige Benutzererfahrung zu bieten. Ziel der Anwendung ist es, Benutzern die Erstellung, Verwaltung und Bearbeitung von Dateien zu erleichtern. Zusätzlich wird eine Kamera-Stream-Komponente und eine Integration für KI-gestützte Interaktionen bereitgestellt.

---

## Features

- **Electron-Integration**: Plattformübergreifende Unterstützung für Windows, Mac und Linux.
- **Vue.js-Frontend**: Ein modernes, responsives UI mit separaten Komponenten.
- **Python-Backend**: Eine Python-Schnittstelle zur Verarbeitung von Benutzeranfragen.
- **Kamera-Stream**: Integration einer Kamera-Komponente.
- **Prompt-basiertes Interface**: Unterstützung für benutzerdefinierte Eingabeaufforderungen.

---

## Voraussetzungen

### Software

- Node.js (Version >= 16)
- Python (Version >= 3.10)
- Paketmanager (npm oder yarn)

### Installierte Bibliotheken

- Electron
- Vue.js
- Vite
- Electron Builder
- Abhängigkeiten des Python-Backends

### Hardware

- Mindestens 4 GB RAM (8 GB empfohlen)
- 1 GB freier Speicherplatz

---

## Installation

### 1. Repository klonen

```bash
git clone https://github.com/audioreworkvisions/ava-app.git
cd ava-app
```

### 2. Abhängigkeiten installieren

```bash
npm install
```

### 3. Virtuelle Umgebung für Python einrichten

```bash
python -m venv .venv
source .venv/bin/activate # (Windows: .venv\Scripts\activate)
pip install -r requirements.txt
```

---

## Nutzung

### Entwicklungsmodus starten

```bash
npm run dev
```

- Öffnet ein lokales Fenster mit dem Vue.js-Frontend.
- Startet das Python-Backend automatisch.

### Anwendung bauen

```bash
npm run build
```

Erstellt die Anwendung für die Produktion. Das Ergebnis befindet sich im Ordner `release/`.

### Anwendung ausführen

Navigiere in den Ordner `release/` und starte die ausführbare Datei:

```bash
release/ava-app.exe
```

---

## Projektstruktur

```
ava-app/
|-- dist/                 # Produktionsdateien
|-- dist-electron/        # Electron-spezifische Dateien
|-- src/                 
|   |-- components/       # Vue-Komponenten
|   |-- assets/           # Statische Dateien (Bilder, CSS)
|   |-- App.vue           # Haupt-Vue-Komponente
|-- package.json          # Node.js-Projektdatei
|-- electron-builder.json5 # Electron Build-Konfiguration
|-- main.js               # Electron-Hauptprozess
|-- preload.mjs           # Preload-Skript für Electron
|-- assistant.py          # Python-Skript für Backend
```

---

## Wichtige Dateien

- **`main.js`**: Steuert das Electron-Hauptfenster und die Python-Integration.
- **`assistant.py`**: Skript für die Verarbeitung der Backend-Logik.
- **`preload.mjs`**: Verbindet Electron mit Vue.js.

---

## Bekannte Probleme

1. \*\*Fehler: \*\***`Python Backend beendet`**

   - Überprüfen, ob die Datei `assistant.py` existiert.
   - Sicherstellen, dass Python richtig installiert ist.

2. \*\*Fehler: \*\***`out of memory allocating heap arena map`**

   - Setze die Umgebungsvariable `NODE_OPTIONS`:
     ```bash
     set NODE_OPTIONS=--max-old-space-size=4096
     ```

3. **Anwendung startet nicht**

   - Stelle sicher, dass alle Abhängigkeiten installiert wurden.
   - Überprüfe die Python-Version und aktivierte virtuelle Umgebung.

---

## Entwicklung und Tests

### Linter ausführen

```bash
npm run lint
```

### Tests ausführen

Testskripte können in einem separaten Ordner `tests/` hinzugefügt werden. Verwende `jest` für JavaScript-Tests und `pytest` für Python.

```bash
npm run test
```

---

## Mitwirken

Wir freuen uns über Beiträge! Bitte beachte die folgenden Schritte:

1. Forke das Repository.
2. Erstelle einen neuen Branch für deine Änderungen.
3. Führe Pull Requests gegen den Hauptzweig ein.

---

## Lizenz

Dieses Projekt steht unter der **MIT-Lizenz**. Siehe [LICENSE](./LICENSE) für weitere Informationen.

