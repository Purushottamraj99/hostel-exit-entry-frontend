import { useEffect, useState } from "react";
import { api } from "../services/api";
import { io } from "socket.io-client";

const socket = io("https://hostel-exit-entry.onrender.com");

export default function WardenDashboard() {

  const [requests, setRequests] = useState([]);
  const [today, setToday] = useState(0);
  const [outsideCount, setOutsideCount] = useState(0);
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    load();

    socket.on("new-exit-request", (data) => {

      setNotification(`New exit request from ${data.name}`);

      load();

    });

  }, []);

  const load = async () => {

    try {

      setLoading(true);

      const r = await api.exitRequests();
      const t = await api.todayStats();
      const o = await api.outsideList();

      setRequests(r.data || []);
      setToday(t.todayExits || 0);
      setOutsideCount(o.count || 0);

    }
    catch (e) {
      console.log(e);
    }
    finally {
      setLoading(false);
    }

  };

  const approve = async (id) => {
    await api.approveExit(id);
    load();
  };

  const reject = async (id) => {
    await api.rejectExit(id);
    load();
  };

  if (loading) return <div>Loading warden dashboard...</div>;

  return (

    <div>

      <h2 className="warden-title">Warden Dashboard</h2>

      {notification && (
        <div className="notify">{notification}</div>
      )}

      <div className="cards">

        <div className="card">
          <div className="card-title">Pending Exit Requests</div>
          <div className="card-value">{requests.length}</div>
        </div>

        <div className="card">
          <div className="card-title">Students Outside</div>
          <div className="card-value">{outsideCount}</div>
        </div>

        <div className="card">
          <div className="card-title">Today Exits</div>
          <div className="card-value">{today}</div>
        </div>

      </div>

      <h3>Pending Exit Requests</h3>

      <div className="table">

        <div className="table-head">
          <div>Name</div>
          <div>Room</div>
          <div>Reason</div>
          <div>Category</div>
          <div>Time</div>
          <div>Action</div>
        </div>

        {requests.map(x => (

          <div key={x._id} className="table-row">

            <div>{x.name}</div>
            <div>{x.room}</div>
            <div>{x.reason}</div>
            <div>{x.reasonCategory}</div>
            <div>{new Date(x.createdAt || x.exitTime).toLocaleTimeString()}</div>

            <div style={{ display: "flex", gap: "6px" }}>

              <button
                className="action-btn approve"
                onClick={() => approve(x._id)}
              >
                Approve
              </button>

              <button
                className="action-btn reject"
                onClick={() => reject(x._id)}
              >
                Reject
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}