import type { ContactDraft, CrmContact } from '@/data/crm/crmTypes'
import { companyStatuses, crmStatuses, type CompanyDraft } from '@/data/crm/crmTypes'

export function contactsToCsv(contacts: CrmContact[], companyName: (id: string) => string) {
  const header = ['firstName', 'lastName', 'email', 'phone', 'company', 'title', 'status', 'owner', 'tags', 'location']
  const lines = contacts.map((contact) =>
    [
      contact.firstName,
      contact.lastName,
      contact.email,
      contact.phone,
      companyName(contact.companyId),
      contact.title,
      contact.status,
      contact.owner,
      contact.tags.join('|'),
      contact.location,
    ]
      .map(csvCell)
      .join(','),
  )
  return [header.join(','), ...lines].join('\n')
}

export function parseContactCsv(text: string): ContactDraft[] {
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
    return [
      {
        firstName,
        lastName,
        email,
        phone: cell(row, index('phone')),
        companyId: cell(row, index('company')),
        title: cell(row, index('title')),
        status: crmStatuses.find((item) => item.toLowerCase() === status.toLowerCase()) ?? 'New',
        owner: cell(row, index('owner')),
        tags: cell(row, index('tags'))
          .split('|')
          .map((tag) => tag.trim())
          .filter(Boolean),
        location: cell(row, index('location')),
      },
    ]
  })
}

export function parseCompanyCsv(text: string): CompanyDraft[] {
  const rows = parseRows(text)
  if (rows.length < 2) return []
  const header = rows[0].map((cell) => cell.trim().toLowerCase())
  const index = (name: string) => header.indexOf(name)
  return rows.slice(1).flatMap((row) => {
    const name = cell(row, index('name')) || cell(row, index('company'))
    if (!name) return []
    const status = cell(row, index('status'))
    return [
      {
        name,
        industry: cell(row, index('industry')) || 'General',
        website: cell(row, index('website')),
        phone: cell(row, index('phone')),
        location: cell(row, index('location')),
        owner: cell(row, index('owner')),
        status: companyStatuses.find((item) => item.toLowerCase() === status.toLowerCase()) ?? 'Prospect',
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
