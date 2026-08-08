// Pneumatic Comparator Educational Application JavaScript

// Application state
let measurementData = [];
let measurementCount = 0;
let isAnimating = false;
let airFlowInterval = null;
let currentAirFlow = 'normal'; // 'normal', 'restricted'

// Deviation values for testing workpiece (exact values as requested)
const deviationValues = [0.00, 0.10, 0.11, -0.13, -0.11, 0.05, -0.08];

// DOM elements
let elements = {};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Pneumatic Comparator Application...');
    
    // Small delay to ensure DOM is fully loaded
    setTimeout(() => {
        initializeElements();
        initializeSimulation();
        
        // Start the simulation visuals immediately
        startAirFlowAnimation();
        initializeWaterLevel();
        
        console.log('Application initialization complete');
    }, 100);
});

function initializeElements() {
    elements = {
        // Simulation elements
        deviationDisplay: document.getElementById('deviation-display'),
        statusText: document.getElementById('status-text'),
        measurementCountEl: document.getElementById('measurement-count'),
        plotGraphBtn: document.getElementById('plot-graph-btn'),
        resetDataBtn: document.getElementById('reset-data-btn'),
        graphModal: document.getElementById('graph-modal'),
        standardWorkpiece: document.getElementById('standard-workpiece'),
        testingWorkpiece: document.getElementById('testing-workpiece'),
        waterColumnLeft: document.getElementById('water-column-left'),
        waterColumnRight: document.getElementById('water-column-right'),
        airParticles: document.getElementById('air-particles'),
        measuringHead: document.getElementById('measuring-head')
    };
    
    console.log('Elements initialized successfully');
}

function initializeSimulation() {
    console.log('Initializing simulation logic...');
    
    if (elements.standardWorkpiece) {
        elements.standardWorkpiece.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            testStandardWorkpiece();
        });
        console.log('Standard workpiece handler added');
    }
    
    if (elements.testingWorkpiece) {
        elements.testingWorkpiece.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            testTestingWorkpiece();
        });
        console.log('Testing workpiece handler added');
    }
    
    if (elements.plotGraphBtn) {
        elements.plotGraphBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showGraph();
        });
        console.log('Plot graph handler added');
    }
    
    if (elements.resetDataBtn) {
        elements.resetDataBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            resetMeasurementData();
        });
        console.log('Reset data handler added');
    }
}

function initializeWaterLevel() {
    updateWaterLevel(0);
}

function startAirFlowAnimation() {
    if (airFlowInterval) {
        clearInterval(airFlowInterval);
    }
    
    console.log('Starting air flow animation');
    airFlowInterval = setInterval(() => {
        createAirParticles();
    }, currentAirFlow === 'normal' ? 600 : 1200);
}

function createAirParticles() {
    if (!elements.airParticles) return;
    
    const paths = [
        {start: {x: 130, y: 320}, end: {x: 240, y: 320}, duration: 1200},
        {start: {x: 350, y: 320}, end: {x: 430, y: 320}, duration: 800},
        {start: {x: 450, y: 320}, end: {x: 850, y: 315}, duration: 2500}
    ];
    
    paths.forEach((path, index) => {
        setTimeout(() => {
            const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            particle.setAttribute('r', currentAirFlow === 'normal' ? '3' : '2');
            particle.setAttribute('class', `air-particle particle-${currentAirFlow}`);
            particle.setAttribute('cx', path.start.x);
            particle.setAttribute('cy', path.start.y);
            
            elements.airParticles.appendChild(particle);
            
            const adjustedDuration = currentAirFlow === 'normal' ? path.duration : path.duration * 1.5;
            
            const animation = particle.animate([
                {transform: `translate(0, 0)`, opacity: '0'},
                {transform: `translate(${(path.end.x - path.start.x) * 0.1}px, ${(path.end.y - path.start.y) * 0.1}px)`, opacity: '1'},
                {transform: `translate(${(path.end.x - path.start.x) * 0.9}px, ${(path.end.y - path.start.y) * 0.9}px)`, opacity: '1'},
                {transform: `translate(${path.end.x - path.start.x}px, ${path.end.y - path.start.y}px)`, opacity: '0'}
            ], {
                duration: adjustedDuration,
                easing: 'ease-in-out'
            });
            
            animation.onfinish = () => {
                if (particle.parentNode) {
                    particle.remove();
                }
            };
        }, index * 200);
    });
}

