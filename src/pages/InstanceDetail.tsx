import { useParams } from 'react-router-dom'

export function InstanceDetail() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Instância {id}</h2>
      
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-muted-foreground">
          Página de gerenciamento da instância em desenvolvimento...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Aqui será implementado:
        </p>
        <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
          <li>Interface de chat em tempo real</li>
          <li>Configurações de humanização</li>
          <li>Estatísticas da instância</li>
          <li>Logs de atividade</li>
        </ul>
      </div>
    </div>
  )
}