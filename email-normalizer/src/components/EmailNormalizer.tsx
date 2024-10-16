'use client'

import React, { useState } from 'react'
import * as ExcelJS from 'exceljs'
import unidecode from 'unidecode'

export default function EmailNormalizer() {
  const [activeTab, setActiveTab] = useState('manual')
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
      <div className="mb-4">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 ${activeTab === 'manual' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('manual')}
          >
            Manual Input
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'file' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('file')}
          >
            File Upload
          </button>
        </div>
      </div>

      {activeTab === 'manual' && (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label htmlFor="manual-emails" className="block text-sm font-medium text-gray-700">
              Enter emails (one per line)
            </label>
            <textarea
              id="manual-emails"
              value={manualEmails}
              onChange={(e) => setManualEmails(e.target.value)}
              placeholder="Enter emails here..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              rows={5}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Normalize Emails
          </button>
        </form>
      )}

      {activeTab === 'file' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
              Upload Excel file
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              accept=".xlsx,.xls"
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          {file && <p className="text-sm text-gray-500">File uploaded: {file.name}</p>}
        </div>
      )}

      {normalizedEmails && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Normalized Emails</h2>
          <textarea
            value={normalizedEmails}
            readOnly
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            rows={5}
          />
          <button
            onClick={handleDownload}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Download Normalized Emails
          </button>
        </div>
      )}
    </div>
  )
}