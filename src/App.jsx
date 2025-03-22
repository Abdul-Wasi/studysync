import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div>
      <Navbar />
      <div className="container">
          <h1>Welcome to StudySync 📚</h1>
          <p>Your all-in-one student productivity hub!</p>
      </div>
      <Footer />
    </div>
  );
}

export default App;
