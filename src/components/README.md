# Bot Showcase Components

This directory contains all the React components for the bot showcase application.

## Components

### 1. SearchBar.jsx
A modern search bar with animated gradient effects and smooth transitions.

**Props:**
- `value` (string): Current search value
- `onChange` (function): Callback when search value changes
- `placeholder` (string): Placeholder text (default: "Search bots...")

**Features:**
- Framer Motion animations
- Lucide React Search icon
- Glassmorphism effect
- Gradient border on hover
- Focus animations

---

### 2. FilterBar.jsx
Filter buttons for different bot statuses with active state styling.

**Props:**
- `activeFilter` (string): Currently active filter ('all', 'active', 'beta', 'maintenance')
- `onFilterChange` (function): Callback when filter changes

**Features:**
- Animated filter transitions
- Color-coded status badges
- Smooth hover effects
- Active state with glow effect
- Layout animation with layoutId

---

### 3. BotGrid.jsx
Responsive grid layout for displaying bot cards.

**Props:**
- `bots` (array): Array of bot objects
- `onBotClick` (function): Callback when a bot is clicked
- `searchTerm` (string): Current search term for filtering
- `activeFilter` (string): Current active filter

**Features:**
- CSS Grid responsive layout (1 col mobile, 2 col tablet, 3 col desktop)
- Staggered animations for cards
- Empty state when no results
- Auto-filtering based on search and status

---

### 4. BotCard.jsx
Individual bot card component with glassmorphism and hover effects.

**Props:**
- `bot` (object): Bot data object containing:
  - `id` (string): Unique identifier
  - `icon` (string): Emoji or icon
  - `name` (string): Bot name
  - `description` (string): Bot description
  - `status` (string): Bot status ('active', 'beta', 'maintenance', 'deprecated')
  - `features` (array): Array of feature strings
- `onClick` (function): Callback when card is clicked
- `index` (number): Card index for staggered animations

**Features:**
- Glassmorphism background
- Hover scale and glow effects
- Animated gradient border
- Status badge with color coding
- Feature pills (shows first 3)
- Shine animation on hover
- Description truncation

---

### 5. BotModal.jsx
Full-screen modal overlay with tabbed content and advanced features.

**Props:**
- `bot` (object): Bot data object (same as BotCard plus additional fields):
  - All BotCard fields
  - `details` (string): Extended description
  - `links` (array): Array of {label, url} objects
  - `screenshots` (array): Array of image URLs
  - `videos` (array): Array of video URLs
  - `changelog` (array): Array of {version, date, changes[]} objects
  - `legal` (object): {tos, privacy} legal documents
- `isOpen` (boolean): Whether modal is open
- `onClose` (function): Callback to close modal

**Features:**
- Full-screen overlay with backdrop blur
- Tabbed navigation (Overview, Features, Media, Changelog, Legal)
- Scrollable content with custom scrollbar
- Screenshot lightbox gallery
- Video player support
- Expandable changelog items
- Collapsible legal sections
- Smooth entrance/exit animations
- Click outside to close
- ESC key support (via onClose)

**Tabs:**
1. **Overview**: Description, details, and external links
2. **Features**: Grid layout of all features
3. **Screenshots & Videos**: Media gallery with lightbox
4. **Changelog**: Expandable version history
5. **Legal**: Terms of Service and Privacy Policy (collapsible)

---

## Usage Example

\`\`\`jsx
import { SearchBar, FilterBar, BotGrid, BotModal } from './components';
import { useState } from 'react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedBot, setSelectedBot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const bots = [
    {
      id: '1',
      icon: '🤖',
      name: 'Example Bot',
      description: 'A cool bot that does things',
      status: 'active',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      details: 'Extended description...',
      links: [{ label: 'Discord', url: 'https://discord.gg/...' }],
      screenshots: ['url1.jpg', 'url2.jpg'],
      changelog: [
        {
          version: 'v1.0.0',
          date: '2024-01-01',
          changes: ['Initial release', 'Added feature X']
        }
      ],
      legal: {
        tos: 'Terms of Service content...',
        privacy: 'Privacy Policy content...'
      }
    }
  ];

  const handleBotClick = (bot) => {
    setSelectedBot(bot);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <BotGrid
        bots={bots}
        onBotClick={handleBotClick}
        searchTerm={searchTerm}
        activeFilter={activeFilter}
      />

      <BotModal
        bot={selectedBot}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
\`\`\`

## Dependencies

Make sure you have these packages installed:

\`\`\`bash
npm install framer-motion lucide-react
\`\`\`

## Styling

All components use:
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- Custom color palette from `tailwind.config.js`
- Glassmorphism design pattern
- Custom scrollbar styles from `index.css`

## Color Palette

The components use the following color scheme:

- **Primary**: Blue shades (sky blue) - `primary-*`
- **Accent**: Purple/Magenta shades - `accent-*`
- **Status Colors**:
  - Active: Green
  - Beta: Yellow
  - Maintenance: Red
  - Deprecated: Gray

## Responsive Breakpoints

- **Mobile**: 1 column grid
- **Tablet** (md): 2 column grid
- **Desktop** (lg): 3 column grid
