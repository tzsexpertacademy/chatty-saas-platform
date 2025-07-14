export interface WhatsAppInstance {
  id: string
  instanceName: string
  connectionStatus: 'connecting' | 'open' | 'close' | 'qr'
  qrCode?: string
  profilePictureUrl?: string
  profileName?: string
  number?: string
  createdAt: string
  humanizationSettings: HumanizationSettings
}

export interface HumanizationSettings {
  enabled: boolean
  typingDelay: {
    min: number
    max: number
  }
  recordingDelay: {
    min: number
    max: number
  }
  messageChunkSize: number
  emotionalTone: 'neutral' | 'friendly' | 'professional' | 'casual'
  useEmojis: boolean
  randomnessLevel: number // 0-100
}

export interface ChatMessage {
  id: string
  fromMe: boolean
  body: string
  type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'sticker'
  timestamp: string
  mediaUrl?: string
  chatId: string
  isHumanized?: boolean
  humanizedDelay?: number
}

export interface Chat {
  id: string
  remoteJid: string
  name: string
  profilePictureUrl?: string
  lastMessage?: ChatMessage
  unreadCount: number
  isGroup: boolean
  participants?: string[]
}

export interface InstanceStats {
  totalMessages: number
  totalChats: number
  humanizedInteractions: number
  averageResponseTime: number
  uptime: string
}