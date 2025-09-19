# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a fully functional AI Ad Generator application built with Next.js 15 that allows users to upload product images and generate marketing advertisements using AI. The application features a modern React frontend with TypeScript, Tailwind CSS v4, and integrates with the Nano Banana API for AI image generation.

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build production version with Turbopack  
npm start           # Start production server
```

### Code Quality
```bash
npm run lint        # Run ESLint for code linting
```

### Testing Individual Components
Since this project doesn't have formal testing setup yet, test components manually by:
1. Running `npm run dev`
2. Navigate to http://localhost:3000
3. Use browser dev tools for debugging
4. Test the full workflow: upload image → select style → generate ad → download result

### Environment Setup
```bash
cp .env.example .env    # Copy environment template
npm install             # Install dependencies
npm run dev            # Start development server
```

## Architecture Overview

### Frontend Architecture
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS v4 with custom CSS variables and dark mode support
- **UI Components**: Custom component system with shadcn/ui-style Button component using class-variance-authority
- **State Management**: React hooks (useState) for local component state
- **Build Tool**: Turbopack for faster development and builds

### Key Application Flow
1. **Image Upload**: Users upload product images via drag-and-drop or file picker (`ImageUpload` component)
2. **Style Selection**: Choose from 6 predefined ad styles or create custom prompts (`StyleSelector` component)
3. **Generation Request**: Frontend sends POST request to `/api/generate` (API route not yet implemented)
4. **Results Display**: Shows original vs generated ad with download functionality

### Component Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with font setup
│   ├── page.tsx            # Main application page (client-side)
│   └── globals.css         # Tailwind imports and CSS variables
├── components/
│   ├── ui/
│   │   └── button.tsx      # Reusable Button component with variants
│   ├── image-upload.tsx    # File upload with drag-and-drop
│   └── style-selector.tsx  # Ad style selection interface
├── lib/
│   └── utils.ts           # Utility functions (cn, file validation, formatting)
└── types/
    └── index.ts           # TypeScript interfaces and constants
```

### Type System
- `UploadedFile`: Represents uploaded image files with preview data
- `AdStyle`: Predefined ad style configurations
- `GenerationRequest`/`GenerationResponse`: API communication interfaces
- `DEFAULT_AD_STYLES`: 6 built-in ad styles (Modern Minimal, Vibrant Colorful, Elegant Luxury, Retro Vintage, Tech Futuristic, Natural Organic)

### API Implementation
The `/api/generate` API route is fully implemented and:
- Accepts POST requests with `GenerationRequest` payload containing product image, style/custom prompt, and aspect ratio
- Integrates with Nano Banana API for AI image generation
- Uses Stable Diffusion XL model with configurable parameters
- Returns `GenerationResponse` with generated ad image URL
- Includes comprehensive error handling and validation
- Requires `NANO_BANANA_API_KEY` environment variable

## Configuration Details

### TypeScript Configuration
- Target: ES2017 with strict mode enabled
- Path mapping: `@/*` points to `./src/*`
- Next.js plugin enabled for optimal integration

### ESLint Configuration
- Extends Next.js core web vitals and TypeScript presets
- Ignores build directories and generated files

### Package Management
- Uses npm with package-lock.json
- Key dependencies: React 19, Next.js 15, Radix UI components, Lucide React icons
- Development dependencies include TypeScript 5, ESLint 9, Tailwind CSS v4
- Requires environment variables for API integration (see .env.example)

### API Configuration
- Uses Nano Banana API for AI image generation
- Requires `NANO_BANANA_API_KEY` in environment variables
- Supports multiple aspect ratios and predefined styles
- Model: Stable Diffusion XL with customizable parameters

### Font Configuration
- Uses Geist Sans and Geist Mono fonts from Google Fonts
- Configured in `layout.tsx` with CSS variable setup

## Development Notes

### File Upload Constraints
- Accepts: JPEG, PNG, WebP formats
- Maximum file size: 10MB
- Includes client-side validation with user-friendly error messages

### Styling System
- Tailwind CSS v4 with `@import "tailwindcss"` syntax
- CSS-in-JS approach for component variants
- Dark mode support via CSS variables
- Uses `cn()` utility function for conditional class merging

### State Management
- Local component state with React hooks
- No global state management (Redux/Zustand) currently implemented
- File upload state includes preview generation and error handling

### Browser Compatibility
- Modern browsers supporting ES2017
- Uses FileReader API for image preview generation
- Includes drag-and-drop file upload functionality