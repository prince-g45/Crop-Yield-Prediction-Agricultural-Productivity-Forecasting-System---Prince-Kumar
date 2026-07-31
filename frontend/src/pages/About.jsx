import Navbar from "../components/Navbar";
import "../styles/About.css";

function About() {
  return (
    <>
      <Navbar />

      <div className="about-page">

        <section className="hero">

          <h1>🌾 YieldSense AI</h1>

          <p>
            AI-Powered Crop Yield Prediction &
            Agricultural Productivity Forecasting System
          </p>

        </section>

        <section className="about-card">

          <h2>About the Project</h2>

          <p>
            YieldSense AI is an intelligent agricultural platform developed to
            help farmers and agricultural organizations predict crop yield,
            analyze weather conditions, evaluate soil quality, and improve
            farming productivity using Artificial Intelligence and Machine
            Learning.
          </p>

        </section>

        <section className="features">

          <h2>Core Features</h2>

          <div className="feature-grid">

            <div className="feature-card">
              🌾
              <h3>Crop Yield Prediction</h3>
              <p>
                Predict crop production using AI models trained on historical
                agricultural data.
              </p>
            </div>

            <div className="feature-card">
              🌦
              <h3>Weather Analysis</h3>
              <p>
                Analyze rainfall, temperature and climate trends for better
                farming decisions.
              </p>
            </div>

            <div className="feature-card">
              🌱
              <h3>Soil Analysis</h3>
              <p>
                Evaluate soil fertility, nutrients and suitability for crops.
              </p>
            </div>

            <div className="feature-card">
              📊
              <h3>Analytics Dashboard</h3>
              <p>
                Interactive dashboards with productivity reports and AI
                insights.
              </p>
            </div>

          </div>

        </section>

        <section className="tech">

          <h2>Technology Stack</h2>

          <div className="tech-list">

            <span>React</span>
            <span>FastAPI</span>
            <span>PostgreSQL</span>
            <span>Docker</span>
            <span>TensorFlow</span>
            <span>Scikit-Learn</span>
            <span>JWT</span>
            <span>Python</span>

          </div>

        </section>

      </div>
    </>
  );
}

export default About;