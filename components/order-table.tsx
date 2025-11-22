'use client'

import { Edit2, Trash2, Eye, Truck, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OrderTableProps {
  orders: any[]
  onEdit: (order: any) => void
  onDelete: (id: number) => void
  onView: (order: any) => void
  onMarkAsDelivered: (id: number) => void
}

export default function OrderTable({ orders, onEdit, onDelete, onView, onMarkAsDelivered }: OrderTableProps) {
  // Fonction de sécurité pour toutes les valeurs
  const safeValue = (value: any, defaultValue: any = '') => {
    if (value === undefined || value === null) return defaultValue
    return value
  }

  // Formatage sécurisé du prix
  const formatPrice = (price: any) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '0 Ar'
    }
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return isNaN(numPrice) ? '0 Ar' : numPrice.toLocaleString('fr-FR') + ' Ar'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">N° Commande</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Client</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Produit</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Quantité</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Montant</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Statut</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr 
              key={safeValue(order.id)} 
              className="border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => onView(order)}
            >
              <td className="px-6 py-4 text-sm text-foreground font-medium">
                {safeValue(order.orderNumber)}
              </td>
              <td className="px-6 py-4 text-sm text-foreground">
                {safeValue(order.clientName)}
              </td>
              <td className="px-6 py-4 text-sm text-foreground">
                {safeValue(order.product)}
              </td>
              <td className="px-6 py-4 text-sm text-foreground">
                {safeValue(order.quantity)}
              </td>
              <td className="px-6 py-4 text-sm text-foreground font-semibold">
                {formatPrice(order.totalPrice)}
              </td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  safeValue(order.status) === 'Livré' ? 'bg-green-500/20 text-green-400' :
                  safeValue(order.status) === 'En cours' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {safeValue(order.status, 'En attente')}
                </span>
              </td>
              <td className="px-6 py-4 text-sm" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onView(order)}
                    className="text-blue-500 hover:bg-blue-500/20"
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {/* Bouton pour marquer comme livré - seulement si pas déjà livré */}
                  {safeValue(order.status) !== 'Livré' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onMarkAsDelivered(safeValue(order.id))}
                      className="text-green-500 hover:bg-green-500/20"
                      title="Marquer comme livré"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(order)}
                    className="text-accent hover:bg-accent/20"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(safeValue(order.id))}
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