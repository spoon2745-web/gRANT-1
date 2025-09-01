# Grant Application Website

A modern, responsive grant application website built with Next.js, similar to Giving Joy grants platform. This application enables organizations to manage grant applications with regional scheduling, comprehensive forms, and user-friendly interfaces.

## Features

- **Grant Application System**: Comprehensive multi-section application form
- **Regional Scheduling**: Different application periods for various geographic regions
- **FAQ Section**: Expandable frequently asked questions with detailed answers
- **Newsletter Signup**: Email subscription for updates and notifications
- **Responsive Design**: Mobile-first design that works on all devices
- **Accessibility**: WCAG compliant with semantic HTML and proper ARIA labels

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: React with hooks
- **Deployment**: Ready for Vercel, Netlify, or other platforms

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd grant-application-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── application/
│   │   └── page.tsx          # Grant application page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
└── components/
    ├── FAQSection.tsx        # FAQ accordion component
    ├── Footer.tsx            # Site footer
    ├── GrantApplicationForm.tsx # Main application form
    ├── GrantSchedule.tsx     # Regional scheduling
    ├── Header.tsx            # Navigation header
    ├── Hero.tsx              # Hero section
    └── NewsletterSignup.tsx  # Email subscription
```

## Key Components

### Grant Application Form
- Multi-section form with validation
- Personal information, project details, and impact metrics
- Form submission with success confirmation
- Mobile-responsive design

### Grant Schedule
- Regional application periods display
- Country eligibility information
- Dynamic status indicators (open/closed/upcoming)
- Application buttons based on status

### FAQ Section
- Expandable question/answer format
- Rich content support for formatted answers
- Smooth animations and transitions

## Customization

### Styling
The website uses Tailwind CSS with a custom color scheme:
- Primary colors: Blue tones (#0ea5e9, #0284c7, etc.)
- Secondary colors: Purple tones for accents
- Neutral grays for text and backgrounds

### Content
- Update grant information in `GrantSchedule.tsx`
- Modify FAQ content in `FAQSection.tsx`
- Customize hero section in `Hero.tsx`
- Update contact information in `Footer.tsx`

### Form Fields
- Modify form fields in `GrantApplicationForm.tsx`
- Update validation rules as needed
- Customize success/error messages

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings

### Other Platforms
```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file for environment-specific settings:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EMAIL_API_KEY=your_email_service_key
DATABASE_URL=your_database_connection
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: info@impactgrantsolutions.org
- Documentation: [Project Wiki](link-to-wiki)
- Issues: [GitHub Issues](link-to-issues)

## Acknowledgments

- Inspired by Giving Joy grants platform
- Built with Next.js and Tailwind CSS
- Icons from Heroicons
- Fonts from Google Fonts (Inter)
