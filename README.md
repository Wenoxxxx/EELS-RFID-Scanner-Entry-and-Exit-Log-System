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
- RESTful API for logs and registered users
- Secure communication between frontend and IoT devices
- Scalable and modular architecture

### IoT Prototype
- RFID scanner integration for physical access control
- Registered card validation (Step 3 setup)
- Tested using Arduino / NodeMCU hardware
- Real-time data transmission to backend

---

## Tech Stack

| Layer        | Technology              |
|--------------|--------------------------|
| Frontend     | React, Vite              |
| Backend      | Node.js, Express.js      |
| Database     | Pluggable / Future       |
| IoT          | RFID, Arduino, NodeMCU   |
| Communication| REST API                 |

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/EELS.git
cd EELS
2. Setup Frontend
bash
Copy code
cd frontend
npm install
npm run dev
3. Setup Backend
bash
Copy code
cd backend
npm install
npm start
4. IoT Prototype Setup
Connect the RFID scanner to the microcontroller

Upload firmware to handle card scanning and backend communication

Register authorized RFID cards during Step 3 of the setup process

Usage
Launch the frontend to access the dashboard

Scan RFID cards on the IoT prototype

Entry and exit logs update automatically in real time

Future Enhancements
Role-based access control (Admin / User)

Cloud deployment for scalability

Mobile application support

Contributing
Contributions are welcome. Please fork the repository and submit a pull request with your improvements.

License
This project is licensed under the MIT License. See the LICENSE file for details.