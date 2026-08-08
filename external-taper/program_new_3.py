from flask import Flask, render_template_string, request, session, redirect, url_for, flash, get_flashed_messages
import math

app = Flask(__name__)
app.secret_key = "supersecretkey"

# Store measurement names for ribbon update
MEASUREMENTS = [
    ("small", "Small Cross Section (mm)"),
    ("large", "Large Cross Section (mm)"),
    ("length", "Tapered Length (mm)")
]

EXPERIMENT_HTML = '''
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Taper Angle Virtual Lab - Home</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<header>
  <h1>Virtual Lab: Determination of Taper Angle of a Tapered Bar using Vernier Caliper</h1>
  <nav>
    <a href="experiment">Home</a>
    <a href="theory">Theory</a>
    <a href="procedure">Procedure</a>
    <a href="quiz">Quiz</a>
  </nav>
</header>

<main>
  <section>
    <h2>Aim</h2>
    <p>To determine the taper angle of a tapered bar using a Vernier caliper.</p>
  </section>

  <section>
    <h2>Introduction</h2>
    <p>
      A taper is defined as the uniform change in diameter of a cylindrical or conical part along its length. 
      Tapered parts are widely used in mechanical components such as shafts, pins, and spindles for easy 
      alignment and assembly. In this experiment, the Vernier caliper — a precision measuring instrument — 
      is used to measure diameters at two different points along the tapered surface. These readings help 
      calculate the taper per unit length and the taper angle.
    </p>
    <img src="{{ img_url }}" alt="Tapered bar setup with Vernier Caliper" class="main-img" >
  </section>
</main>

<footer>
  © 2025 Virtual Lab | Determination of Taper Angle using Vernier Caliper
</footer>
</body>
</html>
'''

THEORY_HTML = '''
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Theory - Vernier Caliper Taper Measurement</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<header>
  <h1>Theory</h1>
  <nav>
    <a href="experiment">Home</a>
    <a href="theory">Theory</a>
    <a href="procedure">Procedure</a>
    <a href="quiz">Quiz</a>
  </nav>
</header>

<main>
  <section>
    <h2>Principle</h2>
    <p>
      The taper angle of a bar can be determined by measuring the diameters at two points along its length 
      using a Vernier caliper. The difference in diameters over a known length gives the taper per unit length. 
      Using trigonometry:
    </p>
    <p><strong>tan(θ) = (D - d) / (2L)</strong></p>
    <ul>
      <li>D → Larger diameter (mm)</li>
      <li>d → Smaller diameter (mm)</li>
      <li>L → Distance between the two measured sections (mm)</li>
    </ul>
  </section>

  <section>
    <h2>Formulae</h2>
    <ul>
      <li>Taper per unit length = (D - d) / L</li>
      <li>Taper angle, θ = tan⁻¹[(D - d) / (2L)]</li>
    </ul>
  </section>

  <section>
    <h2>Applications</h2>
    <ul>
      <li>Determining taper in machine components such as shafts and mandrels</li>
      <li>Ensuring precision fits in mechanical assemblies</li>
      <li>Inspection and quality control in manufacturing</li>
    </ul>
  </section>
</main>

<footer>
  © 2025 Virtual Lab | Determination of Taper Angle using Vernier Caliper
</footer>
</body>
</html>
'''

