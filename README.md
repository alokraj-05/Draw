# Draw

> Draw is a web-based diagramming application that enables users to create flowcharts, diagrams, and visual notes. Key to this project is its integration with Google Drive; users authenticate via their Google accounts, and all diagrams are stored directly in their personal Google Drive storage rather than on a local device or third-party server.



## Features

- [x] All-in-One Diagram Management: Create, edit, and organize flowcharts, diagrams, and visual notes in a single place without switching between multiple tools or file systems.

- [x] Seamless Google Drive Integration: Diagrams are saved directly to the user’s Google Drive, making file management simple, familiar, and reliable.

- [x] Effortless Access Across Devices: Since everything lives in Drive, users can open and continue working on their diagrams from any device with zero manual syncing.

- [x] Intuitive Visual Editing: Easily add shapes, connectors, and structured layouts to represent logic, processes, or ideas with minimal setup.

- [x] No Local or Third-Party Storage Hassle: Eliminates the need for separate storage solutions, backups, or exports — everything is handled automatically through Google Drive.



## Tech Stack

**- Language:** TypeScript

**- Storage: Google** Drive API v3

**- Authentication:** Google OAuth 2.0

**- Frontend:** React (TypeScript)

**- Backend:** Node.js / Express



## Prerequisites

To run this project locally, you need:

\- Node.js (v16 or higher)

\- npm or yarn

\- A Google Cloud Platform account with a project enabled.



**Setup and Installation**

**Google Cloud Configuration**

> This project requires Google API credentials to handle login and storage.


```bash

1. Go to the Google Cloud Console.

2. Create a new project.

3. Enable the Google Drive API and Google Identity Platform.

4. Configure the OAuth Consent Screen.

5. Create credentials for an OAuth Client ID.
```

   **- Authorized JavaScript origins: `http://localhost:5173`**

   **- Authorized redirect URIs: `http://localhost:5173`**

**6. Copy your Client ID and API Key.**