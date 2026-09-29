import { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { parseContactCsv } from '@/data/crm/csv'
import { useCrm } from '@/hooks/useCrm'

export function ContactImport({ label = 'Import' }: { label?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { importContacts } = useCrm()

  return (
    <>
      <Button variant="outline" onClick={() => inputRef.current?.click()}>
        {label}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="sr-only"
        aria-label="Import contacts CSV"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (!file) return
          void file.text().then((text) => importContacts(parseContactCsv(text)))
        }}
      />
    </>
  )
}
