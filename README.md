# NEXUS OSINT 🕵️‍♂️🌐

**Nexus OSINT** es una herramienta profesional de visualización y análisis de Inteligencia de Fuentes Abiertas (OSINT) basada en web. Permite a los investigadores mapear relaciones entre entidades (Elementos), enriquecer datos utilizando APIs externas y generar expedientes de inteligencia completos.

![Captura de pantalla de Nexus OSINT](https://raw.githubusercontent.com/ikerbretos/nexus-osint/main/screenshot.png) *(Marcador de posición para la captura)*

## ✨ Características Principales

*   **Visualización de Gráficos**: Gráfico interactivo de fuerza dirigida para visualizar conexiones entre IPs, Dominios, Emails y más.
*   **Análisis de Línea de Tiempo**: Vista cronológica de eventos asociados con cada elemento para entender la secuencia de actividades.
*   **Generador de Expedientes de Inteligencia**: Genera informes PDF profesionales con un diseño estilo "Dossier" (sin tablas genéricas). Extrae y fotea automáticamente todos los puntos de datos conocidos para cada elemento.
*   **Enriquecimiento de Datos**: Base integrada para APIs como Shodan, VirusTotal y Hunter.io para recopilar automáticamente más información sobre los objetivos.
*   **Gestión de Casos**: Crea, guarda y cambia entre múltiples casos de investigación.
*   **Interfaz Moderna**: Interfaz con estética "Cyber" con modo oscuro, glassmorphism y controles intuitivos.

## 🚀 Comenzando

Sigue estas instrucciones para obtener una copia local en funcionamiento para propósitos de desarrollo y prueba.

### Requisitos Previos

*   [Node.js](https://nodejs.org/) (v16 o superior)
*   [npm](https://www.npmjs.com/) (generalmente viene con Node.js)
*   [Git](https://git-scm.com/)

### Instalación

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/ikerbretos/nexus-osint.git
    cd nexus-osint
    ```

2.  **Instalar Dependencias del Backend**
    ```bash
    cd backend
    npm install
    ```

3.  **Configurar la Base de Datos**
    Inicializa la base de datos SQLite con Prisma.
    ```bash
    # Asegúrate de estar en la carpeta backend
    npx prisma migrate dev --name init
    ```

4.  **Instalar Dependencias del Frontend**
    ```bash
    cd ../frontend
    npm install
    ```

### 🏃‍♂️ Ejecutando la Aplicación

Necesitas ejecutar tanto el servidor backend como el frontend. Abre dos terminales:

**Terminal 1: Backend**
```bash
cd backend
npm run dev
```
*La API del backend iniciará en el puerto `3001`.*

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev
```
*La aplicación frontend iniciará en el puerto `5173` (generalmente).*

Accede a la herramienta abriendo tu navegador y navegando a:
**http://localhost:5173**

## 🛠️ Tecnologías Utilizadas

*   **Frontend**: React, TypeScript, Tailwind CSS, Lucide Icons, React Force Graph (implementación personalizada).
*   **Backend**: Node.js, Express.
*   **Base de Datos**: SQLite (vía Prisma ORM).
*   **Exportación**: HTML-to-Image, jsPDF (implementación personalizada).

## 📝 Guía de Uso

1.  **Crear un Caso**: Comienza creando un nuevo caso de investigación.
2.  **Añadir Elementos**: Usa la barra lateral para añadir objetivos (IPs, Emails, etc.) al gráfico.
3.  **Enriquecer Datos**: Haz clic en un elemento y presiona "Enrich" para obtener datos externos (requiere claves API en Configuración).
4.  **Conectar**: Dibuja enlaces entre elementos para visualizar relaciones.
5.  **Línea de Tiempo**: Usa el panel de línea de tiempo para ver datos temporales.
6.  **Informe**: Haz clic en el icono de "Impresora" para generar un expediente PDF completo de tu investigación.

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Siéntete libre de enviar un Pull Request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.
