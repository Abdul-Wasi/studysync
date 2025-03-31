import { useState } from "react";

const AttendanceRequirementCalculator = () => {
  const [attended, setAttended] = useState("");
  const [total, setTotal] = useState("");
  const [requiredPercentage, setRequiredPercentage] = useState("");
  const [classesNeeded, setClassesNeeded] = useState(null);

  const calculateRequiredClasses = () => {
    if (total > 0 && requiredPercentage > 0 && requiredPercentage <= 100) {
      const requiredClasses = Math.ceil((requiredPercentage / 100) * total);
      const needed = requiredClasses - attended;
      setClassesNeeded(needed > 0 ? needed : 0);
    } else {
      setClassesNeeded(null);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Attendance Requirement Calculator</h2>
      
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

      <input
        type="number"
        placeholder="Required Attendance (%)"
        value={requiredPercentage}
        onChange={(e) => setRequiredPercentage(e.target.value)}
        className="border p-2 rounded w-full mb-2 text-black border-gray-300"
      />

      <button
        onClick={calculateRequiredClasses}
        className="w-full bg-green-500 text-white p-2 rounded mt-2 hover:bg-green-600 transition"
      >
        Calculate
      </button>

      {classesNeeded !== null && (
        <p className="mt-4 text-lg font-semibold text-black bg-gray-200 p-2 rounded text-center">
          You need to attend <strong>{classesNeeded}</strong> more classes.
        </p>
      )}
    </div>
  );
};

export default AttendanceRequirementCalculator;
