# 🛠️ Spendly Development Guide

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Firebase account and project
- Git for version control
- VS Code (recommended) with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - Prettier - Code formatter

### Initial Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd spendly
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Configuration**
Copy `env-template.txt` to `.env.local` and fill in your Firebase credentials:
```bash
cp env-template.txt .env.local
```

4. **Firebase Setup**
- Create a Firebase project
- Enable Authentication (Email/Password)
- Enable Firestore Database
- Deploy security rules: `firebase deploy --only firestore:rules`

5. **Seed Global Categories (Optional)**
```bash
npm run seed-categories seed
```

6. **Start Development Server**
```bash
npm run dev
```

---

## 📁 **Project Structure**

```
spendly/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── dashboard/
│   │   ├── add-expense/
│   │   ├── analytics/
│   │   └── settings/
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Landing page
├── components/                   # Reusable components
│   ├── ui/                       # UI components
│   │   ├── Loading.tsx
│   │   ├── Toaster.tsx
│   │   └── ...
│   ├── icons/                    # Icon components
│   ├── Enhanced*.tsx             # Page-specific components
│   ├── ErrorBoundary.tsx         # Error handling
│   └── CategoryManagement.tsx    # Category CRUD
├── contexts/                     # React contexts
│   └── AuthContext.tsx           # Authentication state
├── hooks/                        # Custom React hooks
│   ├── useCategories.tsx         # Category management
│   └── useExpenses.tsx           # Expense management
├── utils/                        # Utility functions
│   ├── firebase.ts               # Firebase configuration
│   └── seedFirestore.ts          # Database seeding
├── scripts/                      # Development scripts
│   └── seedGlobalCategories.ts   # Category seeding script
├── firestore.rules               # Firestore security rules
└── package.json                  # Dependencies and scripts
```

---

## 🔧 **Development Workflow**

### 1. **Component Development**

#### Creating New Components
```typescript
'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface ComponentProps {
  title: string;
  children: React.ReactNode;
}

export default function Component({ title, children }: ComponentProps) {
  const { currentUser } = useAuth();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6"
    >
      <h2 className="text-white font-bold mb-4">{title}</h2>
      {children}
    </motion.div>
  );
}
```

#### Component Guidelines
- Use TypeScript for all components
- Include proper error boundaries
- Follow the space theme design system
- Add proper loading states
- Include accessibility features (ARIA labels, keyboard navigation)

### 2. **Hook Development**

#### Custom Hook Pattern
```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { db, handleFirebaseError } from '@/utils/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const useCustomHook = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Always include proper cleanup
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(
      collection(db, 'collection'),
      (snapshot) => {
        // Handle success
        setData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        // Handle error
        setError(handleFirebaseError(error));
        setLoading(false);
        toast.error('Failed to load data');
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const addItem = useCallback(async (itemData) => {
    try {
      await addDoc(collection(db, 'collection'), itemData);
      toast.success('Item added successfully!');
    } catch (error) {
      const errorMessage = handleFirebaseError(error);
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  return { data, loading, error, addItem };
};
```

### 3. **Database Operations**

#### Firestore Best Practices
```typescript
// ✅ Good: Proper error handling and validation
const addExpense = async (expenseData: ExpenseData) => {
  if (!currentUser) {
    throw new Error('User must be authenticated');
  }
  
  // Validate data
  if (!expenseData.amount || expenseData.amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  try {
    await addDoc(collection(db, 'users', currentUser.uid, 'expenses'), {
      ...expenseData,
      amount: Number(expenseData.amount),
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

// ❌ Bad: No validation or error handling
const addExpense = async (expenseData) => {
  await addDoc(collection(db, 'expenses'), expenseData);
};
```

---

## 🎨 **Design System**

### Color Palette
```css
/* Primary Colors */
--purple-500: #a855f7;
--blue-500: #3b82f6;
--cyan-500: #06b6d4;

/* Background */
--bg-primary: #000319;
--bg-card: rgba(255, 255, 255, 0.05);
--border: rgba(255, 255, 255, 0.1);

/* Text */
--text-primary: #ffffff;
--text-secondary: #d1d5db;
--text-muted: #9ca3af;
```

### Component Patterns
```typescript
// Floating Animation
const FloatingElement = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
    whileHover={{ y: -4 }}
  >
    {children}
  </motion.div>
);

// Gradient Button
const GradientButton = ({ children, onClick, variant = "primary" }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`px-6 py-3 bg-gradient-to-r ${
      variant === "primary" 
        ? "from-purple-500 to-blue-500" 
        : "from-blue-500 to-cyan-500"
    } text-white font-semibold rounded-xl transition-all duration-300`}
  >
    {children}
  </motion.button>
);
```

