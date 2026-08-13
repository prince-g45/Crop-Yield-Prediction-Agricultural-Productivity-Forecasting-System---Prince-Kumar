import Navbar from "../components/Navbar";
import "../styles/About.css";

function About() {
  return (
    <>
      <Navbar />

      <main className="about-page">

        {/* Hero */}
        <section className="about-hero">

          <span className="about-label">
            ABOUT YIELDSENSE AI
          </span>

          <h1>
            Smarter Agriculture.
            <br />
            Better Decisions.
          </h1>

          <p>
            An AI-powered agricultural platform designed to help farmers
            understand their crops, soil, weather, and expected yield.
          </p>

        </section>


        {/* About */}
        <section className="about-intro">

          <div className="section-heading">
            <span>01</span>
            <h2>About the Project</h2>
          </div>

          <p>
            YieldSense AI is an intelligent agricultural platform developed
            to help farmers and agricultural organizations make better
            farming decisions. The system combines artificial intelligence,
            machine learning, weather information, and soil analysis to
            provide useful agricultural insights.
          </p>

          <p>
            From predicting crop yield to understanding soil conditions and
            monitoring weather, YieldSense AI brings important farming
            information together in one simple platform.
          </p>

        </section>


        {/* Features */}
        <section className="about-features">

          <div className="section-heading centered">
            <span>02</span>
            <h2>What We Provide</h2>
          </div>

          <div className="feature-grid">

            <article className="feature-card">

              <span className="feature-number">
                01
              </span>

              <h3>
                Crop Yield Prediction
              </h3>

              <p>
                Predict expected crop production using machine learning
                models trained on agricultural data.
              </p>

            </article>


            <article className="feature-card">

              <span className="feature-number">
                02
              </span>

              <h3>
                Weather Analysis
              </h3>

              <p>
                Understand temperature, rainfall, humidity, and weather
                conditions that influence farming activities.
              </p>

            </article>


            <article className="feature-card">

              <span className="feature-number">
                03
              </span>

              <h3>
                Soil Analysis
              </h3>

              <p>
                Evaluate soil conditions and nutrient levels to understand
                crop suitability and soil health.
              </p>

            </article>


            <article className="feature-card">

              <span className="feature-number">
                04
              </span>

              <h3>
                Analytics Dashboard
              </h3>

              <p>
                View important agricultural information through a clear and
                easy-to-understand dashboard.
              </p>

            </article>

          </div>

        </section>


        {/* Technology */}
        <section className="technology">

          <div className="section-heading centered">
            <span>03</span>
            <h2>Technology Stack</h2>
          </div>

          <div className="technology-list">

            <span>React</span>
            <span>FastAPI</span>
            <span>Python</span>
            <span>PostgreSQL</span>
            <span>TensorFlow</span>
            <span>Scikit-Learn</span>
            <span>Docker</span>
            <span>JWT</span>

          </div>

        </section>


        {/* Footer Statement */}
        <section className="about-footer">

          <div className="footer-line"></div>

          <h2>
            Technology for better farming decisions.
          </h2>

          <p>
            YieldSense AI brings agricultural data and intelligent insights
            together to support modern farming.
          </p>

        </section>

      </main>
    </>
  );
}

export default About;