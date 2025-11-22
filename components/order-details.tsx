'use client'

import { X, Calendar, User, Package, DollarSign, Hash, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface OrderDetailsProps {
  order: any
  onClose: () => void
}

export default function OrderDetails({ order, onClose }: OrderDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Fonction de sécurité pour les valeurs
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

  // Formatage de la date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non spécifiée'
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Date invalide'
    }
  }

  // Récupérer les images (support ancien et nouveau format)
  const getProductImages = (): string[] => {
    // Nouveau format: tableau d'images
    if (order.productImages && Array.isArray(order.productImages)) {
      return order.productImages
    }
    // Ancien format: image unique
    if (order.productImage) {
      return [order.productImage]
    }
    // Format API
    if (order.product_images && Array.isArray(order.product_images)) {
      return order.product_images
    }
    return []
  }

  const productImages = getProductImages()
  const hasImages = productImages.length > 0
  const currentImage = productImages[currentImageIndex]

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === productImages.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? productImages.length - 1 : prev - 1
    )
  }

  console.log('📋 Données de la commande reçues dans OrderDetails:', order)
  console.log('🖼️ Images trouvées:', productImages)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Détails de la Commande</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Section Images - Améliorée */}
          {hasImages ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground text-lg">Images du Produit</h3>
              
              {/* Image principale avec navigation */}
              <div className="relative bg-secondary/30 rounded-lg p-4">
                <div className="flex justify-center items-center">
                  <div className="relative">
                    <img 
                      src={currentImage} 
                      alt={`Produit ${currentImageIndex + 1}`}
                      className="max-h-80 max-w-full object-contain rounded-lg border border-border"
                    />
                    
                    {/* Navigation si plusieurs images */}
                    {productImages.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Indicateur d'image */}
                {productImages.length > 1 && (
                  <div className="text-center mt-3">
                    <p className="text-sm text-muted-foreground">
                      Image {currentImageIndex + 1} sur {productImages.length}
                    </p>
                  </div>
                )}
              </div>

              {/* Vignettes des images (si plusieurs) */}
              {productImages.length > 1 && (
                <div className="flex justify-center gap-2 flex-wrap">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 rounded-md border-2 overflow-hidden transition-all ${
                        index === currentImageIndex 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`Vignette ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Message si pas d'images
            <div className="border border-border rounded-lg p-8 text-center bg-secondary/10">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                Aucune image disponible
              </h3>
              <p className="text-muted-foreground">
                Aucune image n'a été ajoutée pour ce produit
              </p>
            </div>
          )}

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Numéro de commande</p>
                  <p className="font-semibold text-foreground text-lg">
                    {safeValue(order.orderNumber, 'Non spécifié')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-semibold text-foreground text-lg">
                    {safeValue(order.clientName, 'Non spécifié')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Produit</p>
                  <p className="font-semibold text-foreground text-lg">
                    {safeValue(order.product, 'Non spécifié')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Date de commande</p>
                  <p className="font-semibold text-foreground">
                    {formatDate(safeValue(order.date))}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Statut</p>
                <span className={`px-3 py-2 rounded-full text-sm font-medium ${
                  safeValue(order.status) === 'Livré' ? 'bg-green-500/20 text-green-400' :
                  safeValue(order.status) === 'En cours' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {safeValue(order.status, 'En attente')}
                </span>
              </div>

              {/* Information sur les images */}
              {hasImages && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Images</p>
                  <p className="font-semibold text-foreground">
                    {productImages.length} image{productImages.length > 1 ? 's' : ''} disponible{productImages.length > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Détails financiers */}
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-4 text-lg">Détails financiers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-secondary/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Quantité</p>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {safeValue(order.quantity, 0)}
                </p>
              </div>

              <div className="bg-secondary/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Prix unitaire</p>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {formatPrice(order.unitPrice)}
                </p>
              </div>

              <div className="bg-primary/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <p className="text-sm text-primary font-medium">Total</p>
                </div>
                <p className="text-lg font-bold text-primary">
                  {formatPrice(order.totalPrice)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div className="flex justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  )
}