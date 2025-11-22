'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface ClientFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: any
}

interface FormData {
  name: string
  phone: string
  address: string
  city: string
}

export default function ClientForm({ onSubmit, onCancel, initialData }: ClientFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: '',
    city: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        city: initialData.city || '',
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: FormData) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Nom</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Nom de l'entreprise"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Téléphone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="01 23 45 67 89"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Adresse</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Rue de la paix"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Ville</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Paris"
          />
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          {initialData ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </div>
    </form>
  )
}
