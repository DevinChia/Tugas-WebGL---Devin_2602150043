// Wait for the page to load
window.onload = function() {
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    let currentColor = [1.0, 0.0, 0.0, 1.0];  // Default red color

    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    let fsSource = `
        precision mediump float;
        uniform vec4 uColor;
        void main() {
            gl_FragColor = uColor;
        }
    `;

    let shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    let colorUniformLocation = gl.getUniformLocation(shaderProgram, "uColor");

    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        -0.7,  0.5,
         0.7,  0.5,
        -0.7, -0.5,
         0.7, -0.5,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    gl.useProgram(shaderProgram);
    gl.uniform4fv(colorUniformLocation, currentColor);

    drawScene(gl);

    // Add event listeners for the buttons
    document.getElementById('greenButton').addEventListener('click', function() {
        currentColor = [0.0, 1.0, 0.0, 1.0];  // Green
        updateColor(gl, shaderProgram, colorUniformLocation, currentColor);
    });

    document.getElementById('blueButton').addEventListener('click', function() {
        currentColor = [0.0, 0.0, 1.0, 1.0];  // Blue
        updateColor(gl, shaderProgram, colorUniformLocation, currentColor);
    });

    document.getElementById('yellowButton').addEventListener('click', function() {
        currentColor = [1.0, 1.0, 0.0, 1.0];  // Yellow
        updateColor(gl, shaderProgram, colorUniformLocation, currentColor);
    });

    document.getElementById('resetButton').addEventListener('click', function() {
        currentColor = [1.0, 0.0, 0.0, 1.0];  // Reset to red
        updateColor(gl, shaderProgram, colorUniformLocation, currentColor);
    });
};

// Function to initialize the shader program
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

// Function to load a shader
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

// Function to update the color of the rectangle
function updateColor(gl, shaderProgram, colorUniformLocation, color) {
    gl.useProgram(shaderProgram);
    gl.uniform4fv(colorUniformLocation, color);
    drawScene(gl);
}

// Function to draw the scene
function drawScene(gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Black background
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
