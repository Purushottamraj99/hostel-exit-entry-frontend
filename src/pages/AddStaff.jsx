import { useState } from "react";

export default function AddStaff() {

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    role: "warden",
    shift: "morning",
    address: "",
    joiningDate: ""
  });

  const [created, setCreated] = useState(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (k,v) =>
    setForm({ ...form, [k]: v });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(()=>setToast(""),2000);
  };

  const copy = (text,label) => {
    navigator.clipboard.writeText(text);
    showToast(label+" copied");
  };

  const submit = async (e) => {
    e.preventDefault();

    if(!form.name.trim())
      return showToast("Name required");

    if(!form.mobile.trim())
      return showToast("Mobile required");

    try{
      setLoading(true);

      const r = await fetch(
        "http://localhost:5000/api/staff/add",
        {
          method:"POST",
          headers:{ "Content-Type":"application/json"},
          body: JSON.stringify(form)
        }
      );

      const res = await r.json();

      if(!res.success){
        showToast(res.message || "Failed");
        return;
      }

      setCreated(res.login);

      setForm({
        name:"",
        mobile:"",
        email:"",
        role:"warden",
        shift:"morning",
        address:"",
        joiningDate:""
      });

      showToast("Staff created successfully");

    }catch{
      showToast("Server error");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="add-wrap">

      {/* ===== FORM ===== */}
      <form className="card add-card" onSubmit={submit}>

        <h2>👨‍💼 Add Staff</h2>

        <Field label="Full Name"
          value={form.name}
          onChange={v=>onChange("name",v)}
        />

        <Field label="Mobile Number"
          value={form.mobile}
          onChange={v=>onChange("mobile",v)}
        />

        <Field label="Email"
          value={form.email}
          onChange={v=>onChange("email",v)}
        />

        <label>Role</label>
        <select className="input"
          value={form.role}
          onChange={e=>onChange("role",e.target.value)}
        >
          <option value="warden">Warden</option>
          <option value="guard">Guard</option>
        </select>

        <label>Shift</label>
        <select className="input"
          value={form.shift}
          onChange={e=>onChange("shift",e.target.value)}
        >
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
          <option value="night">Night</option>
        </select>

        <Field label="Joining Date"
          value={form.joiningDate}
          onChange={v=>onChange("joiningDate",v)}
        />

        <Field label="Address"
          value={form.address}
          onChange={v=>onChange("address",v)}
        />

        <button className="btn add-btn">
          {loading ? "Creating..." : "Create Staff"}
        </button>

      </form>

      {/* ===== GENERATED STAFF CARD ===== */}
      {created && (
        <div className="card id-card">

          <h3>🏫 STAFF ID CARD</h3>

          <Row
            k="Staff ID"
            v={created.staffId}
            onCopy={()=>copy(created.staffId,"ID")}
          />

          <Row
            k="Password"
            v={created.password}
            onCopy={()=>copy(created.password,"Password")}
          />

          <Row k="Role" v={created.role} />

        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* ---------- components ---------- */

function Field({ label,value,onChange }){
  return (
    <div className="field">
      <label>{label}</label>
      <input
        className="input"
        value={value}
        onChange={e=>onChange(e.target.value)}
      />
    </div>
  );
}

function Row({k,v,onCopy}){
  return (
    <div className="row">
      <span>{k}</span>
      <div style={{display:"flex",gap:8}}>
        <b>{v}</b>
        {onCopy && (
          <button
            type="button"
            className="copy-btn"
            onClick={onCopy}
          >
            Copy
          </button>
        )}
      </div>
    </div>
  );
}