PROCEDURE_HTML = '''
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Procedure - Vernier Caliper Virtual Lab</title>
<link rel="stylesheet" href="style.css">
<script>
function calculateTaper() {
  const D = parseFloat(document.getElementById("D").value);
  const d = parseFloat(document.getElementById("d").value);
  const L = parseFloat(document.getElementById("L").value);
  if (isNaN(D) || isNaN(d) || isNaN(L) || D <= 0 || d <= 0 || L <= 0) {
    alert("Please enter valid positive numbers for all fields.");
    return;
  }
  const taperPerUnit = (D - d) / L;
  const theta = Math.atan((D - d) / (2 * L)) * (180 / Math.PI);
  document.getElementById("result").innerHTML =
    `Taper per unit length = <b>${taperPerUnit.toFixed(4)}</b><br>
     Taper angle (θ) = <b>${theta.toFixed(2)}°</b>`;
}
</script>
</head>
<body>
<header>
  <h1>Apparatus & Procedure</h1>
  <nav>
    <a href="experiment">Home</a>
    <a href="theory">Theory</a>
    <a href="procedure">Procedure</a>
    <a href="quiz">Quiz</a>
  </nav>
</header>

<main>
  <section>
    <h2>Apparatus Required</h2>
    <ul>
      <li>Vernier Caliper</li>
      <li>Tapered Bar specimen</li>
      <li>Steel rule</li>
      <li>Surface plate or measuring bench</li>
      <li>Calculator</li>
    </ul>
  </section>

  <section>
    <h2>Step-by-Step Procedure</h2>
    <ol>
      <li>Clean the Vernier caliper and the tapered bar properly.</li>
      <li>Measure the larger diameter (D) at one end of the bar using the Vernier caliper.</li>
      <li>Measure the smaller diameter (d) at the other end of the bar.</li>
      <li>Measure the distance (L) between the two points of measurement.</li>
      <li>Substitute the values into the formula to find the taper per unit length and taper angle.</li>
    </ol>
    <img src="{{ img_url }}" alt="Vernier Caliper measuring taper" class="main-img">
  </section>

  <section class="calculator">
    <h2>Interactive Taper Calculator</h2>
    <label>Large diameter D (mm): <input type="number" id="D" placeholder="e.g. 25.0"></label><br><br>
    <label>Small diameter d (mm): <input type="number" id="d" placeholder="e.g. 20.0"></label><br><br>
    <label>Length L (mm): <input type="number" id="L" placeholder="e.g. 100.0"></label><br><br>
    <button onclick="calculateTaper()">Calculate</button>
    <p id="result"></p>
  </section>
</main>

<footer>
  © 2025 Virtual Lab | Determination of Taper Angle using Vernier Caliper
</footer>
</body>
</html>
'''

