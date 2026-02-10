# Uruthana Uravugal - Advanced Next.js 16 Boilerplate

A high-performance Next.js 16 boilerplate with route protection, optimized rendering, and modern UI components.

## 🚀 Features

- **Route Protection**: Middleware-based authentication with protected routes
- **Performance Optimized**: React Query caching, optimized imports, and code splitting
- **Modern UI**: shadcn/ui components with Tailwind CSS
- **Type Safety**: Full TypeScript support with Zod validation
- **CRUD Operations**: Example table with full CRUD functionality
- **Responsive Design**: Mobile-first approach with framer-motion animations
- **Toast Notifications**: Sonner for beautiful toast messages

## 📦 Tech Stack

- **Framework**: Next.js 16.1.6
- **UI**: React 19, Tailwind CSS 4, shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack React Table
- **Animations**: Framer Motion
- **Notifications**: Sonner
- **Date Handling**: date-fns

## 🏗️ Project Structure

```
src/
├── app/
│   ├── (auth)/          # Auth routes (login, register)
│   ├── (dashboard)/     # Protected dashboard routes
│   │   ├── admin/       # Admin dashboard
│   │   └── user/        # User dashboard
│   ├── test/            # Unprotected test route with CRUD
│   └── page.tsx         # Homepage
├── components/
│   ├── auth/            # Auth components
│   ├── common/          # Shared components (Sidebar)
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── auth-context.tsx # Authentication context
│   ├── providers.tsx    # React Query & Auth providers
│   └── utils.ts         # Utility functions
└── middleware.ts        # Route protection middleware
```

## 🛠️ Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 🔐 Authentication

- **Protected Routes**: All routes under `(dashboard)` are protected
- **Test Route**: `/test` is unprotected for testing CRUD operations
- **Auth Flow**: Login → Set token → Access protected routes

### Default Credentials (Mock)
- Email: Any valid email
- Password: Any password (min 6 characters)

## 📍 Routes

- `/` - Homepage
- `/login` - Login page (public)
- `/register` - Registration page (public)
- `/test` - Test page with CRUD table (public)
- `/admin` - Admin dashboard (protected)
- `/user` - User dashboard (protected)

## 🎨 Features Explained

### Route Protection
- Middleware checks for `auth_token` cookie
- Protected routes redirect to `/login` if not authenticated
- Client-side protection via `ProtectedRoute` component

### Performance Optimizations
- React Query with optimized cache settings
- Package import optimization in `next.config.ts`
- Code splitting and lazy loading
- Image optimization with AVIF/WebP support

### CRUD Table (Test Page)
- Full CRUD operations with TanStack React Table
- Search and filtering
- Sorting and pagination
- Form validation with Zod

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Customization
- Update `src/lib/auth-context.tsx` for real authentication
- Modify `src/middleware.ts` for custom route protection logic
- Customize theme in `src/app/globals.css`

## 📝 Notes

- This is a boilerplate - replace mock authentication with real API calls
- Update middleware cookie handling for production security
- Add proper error boundaries and loading states as needed
- Configure your database and API endpoints

## 🚦 Performance Tips

1. Use React Query for all data fetching
2. Implement proper loading and error states
3. Optimize images with Next.js Image component
4. Use dynamic imports for heavy components
5. Monitor bundle size with `@next/bundle-analyzer`

## 📄 License

MIT
