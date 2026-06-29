# User Management Dashboard — Enterprise SaaS Admin Portal

An enterprise-grade, visually stunning, and highly responsive **User Management Dashboard** built using React, Vite, Tailwind CSS v4, TanStack Table, Framer Motion, and Zod. This application handles full CRUD operations on user records using the **JSONPlaceholder** mock REST API.

---

## 🚀 Live Demo & Repository
- **Production Build:** Build verified and compiled successfully.
- **GitHub Repository Link:** https://github.com/vishalpohar/user-management-dashboard

---

## 🛠️ Technical Stack & Libraries
This application is constructed using a robust frontend stack:
- **Core Framework:** React 19 & Vite 8
- **Styling:** Tailwind CSS v4 (using the `@tailwindcss/vite` plugin for CSS-based theme compilation)
- **Data Table Engine:** `@tanstack/react-table` (v8)
- **State Management:** Custom hook layer (`useUsers.js`) managing localized cache state
- **Form Management:** `react-hook-form`
- **Schema Validation:** `zod` with `@hookform/resolvers` for inline validation
- **HTTP Client:** `axios`
- **Animations:** `framer-motion` (for card lifts, dialog entries, and grid row transitions)
- **Dialogs & Confirmations:** SweetAlert2 (`sweetalert2`) & Headless UI (`@headlessui/react`)
- **Icons:** Lucide React (`lucide-react`)
- **Notifications:** React Hot Toast (`react-hot-toast`)

---

## 🗂️ Folder Structure Map
The project is organized using a scalable, feature-based architecture:

```text
user-management-dashboard/
├── dist/                      # Production build assets
├── public/                    # Static assets
└── src/
    ├── api/
    │   └── userService.js     # Axios API service layer (GET, POST, PUT, DELETE)
    ├── components/
    │   ├── common/
    │   │   ├── Spinner.jsx    # Loading indicators & skeletal loaders
    │   │   └── StatCard.jsx   # Top metric widget cards
    │   ├── dashboard/
    │   │   ├── FilterPopup.jsx # Slide-down advanced filter controls
    │   │   ├── Pagination.jsx  # Paging entries and row sizing controls
    │   │   └── Toolbar.jsx     # Real-time search bar & filter triggers
    │   ├── forms/
    │   │   └── UserForm.jsx    # Unified react-hook-form schema for Add & Edit
    │   ├── layout/
    │   │   └── Header.jsx      # Sticky top navigation with branding & actions
    │   ├── table/
    │   │   └── UserTable.jsx   # TanStack Table wrapping tabular grid & mobile cards
    │   └── ui/
    │       └── Modal.jsx       # Headless UI accessible dialog container
    ├── hooks/
    │   └── useUsers.js        # State synchronization & search/sort/filter logic
    ├── utils/
    │   ├── constants.js       # Predefined department constants & color maps
    │   ├── helpers.js         # Name splitters, avatar initials, Tailwind merging
    │   └── validators.js      # Zod validation schema definition
    ├── App.css                # Style override file (emptied to avoid conflicts)
    ├── App.jsx                # Root container orchestrating layouts and states
    ├── index.css              # Main stylesheet loading Tailwind CSS v4 & theme variables
    ├── main.jsx               # Application entry point
    └── vite.config.js         # Vite configuration with Tailwind CSS v4 plugin
```

---

## ⚙️ Setup and Installation

### Prerequisites
- Node.js (version 18.x or above recommended)
- npm (Node Package Manager)

### Step 1: Clone and Navigate to Directory
```bash
git clone https://github.com/vishalpohar/user-management-dashboard.git
cd user-management-dashboard
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Development Server
```bash
npm run dev
```
The application will run locally and is typically accessible at `http://localhost:5173/`.

### Step 4: Build for Production
```bash
npm run build
```
This builds the application for production and bundles all code inside the `dist/` directory.

---

## 📐 Engineering & Architecture Assumptions