QUIZ_HTML = '''
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vernier Caliper Virtual Lab — Quiz</title>
  <style>
    /* (kept same styles as before) */
    body { font-family: "Segoe UI", Arial, sans-serif; background: #f6f9fc; margin: 0; color: #111; }
    header { background: #0b63d3; color: white; padding: 25px; text-align: center; }
    h1 { margin: 0; }
    main { max-width: 800px; margin: 30px auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    h2 { margin-top: 0; }
    .question { background: #f9fbfe; border: 1px solid #e1e6ef; padding: 14px 18px; border-radius: 10px; margin-bottom: 18px; }
    label { display: block; margin: 4px 0; cursor: pointer; }
    button { background: #0b63d3; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600; }
    button:hover { background: #084ca6; }
    #score { font-weight: bold; font-size: 1.1rem; margin-top: 18px; }
    .correct { background-color: #d4edda; border-color: #28a745; }
    .incorrect { background-color: #f8d7da; border-color: #dc3545; }
    footer { text-align: center; padding: 20px; color: #666; }
    #labBtn { display: none; margin-top: 14px; background: #10b981; }
    #labBtn:hover { background: #0d946b; }
  </style>
</head>
<body>
<header>
  <h1>Virtual Lab: Determination of Taper Angle using Vernier Caliper</h1>
  <p>Test your understanding before performing the experiment</p>
</header>

<main>
  <!-- Hidden form to POST score to /quiz so server can set session -->
  <form id="passForm" action="/quiz" method="post" style="display:none;">
    <input type="hidden" name="score" id="hiddenScore" value="0">
  </form>

  <form id="quizForm">
    <h2>Answer all questions below:</h2>

    <div class="question" id="q1">
      <p>1. What is the least count of a standard Vernier caliper?</p>
      <label><input type="radio" name="q1" value="a"> 0.01 mm</label>
      <label><input type="radio" name="q1" value="b"> 0.02 mm</label>
      <label><input type="radio" name="q1" value="c"> 0.1 mm</label>
      <label><input type="radio" name="q1" value="d"> 1 mm</label>
    </div>

    <div class="question" id="q2">
      <p>2. Formula for taper angle (θ) is:</p>
      <label><input type="radio" name="q2" value="a"> tanθ = (D - d) / L</label>
      <label><input type="radio" name="q2" value="b"> tanθ = 2L / (D - d)</label>
      <label><input type="radio" name="q2" value="c"> tanθ = (D - d) / (2L)</label>
      <label><input type="radio" name="q2" value="d"> tanθ = L / (D - d)</label>
    </div>

    <div class="question" id="q3">
      <p>3. If D = 30 mm, d = 20 mm, and L = 100 mm, the taper per unit length is:</p>
      <label><input type="radio" name="q3" value="a"> 0.05</label>
      <label><input type="radio" name="q3" value="b"> 0.025</label>
      <label><input type="radio" name="q3" value="c"> 0.1</label>
      <label><input type="radio" name="q3" value="d"> 0.5</label>
    </div>

    <div class="question" id="q4">
      <p>4. Why is taper provided in machine components?</p>
      <label><input type="radio" name="q4" value="a"> To increase frictional loss</label>
      <label><input type="radio" name="q4" value="b"> For easy alignment and assembly</label>
      <label><input type="radio" name="q4" value="c"> To make machining difficult</label>
      <label><input type="radio" name="q4" value="d"> To increase weight</label>
    </div>

    <div class="question" id="q5">
      <p>5. What happens if Vernier caliper jaws are not properly aligned?</p>
      <label><input type="radio" name="q5" value="a"> Measurement becomes more accurate</label>
      <label><input type="radio" name="q5" value="b"> Measurement error occurs</label>
      <label><input type="radio" name="q5" value="c"> Readings remain unaffected</label>
      <label><input type="radio" name="q5" value="d"> None of the above</label>
    </div>

    <button type="button" onclick="checkAnswers()">Submit Quiz</button>
    <!-- Lab button now triggers POST to /quiz via hidden form -->
    <button type="button" id="labBtn" onclick="goToLab()">Go to Virtual Lab</button>

    <p id="score"></p>
  </form>
</main>

<footer>
  © 2025 Virtual Lab | Determination of Taper Angle using Vernier Caliper
</footer>

<script>
function checkAnswers() {
  // correct answers
  const answers = { q1: "b", q2: "c", q3: "c", q4: "b", q5: "b" };
  let score = 0;

  // reset background
  document.querySelectorAll('.question').forEach(div => {
    div.classList.remove('correct', 'incorrect');
  });

  // check each
  for (let key in answers) {
    const div = document.getElementById(key);
    const selected = document.querySelector(`input[name="${key}"]:checked`);
    if (selected) {
      if (selected.value === answers[key]) {
        score++;
        div.classList.add('correct');
      } else {
        div.classList.add('incorrect');
      }
    } else {
      div.classList.add('incorrect');
    }
  }

  // display score
  const scoreText = document.getElementById('score');
  const labBtn = document.getElementById('labBtn');

  if (score === 5) {
    scoreText.textContent = `Excellent! 🎯 You scored ${score}/5. Click "Go to Virtual Lab" to proceed.`;
    scoreText.style.color = "#28a745";
    labBtn.style.display = 'inline-block'; // show button only when all correct
  } else if (score >= 3) {
    scoreText.textContent = `Good job! You scored ${score}/5. Review the incorrect ones.`;
    scoreText.style.color = "#0b63d3";
    labBtn.style.display = 'none';
  } else {
    scoreText.textContent = `You scored ${score}/5. Please review the theory and try again.`;
    scoreText.style.color = "#dc3545";
    labBtn.style.display = 'none';
  }
}

// Submits hidden form to /quiz with score so server sets session and redirects
function goToLab() {
  document.getElementById('hiddenScore').value = 5;
  document.getElementById('passForm').submit();
}
</script>
</body>
</html>
'''

