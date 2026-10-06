import { leadSourceNames, leadStatuses, type LeadDraft, type SalesLead } from '@/data/leads/leadTypes'

export function leadsToCsv(leads: SalesLead[]) {
  const header = ['firstName', 'lastName', 'email', 'phone', 'company', 'title', 'source', 'status', 'score', 'owner', 'tags', 'location']
  const lines = leads.map((lead) =>
    [lead.firstName, lead.lastName, lead.email, lead.phone, lead.company, lead.title, lead.source, lead.status, String(lead.score), lead.owner, lead.tags.join('|'), lead.location]
      .map(csvCell)
      .join(','),
  )
  return [header.join(','), ...lines].join('\n')
}

export function parseLeadCsv(text: string): LeadDraft[] {
  const rows = parseRows(text)
  if (rows.length < 2) return []
  const header = rows[0].map((cell) => cell.trim().toLowerCase())
  const index = (name: string) => header.indexOf(name)
  return rows.slice(1).flatMap((row) => {
    const firstName = cell(row, index('firstname'))
    const lastName = cell(row, index('lastname'))
    const email = cell(row, index('email'))
    if (!firstName || !lastName || !email) return []
    const status = cell(row, index('status'))
    const source = cell(row, index('source'))
    const score = Number(cell(row, index('score')))
    return [
      {
        firstName,
        lastName,
        email,
        phone: cell(row, index('phone')),
        company: cell(row, index('company')),
        title: cell(row, index('title')),
        location: cell(row, index('location')),
        source: leadSourceNames.find((item) => item.toLowerCase() === source.toLowerCase()) ?? 'Other',
        status: leadStatuses.find((item) => item.toLowerCase() === status.toLowerCase()) ?? 'New',
        score: Number.isFinite(score) ? Math.min(100, Math.max(0, Math.round(score))) : 50,
        owner: cell(row, index('owner')),
        tags: cell(row, index('tags'))
          .split('|')
          .map((tag) => tag.trim())
          .filter(Boolean),
        notes: '',
      },
    ]
  })
}

function cell(row: string[], index: number) {
  if (index < 0) return ''
  return row[index]?.trim() ?? ''
}

function csvCell(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`
  return value
}

function parseRows(text: string) {
  const rows: string[][] = []
  let row: string[] = []
  let current = ''
  let quoted = false
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          current += '"'
          i += 1
        } else quoted = false
      } else current += char
      continue
    }
    if (char === '"') quoted = true
    else if (char === ',') {
      row.push(current)
      current = ''
    } else if (char === '\n') {
      row.push(current)
      rows.push(row)
      row = []
      current = ''
    } else if (char !== '\r') current += char
  }
  if (current.length > 0 || row.length > 0) {
    row.push(current)
    rows.push(row)
  }
  return rows.filter((item) => item.some((value) => value.trim().length > 0))
}