---

## 🧪 **Testing Strategy**

### Unit Testing (Jest + React Testing Library)
```typescript
// __tests__/components/CategoryManagement.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CategoryManagement } from '@/components/CategoryManagement';
import { AuthProvider } from '@/contexts/AuthContext';

const MockedComponent = () => (
  <AuthProvider>
    <CategoryManagement />
  </AuthProvider>
);

describe('CategoryManagement', () => {
  it('renders category list', async () => {
    render(<MockedComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('Category Management')).toBeInTheDocument();
    });
  });

  it('adds new category', async () => {
    render(<MockedComponent />);
    
    const addButton = screen.getByText('Add Category');
    fireEvent.click(addButton);
    
    // Test form submission
    const nameInput = screen.getByLabelText('Category Name');
    fireEvent.change(nameInput, { target: { value: 'Test Category' } });
    
    const submitButton = screen.getByText('Add Category');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test Category')).toBeInTheDocument();
    });
  });
});
```

### Integration Testing
```typescript
// __tests__/integration/expense-flow.test.tsx
describe('Expense Management Flow', () => {
  it('creates expense with category', async () => {
    // Test full flow from category creation to expense addition
  });
});
```

---

## 🔍 **Debugging Guide**

### Common Issues & Solutions

#### 1. **Firebase Not Initialized**
```
Error: Firebase is not properly configured
```
**Solution**: Check environment variables in `.env.local`

#### 2. **Memory Leaks in Firestore Listeners**
```typescript
// ✅ Proper cleanup
useEffect(() => {
  const unsubscribe = onSnapshot(query, callback);
  return () => unsubscribe(); // Always cleanup
}, []);
```

#### 3. **Category Loading Issues**
```typescript
// ✅ Proper error handling
const { categories, loading, error } = useCategories();

if (error) {
  return <div>Error: {error}</div>;
}
```

### Development Tools

#### Firebase Emulator Suite
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Start emulators
firebase emulators:start --only firestore,auth
```

#### React Developer Tools
- Install React DevTools browser extension
- Use Profiler to identify performance issues
- Monitor component re-renders

---

## 📊 **Performance Optimization**

### Code Splitting
```typescript
// Lazy load heavy components
const CategoryManagement = dynamic(() => import('@/components/CategoryManagement'), {
  ssr: false,
  loading: () => <Loading message="Loading categories..." />
});
```

### Memoization
```typescript
// Memoize expensive calculations
const expenseSummary = useMemo(() => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}, [expenses]);

// Memoize callbacks
const handleAddExpense = useCallback(async (data) => {
  await addExpense(data);
}, [addExpense]);
```

### Bundle Analysis
```bash
npm run analyze
```

---

## 🚀 **Deployment**

### Development Deployment
```bash
# Vercel (Recommended)
npm run deploy

# Or manual
vercel --prod
```

### Environment Variables
Ensure all production environment variables are set:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- etc.

### Pre-deployment Checklist
- [ ] All tests pass
- [ ] Type checking passes (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables configured
- [ ] Firestore rules deployed
- [ ] Global categories seeded

---

## 📝 **Code Standards**

### TypeScript
- Use strict mode
- Define interfaces for all props
- Avoid `any` type
- Use proper generics

### React
- Use functional components with hooks
- Implement proper error boundaries
- Include loading states
- Handle edge cases

### Styling
- Use Tailwind CSS classes
- Follow mobile-first approach
- Maintain consistent spacing
- Use semantic HTML

### Git Workflow
```bash
# Feature branch workflow
git checkout -b feature/category-management
git commit -m "feat: add category management UI"
git push origin feature/category-management
# Create pull request
```

---

## 🔧 **Available Scripts**

```bash
# Development
npm run dev              # Start development server
npm run dev:debug        # Start with Node.js debugger

# Building
npm run build            # Build for production
npm run start            # Start production server

# Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking

# Database
npm run seed-categories  # Seed global categories

# Utilities
npm run clean            # Clean build artifacts
npm run analyze          # Analyze bundle size
```

---

## 🆘 **Getting Help**

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

### Common Commands
```bash
# Reset development environment
npm run clean && npm install && npm run dev

# Check for issues
npm run lint && npm run type-check

# Full deployment check
npm run build && npm run start
```

---

**Happy coding! 🚀** 