# EELS – Entry and Exit Log System

EELS (Entry and Exit Log System) is a modern access logging platform designed to track entry and exit activities using a web-based interface and IoT integration. It combines a React + Vite frontend, an Express.js backend, and an RFID-based IoT prototype for secure and seamless access management.

---

## Features

### Frontend (React + Vite)
- Fast and responsive UI powered by Vite
- Real-time entry and exit log visualization
- Clean dashboard interface
- User-friendly RFID card registration

### Backend (Express.js)
- Secure communication between frontend and IoT devices
- Scalable and modular architecture

### IoT Prototype
- RFID scanner integration for physical access control
- Tested using Arduino / ESP32 hardware
- Real-time data transmission to backend

---

## Tech Stack

| Layer         | Technology            |
|---------------|-----------------------|
| Frontend      | React, Vite           |
| Backend       | Node.js, Express.js   |
| Database      | MySQL                 |
| IoT           | RFID, Arduino / ESP32 |
| Communication | REST API              |

---

## Installation


### 1. Clone the repository
```bash
git clone https://github.com/your-username/EELS.git
cd EELS
```

### 2. Setup frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Setup backend
```bash
cd backend
npm install
npm run start
```
<em><strong>NOTE: Without RFID (IoT) will result as an error for the backend to fetch data.</strong></em>


### 4. IoT Prototype
- Connect RFID scanner to microcontroller.
- Upload firmware to handle card scanning and communication with backend.


### Usage
- Launch the frontend to access the dashboard.
- Scan RFID cards at the IoT prototype.
- Logs will automatically update in the system.
- Can export summary logs within specific date selected.


### Future Enhancements
- Role-based access control (Admin, User).
- Cloud deployment for scalability.


### Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your improvements.


### Author
<em>Owen M. Jerusalem </em>