function testStandardWorkpiece() {
    if (isAnimating) return;
    
    console.log('Testing standard workpiece...');
    isAnimating = true;
    updateStatus('Testing standard workpiece...', 'measuring');
    
    // Animate workpiece sliding to enclose measuring head
    elements.standardWorkpiece.classList.add('moving-standard');
    
    setTimeout(() => {
        // Show measuring head being covered
        showMeasuringHeadCovered();
        updateDeviation(0.00);
        updateWaterLevel(0.00);
        updateStatus('Standard workpiece enclosed - No deviation detected', 'complete');
        
        setTimeout(() => {
            // Return to original position
            elements.standardWorkpiece.classList.remove('moving-standard');
            showMeasuringHeadUncovered();
            updateStatus('Ready for measurement', 'ready');
            isAnimating = false;
        }, 3000);
    }, 1000);
}

function testTestingWorkpiece() {
    if (isAnimating) return;
    
    console.log('Testing workpiece with deviations...');
    isAnimating = true;
    updateStatus('Testing workpiece...', 'measuring');
    
    // Animate workpiece sliding to enclose measuring head
    elements.testingWorkpiece.classList.add('moving-testing');
    
    setTimeout(() => {
        showMeasuringHeadCovered();
        currentAirFlow = 'restricted';
        startAirFlowAnimation();
        performMeasurementCycle();
    }, 1000);
}

function showMeasuringHeadCovered() {
    // Dim the measuring head probes to show they're enclosed
    if (elements.measuringHead) {
        const probes = elements.measuringHead.querySelectorAll('.measuring-probe, .probe-tip');
        probes.forEach(probe => {
            probe.classList.add('probe-covered');
        });
    }
}

function showMeasuringHeadUncovered() {
    // Restore measuring head probes
    if (elements.measuringHead) {
        const probes = elements.measuringHead.querySelectorAll('.measuring-probe, .probe-tip');
        probes.forEach(probe => {
            probe.classList.remove('probe-covered');
        });
    }
}

function performMeasurementCycle() {
    let cycleCount = 0;
    const maxCycles = deviationValues.length;
    
    const measurementInterval = setInterval(() => {
        const deviation = deviationValues[cycleCount];
        
        updateDeviation(deviation);
        updateWaterLevel(deviation);
        measurementData.push(deviation);
        
        updateStatus(`Measuring... Reading ${cycleCount + 1}/${maxCycles} (${deviation.toFixed(2)}mm)`, 'measuring');
        cycleCount++;
        
        if (cycleCount >= maxCycles) {
            clearInterval(measurementInterval);
            
            setTimeout(() => {
                measurementCount++;
                if (elements.measurementCountEl) {
                    elements.measurementCountEl.textContent = measurementCount;
                }
                
                // Return workpiece to original position
                elements.testingWorkpiece.classList.remove('moving-testing');
                showMeasuringHeadUncovered();
                currentAirFlow = 'normal';
                startAirFlowAnimation();
                
                updateStatus('Measurement complete - Ready for next test', 'complete');
                updateDeviation(0.00);
                updateWaterLevel(0.00);
                isAnimating = false;
            }, 1500);
        }
    }, 1500);
}

function updateDeviation(value) {
    if (!elements.deviationDisplay) return;
    
    elements.deviationDisplay.textContent = value.toFixed(2);
    
    // Color coding based on deviation value
    if (value === 0) {
        elements.deviationDisplay.style.color = '#32B8C6';
    } else if (Math.abs(value) <= 0.05) {
        elements.deviationDisplay.style.color = '#1FB8CD';
    } else if (Math.abs(value) <= 0.10) {
        elements.deviationDisplay.style.color = '#E68161';
    } else {
        elements.deviationDisplay.style.color = '#FF5459';
    }
}

