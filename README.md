# FORGE

FORGE is an AI business automation platform for revenue teams. It keeps leads, conversations, pipeline, and the next action on one record.

This repository is the application foundation: a working React app with routing, a reusable interface kit, and local mock data shaped so a later Supabase or HTTP source can replace it.

## Stack

- React 19, TypeScript, Vite
- Tailwind CSS
- React Router
- Framer Motion
- Lucide icons
- Recharts

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Routes

| Path | Surface |
| --- | --- |
| `/` | Product introduction |
| `/features` | Workspace surfaces |
| `/pricing` | Seat plans |
| `/login` | Tab session |
| `/signup` | Operator profile |
| `/demo` | Preview entry |
| `/architecture` | How the app is layered |
| `/case-study` | Sample workspace story |
| `/app` | Workspace overview |
| `/app/leads` | Leads |
| `/app/contacts` | Contacts |
| `/app/pipeline` | Pipeline |
| `/app/conversations` | Conversations |
| `/app/automations` | Automations |
| `/app/ai` | Assistant briefing |
| `/app/analytics` | Qualified vs won |
| `/app/integrations` | Connections |
| `/app/team` | Team |
| `/app/settings` | Operator settings |
| `/app/billing` | Sample plan |

## Source layout

```text
src/
  components/
    ui/          reusable controls
    layout/      marketing and workspace chrome
    marketing/   public-page pieces
    dashboard/   overview metrics
    crm/         leads, contacts, pipeline, conversations
    automation/  automation records
    ai/          briefing panel
    analytics/   charts
  data/          ForgeDataSource and the mock implementation
  hooks/         session, workspace, async reads, disclosure
  lib/           class names, session storage, router
  pages/         route screens
  types/         shared models
  utils/         formatting and focus helpers
```

## Data

Pages do not import raw arrays. They call `forgeData`, a `ForgeDataSource`. The current implementation in `src/data/mock.ts` resolves local sample records for two workspaces, Harbor & Co. and Fieldnote Studio.

To connect a backend, implement the same interface in `src/data/source.ts` and export it from `src/data/index.ts`. Pages and hooks can stay as they are.

Sign-in stores an operator profile in `sessionStorage` for the current tab. It does not call a server. Leads added from the workspace last until refresh.

## Accessibility

The shell includes a skip link, visible focus, keyboard menus, a focus-trapped dialog, and a mobile navigation drawer. Motion follows `prefers-reduced-motion`.
