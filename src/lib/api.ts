const API_BASE = 'http://localhost:8084'

export const api = {
  // Instance Management
  async getInstances() {
    const response = await fetch(`${API_BASE}/instance`)
    return response.json()
  },

  async createInstance(instanceName: string) {
    const response = await fetch(`${API_BASE}/instance/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instanceName })
    })
    return response.json()
  },

  async deleteInstance(instanceName: string) {
    const response = await fetch(`${API_BASE}/instance/delete/${instanceName}`, {
      method: 'DELETE'
    })
    return response.json()
  },

  async connectInstance(instanceName: string) {
    const response = await fetch(`${API_BASE}/instance/connect/${instanceName}`, {
      method: 'GET'
    })
    return response.json()
  },

  // Chat Management
  async getChats(instanceName: string) {
    const response = await fetch(`${API_BASE}/chat/findChats/${instanceName}`)
    return response.json()
  },

  async getMessages(instanceName: string, chatId: string) {
    const response = await fetch(`${API_BASE}/chat/findMessages/${instanceName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        where: { 
          key: { 
            remoteJid: chatId 
          } 
        } 
      })
    })
    return response.json()
  },

  // Message Sending
  async sendMessage(instanceName: string, data: {
    number: string
    text?: string
    media?: File
    type?: string
  }) {
    const formData = new FormData()
    formData.append('number', data.number)
    
    if (data.text) {
      formData.append('text', data.text)
    }
    
    if (data.media) {
      formData.append('media', data.media)
    }

    const response = await fetch(`${API_BASE}/message/sendText/${instanceName}`, {
      method: 'POST',
      body: formData
    })
    return response.json()
  },

  // Humanization Settings
  async updateHumanizationSettings(instanceName: string, settings: any) {
    // This will be implemented in the backend
    const response = await fetch(`${API_BASE}/instance/humanization/${instanceName}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    })
    return response.json()
  }
}