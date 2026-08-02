# Professional Monolith MERN Developer Portfolio & Admin Console

A production-style, animated, secure, and fully responsive Developer Portfolio built using the **MERN (MongoDB, Express, React, Node)** stack. The portal allows administrative CRUD controls over all portfolio sections (about, experiences, skills, education, projects) alongside email contact message inbox management directly from a protected Admin Console dashboard.

---

## 🚀 Key Features

* **Dynamic Portfolio Sections**: Dynamic profiles, technical skill categorization blocks, timeline history logs, academic grids, and showcase cards loaded directly from database APIs.
* **Responsive Layouts**: Desktop persistent sidebars and mobile sliding navigation drawer components for the Admin Console panels.
* **Secure JWT Cookies Session**: Verification tokens signed and issued inside HttpOnly, Secure, SameSite=None cookie attributes to prevent client script extraction (XSS protection).
* **Technical Validators**: Input type validations, Joi-style length restrictions, and email regex match guards.
* **Dynamic Media Uploading**: Raw multipart file buffers parsed in RAM memory via Multer and streamed to Cloudinary folders (prevents server disk overflow).
* **Persistent Themes**: Automatic dark/light theme switching with preference stored in browser `localStorage` (defaulting to Dark Developer style).
* **Animated Elements**: Scroll reveals, stagger load reveals, hover card zooms, and transitions designed using `framer-motion`.
* **API Rate Limiting**: Limit protection policies on login triggers (Max 5 per 15m) and contact form posts (Max 3 per hour) to block brute force spam attacks.
* **Database Seeding**: Programmatic initial seed script `npm run seed` to setup default admin profile and sample portfolio logs.

---

## 🛠️ Technology Stack

* **Frontend**: React.js, Vite, Tailwind CSS, React Router, Axios, Framer Motion, Lucide React, React Icons.
* **Backend**: Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), BCryptJS, Multer, Cloudinary, Cookie Parser, Express Rate Limit.
* **Database**: MongoDB Atlas.
* **Hosting**: Frontend Vercel, Backend Render API services.

---

## 📂 Folder Architecture

```text
MyProtfolio/
├── client/                     # React Frontend (Vite)
│   ├── public/                 # Static asset folders
│   ├── src/
│   │   ├── assets/             # Global styles and static icons
│   │   ├── components/         # Common UI components (Buttons, skeletons, theme toggle)
│   │   │   └── dashboard/      # Admin dashboard sub-panels (overview, profile, projects, etc)
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── hooks/              # Custom hooks (useTheme, useAuth)
│   │   ├── layouts/            # PublicLayout, AdminLayout drawer wrappers
│   │   ├── pages/              # Landing, Project Details, Login, Dashboard Pages
│   │   ├── sections/           # Scroll landing sections (Hero, About, Skills, timelines)
│   │   └── services/           # Axios HTTP client requests (api, auth, portfolio, message)
│   └── package.json
├── server/                     # Node/Express Backend
│   ├── config/                 # DB, Cloudinary configuration scripts
│   ├── controllers/            # Controller business logics (auth, profile, projects, etc)
│   ├── middleware/             # Auth protect guard, error handler, rate limiters
│   ├── models/                 # Mongoose schema definitions (User, Profile, Project, etc)
│   ├── routes/                 # Separated Public & Protected Admin endpoint routes
│   ├── services/               # Cloudinary upload helpers
│   ├── utils/                  # DB bootstrap seed scripts
│   └── validators/             # Input schema validation methods
└── package.json                # Root workspace concurrency scripts
```

---

## ⚙️ Local Development Setup

### 1. Prerequisites
* Node.js (v18+)
* MongoDB Atlas Cloud database or local instance.
* Cloudinary credentials folder.

### 2. Environment Configurations

#### Backend Environment (`server/.env`)
Create `server/.env` matching the following configuration variables:
```ini
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=your_32_chars_long_jwt_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Seeding Variables (Optional)
SEED_ADMIN_EMAIL=admin@portfolio.local
SEED_ADMIN_PASSWORD=Admin@2026!
```

#### Frontend Environment (`client/.env`)
Create `client/.env` matching:
```ini
VITE_API_URL=http://localhost:5000/api
```

### 3. Installation & Seeding

At the root directory, install workspace dependencies and seed data:
```bash
# Install root, client, and server packages
npm run install-all

# Bootstrap database collections and default admin user credentials
npm run seed
```

### 4. Running Locally
Run the development environment simultaneously (both Vite client and Nodemon server):
```bash
npm run dev
```
* Frontend client: `http://localhost:5173`
* Backend API server: `http://localhost:5000`

---

## 🔌 API Documentation Summary

### Public Routes
* `POST /api/auth/login` - Authenticate admin credentials.
* `GET /api/profile` - Retrieve profile info, socials, and resume links.
* `GET /api/projects` - Retrieve showcase projects list.
* `GET /api/projects/:slug` - Retrieve detailed project specs.
* `GET /api/skills` - Get categorized skills.
* `GET /api/experiences` - Timeline job lists.
* `GET /api/education` - Timeline academic lists.
* `POST /api/messages` - Submit contact inquiry (Rate limited to Max 3/hr).

### Protected Admin Routes (Requires cookie validation)
* `POST /api/auth/logout` - Invalidate admin session cookie.
* `GET /api/auth/me` - Verify admin identity status.
* `PUT /api/profile` - Save general info details.
* `POST /api/profile/upload-avatar` - Upload new photo avatar.
* `POST /api/profile/upload-resume` - Upload new PDF resume.
* `POST /api/projects` - Add showcase project (with screenshot upload).
* `PUT /api/projects/:id` - Edit project details.
* `DELETE /api/projects/:id` - Delete showcase item.
* `GET /api/messages` - Retrieve contact message submissions inbox.
* `PATCH /api/messages/:id` - Mark message read status.
* `DELETE /api/messages/:id` - Remove contact item.

---

## 🌎 Production Hosting Deployment

### Frontend (Vercel)
Deploy `client` folder. In Vercel Project settings:
1. Set Root Directory to `client`.
2. Configure Environment Variable: `VITE_API_URL` pointing to Render backend URL.
3. Configure `vercel.json` rewrite file to prevent 404 router errors:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

### Backend (Render)
Deploy `server` folder as a **Web Service**:
1. Configure build settings:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node server.js`
2. Define Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (pointing to Vercel production frontend address), `NODE_ENV=production`, and Cloudinary keys.
