import { useState, useEffect } from 'react'

// API service para comunicar com backend
const api = {
  async getInstances() {
    try {
      const response = await fetch('/api/instance/fetchInstances');
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar instâncias:', error);
      return [];
    }
  },

  async createInstance(instanceName: string) {
    try {
      const response = await fetch('/api/instance/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instanceName }),
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      throw error;
    }
  },

  async connectInstance(instanceName: string) {
    try {
      const response = await fetch(`/api/instance/connect/${instanceName}`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao conectar instância:', error);
      throw error;
    }
  }
};

interface WhatsAppInstance {
  instanceName: string;
  connectionStatus?: string;
  profileName?: string;
  number?: string;
}

function App() {
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInstances();
  }, []);

  const loadInstances = async () => {
    try {
      const data = await api.getInstances();
      setInstances(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar instâncias:', error);
    } finally {
      setLoading(false);
    }
  };

  const createInstance = async () => {
    const instanceName = prompt('Nome da instância:');
    if (!instanceName) return;

    try {
      await api.createInstance(instanceName);
      await loadInstances();
    } catch (error) {
      alert('Erro ao criar instância: ' + (error as Error).message);
    }
  };

  const connectInstance = async (instanceName: string) => {
    try {
      await api.connectInstance(instanceName);
      await loadInstances();
    } catch (error) {
      alert('Erro ao conectar instância: ' + (error as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Carregando instâncias...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">
            WhatsApp SaaS Multi-Cliente
          </h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
            <button
              onClick={createInstance}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              + Nova Instância
            </button>
          </div>

          {instances.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Nenhuma instância criada ainda
              </p>
              <button
                onClick={createInstance}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Criar Primeira Instância
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instances.map((instance, index) => (
                <div
                  key={instance.instanceName || index}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-card-foreground">
                      {instance.instanceName}
                    </h3>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        instance.connectionStatus === 'open'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : instance.connectionStatus === 'connecting'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {instance.connectionStatus || 'disconnected'}
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

                  <div className="space-y-2">
                    <button
                      onClick={() => connectInstance(instance.instanceName)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Conectar
                    </button>
                    <button
                      onClick={() =>
                        window.open(`/instance/${instance.instanceName}`, '_blank')
                      }
                      className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm font-medium"
                    >
                      Gerenciar
                    </button>
                    <button
                      onClick={() =>
                        window.open(
                          `/api/instance/qrcode/${instance.instanceName}`,
                          '_blank'
                        )
                      }
                      className="w-full px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/90 transition-colors text-sm font-medium"
                    >
                      Ver QR Code
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;