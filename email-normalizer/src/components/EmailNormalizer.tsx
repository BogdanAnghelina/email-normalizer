'use client'

import React, { useState } from 'react'
import * as ExcelJS from 'exceljs'
import unidecode from 'unidecode'

export default function EmailNormalizer() {
  const [manualEmails, setManualEmails] = useState('')
  const [normalizedEmails, setNormalizedEmails] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const normalizeEmails = (emails: string) => {
    return emails
      .split('\n')
      .map(email => unidecode(email.trim()))
      .join('\n')
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = normalizeEmails(manualEmails)
    setNormalizedEmails(normalized)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(await file.arrayBuffer())
      const worksheet = workbook.getWorksheet(1)
      const emails: string[] = []
      worksheet?.eachRow((row) => {
        const email = row.getCell(1).text
        if (email) emails.push(email)
      })
      const normalized = normalizeEmails(emails.join('\n'))
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
    <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-8">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Manual Input</h2>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <textarea
              value={manualEmails}
              onChange={(e) => setManualEmails(e.target.value)}
              placeholder="Enter emails here (one per line)..."
              className="w-full h-40 p-2 border rounded"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Normalize Emails</button>
          </form>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">File Upload</h2>
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".xlsx,.xls"
            className="mb-2"
          />
          {file && <p className="text-sm text-gray-500">File uploaded: {file.name}</p>}
        </div>
      </div>

      {normalizedEmails && (
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold">Normalized Emails</h2>
          <textarea
            value={normalizedEmails}
            readOnly
            className="w-full h-40 p-2 border rounded"
          />
          <button onClick={handleDownload} className="bg-green-500 text-white px-4 py-2 rounded">Download Normalized Emails</button>
        </div>
      )}
    </div>
  )
}