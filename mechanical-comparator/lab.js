const canvas = document.getElementById('dialCanvas');
const ctx = canvas.getContext('2d');
const display = document.getElementById('measurementDisplay');
const plungerMount = document.getElementById('plungerMount');
const plungerShaft = document.getElementById('plungerShaft');
const plungerTip = document.getElementById('plungerTip');
const base = document.getElementById('base');
const activeWorkpieceContainer = document.getElementById('activeWorkpieceContainer');
const workpieces = document.querySelectorAll('.workpiece');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const mainRadius = 220;
const smallRadius = 50;

const PIXELS_PER_MM = 10;
const ZERO_BLOCK_HEIGHT_MM = 4;

let maxPlungerShaftHeight = 0;
let currentValue = 0;
let targetValue = 0;
let displacementPx = 0;
let activeWorkpiece = null;
let isDragging = false;
let dragOffsetX = 0;

// --- Workpiece Activation ---
function updateActiveWorkpieceStyles(el) {
    const nominalHeight = parseFloat(el.dataset.nominalHeight);
    activeWorkpiece.style.height = `${nominalHeight * PIXELS_PER_MM}px`;
    activeWorkpiece.style.backgroundColor = el.dataset.bg;
    activeWorkpiece.style.borderColor = el.dataset.border;

    // Build a fresh, perfectly matched clip-path
    activeWorkpiece.style.clipPath = getMatchedClipPath(el);
}

function moveWorkpieceToMeasurement(el) {
    // Find the label *before* clearing the container
    const labelEl = el.parentElement.querySelector('.workpiece-label');

    activeWorkpieceContainer.innerHTML = '';
    
    // Clone the workpiece DIV
    activeWorkpiece = el.cloneNode(true);
    activeWorkpiece.id = 'activeWorkpiece';
    activeWorkpiece.classList.remove('workpiece');

    updateActiveWorkpieceStyles(el);
    activeWorkpieceContainer.appendChild(activeWorkpiece);

    // Attach events to the cloned element
    activeWorkpiece.addEventListener('mousedown', startDrag);
    activeWorkpiece.addEventListener('touchstart', startDrag, { passive: false });

    const elRect = el.getBoundingClientRect();
    const containerRect = activeWorkpieceContainer.getBoundingClientRect();
    const startLeft = elRect.left - containerRect.left;
    const startTop = elRect.top - containerRect.top;

    // Start position (animation logic)
    activeWorkpiece.style.left = `${startLeft}px`;
    activeWorkpiece.style.top = `${startTop}px`;

    // Calculate center position
    const finalLeft = (activeWorkpieceContainer.offsetWidth - activeWorkpiece.offsetWidth) / 2;
    const finalTop = activeWorkpieceContainer.offsetHeight - activeWorkpiece.offsetHeight;

    // Animate to center
    setTimeout(() => {
        activeWorkpiece.style.left = `${finalLeft}px`;
        activeWorkpiece.style.top = `${finalTop}px`;
        updateMeasurement();
    }, 10);
}

// Add click listeners to sidebar items
workpieces.forEach(wp => {
    wp.addEventListener('dblclick', () => moveWorkpieceToMeasurement(wp));
    wp.addEventListener('touchend', (e) => {
        const now = new Date().getTime();
        const lastTouch = wp.dataset.lastTouch || 0;
        const delta = now - lastTouch;
        if (delta > 0 && delta < 300) {
            moveWorkpieceToMeasurement(wp);
        }
        wp.dataset.lastTouch = now;
    });
});

// --- Dragging Logic ---
function startDrag(e) {
    if (!activeWorkpiece) return;
    isDragging = true;
    
    if (e.type.includes('touch')) {
        e.preventDefault();
    }
    
    const event = e.type.includes('touch') ? e.touches[0] : e;
    const rect = activeWorkpiece.getBoundingClientRect();
    
    // Calculate offset where user clicked relative to piece edge
    dragOffsetX = event.clientX - rect.left;
    
    // Change cursor
    activeWorkpiece.style.cursor = 'grabbing';
}

function drag(e) {
    if (!isDragging || !activeWorkpiece) return;
    e.preventDefault();
    
    const event = e.type.includes('touch') ? e.touches[0] : e;
    const containerRect = activeWorkpieceContainer.getBoundingClientRect();
    
    // Calculate new X position relative to container
    let x = event.clientX - dragOffsetX - containerRect.left;
    
    // Bounds checking
    const movementRange = 150;
    const pieceCenter = containerRect.width / 2;
    const pieceWidth = activeWorkpiece.offsetWidth;

    const minX = pieceCenter - movementRange - (pieceWidth / 2);
    const maxX = pieceCenter + movementRange - (pieceWidth / 2);

    x = Math.max(minX, Math.min(x, maxX));
    
    // Apply position
    activeWorkpiece.style.left = `${x}px`;
    
    // Update Gauge
    updateMeasurement();
}

function stopDrag() { 
    isDragging = false; 
    if(activeWorkpiece) {
        activeWorkpiece.style.cursor = 'grab';
    }
}

