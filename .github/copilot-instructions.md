# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Context
This is a React TypeScript billing application built with Vite. The app manages invoices, customers, payments, and provides a dashboard for financial overview.

## Technical Stack
- React 18 with TypeScript
- Vite for build tooling
- React Router for navigation
- Lucide React for icons
- Date-fns for date manipulation
- Modern CSS with CSS Modules or styled components

## Coding Guidelines
- Use TypeScript interfaces for all data structures
- Follow React best practices with functional components and hooks
- Implement proper error boundaries and loading states
- Use semantic HTML and accessibility best practices
- Keep components focused and reusable
- Implement proper form validation for billing data
- Use consistent naming conventions for billing-related entities

## Key Features to Implement
- Dashboard with financial overview
- Invoice management (create, edit, view, delete)
- Customer management
- Payment tracking
- Reporting and analytics
- Export functionality (PDF, CSV)
- Search and filtering capabilities

## Data Structure Examples
- Invoice: id, customer, items, total, status, date, due date
- Customer: id, name, email, address, phone, billing info
- Payment: id, invoice, amount, date, method, status
- Product/Service: id, name, description, price, category
