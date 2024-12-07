# n15 Template

A lightweight, modern Next.js 15 template designed for building full-stack applications. This project supports contributions from the open-source community.

---

## Features

- Built with Next.js 15 (App Router).
- TypeScript for type safety.
- Tailwind 4.0 _Beta_ CSS for styling. which will be upgraded to LTS
- Mongoose for MongoDB integration.
- OAuth support for Google, GitHub, Facebook, and Twitter.
- TanStack Query for API data fetching and caching.
- Authentication via JWT and secure password hashing.
- Example setup for Mailgun and Stripe integrations.
- ShadCN is desired but has issues with the beta changes for TW 4.0 at this time.

---

## Getting Started

### Prerequisites

- **Node.js** (18+)
- **Bun** (optional, for faster installs, recommended)
- A MongoDB database (local or cloud-hosted, e.g., MongoDB Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/benochi/n15.git
   cd n15
   ```

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
