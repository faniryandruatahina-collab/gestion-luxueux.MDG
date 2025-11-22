'use client'

import { Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ClientTableProps {
  clients: any[]
  onEdit: (client: any) => void
  onDelete: (id: number) => void
}

export default function ClientTable({ clients, onEdit, onDelete }: ClientTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Nom</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Téléphone</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Adresse</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
              <td className="px-6 py-4 text-sm text-foreground font-medium">{client.name}</td>
              <td className="px-6 py-4 text-sm text-foreground">{client.email}</td>
              <td className="px-6 py-4 text-sm text-foreground">{client.phone}</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{client.address}, {client.zip}</td>
              <td className="px-6 py-4 text-sm">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(client)}
                    className="text-accent hover:bg-accent/20"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(client.id)}
                    className="text-destructive hover:bg-destructive/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
