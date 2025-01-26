# Streakify - Habit Tracker

Streakify is a habit-tracking application designed to help users build and maintain positive habits. Built in under a week as part of the Chingu Solo Developer Project (Tier 3), Streakify demonstrates intermediate to advanced web development skills, including frontend and backend separation, API design, and database integration.

Visit the live app: [Streakify](https://thestreakify.vercel.app/)

## Features

- Habit Tracking: Users can create, update, and delete habits.
- Streak Management: Track your progress and maintain streaks for each habit.
- Authentication: Secure login via GitHub OAuth.
- RESTful API: Backend implements CRUD operations for habits and habit instances.
- Database Integration: PostgreSQL for data storage and Redis for session management.
- Responsive Design: Built with SvelteKit and TailwindCSS for a seamless user experience.

## Stack

### Frontend

- SvelteKit: A modern framework for building fast and reactive web applications.
- TailwindCSS: Utility-first CSS framework for styling.
- Lucide Icons: Beautiful and customizable icons.
- Svelte Sonner: Toast notifications for user feedback.

### Backend

- Drizzle ORM: TypeScript ORM for interacting with PostgreSQL.
- Better Auth: Authentication library for handling user sessions.
- Redis: Session management and caching.
- Zod: Schema validation for API requests.

### Deployment

- Vercel: Hosting for the frontend and backend.
- Neon: Serverless PostgreSQL database.
- Upstash: Serverless Redis for session management.

## Project Structure

The project follows the Separation of Concerns principle, with distinct files for frontend and backend logic.

streakify/
├── src/
│   ├── lib/
│   │   ├── server/
│   │   │   ├── db/            # Database schema and queries
│   │   │   ├── auth/          # Authentication logic
│   │   │   └── api/           # API endpoints
│   ├── routes/                # SvelteKit routes
│   └── app.html               # Main HTML template
├── drizzle.config.ts          # Drizzle ORM configuration
├── package.json               # Project dependencies and scripts
└── README.md                  # This file

## Setup and Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/streakify.git
    cd streakify
    ```

2. Install dependencies:
    ```bash
    pnpm install
    ```

3. Set Up Environment Variables:
    Create a .env file in the root directory and add the variables listed in .env.example.

4. Run db migrations:
    ```bash
    pnpm db:push
    OR
    pnpm db:generate && pnpm db:migrate
    ```

5. Start the development server:
    ```bash
    pnpm dev
    ```

## Chingu Solo Developer Project (Tier 3)

This project was built to satisfy the requirements for the Tier 3 Solo Developer Project for Chingu. The criteria included:

- Separation of frontend and backend logic.
- Implementation of a custom backend API.
- Use of a database (PostgreSQL) accessed only from the backend.
- CRUD operations for habit management.
- Advanced use of tools like SvelteKit, Drizzle ORM, and Redis.

## License

This project is licensed under the GPL License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Chingu](https://www.chingu.io/): For providing the opportunity to work on this project.
- SvelteKit and Drizzle ORM: For their excellent frameworks and tools.
- TailwindCSS: For its utility-first CSS framework.

Happy habit tracking with Streakify! 🚀