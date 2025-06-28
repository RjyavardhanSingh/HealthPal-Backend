# HealthPal Backend API

A comprehensive healthcare API built with Node.js, Express, and MongoDB that powers the HealthPal telemedicine platform.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/username/HealthPal.git

# Navigate to server directory
cd HealthPal/Server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

## 📋 Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Firebase Admin SDK** - User management
- **Socket.io** - Real-time communication
- **Cloudinary** - File storage
- **Stripe** - Payment processing
- **Google Gemini AI** - Health assistant
- **Agora SDK** - Video consultations

## 🗂️ Project Structure

```
Server/
├── config/                  # Configuration files
│   ├── cloudinary.js        # Cloudinary setup
│   ├── firebase-admin.js    # Firebase setup
├── controllers/             # Request handlers
│   ├── aiController.js      # AI assistant
│   ├── appointmentController.js
│   ├── authController.js    # Authentication
│   ├── consultationController.js
│   ├── doctorController.js
│   ├── fileController.js
│   ├── medicalRecordController.js
│   ├── notificationController.js
│   ├── patientController.js
│   ├── paymentController.js
│   └── prescriptionController.js
├── middlewares/             # Custom middlewares
│   ├── auth.js              # Auth middleware
│   └── roleAuth.js          # Role-based access
├── models/                  # Database models
│   ├── Appointment.js
│   ├── Doctor.js
│   ├── MedicalRecord.js
│   ├── Patient.js
│   ├── Person.js           # Base user model
│   └── Prescription.js
├── routes/                  # API routes
│   ├── aiRoutes.js
│   ├── appointmentRoutes.js
│   ├── authRoutes.js
│   └── ...
├── scripts/                 # Utility scripts
│   └── createAdmin.js       # Admin creation script
├── services/                # Reusable services
├── .env                     # Environment variables
├── Server.js               # Application entry point
├── seed.js                 # Database seeding
└── package.json            # Dependencies
```

## ⚙️ Setup & Installation

### Prerequisites

- Node.js 18.x
- MongoDB Atlas account
- Firebase project (for authentication)
- Cloudinary account (for file storage)
- Stripe account (for payments)
- Google Gemini API key (for AI assistant)

### Installation Steps

```bash
# Clone the repo
git clone https://github.com/username/HealthPal.git
cd HealthPal/Server

# Install dependencies
npm install

# Create and configure .env file
cp .env.example .env

# Edit .env with your credentials
nano .env

# Seed the database (optional)
node seed.js

# Create admin user
node scripts/createAdmin.js "Admin Name" "admin@example.com" "password"

# Start development server
npm run dev

# Start production server
npm start
```

### Environment Variables

```bash
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/HealthPal
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Agora Configuration
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_certificate

# Admin Configuration
ADMIN_EMAIL=admin@healthpal.com
ADMIN_PASSWORD=your_admin_password

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# Firebase Configuration
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your_client_x509_cert_url
FIREBASE_UNIVERSE_DOMAIN=googleapis.com
```

## 🔐 Authentication

The API supports multiple authentication methods:

- **Firebase Authentication** - For Google sign-in and email/password
- **JWT Token** - Used internally after authentication
- **Role-based access control** - Different permissions for patients, doctors, and admins

Authentication flow:
1. Client authenticates with Firebase
2. Client sends Firebase token to server
3. Server verifies token with Firebase Admin SDK
4. Server generates JWT token for subsequent requests
5. Client includes JWT token in Authorization header

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Login with Google
- `POST /api/auth/admin-login` - Admin login
- `GET /api/auth/me` - Get current user profile

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get specific doctor
- `PUT /api/doctors/:id` - Update doctor profile
- `POST /api/doctors/:id/reviews` - Add review for doctor
- `GET /api/doctors/:id/availability` - Get doctor availability

### Patients
- `GET /api/patients/:id` - Get patient profile
- `PUT /api/patients/:id` - Update patient profile
- `GET /api/patients/:id/appointments` - Get patient appointments
- `POST /api/patients/:id/medical-documents` - Add medical document

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get appointments
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Medical Records
- `POST /api/medical-records` - Create medical record
- `GET /api/medical-records/patient/:id` - Get patient records
- `PUT /api/medical-records/:id` - Update medical record
- `DELETE /api/medical-records/:id` - Delete medical record

### Prescriptions
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions` - Get prescriptions
- `GET /api/prescriptions/:id` - Get specific prescription
- `PUT /api/prescriptions/:id` - Update prescription

### AI Assistant
- `POST /api/ai/health-assistant` - Query AI health assistant

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent

## 🏥 Key Features

### User Management
- Multi-role system (patients, doctors, admins)
- Profile management
- Doctor verification process

### Appointment System
- Booking appointments with doctors
- Availability management
- Appointment status tracking

### Medical Records
- Digital medical records management
- Document upload and retrieval
- Sharing records with doctors

### Telemedicine
- Video consultations using Agora SDK
- Real-time chat via Socket.io
- Post-consultation follow-ups

### Prescriptions
- Digital prescription creation
- Medication tracking
- Prescription history

### AI Health Assistant
- Health query responses using Google Gemini AI
- Medical information retrieval
- Symptom analysis

### Notifications
- Email notifications
- In-app notifications
- Appointment reminders

## 🛠️ Development

```bash
# Run in development mode with auto-restart
npm run dev

# Lint code
npm run lint

# Run tests (if configured)
npm test

# Seed database with sample data
node seed.js
```

### Creating an Admin User

```bash
# Basic usage
node scripts/createAdmin.js

# Custom admin details
node scripts/createAdmin.js "Admin Name" "admin@example.com" "securepassword"
```

## 🚢 Deployment

The API is configured to deploy on Render.com or similar services.

### Render.com Deployment Steps

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect to GitHub repository
4. Set environment variables
5. Deploy with these settings:
   - Build Command: `npm install`
   - Start Command: `npm start`

### Environment Variables for Production

For production deployment, ensure these environment variables are set:
- `NODE_ENV=production`
- All Firebase credentials
- Database credentials
- API keys for external services

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage report
npm run test:coverage
```

## 📄 License

This project is licensed under the ISC License.

## 👥 Contributors

- Team HealthPal

---

**API URL:** [https://healthpal-api.onrender.com](https://healthpal-api.onrender.com)  
**Documentation:** [https://healthpal-api.onrender.com/api-docs](https://healthpal-api.onrender.com/api-docs)