// Attach global events for dragging
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchmove', drag, { passive: false });
document.addEventListener('touchend', stopDrag);

// --- Measurement Calculation ---
function calculateDisplacement() {
    if (!activeWorkpiece) return { displacement: 0, rawValue: 0 };

    const plungerRect = plungerTip.getBoundingClientRect();
    const plungerCenterX = plungerRect.left + plungerRect.width / 2;
    const activeRect = activeWorkpiece.getBoundingClientRect();
    
    // Where is the plunger relative to the workpiece (0.0 to 1.0)
    const relativeXRatio = (plungerCenterX - activeRect.left) / activeRect.width;

    let surfaceHeightPx = ZERO_BLOCK_HEIGHT_MM * PIXELS_PER_MM;
    
    // Only measure if plunger is overlapping the workpiece
    if (relativeXRatio >= 0 && relativeXRatio <= 1) {
        const nominalHeight = parseFloat(activeWorkpiece.dataset.nominalHeight);
        surfaceHeightPx = nominalHeight * PIXELS_PER_MM;
        
        // Add irregularity
        if (activeWorkpiece.dataset.type === 'irregular10') {
            surfaceHeightPx += 1 * Math.sin(relativeXRatio * Math.PI * 4); 
        } else if (activeWorkpiece.dataset.type === 'irregular20') {
            surfaceHeightPx += 2 * Math.sin(relativeXRatio * Math.PI * 6) + 1 * Math.cos(relativeXRatio * Math.PI * 10); 
        }
    }
    
    const absoluteMM = surfaceHeightPx / PIXELS_PER_MM;
    const dialMM = absoluteMM - ZERO_BLOCK_HEIGHT_MM;
    return { displacement: surfaceHeightPx, rawValue: dialMM };
}

function getMatchedClipPath(el) {
    const type = el.dataset.type;
    const nominalHeight = parseFloat(el.dataset.nominalHeight);
    const blockHeightPx = nominalHeight * PIXELS_PER_MM;

    const samples = 20;
    const amplitude10 = blockHeightPx * 0.11;
    const amplitude20 = blockHeightPx * 0.08;
    const baseRaise = blockHeightPx * 0.35;

    const points = [];

    for (let i = 0; i <= samples; i++) {
        const x = i / samples;
        let y = 0;
        let amp = amplitude10;

        if (type === "irregular10") {
            y = Math.sin(x * Math.PI * 4);
            amp = amplitude10;
        } else if (type === "irregular20") {
            y = 1.3 * Math.sin(x * Math.PI * 6) + 0.7 * Math.cos(x * Math.PI * 6);
            amp = amplitude20;
        }

        const yPx = blockHeightPx / 2 - (y * amp) / 2 - baseRaise;
        const yPercent = (yPx / blockHeightPx) * 100;
        points.push(`${(x * 100).toFixed(1)}% ${yPercent.toFixed(1)}%`);
    }

    const polygon = `polygon(0% 100%, 100% 100%, ${points.reverse().join(", ")})`;
    return polygon;
}

function updateMeasurement() {
    const { displacement, rawValue } = calculateDisplacement();
    displacementPx = displacement;
    targetValue = rawValue;
    const newHeight = maxPlungerShaftHeight - displacementPx;
    plungerShaft.style.height = `${Math.max(10, newHeight)}px`;
}

// --- Drawing Functions ---
function setInitialPlungerHeight() {
    if(!plungerMount || !base || !plungerTip) return;
    const mountRect = plungerMount.getBoundingClientRect();
    const baseRect = base.getBoundingClientRect();
    // Safety check if elements aren't rendered yet
    if(baseRect.top === 0) return; 
    
    maxPlungerShaftHeight = baseRect.top - mountRect.bottom - (plungerTip.offsetHeight / 2);
    plungerShaft.style.height = `${maxPlungerShaftHeight}px`;
}

function drawDial(value) {
    const scale = window.devicePixelRatio || 1;
    canvas.width = 500 * scale;
    canvas.height = 500 * scale;
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, 500, 500);

    // Main Face Background
    ctx.beginPath();
    ctx.arc(centerX, centerY, mainRadius + 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#D1D5DB'; ctx.fill();
    ctx.strokeStyle = '#6B7280'; ctx.lineWidth = 5; ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, mainRadius + 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'white'; ctx.fill();

    drawInternals(displacementPx);
    drawMainTicksAndNumbers();

    const smallDialX = centerX;
    const smallDialY = centerY - 60;
    drawSmallDial(smallDialX, smallDialY);

    drawMainNeedle(value);
    drawSmallNeedle(smallDialX, smallDialY, value);

    // Center Pin
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#4B5563'; ctx.fill();
}

