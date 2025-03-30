import AttendanceCalculator from "../components/AttendanceCalculator";

const Tools = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Study Tools</h1>
      <div className="flex flex-wrap gap-6">
        <AttendanceCalculator />
      </div>
    </div>
  );
};

export default Tools;
