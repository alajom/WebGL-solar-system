

var canvas;
var gl;

var numTimesToSubdivide = 4;

var index = 0;

var pointsArray = [];

var va = vec4(0.0, 0.0, -1.0, 1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

//Sun
var sunRotationTheta = [ 0, 0, 0 ];
var sunRotationThetaLoc;
var sunProgram;

//Mercury
var planetRotation = [ 0 , 0, 0 ];
var planetRotationLoc;
var planetProgram;

//Venus
var venusRotation = [ 0, 0, 0 ];
var venusRotationLoc;
var venusProgram;

//Earth
var earthRotation = [ 0, 0, 0 ];
var earthRotationLoc;
var earthProgram;

function triangle(a, b, c) {



     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);

     index += 3;

}


function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {

        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        triangle( a, b, c );
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.01, 0.0, 0.12, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
	tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
	tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
	tetrahedron(va, vb, vc, vd, numTimesToSubdivide);



    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

	//SunProgram
	sunProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
    var vPosition = gl.getAttribLocation( sunProgram, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
	sunRotationThetaLoc = gl.getUniformLocation(sunProgram, "sunRotationTheta");

	//Mercury
	planetProgram = initShaders( gl, "vertex-shader1", "fragment-shader1" );
	var vPosition1 = gl.getAttribLocation( planetProgram, "vPosition");
    gl.vertexAttribPointer(vPosition1, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition1);
    planetRotationLoc = gl.getUniformLocation(planetProgram, "planetRotation");
	
	//Venus
	venusProgram = initShaders( gl, "vertex-shader2", "fragment-shader2" );
	var vPosition2 = gl.getAttribLocation( venusProgram, "vPosition2");
    gl.vertexAttribPointer(vPosition2, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition2);
    venusRotationLoc = gl.getUniformLocation(venusProgram, "venusRotation");
	
	//Earth
	earthProgram = initShaders( gl, "vertex-shader3", "fragment-shader3" );
	var earthPosition = gl.getAttribLocation( earthProgram, "earthPosition");
    gl.vertexAttribPointer(earthPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(earthPosition);
    earthRotationLoc = gl.getUniformLocation(earthProgram, "earthRotation");
    


    document.getElementById("Button0").onclick = function(){
        numTimesToSubdivide++;
        index = 0;
        pointsArray = [];
        init();
    };
    document.getElementById("Button1").onclick = function(){
        if(numTimesToSubdivide) numTimesToSubdivide--;
        index = 0;
        pointsArray = [];
        init();
    };


    render();
}


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	

	//Sun
	gl.useProgram( sunProgram );
    gl.uniform3fv(sunRotationThetaLoc, sunRotationTheta);
    for( var i=0; i<index/2; i+=3)
        gl.drawArrays( gl.TRIANGLES, i, 3 );
	
	//Mercury
	gl.useProgram( planetProgram );
	planetRotation[2] -= 2.4;
    gl.uniform3fv(planetRotationLoc, planetRotation);
	for( var i=index/2; i<index; i+=3)
        gl.drawArrays( gl.TRIANGLES, i, 3 );
	
	//Venus
	gl.useProgram( venusProgram );
	venusRotation[2] -= 1.6;
    gl.uniform3fv(venusRotationLoc, venusRotation);
    for( var i=0; i<index/2; i+=3)
        gl.drawArrays( gl.TRIANGLES, i, 3 );
	
	//Earth
	gl.useProgram( earthProgram );
	earthRotation[2] -= 1.2;
    gl.uniform3fv(earthRotationLoc, earthRotation);
    for( var i=0; i<index/2; i+=3)
        gl.drawArrays( gl.TRIANGLES, i, 3 );

    requestAnimFrame(render);
}
