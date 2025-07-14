const { useState, useEffect } = React;

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

  async createInstance(instanceName) {
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

  async connectInstance(instanceName) {
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

// Componente Dashboard
function Dashboard() {
  const [instances, setInstances] = useState([]);
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
      alert('Erro ao criar instância: ' + error.message);
    }
  };

  const connectInstance = async (instanceName) => {
    try {
      await api.connectInstance(instanceName);
      await loadInstances();
    } catch (error) {
      alert('Erro ao conectar instância: ' + error.message);
    }
  };

  if (loading) {
    return React.createElement('div', { 
      className: 'flex items-center justify-center h-64' 
    }, 
      React.createElement('div', { 
        className: 'text-lg text-gray-600' 
      }, 'Carregando instâncias...')
    );
  }

  return React.createElement('div', { className: 'min-h-screen bg-gray-50' },
    React.createElement('header', { className: 'bg-white shadow border-b' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-6 py-4' },
        React.createElement('h1', { className: 'text-2xl font-bold text-gray-900' }, 
          'WhatsApp SaaS Multi-Cliente'
        )
      )
    ),
    React.createElement('main', { className: 'max-w-7xl mx-auto px-6 py-8' },
      React.createElement('div', { className: 'space-y-6' },
        React.createElement('div', { className: 'flex items-center justify-between' },
          React.createElement('h2', { className: 'text-3xl font-bold text-gray-900' }, 
            'Dashboard'
          ),
          React.createElement('button', {
            onClick: createInstance,
            className: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          }, '+ Nova Instância')
        ),
        instances.length === 0 ? 
          React.createElement('div', { className: 'text-center py-12' },
            React.createElement('p', { className: 'text-gray-500 mb-4' }, 
              'Nenhuma instância criada ainda'
            ),
            React.createElement('button', {
              onClick: createInstance,
              className: 'px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            }, 'Criar Primeira Instância')
          ) :
          React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
            ...instances.map((instance, index) =>
              React.createElement('div', {
                key: instance.instanceName || index,
                className: 'bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow'
              },
                React.createElement('div', { className: 'flex items-center justify-between mb-4' },
                  React.createElement('h3', { className: 'font-semibold text-gray-900' }, 
                    instance.instanceName
                  ),
                  React.createElement('div', {
                    className: `px-2 py-1 rounded-full text-xs font-medium ${
                      instance.connectionStatus === 'open' 
                        ? 'bg-green-100 text-green-800'
                        : instance.connectionStatus === 'connecting'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`
                  }, instance.connectionStatus || 'disconnected')
                ),
                instance.profileName && 
                  React.createElement('p', { className: 'text-sm text-gray-600 mb-2' }, 
                    instance.profileName
                  ),
                instance.number && 
                  React.createElement('p', { className: 'text-sm text-gray-600 mb-4' }, 
                    instance.number
                  ),
                React.createElement('div', { className: 'space-y-2' },
                  React.createElement('button', {
                    onClick: () => connectInstance(instance.instanceName),
                    className: 'w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                  }, 'Conectar'),
                  React.createElement('button', {
                    onClick: () => window.open(`/api/instance/qrcode/${instance.instanceName}`, '_blank'),
                    className: 'w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors'
                  }, 'Ver QR Code')
                )
              )
            )
          )
      )
    )
  );
}

// Renderizar a aplicação
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Dashboard));