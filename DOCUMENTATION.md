# Apricity - Cybersecurity Monitoring App

A modern React-based cybersecurity dashboard for real-time security monitoring, threat analysis, and compliance management.

## Features

- **Real-time Security Alerts** - Monitor critical, high, medium, and low priority security alerts
- **System Status Dashboard** - View overall system health and threat level metrics
- **Network Monitoring** - Track active sessions and network devices
- **Failed Login Tracking** - Monitor suspicious authentication attempts
- **Quick Actions** - Perform security scans, audits, and generate reports directly from dashboard
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI** - Clean, intuitive interface with security-focused color scheme

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AlertCard.tsx    # Security alert display
│   ├── StatCard.tsx     # Statistics cards
│   ├── Navigation.tsx   # Top navigation bar
│   └── index.tsx        # Component exports
├── pages/               # Page components
│   └── Dashboard.tsx    # Main dashboard page
├── services/            # API services
│   └── securityService.ts # Security API integration
├── hooks/               # Custom React hooks
│   └── useAlerts.ts     # Alert data fetching hooks
├── types/               # TypeScript type definitions
│   └── index.ts         # App-wide types
├── App.tsx              # Main app component
├── main.tsx             # React entry point
└── index.css            # Global styles
```

## Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library
- **Axios** - HTTP client for API calls
- **Chart.js** - Data visualization (ready to integrate)

## API Integration

The app is configured to work with a backend API at `http://localhost:3000/api`. Key endpoints:

- `GET /alerts` - Fetch security alerts
- `GET /system/status` - Get system health status
- `GET /vulnerabilities/metrics` - Get vulnerability metrics
- `GET /network/devices` - Get connected network devices
- `GET /users` - Get user list

See `src/services/securityService.ts` for full API integration details.

## Component Showcase

### AlertCard
Displays individual security alerts with severity levels, descriptions, and resolution options.

### StatCard
Shows key metrics in visually appealing cards with trend indicators.

### Navigation
Sticky navigation bar with quick access to dashboard sections.

## Responsive Design

The app is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## Color Scheme

- **Green (#10b981)** - Healthy status
- **Orange (#f59e0b)** - Warning status
- **Red (#dc2626)** - Critical status
- **Blue (#3b82f6)** - Neutral/Primary

## Future Enhancements

- [ ] Chart.js integration for vulnerability trends
- [ ] Real-time WebSocket updates for alerts
- [ ] User authentication and roles
- [ ] Advanced filtering and search
- [ ] PDF report generation
- [ ] Email notifications
- [ ] Dark mode theme
- [ ] Two-factor authentication support

## Development

To extend the app:

1. Add new components to `src/components/`
2. Create new pages in `src/pages/`
3. Add new API calls in `src/services/securityService.ts`
4. Define types in `src/types/`
5. Create custom hooks in `src/hooks/`

## License

MIT
