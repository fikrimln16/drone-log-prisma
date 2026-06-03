# 🚁 Drone Flight Log Web

Web dashboard untuk mencatat, memonitor, dan mengelola history penerbangan drone/UAV menggunakan Next.js + SQL Database.

---

# ✨ Features

* Dashboard Mission
* Group Flight berdasarkan Mission
* Flight Detail Modal
* Add Flight
* CSV Upload
* CSV Preview Page
* Sort Table ASC / DESC
* Statistics Card
* Responsive Modern UI
* Fixed Navbar
* Validation Form
* SQL Database Integration

---

# 🛠 Tech Stack

## Frontend

* Next.js
* React.js
* Tailwind CSS
* TypeScript

## Backend

* Next.js API Route

## Database

* MySQL / SQL Server

## Library

* papaparse
* lucide-react

---

# 📦 Installation

## 1. Install Node.js

Download Node.js:

https://nodejs.org

Gunakan versi:

* Node.js 20+

Cek instalasi:

```bash
node -v
npm -v
```

---

# 2. Install Git

Download Git:

https://git-scm.com/downloads

Cek instalasi:

```bash
git --version
```

---

# 3. Clone Repository

```bash
git clone https://github.com/fikrimln16/Drone-log.git
```

Masuk ke folder project:

```bash
cd Drone-log
```

---

# 4. Install Dependencies

```bash
npm install
```

---

# 📚 Install Required Packages

```bash
npm install papaparse
npm install lucide-react
npm install mysql2
```

Jika menggunakan SQL Server:

```bash
npm install mssql
```

---

# ⚙️ Setup Environment

Buat file:

```bash
.env.local
```

Isi:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=drone_db
DB_PORT=3306
```

Jika SQL Server:

```env
DB_SERVER=localhost
DB_USER=sa
DB_PASSWORD=yourpassword
DB_DATABASE=drone_db
DB_PORT=1433
```

---

# 🗄 Database Setup

## Create Database

```sql
CREATE DATABASE drone_db;
```

---

# Create Table

```sql
CREATE TABLE drone_flight_history (
    id INT AUTO_INCREMENT PRIMARY KEY,

    flight_date DATE NOT NULL,

    ama VARCHAR(255),

    estate VARCHAR(255),

    flight_id VARCHAR(255),

    mission_name VARCHAR(255),

    battery_id VARCHAR(255),

    battery_id_2 VARCHAR(255),

    battery_color VARCHAR(255),

    start_percent INT,

    end_percent INT,

    start_volt DECIMAL(10,2),

    end_volt DECIMAL(10,2),

    start_time TIME,

    end_time TIME,

    duration_min INT,

    notes VARCHAR(2000)
);
```

---

# 🧹 Reset Table

Hapus semua data:

```sql
DELETE FROM drone_flight_history;
```

Reset auto increment:

```sql
TRUNCATE TABLE drone_flight_history;
```

---

# 🚀 Run Project

## Development

```bash
npm run dev
```

Buka browser:

```txt
http://localhost:3000
```

---

# 📁 Project Structure

```txt
app/
 ├── api/
 ├── missions/
 ├── preview-upload/
 ├── components/
 ├── lib/

components/
 ├── mission-page.tsx
 ├── mission-table.tsx
 ├── upload-csv.tsx
 ├── flight-detail-modal.tsx
 ├── add-flight-model.tsx
```

---

# 📤 CSV Upload Format

Example CSV:

```csv
flight_date,ama,estate,flight_id,mission_name,battery_id,battery_id_2,battery_color,start_percent,end_percent,start_volt,end_volt,start_time,end_time,duration_min,notes
2026-06-01,Muara,MKE,F001,Pikri,9001A/B,9002A/B,Red,100,30,32.00,29.50,08:00:00,08:42:00,42,Normal Flight
```

---

# 🔄 Git Commands

## Add Changes

```bash
git add .
```

## Commit

```bash
git commit -m "update project"
```

## Push

```bash
git push origin main
```

---

# 🔐 GitHub Authentication

GitHub tidak mendukung password biasa.

Gunakan:

* Personal Access Token (PAT)

Generate token:
https://github.com/settings/tokens

---

# 🌐 Deployment

## Deploy to Vercel

Install Vercel CLI:

```bash
npm install -g vercel
```

Deploy:

```bash
vercel
```

---

# 📊 Main Pages

| Page                  | Description        |
| --------------------- | ------------------ |
| `/`                   | Mission Dashboard  |
| `/missions/[mission]` | Mission Detail     |
| `/preview-upload`     | CSV Preview Upload |

---

# 🎨 UI Features

* Modern Dashboard
* Glassmorphism Navbar
* Sticky Header
* Sortable Table
* Stats Card
* Responsive Layout
* Scrollable Table
* Large Modal Design

---

# 🧠 Future Improvement

* Authentication
* User Management
* Export Excel
* Analytics Chart
* Battery Health Monitoring
* Flight Map Visualization
* Drone Status Monitoring
* Upload History
* Bulk Edit CSV

---

# 👨‍💻 Author

Developed by Fikri Maulana
