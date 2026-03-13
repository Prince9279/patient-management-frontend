# Patient Management Frontend

This repository contains a Next.js 13 application built for a frontend assessment. The app displays a list of patients with search, filter, sort, and pagination features. It supports both card and table views and is responsive across devices.

## Features

- Fetches patient data from a local API (`/api/patients`).
- Client-side search and filters: name, age range, medical issue.
- Sort by name, age, or ID with ascending/descending toggles.
- Card and table layouts with dynamic badge colors for medical issues.
- Responsive design using Tailwind CSS.
- Avatar component with image fallback.
- Clear filter UI with chips and "Clear all filters" button.
- Pagination support and total count display.
- Patient detail page accessible via `/patient/[id]`.

## Project Structure

- `app/` – Next.js App Router pages and API routes.
- `components/` – Reusable UI components (cards, rows, filters, avatar, etc.).
- `lib/` – Utility helpers (`issueColors.ts`, `format.ts`).
- `public/` – Static assets and sample data (`data.json`).
- `styles/` – Global CSS.

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Run development server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view in the browser.

3. **Build for production**
   ```bash
   pnpm build
   pnpm start
   ```

## API

The API route `app/api/patients/route.ts` serves patient data from `public/data.json`. It supports query parameters for pagination, search, age filtering, and medical issue filtering.

## Deployment

This app is ready for deployment to Vercel. To deploy:

1. Push the repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and import the project.
3. Use the default settings (Next.js detected automatically).
4. Configure environment variables if needed (none required for this static API).
5. Click **Deploy**. The site will be available at a `.vercel.app` URL.

## Notes

- Ensure you clear filters to view the full dataset, and the UI indicates active filters.
- The app is mobile-responsive but test on various screen sizes.
- This code is part of a frontend assessment; modify or extend as needed.

---

Happy coding!
