# n15 Template

A lightweight, modern Next.js 15 template designed for building full-stack applications. This project supports contributions from the open-source community.

---

## Features

- **Built with Next.js 15 (App Router).**
- **TypeScript** for type safety.
- **Tailwind CSS 4.0.3** for styling.
- **Mongoose** for MongoDB integration.
- **OAuth & Authentication** using **Clerk** (Google, GitHub, Email/Password support).
- **TanStack Query** for API data fetching and caching.
- **Mailgun API** for email notifications.
- **Stripe API** for subscription payments & one-time purchases.
- **Cloudflare R2** for cost-efficient file/image storage.
- **Google APIs** for potential integrations (Maps, Calendar, etc.).
- **React Hook Form + Zod** for validation & form management.
- **ShadCN is desired** but has issues with **Tailwind 4.X** at this time.

---

## Getting Started

### Prerequisites

- **Node.js** (18+)
- **Bun** (optional, for faster installs, recommended)


### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/benochi/n15.git
   cd n15
   ```

## Package setup instructions:
### **MongoDB Setup**

This boilerplate includes MongoDB integration using **Mongoose**. Follow these steps to configure it:

1. **Set up MongoDB Atlas (or a local MongoDB instance)**:
   - Go to **[MongoDB Atlas](https://www.mongodb.com/atlas/database)**
   - Create a **free cluster**.
   - In **Database Access**, create a new user with **read/write** access.
   - Under **Network Access**, allow connections from **your IP or 0.0.0.0/0** (for development).
   - Copy your **MongoDB connection string**.

2. **Update `.env.local` with your MongoDB credentials**:
   MONGODB_URI_DEV=your_mongo_dev_str
   MONGODB_URI_TEST=your_mongo_test_str
   MONGODB_URI_PROD=your_mongo_prod_str

3. **dbConnect.test.ts**:
   Ensure your DB connection works by running ```bun test```
   
### **Clerk setup**

   - Sign up for Clerk at **https://www.clerk.com**
   - Create a clerk application.
   - Copy your clerk API keys from the clerk dashboard.
   - Update .env.local with your Clerk credentials.
   - Set up Clerk Middleware (middleware.ts) to handle authentication.
   - Add public or private routes as desired, see clerk route for userID/api example.
   - Add Sign-In & Sign-Up Routes with catch all, as provided.
   - Wrap the App with ClerkProvider in layout.tsx
   - This boilerplate currently uses a GET /api/users route to fill in user data to the DB

### **Tanstack setup**
   - Set up queryClient in app/providers.tsx
   - Wrap App inside of Layout.tsx with the provider 
   - [Tanstack](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)
   - useQuery hook ie const { data, isPending, error, etc... } = useQuery({arg1, arg2}) - 1 object arg
   - useQueryARG1 - queryKey(array) - refetching and caching unique key. ie ['todos'] 
   - useQueryARG1 - if using dynamic keys like id: ["todos", id] id is needed for caching the query
   - useQueryARG2 - queryFn(API call) - IE: getTodos -> queryFn: getTodos - no parenthesis
   - many options IE: button onClick={() => refetch()} etc. 
   - example use in app/dashboard/page.tsx and app/placeholder/page.tsx
   - FE api logic can be found in utils/
   - Please refer to docs for all options of useQuery

### **Mailgun setup**
 - FE app/mailgun/page.tsx, types/email.ts, utils/mailgun/api.ts
 - BE app/api/mailgun/route.ts
 - components/emailForm.tsx
 - sign up for mailgun: [Mailgun](https://www.mailgun.com/)
 - Add API key -> .env.local: MAILGUN_API_KEY
 - Add Domain on Mailgun, and set up dns keys with your hosting provider(AWS, GoDaddy, etc)
 - Verify keys on Mailgun and add domain to .env.local: MAILGUN_DOMAIN=mail.example.com
 

## Contributing

We welcome contributions to this project! Please follow these best practices to ensure a smooth and collaborative workflow.

### Best Practices

1. **Sync with `main`**:

   - Before starting your work, pull the latest changes from the `main` branch:
     ```bash
     git checkout main
     git pull origin main
     ```
   - Create a new branch for your feature or fix:
     ```bash
     git checkout -b feature/your-branch-name
     ```

2. **Code Guidelines**:

   - Write clear, concise, and well-documented code.
   - Follow the existing structure and conventions used in this repository.

3. **Testing**:

   - Test your changes thoroughly before submitting a pull request.
   - Include tests where applicable.
   - Test files go in the same directory as the files they're testing when possible.

4. **Pull Requests**:

   - Push your branch to GitHub:
     ```bash
     git push origin feature/your-branch-name
     ```
   - Open a Pull Request (PR) against the `main` branch.
   - Add a detailed description of your changes and reference any related issues.

5. **Notification**:

   - Notify the project maintainer (me) about your PR via Discord. Include the link to your PR.

6. **Approval Process**:

   - Wait for review and approval before merging your PR. The maintainer will merge it once it has been reviewed.

7. **Post-Merge Cleanup**:
   - After your PR is merged, delete your branch locally and remotely:
     ```bash
     git branch -d feature/your-branch-name
     git push origin --delete feature/your-branch-name
     ```

### Thank You for Contributing!

Your contributions help make this project better and more useful for everyone. We appreciate your effort and collaboration!