function drawInternals(totalPhysicalDisplacementPx) {
    const rackWidth = 20, rackHeight = 150;
    const rackY = centerY + 70 - totalPhysicalDisplacementPx;

    // Rack
    ctx.fillStyle = '#9CA3AF';
    ctx.fillRect(centerX - rackWidth / 2, rackY - rackHeight / 2, rackWidth, rackHeight);
    ctx.strokeStyle = '#6B7280'; ctx.lineWidth = 2;
    for (let i = 0; i < 15; i++) {
        const toothY = rackY - rackHeight / 2 + i * 10 + 5;
        ctx.beginPath();
        ctx.moveTo(centerX - rackWidth / 2, toothY);
        ctx.lineTo(centerX - rackWidth / 2 - 5, toothY);
        ctx.stroke();
    }

    // Pinion
    const pinionRadius = 40;
    const angleRatio = 2 * Math.PI / PIXELS_PER_MM; 
    const pinionAngle = totalPhysicalDisplacementPx * angleRatio;
    
    ctx.save();
    ctx.translate(centerX + pinionRadius - 5, centerY);
    ctx.rotate(pinionAngle);
    ctx.beginPath();
    const teeth = 20;
    const toothHeight = 8;
    const angleStep = (2 * Math.PI) / teeth;
    for (let i = 0; i < teeth; i++) {
        const angle = i * angleStep;
        ctx.lineTo(pinionRadius * Math.cos(angle), pinionRadius * Math.sin(angle));
        ctx.lineTo((pinionRadius - toothHeight) * Math.cos(angle + angleStep / 2), (pinionRadius - toothHeight) * Math.sin(angle + angleStep / 2));
    }
    ctx.closePath();
    ctx.fillStyle = '#FBBF24'; ctx.fill();
    ctx.strokeStyle = '#B45309'; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath();
    ctx.arc(0,0,5,0,2*Math.PI);
    ctx.fillStyle = '#4B5563'; ctx.fill();
    ctx.restore();
}

function drawMainTicksAndNumbers() {
    ctx.font = 'bold 32px Inter';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    for (let i = 0; i <= 100; i++) {
        const angle = (i / 100) * 2 * Math.PI - Math.PI / 1;
        const isMajorTick = i % 10 === 0;
        const tickLength = isMajorTick ? 25 : (i % 5 === 0 ? 15 : 10);
        const startX = centerX + mainRadius * Math.cos(angle);
        const startY = centerY + mainRadius * Math.sin(angle);
        const endX = centerX + (mainRadius - tickLength) * Math.cos(angle);
        const endY = centerY + (mainRadius - tickLength) * Math.sin(angle);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = isMajorTick ? 3 : 1;
        ctx.stroke();
        if (isMajorTick) {
            const num = i === 100 ? 0 : i;
            const numX = centerX + (mainRadius - 50) * Math.cos(angle);
            const numY = centerY + (mainRadius - 50) * Math.sin(angle);
            ctx.fillText(num, numX, numY);
        }
    }
}

function drawSmallDial(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, smallRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white'; ctx.fill();
    ctx.strokeStyle = '#9CA3AF'; ctx.lineWidth = 4; ctx.stroke();
    ctx.font = '18px Inter'; ctx.fillStyle = 'black';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * 2 * Math.PI - Math.PI / 1;
        ctx.beginPath();
        ctx.moveTo(x + (smallRadius - 5) * Math.cos(angle), y + (smallRadius-5) * Math.sin(angle));
        ctx.lineTo(x + (smallRadius - 10) * Math.cos(angle), y + (smallRadius-10) * Math.sin(angle));
        ctx.stroke();
        const numX = x + (smallRadius - 22) * Math.cos(angle);
        const numY = y + (smallRadius - 22) * Math.sin(angle);
            ctx.fillText(i, numX, numY);
    }
}

function drawMainNeedle(value) {
    const angle = (value % 1) * 2 * Math.PI - (Math.PI / 2);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(0, -(mainRadius - 40)); 
    ctx.strokeStyle = 'red'; ctx.lineWidth = 4;
    ctx.lineCap = 'round'; ctx.stroke();
    ctx.restore();
}

function drawSmallNeedle(x, y, value) {
    const angle = ((value / 10) % 1) * 2 * Math.PI - (Math.PI / 2);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(0, -(smallRadius - 10));
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
    ctx.lineCap = 'round'; ctx.stroke();
    ctx.restore();
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#4B5563'; ctx.fill();
}

function animateNeedle() {
    const speed = 0.05;
    if (Math.abs(targetValue - currentValue) > 0.0001) {
        currentValue += (targetValue - currentValue) * speed;
    } else {
        currentValue = targetValue; 
    }
    
    if(display) {
        display.textContent = currentValue.toFixed(2);
    }
    drawDial(currentValue);
    requestAnimationFrame(animateNeedle);
}

window.onload = () => {
    // Initial Setup
    setTimeout(() => {
        setInitialPlungerHeight();
        if(workpieces.length > 0) {
            moveWorkpieceToMeasurement(workpieces[0]); // Auto load first piece
        }
        animateNeedle();
    }, 100);
    
    window.addEventListener('resize', () => {
        setInitialPlungerHeight();
        updateMeasurement();
    });
};