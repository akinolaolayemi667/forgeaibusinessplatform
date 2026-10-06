import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { MarketingLayout } from '@/components/layout/MarketingLayout'
import { RootLayout } from '@/components/layout/RootLayout'
import { AiPage } from '@/pages/app/AiPage'
import { AnalyticsPage } from '@/pages/app/AnalyticsPage'
import { AutomationsPage } from '@/pages/app/AutomationsPage'
import { BillingPage } from '@/pages/app/BillingPage'
import { CrmCompaniesPage } from '@/pages/app/crm/CrmCompaniesPage'
import { CrmCompanyPage } from '@/pages/app/crm/CrmCompanyPage'
import { CrmContactPage } from '@/pages/app/crm/CrmContactPage'
import { CrmContactsPage } from '@/pages/app/crm/CrmContactsPage'
import { CrmLayout } from '@/pages/app/crm/CrmLayout'
import { CrmOverviewPage } from '@/pages/app/crm/CrmOverviewPage'
import { ContactsPage } from '@/pages/app/ContactsPage'
import { ConversationsPage } from '@/pages/app/ConversationsPage'
import { IntegrationsPage } from '@/pages/app/IntegrationsPage'
import { LeadsLayout } from '@/pages/app/leads/LeadsLayout'
import { LeadsWorkspacePage } from '@/pages/app/leads/LeadsWorkspacePage'
import { LeadRecordPage } from '@/pages/app/leads/LeadRecordPage'
import { OverviewPage } from '@/pages/app/OverviewPage'
import { PipelinePage } from '@/pages/app/PipelinePage'
import { SettingsPage } from '@/pages/app/SettingsPage'
import { TeamPage } from '@/pages/app/TeamPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'
import { ArchitecturePage } from '@/pages/marketing/ArchitecturePage'
import { CaseStudyPage } from '@/pages/marketing/CaseStudyPage'
import { DemoPage } from '@/pages/marketing/DemoPage'
import { FeaturesPage } from '@/pages/marketing/FeaturesPage'
import { HomePage } from '@/pages/marketing/HomePage'
import { PricingPage } from '@/pages/marketing/PricingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <MarketingLayout />,
        children: [
          { path: '/', element: <HomePage />, handle: { title: 'Home' } },
          { path: '/features', element: <FeaturesPage />, handle: { title: 'Features' } },
          { path: '/pricing', element: <PricingPage />, handle: { title: 'Pricing' } },
          { path: '/demo', element: <DemoPage />, handle: { title: 'Demo' } },
          { path: '/architecture', element: <ArchitecturePage />, handle: { title: 'Architecture' } },
          { path: '/case-study', element: <CaseStudyPage />, handle: { title: 'Case study' } },
          { path: '/login', element: <LoginPage />, handle: { title: 'Log in' } },
          { path: '/signup', element: <SignupPage />, handle: { title: 'Sign up' } },
        ],
      },
      {
        path: '/app',
        element: <AppLayout />,
        children: [
          { index: true, element: <OverviewPage />, handle: { title: 'Overview' } },
          {
            path: 'crm',
            element: <CrmLayout />,
            handle: { title: 'CRM' },
            children: [
              { index: true, element: <CrmOverviewPage /> },
              { path: 'contacts', element: <CrmContactsPage />, handle: { title: 'Contacts' } },
              { path: 'contacts/:contactId', element: <CrmContactPage />, handle: { title: 'Contact details' } },
              { path: 'companies', element: <CrmCompaniesPage />, handle: { title: 'Companies' } },
              { path: 'companies/:companyId', element: <CrmCompanyPage />, handle: { title: 'Company' } },
            ],
          },
          {
            path: 'leads',
            element: <LeadsLayout />,
            handle: { title: 'Leads' },
            children: [
              { index: true, element: <LeadsWorkspacePage /> },
              { path: ':leadId', element: <LeadRecordPage />, handle: { title: 'Lead details' } },
            ],
          },
          { path: 'contacts', element: <ContactsPage />, handle: { title: 'Contacts' } },
          { path: 'pipeline', element: <PipelinePage />, handle: { title: 'Pipeline' } },
          { path: 'conversations', element: <ConversationsPage />, handle: { title: 'Conversations' } },
          { path: 'automations', element: <AutomationsPage />, handle: { title: 'Automations' } },
          { path: 'ai', element: <AiPage />, handle: { title: 'AI Assistant' } },
          { path: 'analytics', element: <AnalyticsPage />, handle: { title: 'Analytics' } },
          { path: 'integrations', element: <IntegrationsPage />, handle: { title: 'Integrations' } },
          { path: 'team', element: <TeamPage />, handle: { title: 'Team' } },
          { path: 'settings', element: <SettingsPage />, handle: { title: 'Settings' } },
          { path: 'billing', element: <BillingPage />, handle: { title: 'Billing' } },
          { path: '*', element: <NotFoundPage />, handle: { title: 'Not found' } },
        ],
      },
      { path: '*', element: <NotFoundPage framed />, handle: { title: 'Not found' } },
    ],
  },
])