INDEX_HTML = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Tapered Circular Bar Measurement</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
    <style>
        body { margin:0; font-family:Arial,sans-serif; background:#f6f9fc; }
        .main { display: flex; flex-direction: row; height: 98vh; }
        .center-panel { flex: 1; display: flex; flex-direction: column; }
        .top-bar { display: flex; flex-direction: row; justify-content: center; margin-top:36px; }
        /* Smaller buttons */
        .top-bar button {
            margin: 6px 12px;
            padding: 10px 20px;
            border-radius: 6px;
            border:1px solid #666;
            background:#fff;
            font-size:1rem;
            cursor:pointer;
            font-family:inherit;
        }
        /* Disabled buttons style */
        .top-bar button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        /* Navigation links */
        nav a {
            margin: 0 15px;
            font-weight: bold;
            text-decoration: none;
            color: #0b63d3;
        }
        nav a.disabled {
            pointer-events: none;
            color: grey;
            cursor: default;
            text-decoration: none;
        }
        .legend-arrow {
          display: inline-block;
          width: 22px;
          height: 8px;
          border-radius: 2px;
          margin-right: 4px;
          position: relative;
          vertical-align: middle;
        }
        .legend-arrow.msr {
          background: #e63946;
        }
        .legend-arrow.vsd {
          background: #1d3557;
        }
        .legend-arrow::after {
          content: "";
          position: absolute;
          right: -7px;
          top: 50%;
          width: 0;
          height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-top: 10px solid;
          transform: translateY(-50%) rotate(270deg);
        }
        .legend-arrow.msr::after {
          border-top-color: #e63946;
        }
        .legend-arrow.vsd::after {
          border-top-color: #1d3557;
        }
        .exp-area { flex:1; display:flex; align-items:center; justify-content:center; }
        .right-ribbon { width:320px; background:#e9ecf3; border-left:3px solid #b8c1da; padding:24px; display:flex; flex-direction:column; }
        .isometric-img { width:100%; max-width:230px; border:0; margin-bottom:12px; }
        .ribbon-block { padding:12px 0; margin-bottom:8px; border-bottom:1px solid #cfd8e4; }
        .result-section { color:#024; margin-top:18px; font-size:1.1rem; }
        /* Vernier container */
        .vernier-container { position: relative; width: 1200px; height: 480px; margin: 0 auto; }
        .vernier-body { width: 100%; height: auto; position: absolute; top: 0; left: 0; z-index: 1; }
        .vernier-jaw { position: absolute; top: -5px; left: 500px; width: 23.5%; height: auto; z-index: 2; transition: transform 1.5s ease-in-out; }
        .object-shape { position: absolute; z-index: 2; transition: all 1s ease-in-out; }
        .small-circle { width: 100px; height: 100px; border-radius: 50%; top: 190px; left: 108px; background: grey; }
        .large-circle { width: 150px; height: 150px; border-radius: 50%; top: 190px; left: 108px; background: grey; }
        .trapezium { width: 300px; height: 100px; top: 190px; left: 108px; background: grey; clip-path: polygon(0% 0%, 100% 20%, 100% 80%, 0% 100%); }
        .arrow { position: absolute; width: 80px; height: 4px; background: #e63946; z-index: 4; transform-origin: left center; }
        .arrow::after { content: ""; position: absolute; right: -10px; top: 50%; transform: translateY(-50%) rotate(270deg); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 14px solid #e63946; }
        .arrow-label { position: absolute; color: #e63946; font-weight: bold; font-size: 1rem; }
        /* Arrow color overrides */
        .arrow.main-scale { background: #e63946; }
        .arrow.main-scale::after { border-top-color: #e63946; }
        .arrow-label.main-scale { color: #e63946; }
        .arrow.vernier-scale { background: #1d3557; }
        .arrow.vernier-scale::after { border-top-color: #1d3557; }
        .arrow-label.vernier-scale { color: #1d3557; }
        /* Disable hyperlinks when measurement active */
        nav a.disabled-link {
            pointer-events: none;
            color: #aaa;
            cursor: default;
            text-decoration: none;
        }
    </style>
</head>
<body>
<nav>
  <a href="{{ url_for('experiment') }}" class="{% if active_measurement %}disabled-link{% endif %}">Home</a>
  <a href="{{ url_for('theory') }}" class="{% if active_measurement %}disabled-link{% endif %}">Theory</a>
  <a href="{{ url_for('procedure') }}" class="{% if active_measurement %}disabled-link{% endif %}">Procedure</a>
  <a href="{{ url_for('quiz') }}" class="{% if active_measurement %}disabled-link{% endif %}">Quiz</a>
</nav>

<div class="main">
    <div class="center-panel">
        <div class="top-bar">
            <form action="{{ url_for('measure', which='small') }}" method="get">
                <button type="submit" {% if active_measurement and active_measurement != 'small' %}disabled{% endif %}>1)Measure Small Cross Section(d)</button>
            </form>
            <form action="{{ url_for('measure', which='large') }}" method="get">
                <button type="submit" {% if active_measurement and active_measurement != 'large' %}disabled{% endif %}>2)Measure Large Cross Section(D)</button>
            </form>
            <form action="{{ url_for('measure', which='length') }}" method="get">
                <button type="submit" {% if active_measurement and active_measurement != 'length' %}disabled{% endif %}>3)Measure Tapered Length(L)</button>
            </form>
            <form action="{{ url_for('calculate') }}" method="post">
                <button type="submit" {% if not (session.get('small') and session.get('large') and session.get('length')) %}disabled{% endif %}>
                    4)Calculate Angle of Taper(θ)
                </button>
            </form>
        </div>
        <div class="exp-area">
            {% if popup %}
            <div>
                <h2>Vernier Caliper Simulator - {{ popup_title }}</h2>
                <div class="vernier-container">
                    <img src="{{ url_for('static', filename='vernier_body.png') }}" class="vernier-body" alt="Vernier Body">
                    {% if popup_title == 'Small Cross Section' %}
                        <div class="object-shape small-circle"></div>
                        <div id="arrowContainer" style="display:none;">
                            <div class="arrow main-scale" style="top: 50px; left: 219px; transform: rotate(90deg);"></div>
                            <div class="arrow-label main-scale" style="top: 70px; left: 180px;">Main Scale</div>
                            <div class="arrow vernier-scale" style="top: 50px; left: 343.5px; transform: rotate(90deg);"></div>
                            <div class="arrow-label vernier-scale" style="top: 70px; left: 430px;">Vernier Scale</div>
                        </div>
                    {% elif popup_title == 'Large Cross Section' %}
                        <div class="object-shape large-circle"></div>
                        <div id="arrowContainer" style="display:none;">
                            <div class="arrow main-scale" style="top: 50px; left: 270px; transform: rotate(90deg);"></div>
                            <div class="arrow-label main-scale" style="top: 70px; left: 180px;">Main Scale</div>
                            <div class="arrow vernier-scale" style="top: 50px; left: 364.5px; transform: rotate(90deg);"></div>
                            <div class="arrow-label vernier-scale" style="top: 70px; left: 430px;">Vernier Scale</div>
                        </div>
                    {% elif popup_title == 'Tapered Length' %}
                        <div class="object-shape trapezium"></div>
                        <div id="arrowContainer" style="display:none;">
                            <div class="arrow main-scale" style="top: 50px; left: 420px; transform: rotate(90deg);"></div>
                            <div class="arrow-label main-scale" style="top: 70px; left: 180px;">Main Scale</div>
                            <div class="arrow vernier-scale" style="top: 50px; left: 556.5px; transform: rotate(90deg);"></div>
                            <div class="arrow-label vernier-scale" style="top: 70px; left: 430px;">Vernier Scale</div>
                        </div>
                    {% endif %}
                    <img src="{{ url_for('static', filename='vernier_jaw.png') }}" class="vernier-jaw" id="vernierJaw" alt="Vernier Jaw">
                </div>
            </div>
            {% elif result %}
            <pre class="result-section">{{ result }}</pre>
            {% else %}
            <div style="color:#444; font-size:1.25rem">This is where the experiment is done</div>
            {% endif %}
        </div>
    </div>
    <div class="right-ribbon">
        <img src="{{ url_for('static', filename='isometric_circular_bar.png') }}" class="isometric-img" alt="Isometric view">
        <div style="font-size:1.15rem; font-weight:600;">Experiment Log</div>
        {% for key, label in measurements %}
        <div class="ribbon-block">
            <div>{{ label }}</div>
            {% if session.get(key) %}
                <div><strong>{{ session.get(key) }} mm</strong></div>
            {% endif %}
        </div>
        {% endfor %}
        {% if active_measurement %}
        {% with messages = get_flashed_messages() %}
          {% if messages %}
            <div style="color:#c0392b; font-weight:bold; margin-bottom:10px;">{{ messages[0] }}</div>
          {% endif %}
        {% endwith %}
        <form action="{{ url_for('measure', which=active_measurement) }}" method="post" style="margin-top:20px;">
            <h3>Confirm Reading for {{ active_measurement.replace('_',' ').title() }} </h3>
            <label>
              <span class="legend-arrow msr"></span>
              MSR: <input type="number" step="any" name="msr" required>
            </label><br><br>
            <label>
              <span class="legend-arrow vsd"></span>
              VSC: <input type="number" step="any" name="vsd" required>
            </label><br><br>
            <button type="submit">Confirm Reading</button>
        </form>
        {% endif %}
    </div>
</div>

{% if popup %}
<script>
window.onload = function() {
    const jaw = document.getElementById('vernierJaw');
    if (!jaw) return;

    const arrows = document.querySelectorAll('.arrow, .arrow-label');
    arrows.forEach(a => a.style.display = 'none');

    // Reset initial position
    jaw.style.transform = "translateX(0px)";
    jaw.style.transition = "transform 1.5s ease-in-out";

    // Move based on which measurement
    setTimeout(() => {
        {% if popup_title == 'Small Cross Section' %}
            jaw.style.transform = "translateX(-376px)";
        {% elif popup_title == 'Large Cross Section' %}
            jaw.style.transform = "translateX(-326px)";
        {% elif popup_title == 'Tapered Length' %}
            jaw.style.transform = "translateX(-176px)";
        {% endif %}
    }, 100);
    setTimeout(() => {
        const arrowContainer = document.getElementById('arrowContainer');
        if (arrowContainer) arrowContainer.style.display = 'block';
        arrows.forEach(a => {
        a.style.display = 'block';
        a.style.opacity = '1'
        });
    }, 1700);
};
</script>
{% endif %}
</body>
</html>
'''

def render_main(popup=False, popup_title=None, result=None, image_file=None, active_measurement=None):
    return render_template_string(
        INDEX_HTML, measurements=MEASUREMENTS, popup=popup, popup_title=popup_title, result=result,
        image_file=image_file, session=session, active_measurement=active_measurement
    )

@app.route("/")
def root():
    return redirect(url_for("experiment"))

@app.route("/experiment")
def experiment():
    img_url = url_for('static', filename='taper_bar_setup.png')
    return render_template_string(EXPERIMENT_HTML, img_url=img_url)

@app.route("/theory")
def theory():
    return render_template_string(THEORY_HTML)

@app.route("/procedure")
def procedure():
    img_url = url_for('static', filename='vernier_taper_setup.png')
    return render_template_string(PROCEDURE_HTML, img_url=img_url)

@app.route("/quiz", methods=["GET", "POST"])
def quiz():
    if request.method == "POST":
        score = int(request.form.get("score", 0))
        if score == 5:
            session["quiz_passed"] = True
            return redirect(url_for("index_lab"))
        return render_template_string(QUIZ_HTML.replace(
            "<body>", "<body><p style='color:red;text-align:center'>Try again! You need 5/5 to proceed.</p>"
        ))
    return render_template_string(QUIZ_HTML)

@app.route("/index_lab", methods=["GET", "POST"])
def index_lab():
    if not session.get("quiz_passed"):
        return redirect(url_for("experiment"))
    return render_main()

@app.route("/measure/<which>", methods=["GET", "POST"])
def measure(which):
    if not session.get("quiz_passed"):
        return redirect(url_for("experiment"))
    allowed_readings = {
        "small": {"msr": [22, 23, 24], "vsd": [16, 17, 18]},
        "large": {"msr": [34, 35, 36], "vsd": [12, 13, 14]},
        "length": {"msr": [69, 70, 71], "vsd": [18, 19, 20]},
    }
    error = None
    if request.method == "POST":
        try:
            msr = float(request.form["msr"])
            vsd = float(request.form["vsd"])
            correct_msr = msr in allowed_readings[which]['msr']
            correct_vsd = vsd in allowed_readings[which]['vsd']
            if not (correct_msr and correct_vsd):
                error = "Please give correct reading."
                flash(error)
                image_file = {
                    "small": "vernier_small.png",
                    "large": "vernier_large.png",
                    "length": "vernier_length.png"
                }[which]
                popup_title = {
                    "small": "Small Cross Section",
                    "large": "Large Cross Section",
                    "length": "Tapered Length"
                }[which]
                return render_main(
                    popup=True, popup_title=popup_title, image_file=image_file, active_measurement=which
                )
            value = msr + vsd * 0.05
            session[which] = round(value, 3)
            session.pop("active_measurement", None)
            return redirect(url_for("index_lab"))
        except Exception:
            flash("Please give correct reading.")
            image_file = {
                "small": "vernier_small.png",
                "large": "vernier_large.png",
                "length": "vernier_length.png"
            }[which]
            popup_title = {
                "small": "Small Cross Section",
                "large": "Large Cross Section",
                "length": "Tapered Length"
            }[which]
            return render_main(
                popup=True, popup_title=popup_title, image_file=image_file, active_measurement=which
            )
    # On GET, set the active measurement and block other navigation
    session["active_measurement"] = which
    image_file = {
        "small": "vernier_small.png",
        "large": "vernier_large.png",
        "length": "vernier_length.png"
    }[which]
    popup_title = {
        "small": "Small Cross Section",
        "large": "Large Cross Section",
        "length": "Tapered Length"
    }[which]
    return render_main(popup=True, popup_title=popup_title, image_file=image_file, active_measurement=which)

@app.route("/calculate", methods=["POST"])
def calculate():
    if not session.get("quiz_passed"):
        return redirect(url_for("experiment"))
    try:
        d = float(session.get("small", 0))
        D = float(session.get("large", 0))
        L = float(session.get("length", 0))
        if min(d, D, L) <= 0:
            result = "Please enter all readings first."
        else:
            tan_theta = (D - d) / (2 * L)
            theta = round(math.degrees(math.atan(tan_theta)), 2)
            result = f'''
*********************************

FORMULA :\n
tanθ = (D - d) / (2L)\n
Small Diameter (d) = {d}\n
Large Diameter (D) = {D}\n
Length of Taper (L) = {L}\n

*********************************

tanθ = ({D} - {d}) / (2 × {L})\n
tanθ = {tan_theta}\n
Therefore,\n
θ = {theta}\n
Taper angle is {theta}°.

*********************************
'''
    except Exception:
        result = "Error: Please check entries."
    return render_main(result=result)

@app.route("/style.css")
def style():
    # Load from style_css or file
    STYLE_CSS = '''
body {
  font-family: "Segoe UI", Arial, sans-serif;
  background: #f6f9fc;
  margin: 0;
  color: #111;
}
header {
  background: #0b63d3;
  color: white;
  padding: 20px;
  text-align: center;
}
nav {
  margin-top: 10px;
}
nav a {
  color: white;
  text-decoration: none;
  margin: 0 15px;
  font-weight: bold;
}
nav a:hover {
  text-decoration: underline;
}
main {
  max-width: 850px;
  margin: 30px auto;
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
h1, h2 {
  color: #0b63d3;
}
.main-img {
  width: 100%;
  max-width: 500px;
  display: block;
  margin: 20px auto;
}
.procedure-imgs img {
  width: 45%;
  margin: 5px;
  border-radius: 10px;
  border: 1px solid #ccc;
}
.calculator {
  margin-top: 25px;
  background: #f2f7ff;
  padding: 20px;
  border-radius: 10px;
}
button {
  background: #0b63d3;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}
button:hover {
  background: #094f9d;
}
.question {
  background: #f9fbfe;
  border: 1px solid #e1e6ef;
  padding: 14px 18px;
  border-radius: 10px;
  margin-bottom: 18px;
}
.correct { background-color: #d4edda; border-color: #28a745; }
.incorrect { background-color: #f8d7da; border-color: #dc3545; }
footer {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 0.9rem;
}
''' 
    return STYLE_CSS, 200, {"Content-Type": "text/css"}

if __name__ == "__main__":
    app.run(debug=True)
