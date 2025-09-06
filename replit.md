# Tournament Manager Web Application

## Overview
A comprehensive tournament organization web application built with vanilla HTML, CSS, and JavaScript. The application allows administrators to manage tournaments, teams, players, and matches, while providing public access to tournament information.

## Project Architecture

### Core Files
- `index.html` - Main application structure with modals and dashboard
- `styles.css` - Responsive CSS styling for modern UI
- `data.js` - Local storage database simulation using JSON
- `auth.js` - Authentication and user management system
- `tournament.js` - Tournament CRUD operations and bracket generation
- `team.js` - Team management and roster functionality
- `player.js` - Player management with team assignments
- `match.js` - Match scheduling and result recording
- `app.js` - Main application controller and UI management

### Key Features Implemented
1. **User Authentication**
   - Login/Registration system with role-based access (admin/user)
   - Session management using sessionStorage
   - Default users: admin/admin123, user/user123

2. **Tournament Management**
   - Create, edit, delete tournaments
   - Support for knockout and league formats
   - Automatic bracket/fixture generation
   - Team registration management
   - Standings calculation

3. **Team & Player Management**
   - CRUD operations for teams and players
   - Player-team assignments with validation
   - Jersey number uniqueness per team
   - Free agent management

4. **Match Management**
   - Schedule matches within tournaments
   - Record match results
   - Automatic bracket progression for knockout tournaments
   - Match history and statistics

5. **Public Interface**
   - View tournament details, teams, and standings
   - Browse match results and fixtures
   - Responsive design for all devices

### Database Structure
Using localStorage to simulate database with collections:
- `users` - User accounts with roles
- `tournaments` - Tournament information and settings
- `teams` - Team details and rosters
- `players` - Player profiles and team assignments
- `matches` - Match fixtures and results

### Security Features
- Role-based access control
- Input validation and sanitization
- Prevent duplicate registrations
- Data integrity checks

## Recent Changes
- Initial application development completed (September 6, 2025)
- All core functionality implemented and tested
- Responsive design for desktop and mobile
- Sample data structure established

## User Preferences
- Clean, modern interface preferred
- Minimal framework dependencies (vanilla JS only)
- Local storage for data persistence
- Responsive design for all devices

## Deployment
- Simple HTTP server using Python's built-in server
- Runs on port 5000 for web preview
- No external dependencies required