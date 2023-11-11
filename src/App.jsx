import './App.css'
import LeftSection from './components/LeftSection';

function App() {

  return (
    <>
      <div className="container">
        <LeftSection />
      </div>
      <div className="footer-info">
        <a href="#">
          Download source code
        </a>{" "}
        <a href="#">
          | Developed By {" "}
          <a href="#">
            Siddhartha Sarkar
          </a>
        </a>
      </div>
    </>
  )
}

export default App
