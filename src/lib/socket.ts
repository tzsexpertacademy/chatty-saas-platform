import { io, Socket } from 'socket.io-client'

class SocketManager {
  private socket: Socket | null = null
  private listeners: Map<string, Function[]> = new Map()

  connect() {
    if (this.socket?.connected) return

    this.socket = io('ws://localhost:8084', {
      transports: ['websocket']
    })

    this.socket.on('connect', () => {
      console.log('Connected to WhatsApp API')
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WhatsApp API')
    })

    // Handle WhatsApp events
    this.socket.on('qrcode.updated', (data) => {
      this.emit('qrcode.updated', data)
    })

    this.socket.on('connection.update', (data) => {
      this.emit('connection.update', data)
    })

    this.socket.on('messages.upsert', (data) => {
      this.emit('messages.upsert', data)
    })

    this.socket.on('messaging-history.set', (data) => {
      this.emit('messaging-history.set', data)
    })

    // Humanization events
    this.socket.on('typing.start', (data) => {
      this.emit('typing.start', data)
    })

    this.socket.on('typing.stop', (data) => {
      this.emit('typing.stop', data)
    })

    this.socket.on('recording.start', (data) => {
      this.emit('recording.start', data)
    })

    this.socket.on('recording.stop', (data) => {
      this.emit('recording.stop', data)
    })
  }

  disconnect() {
    this.socket?.disconnect()
    this.socket = null
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)?.push(callback)
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      const index = eventListeners.indexOf(callback)
      if (index > -1) {
        eventListeners.splice(index, 1)
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data))
    }
  }

  // Humanization controls
  startTyping(instanceName: string, chatId: string) {
    this.socket?.emit('start-typing', { instanceName, chatId })
  }

  stopTyping(instanceName: string, chatId: string) {
    this.socket?.emit('stop-typing', { instanceName, chatId })
  }

  startRecording(instanceName: string, chatId: string) {
    this.socket?.emit('start-recording', { instanceName, chatId })
  }

  stopRecording(instanceName: string, chatId: string) {
    this.socket?.emit('stop-recording', { instanceName, chatId })
  }
}

export const socketManager = new SocketManager()