import { useEffect, useState } from "react";
import axios from "axios";

export default function Data() {
  const [data, setData] = useState({ columns: [], rows: [] });

  useEffect(() => {
    axios
      .get("http://localhost:8000/log")
      .then((response) => {
        const transformedData = {
          columns: [
            {
              Header: "Patient",
              accessor: "patient",
              width: "25%",
              align: "left",
              style: { color: "#1E88E5", fontWeight: "bold" },
            },
            {
              Header: "Date",
              accessor: "date",
              width: "15%",
              align: "center",
              style: { color: "#1E88E5", fontWeight: "bold" },
            },
            {
              Header: "Body",
              accessor: "body",
              width: "40%",
              align: "left",
              style: { color: "#424242" },
            },
            {
              Header: "Action",
              accessor: "action",
              width: "10%",
              align: "center",
            }, // Action column added here, rendered in Projects.js
            {
              Header: "Doctor's Comments",
              accessor: "doctor_comments",
              width: "20%",
              align: "left",
              style: { color: "#1E88E5" },
              Cell: ({ value }) =>
                value?.map((comment, index) => (
                  <div key={index}>
                    <strong>{comment.doctor}</strong>: {comment.text}
                  </div>
                )),
            },
          ],
          rows: response.data.map((item) => ({
            patient: item.patient,
            date: item.date,
            body: item.body,
            doctor_comments: item.comments.map((comment) => ({
              doctor: comment.doctor,
              text: comment.text,
            })),
            _id: item._id, // Keep _id for reference
          })),
        };
        console.log(response.data);
        console.log(transformedData);
        setData(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return data;
}
