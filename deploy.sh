#!/bin/bash

# Script de Deploy - WhatsApp SaaS
echo "=== WhatsApp SaaS - Deploy Script ==="

# 1. Setup do Backend
echo "📦 Configurando Backend..."
mkdir -p backend
cd backend

# Criando package.json do backend
cat > package.json << 'EOF'
{
  "name": "whatsapp-api-backend",
  "version": "1.3.5",
  "description": "Rest api for communication with WhatsApp",
  "main": "./dist/src/main.js",
  "scripts": {
    "build": "tsc",
    "start": "cross-env NODE_ENV=dev ts-node --files --transpile-only ./src/main.ts",
    "start:prod": "cross-env NODE_ENV=prod bash start.sh",
    "start:dev": "cross-env NODE_ENV=dev tsnd --files --transpile-only --respawn --ignore-watch node_modules ./src/main.ts"
  },
  "dependencies": {
    "@adiwajshing/keyed-db": "^0.2.4",
    "@hapi/boom": "^10.0.1",
    "@prisma/client": "^6.10.1",
    "@whiskeysockets/baileys": "^6.7.16",
    "axios": "^1.7.7",
    "class-validator": "^0.14.0",
    "cross-env": "^7.0.3",
    "dayjs": "^1.11.13",
    "dotenv": "^16.3.1",
    "eventemitter2": "^6.4.9",
    "express": "^4.21.0",
    "express-async-errors": "^3.1.1",
    "express-session": "^1.17.3",
    "jsonwebtoken": "^9.0.2",
    "socket.io": "^4.8.1",
    "typescript": "^5.4.5",
    "ts-node": "^10.9.2"
  }
}
EOF

# Instalando dependências do backend
echo "📥 Instalando dependências do backend..."
npm install

# 2. Criando servidor básico
mkdir -p src
cat > src/main.ts << 'EOF'
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Mock data para desenvolvimento
const instances = [
  {
    id: '1',
    instanceName: 'Instancia Demo',
    connectionStatus: 'open',
    profileName: 'WhatsApp Bot',
    number: '+55 11 99999-9999',
    createdAt: new Date().toISOString(),
    humanizationSettings: {
      enabled: true,
      typingDelay: { min: 1000, max: 3000 },
      recordingDelay: { min: 2000, max: 5000 },
      messageChunkSize: 500,
      emotionalTone: 'friendly',
      useEmojis: true,
      randomnessLevel: 70
    }
  }
];

// Routes
app.get('/instance', (req, res) => {
  res.json(instances);
});

app.post('/instance/create', (req, res) => {
  const { instanceName } = req.body;
  const newInstance = {
    id: (instances.length + 1).toString(),
    instanceName,
    connectionStatus: 'connecting',
    createdAt: new Date().toISOString(),
    humanizationSettings: {
      enabled: true,
      typingDelay: { min: 1000, max: 3000 },
      recordingDelay: { min: 2000, max: 5000 },
      messageChunkSize: 500,
      emotionalTone: 'neutral',
      useEmojis: false,
      randomnessLevel: 50
    }
  };
  instances.push(newInstance);
  res.json(newInstance);
});

// Socket.IO para eventos em tempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 8084;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Socket.IO ativo para eventos em tempo real`);
});
EOF

cd ..

# 3. Setup do Frontend (React)
echo "🎨 Configurando Frontend..."

# O frontend já está configurado no projeto atual
echo "✅ Frontend já configurado"

# 4. Docker setup
echo "🐳 Configurando Docker..."
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # Backend API
  backend:
    build: ./backend
    ports:
      - "8084:8084"
    environment:
      - NODE_ENV=production
      - PORT=8084
    volumes:
      - ./backend:/app
      - /app/node_modules
    restart: unless-stopped

  # Frontend (React)
  frontend:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - backend
    restart: unless-stopped

  # PostgreSQL Database
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: whatsapp_saas
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: senha123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
EOF

# 5. Scripts de inicialização
cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando ambiente de desenvolvimento..."

# Inicia o backend
cd backend && npm run start:dev &
BACKEND_PID=$!

# Volta para raiz e inicia frontend
cd ..
npm run dev &
FRONTEND_PID=$!

echo "✅ Backend rodando no PID $BACKEND_PID (porta 8084)"
echo "✅ Frontend rodando no PID $FRONTEND_PID (porta 8080)"
echo "🌐 Acesse: http://localhost:8080"

# Aguarda interrupção
wait
EOF

cat > start-prod.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando ambiente de produção..."

# Build do frontend
npm run build

# Inicia com Docker
docker-compose up -d

echo "✅ Aplicação rodando em produção"
echo "🌐 Frontend: http://localhost:8080"
echo "🔧 Backend API: http://localhost:8084"
EOF

# Tornar scripts executáveis
chmod +x start-dev.sh start-prod.sh

echo "🎉 Deploy configurado com sucesso!"
echo ""
echo "📋 Para iniciar:"
echo "   Development: ./start-dev.sh"
echo "   Production:  ./start-prod.sh"
echo ""
echo "🔗 URLs:"
echo "   Frontend: http://localhost:8080"
echo "   Backend:  http://localhost:8084"