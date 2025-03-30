import { useState } from "react";

const AttendanceCalculator = () => {
  const [attended, setAttended] = useState("");
  const [total, setTotal] = useState("");
  const [percentage, setPercentage] = useState(null);

  const calculateAttendance = () => {
    if (total > 0) {
      const percent = ((attended / total) * 100).toFixed(2);
      setPercentage(percent);
    } else {
      setPercentage(null);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Attendance Calculator</h2>
      
      <input
        type="number"
        placeholder="Attended Classes"
        value={attended}
        onChange={(e) => setAttended(e.target.value)}
        className="border p-2 rounded w-full mb-2 text-black border-gray-300"
      />

      <input
        type="number"
        placeholder="Total Classes"
        value={total}
        onChange={(e) => setTotal(e.target.value)}
        className="border p-2 rounded w-full mb-2 text-black border-gray-300"
      />

      <button
        onClick={calculateAttendance}
        className="w-full bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600 transition"
      >
        Calculate
      </button>

      {percentage !== null && (
        <p className="mt-4 text-lg font-semibold text-black bg-gray-200 p-2 rounded text-center">
          Attendance: {percentage}%
        </p>
      )}
    </div>
  );
};

export default AttendanceCalculator;
