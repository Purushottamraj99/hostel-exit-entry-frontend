import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

export default function VerifyPass(){

  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===== VERIFY FUNCTION ===== */
  const verify = async () => {
    setLoading(true);
    setError("");

    try {
      const r = await api.verifyPass(id);
      setData(r);
    } catch (e) {
      console.error(e);
      setError(e?.message ?? "Unable to verify pass.");
    } finally {
      setLoading(false);
    }
  };

  /* ===== USE EFFECT ===== */
  useEffect(()=>{
    if(id){
      verify();
    }
  },[id]);

  if (loading)
    return <div style={{ padding: 40 }}>Verifying pass...</div>;

  if (error)
    return (
      <div style={{ padding: 40, color: "red" }}>
        ❌ Error: {error}
      </div>
    );

  if (!data?.valid)
    return (
      <div style={{ padding: 40, color: "red" }}>
        ❌ INVALID PASS
      </div>
    );

  return(

    <div style={{padding:40}}>

      <h2 style={{color:"green"}}>
        ✅ GATE PASS VERIFIED
      </h2>

      <p><b>Student:</b> {data.student}</p>
      <p><b>Room:</b> {data.room}</p>
      <p><b>Status:</b> {data.status}</p>
      <p><b>Exit:</b> {new Date(data.exitTime).toLocaleString()}</p>

      {data.entryTime &&
        <p><b>Entry:</b> {new Date(data.entryTime).toLocaleString()}</p>
      }

    </div>

  );

}