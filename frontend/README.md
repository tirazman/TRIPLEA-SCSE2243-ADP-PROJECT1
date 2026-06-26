# e-Urus PDK Project

## Prerequisites

Before running this project, make sure you have installed:

- Node.js (v18 or above recommended)
- npm (comes together with Node.js)

Check the installation:

```bash
node -v
npm -v
```

---

## Project Setup

Go to the frontend folder:

```bash
cd frontend
```

Install project dependencies (first time only)
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The application will be available at:
http://localhost:5173



## Frontend Routing
Continuation after main localhost link above : 
| URL | Description |
|------|-------------|
| `/` | Login Interface |
| `/pembantu-tadbir` | Pembantu Tadbir Dashboard |
| `/ketua-jabatan` | Ketua Jabatan Dashboard |
| `/ketua-bahagian` | Ketua Bahagian Dashboard |
| `/pegawai-penyedia` | Pegawai Penyedia Laporan Dashboard |
| `/pegawai-penyelaras` | Pegawai Penyelaras Bahagian Dashboard |

---

## Development Notes

- This project is currently **Frontend Only**.
- Authentication is not integrated yet.
- Backend and database integration will be added later.
- Dummy data is currently used for UI development.

---

## Current Tech Stack

- React.js
- Vite
- React Router DOM
- CSS