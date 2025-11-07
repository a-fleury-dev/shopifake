# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

## Development Tools

### Code Quality

This project uses ESLint and Prettier to maintain consistent code quality and formatting.

#### ESLint

ESLint is configured with:

- **TypeScript support** via `typescript-eslint`
- **React best practices** including hooks rules and accessibility checks
- **Modern JSX** - no need to import React in component files (React 17+ transform)
- **Smart ignores** - automatically excludes `build/`, `dist/`, and `.react-router/` directories

**Available commands:**

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

#### Prettier

Prettier ensures consistent code formatting across the project.

**Available commands:**

```bash
# Format all files
npm run format

# Check if files are formatted (useful for CI)
npm run format:check
```

**Configuration:**

- `.prettierrc` - Prettier formatting rules
- `.prettierignore` - Files/folders excluded from formatting
- `eslint.config.js` - ESLint configuration (flat config format)

**Editor Integration:**
For the best development experience, install the ESLint and Prettier extensions in your editor:

- VS Code: `dbaeumer.vscode-eslint` and `esbenp.prettier-vscode`
- Enable "Format on Save" in your editor settings

---

Built with ❤️ using React Router.
