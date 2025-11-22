'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

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
  productImages?: string[] // Changé pour supporter plusieurs images
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
    productImages: [] // Tableau vide pour les images
  })

  const [imagePreviews, setImagePreviews] = useState<string[]>([]) // Tableau pour les aperçus

  // Fonction pour convertir une date ISO en format yyyy-MM-dd
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

  // Fonction pour générer un nouveau numéro de commande
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
      // Mode création - générer le numéro de commande
      generateOrderNumber()
    } else {
      // Mode édition - pré-remplir avec les données existantes
      console.log('📝 Données initiales pour édition:', initialData)
      
      // Formater la date correctement pour l'input
      const rawDate = initialData.order_date || initialData.date
      const formattedDate = formatDateForInput(rawDate)
      
      // Récupérer le numéro de commande existant
      const existingOrderNumber = initialData.order_number || initialData.orderNumber
      
      // Gérer les images (supporte ancien format single image et nouveau format multiple)
      let initialImages: string[] = []
      if (initialData.product_images && Array.isArray(initialData.product_images)) {
        initialImages = initialData.product_images
      } else if (initialData.productImages && Array.isArray(initialData.productImages)) {
        initialImages = initialData.productImages
      } else if (initialData.product_image) {
        initialImages = [initialData.product_image] // Convertir ancien format en tableau
      } else if (initialData.productImage) {
        initialImages = [initialData.productImage] // Convertir ancien format en tableau
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
      
      // Afficher les images existantes
      setImagePreviews(initialImages)
    }
  }, [initialData])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newImages: string[] = []
    const newPreviews: string[] = []

    // Limiter à 5 images maximum
    const remainingSlots = 5 - imagePreviews.length
    const filesToProcess = Array.from(files).slice(0, remainingSlots)

    if (filesToProcess.length === 0) {
      alert('Vous ne pouvez pas ajouter plus de 5 images')
      return
    }

    let processedCount = 0

    filesToProcess.forEach((file) => {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert(`Le fichier "${file.name}" n'est pas une image valide`)
        return
      }

      // Vérifier la taille (max 5MB)
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
        
        // Quand toutes les images sont traitées
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Vérifier que le numéro de commande est défini
    if (!formData.orderNumber || formData.orderNumber === 'CMD-000') {
      alert('Erreur: Le numéro de commande n\'est pas défini')
      return
    }
    
    // Calcul sécurisé
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
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Nom du Client</label>
          <select
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Sélectionnez un client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.name}>
                {client.name} - {client.email}
              </option>
            ))}
          </select>
          {initialData && formData.clientName && (
            <p className="text-xs text-muted-foreground mt-1">
              Client actuel: {formData.clientName}
            </p>
          )}
        </div>

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

        {/* NOUVEAU : Cadre carré compact pour plusieurs images */}
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
          
          {/* Instructions */}
          <p className="text-xs text-muted-foreground mt-2">
            Maximum 5 images. Formats supportés: JPG, PNG, JPEG
          </p>
        </div>
        
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