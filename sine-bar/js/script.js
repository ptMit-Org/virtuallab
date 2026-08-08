const sineBarLength = 200; // mm
const pixelsPerMM = 2;
const neutralHeight = 41.655;
// This offset matches the bottom position of the base image in CSS (approx 195px bottom for bar pivot)
const baseBottomOffset = 215; 

function updateAngle() {
  const h = parseFloat(document.getElementById('heightSelect').value);
  
  // Calculate Angle
  const thetaRad = Math.asin(h / sineBarLength);
  const thetaDeg = (thetaRad * 180 / Math.PI).toFixed(2);

  // Rotate Elements
  document.getElementById('sinebar').style.transform = `rotate(${-thetaDeg}deg)`;
  document.getElementById('taperbar').style.transform = `rotate(${-thetaDeg}deg)`;

  // Update Slip Gauge Visuals
  const slipGauge = document.getElementById('slipgauge');
  const newHeight = h * pixelsPerMM; // Height in pixels
  
  // Update height and position
  // 10px serves as a visual correction factor for the gauge stack image connection
  slipGauge.style.height = `${Math.max(0, newHeight - 10)}px`; 
  
  // Reset Dial Position
  const dial = document.getElementById('dialGauge');
  dial.style.transition = "left 0.5s ease";
  dial.style.left = '50px';
  document.getElementById('readingBox').innerText = "0.00";

  // Update Info Text (Right Panel)
  document.getElementById('angleInfoBox').innerHTML = `
    <div>Slip Gauge Height (h): <b>${h} mm</b></div>
    <div>Sine Bar Length (L): <b>${sineBarLength} mm</b></div>
    <div>Formula: <b>sin(θ) = h / L</b></div>
  `;

  displaySlipGaugeSplit(h);
}

function calculateDeflection() {
  const dial = document.getElementById('dialGauge');
  const readingBox = document.getElementById('readingBox');
  const h = parseFloat(document.getElementById('heightSelect').value);
  
  const diff = Math.abs(h - neutralHeight);
  const maxDeflection = 5.17;
  const deflectionRange = 20;
  
  // Calculate simulated deflection value
  let targetDeflection = Math.min((diff / deflectionRange) * maxDeflection, maxDeflection);

  // Animation: Move Dial
  dial.style.transition = "left 2s linear";
  dial.style.left = "250px";

  // Animation: Tick numbers
  let deflection = 0;
  // Delay number crunching until dial starts moving over the piece
  setTimeout(() => {
    if (window.deflectionInterval) clearInterval(window.deflectionInterval);
    
    window.deflectionInterval = setInterval(() => {
      deflection += targetDeflection / 25; // Increment
      readingBox.innerText = deflection.toFixed(2);
      
      if (deflection >= targetDeflection) {
        clearInterval(window.deflectionInterval);
        readingBox.innerText = targetDeflection.toFixed(2); // Ensure exact final value
        
        // If close to target, show success message
        if (h === 41.65) {
            showCalculatedAngle(h);
        }
      }
    }, 60);
  }, 500);
}

function showCalculatedAngle(h) {
  const thetaRad = Math.asin(h / sineBarLength);
  const thetaDeg = (thetaRad * 180 / Math.PI).toFixed(2);
  const infoBox = document.getElementById('angleInfoBox');
  infoBox.innerHTML += `<div class="glowBlue">Calculated Taper Angle (θ):<br><b>${thetaDeg}°</b></div>`;
}

function displaySlipGaugeSplit(height) {
  const availableGauges = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 5, 3, 2, 1, 0.5, 0.2, 0.1, 0.05];
  let remaining = parseFloat(height.toFixed(3));
  let selected = [];

  // Greedy algorithm to find gauges
  for (let g of availableGauges) {
    while (remaining >= g - 0.0001) {
      selected.push(g);
      remaining = parseFloat((remaining - g).toFixed(3));
    }
    if (remaining <= 0.001) break;
  }
  if (remaining > 0.001) selected.push(parseFloat(remaining.toFixed(2)));

  // Render list
  const listDiv = document.getElementById('splitGaugeList');
  listDiv.innerHTML = "";
  
  if(height === 0) {
      listDiv.innerHTML = "Base level (0 mm)";
      return;
  }

  selected.forEach((val, i) => {
    setTimeout(() => {
      const block = document.createElement("div");
      block.className = "gauge-block";
      block.textContent = val + " mm";
      listDiv.appendChild(block);

      if (i === selected.length - 1) {
        setTimeout(() => {
          const sumDiv = document.createElement("div");
          sumDiv.className = "sumDisplay";
          const total = selected.reduce((a, b) => a + b, 0).toFixed(2);
          sumDiv.innerHTML = "Total = " + total + " mm";
          listDiv.appendChild(sumDiv);
        }, 300);
      }
    }, i * 200); // Faster animation
  });
}


function showCalculatedAngle(h) {
  const thetaRad = Math.asin(h / sineBarLength);
  const thetaDeg = (thetaRad * 180 / Math.PI).toFixed(2);
  const infoBox = document.getElementById('angleInfoBox');
  
  // Clear previous content
  infoBox.innerHTML = `
    <div class="glowBlue">
      Result: <b>${thetaDeg}°</b>
    </div>
    <div style="margin-top:15px; text-align:center;">
      <p style="font-size:14px; margin-bottom:8px;">Want to see the math?</p>
      
      <button onclick="window.location.href='calculation.html?h=${h}&L=${sineBarLength}'" 
        style="
          background:#28a745; 
          color:white; 
          border:none; 
          padding:8px 12px; 
          border-radius:4px; 
          cursor:pointer; 
          font-weight:bold;
          font-size:14px;">
        View Step-by-Step Calculation
      </button>
    </div>
  `;
}

// Initial Load
window.onload = updateAngle;