function updateWaterLevel(deviation) {
    if (!elements.waterColumnLeft || !elements.waterColumnRight) return;
    
    const zeroPosition = 400; // Center position
    const scaleFactor = 150; // Amplification factor
    
    // Left column goes opposite to right column
    const leftY = zeroPosition + (deviation * scaleFactor);
    const rightY = zeroPosition - (deviation * scaleFactor);
    
    // Clamp values to reasonable range
    const clampedLeftY = Math.max(260, Math.min(520, leftY));
    const clampedRightY = Math.max(260, Math.min(520, rightY));
    
    const leftHeight = Math.max(10, 530 - clampedLeftY);
    const rightHeight = Math.max(10, 530 - clampedRightY);
    
    // Add animation class
    elements.waterColumnLeft.classList.add(deviation > 0 ? 'water-rising' : 'water-falling');
    elements.waterColumnRight.classList.add(deviation < 0 ? 'water-rising' : 'water-falling');
    
    elements.waterColumnLeft.setAttribute('y', clampedLeftY);
    elements.waterColumnLeft.setAttribute('height', leftHeight);
    
    elements.waterColumnRight.setAttribute('y', clampedRightY);
    elements.waterColumnRight.setAttribute('height', rightHeight);
    
    // Remove animation class after animation completes
    setTimeout(() => {
        elements.waterColumnLeft.classList.remove('water-rising', 'water-falling');
        elements.waterColumnRight.classList.remove('water-rising', 'water-falling');
    }, 800);
}

function updateStatus(message, type = 'ready') {
    if (!elements.statusText) return;
    
    elements.statusText.textContent = message;
    elements.statusText.className = `status-text status-${type}`;
}

function showGraph() {
    if (measurementData.length === 0) {
        updateStatus('No measurement data available. Test the workpiece first.', 'ready');
        return;
    }
    
    elements.graphModal.classList.remove('hidden');
    setTimeout(createDeviationChart, 100);
}

function createDeviationChart() {
    const canvas = document.getElementById('deviation-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (window.deviationChart) {
        window.deviationChart.destroy();
    }
    
    const labels = measurementData.map((_, index) => `Reading ${index + 1}`);
    
    window.deviationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Deviation (mm)',
                data: measurementData,
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: '#1FB8CD',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                fill: true,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Hollow Workpiece Deviation Measurements',
                    font: { size: 16, weight: 'bold' },
                    color: '#1F343B'
                },
                legend: {
                    display: true,
                    labels: {
                        color: '#626C7C'
                    }
                }
            },
            scales: {
                y: {
                    title: { 
                        display: true, 
                        text: 'Deviation (mm)',
                        color: '#626C7C'
                    },
                    min: -0.2,
                    max: 0.2,
                    grid: {
                        color: 'rgba(98, 108, 124, 0.1)'
                    },
                    ticks: {
                        color: '#626C7C'
                    }
                },
                x: {
                    title: { 
                        display: true, 
                        text: 'Measurement Number',
                        color: '#626C7C'
                    },
                    grid: {
                        color: 'rgba(98, 108, 124, 0.1)'
                    },
                    ticks: {
                        color: '#626C7C'
                    }
                }
            }
        }
    });
}

function closeModal() {
    if (elements.graphModal) {
        elements.graphModal.classList.add('hidden');
    }
    if (window.deviationChart) {
        window.deviationChart.destroy();
        window.deviationChart = null;
    }
}

function resetMeasurementData() {
    measurementData = [];
    measurementCount = 0;
    
    if (elements.measurementCountEl) {
        elements.measurementCountEl.textContent = '0';
    }
    
    updateStatus('Measurement data reset - Ready for testing', 'ready');
    updateDeviation(0.00);
    updateWaterLevel(0.00);
    
    console.log('Measurement data reset');
}

// Global event handlers
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-backdrop')) {
        closeModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Global functions for HTML onclick handlers
window.closeModal = closeModal;

console.log('Pneumatic Comparator Simulation script loaded successfully');