# 🏭 SMART 4.0 – Módulo G4: Rastreabilidade & QR Code

Módulo do **Grupo 4** da Estação SMART 4.0. Lê o QR Code das peças, registra o histórico de rastreabilidade e mostra o resultado da inspeção (aprovada, rejeitada ou pendente). Funciona como um **remote de Module Federation**, carregado pelo App Shell do Grupo 1.

---

## 📚 Objetivo do Projeto

* Identificar peças pela leitura de **QR Code** (câmera) ou por entrada manual de backup
* Manter o **histórico de rastreabilidade** com hora, ID da peça, lote e resultado
* Sinalizar visualmente a **aprovação ou rejeição** da última peça
* Conversar com o restante da estação pelo **contrato de eventos** `v0.1.0`

---

## 🗺️ Funcionalidades

* 📷 **Leitor de câmera:** ignora o mesmo QR lido em sequência (janela de 3s)
* ⌨️ **Entrada manual:** ID da peça, resultado, lote e motivo (quando rejeitada)
* 🚦 **Indicador de inspeção:** painel grande com o resultado da última peça
* 📋 **Tabela de histórico:** mais recentes primeiro, sem duplicatas (por `eventId` e `pieceId`)
* 🔌 **Estado da conexão e da máquina:** aviso de emergência, alarme ou falha de segurança

---

## 📡 Eventos (contrato v0.1.0)

* **Consome:** `traceability.piece-scanned`, `connection.state`, `machine.telemetry`
* **Publica:** `traceability.piece-scanned` (com `source: "mock"`) a cada leitura local
* O conteúdo do QR Code é o **ID da peça** (`pieceId` e `code` recebem o mesmo valor)

> ⚠️ Projeto em modo **simulação (Sprint 1)**. Nenhum comando é enviado ao CLP, ao robô ou à planta física.

---

## 🛠️ Tecnologias Utilizadas

* **React 19**
* **Vite**
* **Module Federation** (`@module-federation/vite`)
* **html5-qrcode** (leitura de QR pela câmera)
* **CSS puro**, escopado em `.g4` para não afetar o Shell

---

## 🌐 Como Rodar o Projeto

Requisito: **Node.js 20.19+**

```bash
npm install
npm run dev
```

> 🔗 http://localhost:8083

> ⚠️ A câmera só funciona em `localhost` ou em **HTTPS**.

---

## 🧩 Integração com o App Shell

No Vite do host:

```js
remotes: {
  smart40_g4: {
    type: 'module',
    name: 'smart40_g4',
    entry: 'http://localhost:8083/remoteEntry.js',
  },
},
shared: {
  react: { singleton: true },
  'react-dom': { singleton: true },
},
```

Uso no Shell:

```jsx
const Traceability = lazy(() => import('smart40_g4/Traceability'));

<Traceability bus={bus} />
```

`bus` é um objeto `{ subscribe(handler) => unsubscribe, publish(event) }`. Sem ele, o módulo roda sozinho com um barramento local.

---

## 📁 Estrutura

```
smart40-g4-rastreabilidade/
├── src/
│   ├── Traceability.jsx        # componente exposto ao Shell
│   ├── components/             # CameraReader, ManualForm, HistoryTable, ...
│   ├── hooks/useTraceability.js
│   ├── bus.js                  # barramento local (modo standalone)
│   ├── events.js               # montagem dos eventos do contrato
│   ├── contract/               # contrato-smart40-v0_1.ts
│   ├── traceability.css
│   └── main.jsx                # entrada standalone
├── vite.config.js
└── index.html
```

---

## 🎓 Contexto Acadêmico

Projeto em equipe da **Estação SMART 4.0**, dividido em módulos por grupo (App Shell, IHM, Robô UR, Rastreabilidade e Expedição). Este repositório é o módulo do **Grupo 4**.

---

## 🚀 Status do Projeto

🟡 Em desenvolvimento
