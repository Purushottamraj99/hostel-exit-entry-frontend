import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function MyRequests() {

  const studentId = localStorage.getItem("studentId");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      load();
    }
  }, [studentId]);

  const load = async () => {

    try {

      setLoading(true);

      const res = await api.myRequests(studentId);

      setRows(res.data || []);

    } catch (e) {

      console.log(e);

    } finally {

      setLoading(false);

    }

  };

  if (loading) return <div>Loading requests...</div>;

  return (
    <div className="requests-page">

      <h2>My Exit Requests</h2>

      <div className="table">

        <div className="table-head">
          <div>Reason</div>
          <div>Category</div>
          <div>Status</div>
          <div>Time</div>
        </div>

        {rows.length === 0 && (
          <div className="table-row">
            <div>No requests found</div>
          </div>
        )}

        {rows.map(x => (

          <div key={x._id} className="table-row">

            <div>{x.reason}</div>

            <div>{x.reasonCategory}</div>

            <div>
              <span className={`status ${x.status}`}>
                {x.status}
              </span>
            </div>

            <div>
              {new Date(x.createdAt).toLocaleString()}
            </div>

          </div>

        ))}

      </div>

    </div>
  );

}