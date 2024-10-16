'use client'

import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import * as XLSX from 'xlsx'
import unidecode from 'unidecode'
import { SettingsDialog } from './Settings'

type ReplacementRule = {
  from: string;
  to: string;
  action: 'replace' | 'keep';
};

export default function EmailNormalizer() {
  const [manualEmails, setManualEmails] = useState('')
  const [normalizedEmails, setNormalizedEmails] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [replacements, setReplacements] = useState<ReplacementRule[]>([])

  useEffect(() => {
    const savedReplacements = localStorage.getItem('emailNormalizerReplacements');
    if (savedReplacements) {
      setReplacements(JSON.parse(savedReplacements));
    }
  }, []);

  const normalizeEmails = (emails: string) => {
    return emails
      .split('\n')
      .map(email => {
        let normalizedEmail = unidecode(email.trim());
        replacements.forEach(rule => {
          if (rule.action === 'replace') {
            normalizedEmail = normalizedEmail.replace(new RegExp(rule.from, 'g'), rule.to);
          }
        });
        return normalizedEmail;
      })
      .join('\n')
  }

  const handleManualSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const normalized = normalizeEmails(manualEmails)
    setNormalizedEmails(normalized)
  }

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]
      const emails = jsonData.flat().filter(Boolean).join('\n')
      const normalized = normalizeEmails(emails)
      setNormalizedEmails(normalized)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([normalizedEmails], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'normalized_emails.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-8 relative">
      <SettingsDialog />
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="manual">Manual Input</TabsTrigger>
          <TabsTrigger value="file">File Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="manual-emails">Enter emails (one per line)</Label>
              <Textarea
                id="manual-emails"
                value={manualEmails}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setManualEmails(e.target.value)}
                placeholder="Enter emails here..."
                className="min-h-[200px]"
              />
            </div>
            <Button type="submit">Normalize Emails</Button>
          </form>
        </TabsContent>
        <TabsContent value="file">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload Excel file</Label>
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                accept=".xlsx,.xls"
              />
            </div>
            {file && <p className="text-sm text-gray-500">File uploaded: {file.name}</p>}
          </div>
        </TabsContent>
      </Tabs>

      {normalizedEmails && (
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold">Normalized Emails</h2>
          <Textarea
            value={normalizedEmails}
            readOnly
            className="min-h-[200px]"
          />
          <Button onClick={handleDownload}>Download Normalized Emails</Button>
        </div>
      )}
    </div>
  )
}