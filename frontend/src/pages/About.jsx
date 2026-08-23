import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/About.css";

function About() {
  return (
    <>
      <Navbar />

      <main className="about-page">

        {/* =========================
            HERO
        ========================= */}
        <section className="about-hero">

          <span className="about-label">
            YIELDSENSE AI
          </span>

          <h1>
            Smarter Agriculture.
            <br />
            Better Decisions.
          </h1>

          <p>
            An AI-powered agricultural platform that combines crop,
            soil, weather, and yield data to support better farming decisions.
          </p>

        </section>


        {/* =========================
            PROJECT INTRO
        ========================= */}
        <section className="about-intro">

          <div className="intro-content">

            <div className="section-number">
              01
            </div>

            <div>

              <span className="section-label">
                THE PROJECT
              </span>

              <h2>
                Data-driven farming intelligence
              </h2>

              <p>
                YieldSense AI is an intelligent agricultural platform
                developed to help farmers and agricultural organizations
                make better farming decisions.
              </p>

              <p>
                The platform brings together machine learning, weather
                information, soil analysis, and crop data to provide
                practical agricultural insights in one place.
              </p>

            </div>

          </div>

        </section>


        {/* =========================
            FEATURES
        ========================= */}
        <section className="about-features">

          <div className="section-heading">

            <div className="section-number">
              02
            </div>

            <div>

              <span className="section-label">
                PLATFORM CAPABILITIES
              </span>

              <h2>
                What YieldSense AI provides
              </h2>

            </div>

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
                Explore agricultural data through clear analytics,
                visualizations, and decision-support insights.
              </p>

            </article>

          </div>

        </section>


        {/* =========================
            TECHNOLOGY
        ========================= */}
        <section className="technology">

          <div className="section-heading">

            <div className="section-number">
              03
            </div>

            <div>

              <span className="section-label">
                TECHNOLOGY
              </span>

              <h2>
                Built with modern technologies
              </h2>

            </div>

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


        {/* =========================
            FINAL STATEMENT
        ========================= */}
        <section className="about-footer">

          <div className="footer-line"></div>

          <h2>
            Technology for better farming decisions.
          </h2>

          <p>
            YieldSense AI brings agricultural data and intelligent
            insights together to support modern farming.
          </p>

        </section>

      </main>


      {/* =========================
          SITE FOOTER
      ========================= */}
      <Footer />

    </>
  );
}

export default About;