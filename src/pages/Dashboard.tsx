import { useState, useEffect } from 'react'
import { WhatsAppInstance } from '../types/whatsapp'
import { api } from '../lib/api'

export function Dashboard() {
  const [instances, setInstances] = useState<WhatsAppInstance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInstances()
  }, [])

  const loadInstances = async () => {
    try {
      const data = await api.getInstances()
      setInstances(data)
    } catch (error) {
      console.error('Erro ao carregar instâncias:', error)
    } finally {
      setLoading(false)
    }
  }

  const createInstance = async () => {
    const instanceName = prompt('Nome da instância:')
    if (!instanceName) return

    try {
      await api.createInstance(instanceName)
      loadInstances()
    } catch (error) {
      console.error('Erro ao criar instância:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Carregando instâncias...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <button
          onClick={createInstance}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Nova Instância
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instances.map((instance) => (
          <div
            key={instance.id}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-card-foreground">{instance.instanceName}</h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                instance.connectionStatus === 'open' 
                  ? 'bg-green-100 text-green-800'
                  : instance.connectionStatus === 'connecting'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {instance.connectionStatus}
              </div>
            </div>
            
            {instance.profileName && (
              <p className="text-sm text-muted-foreground mb-2">
                {instance.profileName}
              </p>
            )}
            
            {instance.number && (
              <p className="text-sm text-muted-foreground mb-4">
                {instance.number}
              </p>
            )}

            <button
              onClick={() => window.location.href = `/instance/${instance.id}`}
              className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Gerenciar
            </button>
          </div>
        ))}
      </div>

      {instances.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhuma instância criada ainda</p>
          <button
            onClick={createInstance}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Criar Primeira Instância
          </button>
        </div>
      )}
    </div>
  )
}