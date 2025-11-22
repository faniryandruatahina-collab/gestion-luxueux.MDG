'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, TrendingUp, DollarSign, Package, CheckCircle, Users, Lock } from 'lucide-react'

interface DashboardData {
  totalRevenue: number
  totalProfit: number
  ordersCount: number
  clientsCount: number
  revenueChange: number
  profitChange: number
}

interface Order {
  id: number
  order_number: string
  client_name: string
  total_price: number
  status: string
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardData>({
    totalRevenue: 0,
    totalProfit: 0,
    ordersCount: 0,
    clientsCount: 0,
    revenueChange: 0,
    profitChange: 0
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const auth = localStorage.getItem('adminAuth')
    const loginTime = localStorage.getItem('adminLoginTime')
    
    if (auth && loginTime && (Date.now() - parseInt(loginTime)) < 24 * 60 * 60 * 1000) {
      setIsAuthenticated(true)
      fetchDashboardData()
    } else {
      localStorage.removeItem('adminAuth')
      localStorage.removeItem('adminLoginTime')
      router.push('/admin')
    }
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const [clientsRes, ordersRes] = await Promise.all([
        fetch('/api/clients'),
        fetch('/api/orders')
      ])

      if (!clientsRes.ok || !ordersRes.ok) {
        throw new Error('Erreur lors du chargement des données')
      }

      const clients = await clientsRes.json()
      const orders = await ordersRes.json()

      const totalRevenue = orders.reduce((sum: number, order: any) => {
        const revenue = parseFloat(order.total_price) || 0
        return sum + revenue
      }, 0)
      
      const totalProfit = totalRevenue * 0.36

      const sortedOrders = orders
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .
