# Spendly

A personal expense tracking application built with Next.js 14, TypeScript, and Firebase.

## Features

- Expense tracking and categorization
- Real-time data synchronization
- Budget management
- Analytics and reporting
- User authentication
- Responsive design

## Technology Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hook Form

### Backend
- Firebase Authentication
- Firestore Database
- Firebase Security Rules

## Installation

### Prerequisites
- Node.js 18+
- Firebase account

### Setup

1. Clone the repository
```bash
git clone https://github.com/your-username/spendly.git
cd spendly
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create `.env.local` with your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Start development server
```bash
npm run dev
```

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking
npm run seed-categories  # Seed database categories
```

## Project Structure

```
app/                    # Next.js App Router pages
components/             # React components
├── ui/                # Reusable UI components
├── Enhanced*.tsx      # Page-specific components
contexts/              # React contexts
hooks/                 # Custom hooks
utils/                 # Utility functions
scripts/               # Database seeding scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Create Pull Request

## License

MIT License