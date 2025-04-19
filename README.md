# Nested Items Manager

A Nuxt 3 application for managing nested draggable items with pagination and undo/redo functionality. The application features unlimited nesting, restricted drag-and-drop (items can only be reordered within their parent), and a complete history system.

## Features

- **Nested Items**: Unlimited nesting with proper hierarchy display
- **Drag and Drop**: HTML5 drag-and-drop for item reordering within parent scopes
- **Undo/Redo**: Full history system with support for up to 20 actions
- **Persistence**: History persists across page reloads using localStorage
- **Pagination**: Server-side pagination for efficient data loading
- **Modern UI**: Clean, responsive design that works from 1024x768 up to 2560x1440 resolution
- **TypeScript**: Full TypeScript support for better developer experience

## Tech Stack

- **Nuxt 3**: Vue.js framework with server-side capabilities
- **TypeScript**: Type-safe code
- **Pinia**: State management
- **Composition API**: Modern Vue.js reactivity system
- **HTML5 Drag and Drop API**: Native browser capabilities for drag-and-drop
- **CSS Variables**: For theming and consistent styling

## Project Structure

```
nested-items-manager/
├── assets/
│   └── css/
│       └── main.css           # Main stylesheet
├── components/
│   ├── ItemRow.vue            # Component for individual items
│   ├── ItemsList.vue          # List container component
│   └── Pagination.vue         # Pagination controls
├── layouts/
│   └── default.vue            # Main layout
├── pages/
│   └── index.vue              # Main page
├── server/
│   └── api/
│       └── items.get.ts       # Mock API endpoint
├── stores/
│   └── items.ts               # Pinia store for items
├── types/
│   └── index.ts               # TypeScript type definitions
├── app.vue                    # Application entry point
├── nuxt.config.ts             # Nuxt configuration
├── package.json               # Project dependencies
└── README.md                  # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd nested-items-manager
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Build for Production

```bash
npm run build
# or
yarn build
```

## Deployment

This project can be easily deployed to Vercel:

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)
2. Import the project to Vercel
3. Deploy

## Usage

- **Drag and Drop**: Click and drag items to reorder them within their parent
- **Expand/Collapse**: Click the arrow button to expand or collapse categories
- **Edit/Remove**: Click the three-dot menu to edit or remove an item
- **Undo/Redo**: Use the buttons at the top-right to undo or redo actions

## License

[MIT License](LICENSE)
