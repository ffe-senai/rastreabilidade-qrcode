# SMART 4.0 - Módulo G4 (Rastreabilidade & QR Code)

Remote Module Federation (Vite). Porta 8083. Tipos conforme `src/contract/contrato-smart40-v0_1.ts`.

## Rodar sozinho (sem o Shell)
    npm install
    npm run dev          # http://localhost:8083  (remoteEntry em /remoteEntry.js)

## Integrar no App Shell (Grupo 1)
Config do host (vite + @module-federation/vite):

    remotes: {
      smart40_g4: { type: 'module', name: 'smart40_g4', entry: 'http://localhost:8083/remoteEntry.js' },
    },
    shared: { react: { singleton: true }, 'react-dom': { singleton: true } }

Uso:

    const Traceability = lazy(() => import('smart40_g4/Traceability'));
    <Traceability bus={bus} />

`bus` = `{ subscribe(handler) => unsubscribe, publish(event) }`.
O módulo consome: `traceability.piece-scanned`, `connection.state`, `machine.telemetry`.
O módulo publica: `traceability.piece-scanned` (source `mock`) quando há leitura local (câmera/manual).

O conteúdo do QR é o ID da peça (`pieceId` e `code` recebem o mesmo valor).
O histórico fica em memória (some ao recarregar). O CSS é escopado em `.g4` para não afetar o Shell.
