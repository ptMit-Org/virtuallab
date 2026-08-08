// Data State
let currentMode = null;
const readings = { small: null, large: null, length: null };
function toggleHelp() {
    toggleModal('help-modal');
}

// EXACT Allowed Readings (From your Flask Python code)
const answers = {
    small:  { msr: [22, 23, 24], vsd: [16, 17, 18] },
    large:  { msr: [32, 33, 31], vsd: [12, 13, 14] },
    length: { msr: [69, 70, 71], vsd: [18, 19, 20] }
};



// Jaw Movement Positions (pixels to move left)
const positions = {
    small: "-375px",  // Adjusted to match typical image size
    large: "-346px",
    length: "-235px"
};

function toggleModal(id) {
    const el = document.getElementById(id);
    el.style.display = (el.style.display === 'none') ? 'flex' : 'none';
}

function startMeasurement(type) {
    currentMode = type;

    // UI Updates
    document.getElementById('welcome-msg').style.display = 'none';
    document.getElementById('simulator-container').style.display = 'block';
    document.getElementById('result-box').style.display = 'none';
    
    // Highlight Button
    document.querySelectorAll('.top-bar button').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + type).classList.add('active');

    // Show correct object
    ['obj-small', 'obj-large', 'obj-length'].forEach(id => document.getElementById(id).style.display = 'none');
    document.getElementById('obj-' + type).style.display = 'block';

    // Reset Inputs
    document.getElementById('input-section').style.display = 'block';
    document.getElementById('input-title').innerText = "Confirm Reading for " + type.charAt(0).toUpperCase() + type.slice(1);
    document.getElementById('in-msr').value = '';
    document.getElementById('in-vsd').value = '';
    document.getElementById('error-msg').style.display = 'none';

    // Animate Jaw
    const jaw = document.getElementById('vernierJaw');
    jaw.style.transition = 'none';
    jaw.style.transform = 'translateX(0px)'; // Reset
    
    setTimeout(() => {
        jaw.style.transition = 'transform 1.5s ease-in-out';
        jaw.style.transform = `translateX(${positions[type]})`;
    }, 100);
}

function submitReading() {
    if (!currentMode) return;

    const msr = parseFloat(document.getElementById('in-msr').value);
    const vsd = parseFloat(document.getElementById('in-vsd').value);
    const valid = answers[currentMode];

    // Check if input is in the allowed list
    if (valid.msr.includes(msr) && valid.vsd.includes(vsd)) {
        // Correct!
        const value = msr + (vsd * 0.05); // Standard LC calculation
        readings[currentMode] = value.toFixed(2);

        // Update Side Panel Log
        document.getElementById('val-' + currentMode).innerHTML = `<strong>${value.toFixed(2)} mm</strong>`;

        // Disable button
        const btn = document.getElementById('btn-' + currentMode);
        btn.disabled = true;
        btn.classList.remove('active');
        btn.innerText += " (Done)";

        // Hide inputs
        document.getElementById('input-section').style.display = 'none';
        document.getElementById('simulator-container').style.display = 'none';
        document.getElementById('welcome-msg').style.display = 'block';
        document.getElementById('welcome-msg').innerText = "Reading Recorded. Select next measurement.";

        // Check completion
        if (readings.small && readings.large && readings.length) {
            document.getElementById('btn-calc').disabled = false;
        }

    } else {
        // Incorrect
        document.getElementById('error-msg').style.display = 'block';
    }
}

function calculateResult() {
    const d = parseFloat(readings.small);
    const D = parseFloat(readings.large);
    const L = parseFloat(readings.length);

    const tanTheta = (D - d) / (2 * L);
    const thetaRad = Math.atan(tanTheta);
    const thetaDeg = thetaRad * (180 / Math.PI);

    const txt = `
CALCULATION RESULT
==================
Formula: tan(θ) = (D - d) / (2L)

Values:
  Small Dia (d) = ${d} mm
  Large Dia (D) = ${D} mm
  Length (L)    = ${L} mm

Calculation:
  tan(θ) = (${D} - ${d}) / (2 × ${L})
  tan(θ) = ${tanTheta.toFixed(5)}

Final Result:
  θ = ${thetaDeg.toFixed(2)}°
    `;
    
    document.getElementById('welcome-msg').style.display = 'none';
    const resBox = document.getElementById('result-box');
    resBox.innerText = txt;
    resBox.style.display = 'block';
}