### 1. Data Mapping Logic (Full Name Splitting)
JSONPlaceholder users have a single `name` string field, but the assignment requires displaying **First Name** and **Last Name**.
- **Extraction:** During initialization (GET request), names are programmatically split:
  - The first word (up to the first space) is extracted as the `firstName`.
  - The remainder of the string is joined back together and assigned to `lastName`.
  - If no space exists, the entire string is mapped to `firstName` and `lastName` remains empty.
- **Reconstruction:** When dispatching `POST` or `PUT` payloads, the fields are rejoined as `firstName + " " + lastName`.

### 2. Department Assignment
The mock schema does not supply department fields.
- **Assignment:** Departments are assigned deterministically upon initialization based on the user's index in the array (`index % DEPARTMENTS.length`). Predefined departments include: *Engineering, Product, Design, Marketing, Sales, Operations, and HR*.
- **Colors:** Each department is bound to a specific color system (e.g., Engineering is Blue, HR is Rose) to display vibrant badges in the dashboard.

### 3. Local State Cache & CRUD Synchronization
JSONPlaceholder is a mock read-only API. Operations such as `POST` (create), `PUT` (update), and `DELETE` (remove) are simulated and do not persist in the actual database.
- **Synchronization:** The custom `useUsers.js` hook dispatches actual HTTP operations. Upon getting successful response returns (e.g., HTTP Status 201 for POST), the hook manually computes a unique incremented ID (IDs 11 and above) and merges the changes into the local state cache.
- **Handling IDs > 10:** Attempting to update or delete local users with IDs > 10 directly on JSONPlaceholder will fail with a `404 Not Found` error. To circumvent this, the service intercepts operations on IDs > 10, simulates network latency, and returns successful promise resolutions.

### 4. Infinite Scrolling vs. Pages Toggle
- **Toggle Control:** We integrated a segmented button in the toolbar letting users swap between standard numeric pages and smooth infinite scrolling.
- **Intersection Observer:** Infinite scrolling is managed via `react-intersection-observer`. An invisible sentinel element is rendered at the bottom of the table. Whenever this sentinel enters the viewport, it triggers the custom hook to slice and display another page worth of profiles.
- **Syncing:** Changing search queries, filters, or sorting values automatically resets the scroll boundary limits back to page size 1.

---

## ⚠️ Challenges Faced & Overcoming Them

1. **React 19 Compatibility Warnings:**
   - **Challenge:** Some third-party modal and UI libraries throw hook warnings under React 19.
   - **Solution:** Configured the modal overlay using `@headlessui/react` (for accessibility features like focus-traps and ESC buttons) combined with `framer-motion` for spring-based entries/exits, which compiled cleanly with no React 19 errors.

2. **JSONPlaceholder 404 on Added IDs:**
   - **Challenge:** Editing or deleting user records that were added locally (e.g., user #11) resulted in a 404 API error because JSONPlaceholder cannot persist new IDs.
   - **Solution:** Implemented ID partitioning in `useUsers.js`. If the target user ID is `<= 10`, it communicates with the REST API. If the ID is `> 10`, it skips the API network layer, simulates network latency, and updates local state directly.

3. **Mobilizing Tabular Grids:**
   - **Challenge:** Relational grids with multiple columns (ID, Name, Email, Department, Actions) suffer from severe layout breaks on mobile screens.
   - **Solution:** Implemented a media query layout structure in `UserTable.jsx`. On desktop and tablet, a structured TanStack table renders. On screens smaller than `768px` (mobile), the grid automatically collapses, and users are rendered in an elegant vertical stack of custom profile cards with large touch targets.

---

## 🔮 Future Architectural Improvements

If allocated more time, the following components would be integrated:
1. **Real-time Database Persistence:** Connecting to a live serverless database (e.g., Supabase or Firebase) to ensure edits persist across reloads.
2. **Advanced CSV/Excel Export:** Providing administrators with the ability to export the filtered/sorted user dataset as a spreadsheet.
3. **Authentications and Audit Logging:** Implementing role-based access control (RBAC) and keeping a historical log of dashboard CRUD transactions (e.g., "Admin deleted user #4 at 10:20 AM").
