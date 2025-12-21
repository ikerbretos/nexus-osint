# NEXUS OSINT 🕵️‍♂️🌐

**Nexus OSINT** is a professional-grade, web-based Open Source Intelligence (OSINT) visualization and analysis tool. It allows investigators to map relationships between entities (Elements), enrich data using external APIs, and generate comprehensive intelligence dossiers.

![Nexus OSINT Screenshot](https://raw.githubusercontent.com/ikerbretos/nexus-osint/main/screenshot.png) *(Placeholder for screenshot)*

## ✨ Key Features

*   **Graph Visualization**: Interactive force-directed graph to visualize connections between IPs, Domains, Emails, and more.
*   **Timeline Analysis**: Chronological view of events associated with each element to understand the sequence of activities.
*   **Intelligence Dossier Generator**: Generate professional PDF reports with a "Dossier" style layout (no generic tables). Automatically extracts and formats all known data points for every element.
*   **Data Enrichment**: Built-in integration groundwork for APIs like Shodan, VirusTotal, and Hunter.io to automatically gather more info on targets.
*   **Case Management**: Create, save, and switch between multiple investigation cases.
*   **Modern UI**: Cyber-aesthetic interface with dark mode, glassmorphism, and intuitive controls.

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)
*   [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ikerbretos/nexus-osint.git
    cd nexus-osint
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd ../frontend
    npm install
    ```

### 🏃‍♂️ Running the Application

You need to run both the backend and frontend servers. Open two terminal windows:

**Terminal 1: Backend**
```bash
cd backend
npm run dev
```
*The backend API will start on port `3001`.*

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev
```
*The frontend application will start on port `5173` (usually).*

Access the tool by opening your browser and navigating to:
**http://localhost:5173**

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript, Tailwind CSS, Lucide Icons, React Force Graph (custom implementation).
*   **Backend**: Node.js, Express.
*   **Database**: SQLite (via Prisma ORM).
*   **Export**: HTML-to-Image, jsPDF (custom implementation).

## 📝 Usage Guide

1.  **Create a Case**: Start by creating a new investigation case.
2.  **Add Elements**: Use the sidebar to add targets (IPs, Emails, etc.) to the graph.
3.  **Enrich Data**: Click on an element and hit "Enrich" to fetch external data (requires API keys in Settings).
4.  **Connect**: Draw links between elements to visualize relationships.
5.  **Timeline**: Use the timeline panel to view temporal data.
6.  **Report**: Click the "Printer" icon to generate a full PDF dossier of your investigation.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
