import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { BASE } from "../services/api";

export default function GuardVerify() {

  const [logId, setLogId] = useState("");
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(""); // success / fail
  const scannerRef = useRef(null);

  useEffect(() => {

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 220 },
      onScan,
      () => {}
    );

    return () => scanner.stop().catch(()=>{});
  }, []);

  /* ===== SOUND ===== */
  const beep = (ok=true) => {
    const audio = new Audio(
      ok
        ? "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"
        : "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
    );
    audio.play();
  };

  /* ===== VIBRATION ===== */
  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(200);
  };

  const stopCamera = async () => {
    try {
      await scannerRef.current?.stop();
    } catch {}
  };

  const onScan = async (decoded) => {
    try {
      const id = decoded.split("/").pop();
      setLogId(id);

      const r = await api.verifyPass(id);
      setData(r);

      if (r.valid) {
        setStatus("success");
        beep(true);
        vibrate();
        stopCamera(); // ⭐ auto stop
      } else {
        setStatus("fail");
        beep(false);
        vibrate();
      }

    } catch {}
  };

  const manualVerify = async () => {
    if (!logId) return;

    const r = await api.verifyPass(logId);
    setData(r);

    if (r.valid) {
      setStatus("success");
      beep(true);
      vibrate();
      stopCamera();
    } else {
      setStatus("fail");
      beep(false);
      vibrate();
    }
  };

  return (
    <div className="guard-wrap">

      <div className={`guard-card ${status}`}>
        <h2>🛡 Guard Security Scanner</h2>

        {/* scanner */}
        <div className="scanner-box">
          <div id="qr-reader" className="qr-box"/>
          <div className="scan-line"/>
        </div>

        <input
          className="guard-input"
          placeholder="Paste logId"
          value={logId}
          onChange={e=>setLogId(e.target.value)}
        />

        <button className="guard-btn" onClick={manualVerify}>
          Verify Manually
        </button>

        {data && <Result data={data} />}
      </div>
    </div>
  );
}

/* ===== RESULT ===== */

function Result({ data }) {

  if (!data.valid)
    return <div className="badge bad">❌ INVALID PASS</div>;

  return (
    <div className="guard-result">
      <div className="badge ok">✅ VALID PASS</div>

      <Row k="Student" v={data.student}/>
      <Row k="Room" v={data.room}/>
      <Row k="Status" v={data.status}/>
      <Row k="Exit" v={fmt(data.exitTime)}/>
      {data.entryTime && <Row k="Entry" v={fmt(data.entryTime)}/>}
    </div>
  );
}

function Row({k,v}) {
  return (
    <div className="guard-row">
      <span>{k}</span>
      <b>{v}</b>
    </div>
  );
}

function fmt(t){
  return new Date(t).toLocaleString("en-IN");
}