import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const READER_ID = 'g4-reader';
const REPEAT_WINDOW_MS = 3000; // ignora o mesmo QR lido várias vezes seguidas

export default function CameraReader({ onScan }) {
  const [active, setActive] = useState(false);
  const [defaultResult, setDefaultResult] = useState('APPROVED');
  const scannerRef = useRef(null);
  const lastScanRef = useRef({ text: '', at: 0 });
  const onScanRef = useRef(onScan);
  const resultRef = useRef(defaultResult);

  useEffect(() => {
    onScanRef.current = onScan;
    resultRef.current = defaultResult;
  }, [onScan, defaultResult]);

  // Desliga a câmera ao desmontar (Shell troca de módulo)
  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;
      if (scanner?.isScanning) scanner.stop().then(() => scanner.clear()).catch(() => {});
    };
  }, []);

  async function start() {
    const scanner = new Html5Qrcode(READER_ID);
    scannerRef.current = scanner;
    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 180, height: 180 } },
        (decodedText) => {
          const now = Date.now();
          const last = lastScanRef.current;
          if (decodedText === last.text && now - last.at < REPEAT_WINDOW_MS) return;
          lastScanRef.current = { text: decodedText, at: now };
          onScanRef.current({ code: decodedText, result: resultRef.current });
        },
        () => {}, // frame sem QR: ignorar
      );
      setActive(true);
    } catch (err) {
      console.error(err);
      alert('Não foi possível acessar a câmera. Verifique as permissões no navegador.');
    }
  }

  async function stop() {
    const scanner = scannerRef.current;
    if (!scanner) return;
    await scanner.stop();
    scanner.clear();
    setActive(false);
  }

  return (
    <div className="g4-card">
      <div className="g4-card-head">
        <h2>Leitor de câmera QR</h2>
        <span className={`g4-tag ${active ? 'g4-tag--on' : 'g4-tag--off'}`}>{active ? 'Câmera ativa' : 'Desativada'}</span>
      </div>

      <div className="g4-camera">
        <div id={READER_ID} className="g4-reader" />
        {!active && <p className="g4-camera-off">Câmera desligada</p>}
      </div>

      <label className="g4-inline">
        Resultado ao ler
        <select value={defaultResult} onChange={(e) => setDefaultResult(e.target.value)}>
          <option value="APPROVED">Aprovada</option>
          <option value="REJECTED">Rejeitada</option>
          <option value="PENDING">Pendente</option>
        </select>
      </label>

      <div className="g4-row">
        <button type="button" onClick={start} disabled={active} className="g4-btn g4-btn--blue">
          Ligar câmera
        </button>
        <button type="button" onClick={stop} disabled={!active} className="g4-btn g4-btn--red">
          Desligar câmera
        </button>
      </div>
    </div>
  );
}
