import { createBrowserRouter } from 'react-router-dom'
import { AdminShell } from '@/components/admin/AdminShell'
import { SuperAdminShell } from '@/components/super-admin/SuperAdminShell'
import { AdminRoute } from '@/components/auth/AdminRoute'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { SuperAdminRoute } from '@/components/auth/SuperAdminRoute'
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
import { OpportunityRecordPage } from '@/pages/app/pipeline/OpportunityRecordPage'
import { PipelineLayout } from '@/pages/app/pipeline/PipelineLayout'
import { PipelineWorkspacePage } from '@/pages/app/pipeline/PipelineWorkspacePage'
import { SettingsPage } from '@/pages/app/SettingsPage'
import { TeamPage } from '@/pages/app/TeamPage'
import { AdminActivityPage } from '@/pages/admin/AdminActivityPage'
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage'
import { AdminBillingPage } from '@/pages/admin/AdminBillingPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage'
import { SuperAdminDashboardPage } from '@/pages/super-admin/SuperAdminDashboardPage'
import { SuperAdminPlaceholderPage } from '@/pages/super-admin/SuperAdminPlaceholderPage'
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
        ],
      },
      { path: '/login', element: <LoginPage />, handle: { title: 'Log in' } },
      { path: '/signup', element: <SignupPage />, handle: { title: 'Sign up' } },
      {
        path: '/admin',
        element: <AdminRoute />,
        children: [
          {
            element: <AdminShell />,
            children: [
              { index: true, element: <AdminDashboardPage />, handle: { title: 'Administration' } },
              { path: 'users', element: <AdminUsersPage />, handle: { title: 'Team members' } },
              { path: 'analytics', element: <AdminAnalyticsPage />, handle: { title: 'Analytics' } },
              { path: 'activity', element: <AdminActivityPage />, handle: { title: 'Activity' } },
              { path: 'billing', element: <AdminBillingPage />, handle: { title: 'Billing' } },
              { path: 'settings', element: <AdminSettingsPage />, handle: { title: 'Admin settings' } },
              { path: '*', element: <NotFoundPage />, handle: { title: 'Not found' } },
            ],
          },
        ],
      },
      {
        path: '/super-admin',
        element: <SuperAdminRoute />,
        children: [
          {
            element: <SuperAdminShell />,
            children: [
              { index: true, element: <SuperAdminDashboardPage />, handle: { title: 'Platform control' } },
              { path: 'organizations', element: <SuperAdminPlaceholderPage title="ORGANIZATIONS" phase="COMING IN SUPER-2" />, handle: { title: 'Organizations' } },
              { path: 'users', element: <SuperAdminPlaceholderPage title="USERS" phase="COMING IN SUPER-2" />, handle: { title: 'Platform users' } },
              { path: 'admins', element: <SuperAdminPlaceholderPage title="ADMINS" phase="COMING IN SUPER-2" />, handle: { title: 'Platform admins' } },
              { path: 'analytics', element: <SuperAdminPlaceholderPage title="ANALYTICS" phase="COMING IN A LATER SUPER PHASE" />, handle: { title: 'Platform analytics' } },
              { path: 'revenue', element: <SuperAdminPlaceholderPage title="REVENUE" phase="COMING IN A LATER SUPER PHASE" />, handle: { title: 'Revenue' } },
              { path: 'ai-usage', element: <SuperAdminPlaceholderPage title="AI USAGE" phase="COMING IN A LATER SUPER PHASE" />, handle: { title: 'AI usage' } },
              { path: 'plans', element: <SuperAdminPlaceholderPage title="PLANS" phase="COMING IN A LATER SUPER PHASE" />, handle: { title: 'Plans' } },
              { path: 'integrations', element: <SuperAdminPlaceholderPage title="INTEGRATIONS" phase="COMING IN A LATER SUPER PHASE" />, handle: { title: 'Platform integrations' } },
              { path: 'system', element: <SuperAdminPlaceholderPage title="SYSTEM" phase="COMING IN A LATER SUPER PHASE" />, handle: { title: 'System' } },
              { path: 'audit-logs', element: <SuperAdminPlaceholderPage title="AUDIT LOGS" phase="COMING IN A LATER SUPER PHASE" />, handle: { title: 'Platform audit logs' } },
              { path: 'settings', element: <SuperAdminPlaceholderPage title="SETTINGS" phase="COMING IN A LATER SUPER PHASE" />, handle: { title: 'Platform settings' } },
              { path: '*', element: <NotFoundPage />, handle: { title: 'Not found' } },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
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
          {
            path: 'pipeline',
            element: <PipelineLayout />,
            handle: { title: 'Pipeline' },
            children: [
              { index: true, element: <PipelineWorkspacePage /> },
              { path: ':opportunityId', element: <OpportunityRecordPage />, handle: { title: 'Opportunity details' } },
            ],
          },
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
        ],
      },
      { path: '*', element: <NotFoundPage framed />, handle: { title: 'Not found' } },
    ],
  },
])
