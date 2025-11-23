'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Image as ImageIcon, Search, ChevronDown } from 'lucide-react'

interface OrderFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: any
  clients?: any[]
}

interface FormData {
  orderNumber: string
  clientName: string
  product: string
  quantity: string
  unitPrice: string
  status: string
  date: string
  productImages?: string[]
}

export default function OrderForm({ onSubmit, onCancel, initialData, clients = [] }: OrderFormProps) {
  const [formData, setFormData] = useState<FormData>({
    orderNumber: '',
    clientName: '',
    product: '',
    quantity: '',
    unitPrice: '',
    status: 'En cours',
    date: new Date().toISOString().split('T')[0],
    productImages: []
  })

  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showClientDropdown, setShowClientDropdown] = useState(false)
  const [filteredClients, setFilteredClients] = useState<any[]>([])

  // Filtrer les clients selon la recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClients(clients)
    } else {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm) ||
        client.city?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredClients(filtered)
    }
  }, [searchTerm, clients])

  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return new Date().toISOString().split('T')[0]
    
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString
      }
      
      if (dateString.includes('T')) {
        return dateString.split('T')[0]
      }
      
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]
      }
      
      return new Date().toISOString().split('T')[0]
    } catch {
      return new Date().toISOString().split('T')[0]
    }
  }

  const generateOrderNumber = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const orders = await response.json()
        
        let nextNumber = 1
        if (orders.length > 0) {
          const numbers = orders
            .map((order: any) => {
              if (!order.order_number) return 0
              const match = order.order_number.match(/CMD-(\d+)/)
              return match ? parseInt(match[1]) : 0
            })
            .filter((num: number) => num > 0)
          
          nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1
        }
        
        const newOrderNumber = `CMD-${nextNumber.toString().padStart(3, '0')}`
        setFormData(prev => ({ ...prev, orderNumber: newOrderNumber }))
      }
    } catch (error) {
      const fallbackNumber = 'CMD-001'
      setFormData(prev => ({ ...prev, orderNumber: fallbackNumber }))
    }
  }

  useEffect(() => {
    if (!initialData) {
      generateOrderNumber()
    } else {
      console.log('📝 Données initiales pour édition:', initialData)
      
      const rawDate = initialData.order_date || initialData.date
      const formattedDate = formatDateForInput(rawDate)
      
      const existingOrderNumber = initialData.order_number || initialData.orderNumber
      
      let initialImages: string[] = []
      if (initialData.product_images && Array.isArray(initialData.product_images)) {
        initialImages = initialData.product_images
      } else if (initialData.productImages && Array.isArray(initialData.productImages)) {
        initialImages = initialData.productImages
      } else if (initialData.product_image) {
        initialImages = [initialData.product_image]
      } else if (initialData.productImage) {
        initialImages = [initialData.productImage]
      }

      setFormData({
        orderNumber: existingOrderNumber || 'CMD-000',
        clientName: initialData.client_name || initialData.clientName || '',
        product: initialData.product || '',
        quantity: initialData.quantity?.toString() || '',
        unitPrice: initialData.unit_price?.toString() || initialData.unitPrice?.toString() || '',
        status: initialData.status || 'En cours',
        date: formattedDate,
        productImages: initialImages
      })
      
      setImagePreviews(initialImages)
    }
  }, [initialData])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newImages: string[] = []
    const newPreviews: string[] = []

    const remainingSlots = 5 - imagePreviews.length
    const filesToProcess = Array.from(files).slice(0, remainingSlots)

    if (filesToProcess.length === 0) {
      alert('Vous ne pouvez pas ajouter plus de 5 images')
      return
    }

    let processedCount = 0

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert(`Le fichier "${file.name}" n'est pas une image valide`)
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`L'image "${file.name}" ne doit pas dépasser 5MB`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string
        newImages.push(imageDataUrl)
        newPreviews.push(imageDataUrl)
        
        processedCount++
        
        if (processedCount === filesToProcess.length) {
          setFormData(prev => ({ 
            ...prev, 
            productImages: [...(prev.productImages || []), ...newImages] 
          }))
          setImagePreviews(prev => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({
      ...prev,
      productImages: (prev.productImages || []).filter((_, i) => i !== index)
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev: FormData) => ({ ...prev, [name]: value }))
  }

  const handleClientSelect = (clientName: string) => {
    setFormData(prev => ({ ...prev, clientName }))
    setShowClientDropdown(false)
    setSearchTerm('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.orderNumber || formData.orderNumber === 'CMD-000') {
      alert('Erreur: Le numéro de commande n\'est pas défini')
      return
    }
    
    const quantity = parseFloat(formData.quantity) || 0
    const unitPrice = parseFloat(formData.unitPrice) || 0
    const totalPrice = quantity * unitPrice
    
    console.log('🧮 Données soumises:', { 
      orderNumber: formData.orderNumber,
      clientName: formData.clientName,
      product: formData.product,
      quantity,
      unitPrice,
      totalPrice,
      imageCount: formData.productImages?.length || 0
    })
    
    onSubmit({ 
      ...formData, 
      totalPrice,
      quantity: quantity,
      unitPrice: unitPrice
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Numéro de commande */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">N° Commande</label>
          <input
            type="text"
            name="orderNumber"
            value={formData.orderNumber}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="CMD-001"
            readOnly
          />
          {initialData && (
            <p className="text-xs text-muted-foreground mt-1">
              Numéro de commande: {formData.orderNumber}
            </p>
          )}
        </div>
        
        {/* Sélection du client avec recherche */}
        <div className="relative">
          <label className="block text-sm font-medium text-foreground mb-1">Nom du Client</label>
          <div className="relative">
            <div className="flex items-center">
              <input
                type="text"
                value={searchTerm || formData.clientName}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  if (!showClientDropdown) setShowClientDropdown(true)
                }}
                onFocus={() => setShowClientDropdown(true)}
                placeholder="Rechercher un client..."
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
              />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>
            
            {/* Dropdown des clients */}
            {showClientDropdown && (
              <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-md shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                {/* Barre de recherche dans le dropdown */}
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom, email, téléphone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-2 py-1 rounded border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Liste des clients */}
                <div className="max-h-48 overflow-y-auto">
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <button
                        key={client.id}
                        type="button"
                        onClick={() => handleClientSelect(client.name)}
                        className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border last:border-b-0"
                      >
                        <div className="font-medium text-foreground">{client.name}</div>
                        <div className="text-xs text-muted-foreground flex flex-wrap gap-2 mt-1">
                          {client.phone && <span>📞 {client.phone}</span>}
                          {client.email && <span>✉️ {client.email}</span>}
                          {client.city && <span>🏙️ {client.city}</span>}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-muted-foreground">
                      <div className="text-sm">Aucun client trouvé</div>
                      <div className="text-xs mt-1">Essayez une autre recherche</div>
                    </div>
                  )}
                </div>

                {/* Bouton fermer */}
                <div className="p-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowClientDropdown(false)}
                    className="w-full text-center text-sm text-muted-foreground hover:text-foreground py-1"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Client sélectionné */}
          {formData.clientName && !showClientDropdown && (
            <div className="mt-2 p-2 bg-primary/10 rounded-md border border-primary/20">
              <div className="text-sm font-medium text-primary">Client sélectionné:</div>
              <div className="text-sm text-foreground">{formData.clientName}</div>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, clientName: '' }))
                  setSearchTerm('')
                }}
                className="text-xs text-destructive hover:text-destructive/80 mt-1"
              >
                Changer de client
              </button>
            </div>
          )}

          {/* Indicateur de résultats */}
          {showClientDropdown && searchTerm && (
            <div className="absolute top-full left-0 right-0 bg-card/95 backdrop-blur-sm rounded-b-md border border-t-0 border-border p-2 z-20">
              <div className="text-xs text-muted-foreground text-center">
                {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} trouvé{filteredClients.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>

        {/* Produit */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Produit</label>
          <input
            type="text"
            name="product"
            value={formData.product}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Produit A"
          />
        </div>

        {/* Images du produit */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Images du Produit ({imagePreviews.length}/5)
          </label>
          
          <div className="flex flex-wrap gap-3">
            {/* Bouton d'upload */}
            {imagePreviews.length < 5 && (
              <div className="flex-shrink-0">
                <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-border rounded-md cursor-pointer bg-input hover:bg-input/80 transition-colors">
                  <Upload className="w-5 h-5 mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground text-center px-1">
                    Ajouter
                  </p>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            )}
            
            {/* Aperçus des images */}
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img 
                  src={preview} 
                  alt={`Aperçu ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md border border-border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-1 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs rounded px-1">
                  {index + 1}
                </div>
              </div>
            ))}
            
            {/* Message si aucune image */}
            {imagePreviews.length === 0 && (
              <div className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-border rounded-md bg-input">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            Maximum 5 images. Formats supportés: JPG, PNG, JPEG
          </p>
        </div>
        
        {/* Quantité */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Quantité</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="10"
            min="1"
          />
        </div>
        
        {/* Prix unitaire */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Prix Unitaire (Ar)</label>
          <input
            type="number"
            step="0.01"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="100"
            min="0"
          />
        </div>
        
        {/* Statut */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Statut</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="En attente">En attente</option>
            <option value="En cours">En cours</option>
            <option value="Livré">Livré</option>
          </select>
        </div>

        {/* Date de commande */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Date de commande</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      
      {/* Boutons d'action */}
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
