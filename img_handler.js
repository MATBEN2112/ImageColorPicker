// Select file input fields
var input = document.getElementById('form-control');
var dropArea = document.getElementById("drop-area")
// Select color code input fields
var htmlInput = document.getElementById('html');
var rgbInput = document.getElementById('rgb');
// Select a canvas object
var imageCanvas = document.getElementById("imageCanvas");
var zoomCanvas = document.getElementById('zoomCanvas');
var colorCanvas = document.getElementById("colorCanvas");

var mouse  = {x : 0, y : 0};
const zoom = 18;

document.addEventListener('dragenter', rejectDefaultCase, false)
document.addEventListener('dragover', rejectDefaultCase, false)
document.addEventListener('dragleave', rejectDefaultCase, false)
document.addEventListener('drop', rejectDefaultCase, false)

function rejectDefaultCase(event){
	// Prevent file opening in browser window
	console.log(event)
	event.preventDefault();
	event.stopPropagation();
}

dropArea.addEventListener('dragenter', dndEventListener, false)
dropArea.addEventListener('dragover', dndEventListener, false)
dropArea.addEventListener('dragleave', dndEventListener, false)
dropArea.addEventListener('drop', dndEventListener, false)

function dndEventListener(event) {  

  	rejectDefaultCase(event)
  	// Highlight drop area when item is dragged over it
  	if (event.type=='dragenter'||event.type=='dragover'){dropArea.classList.add('highlight');}
  	else {dropArea.classList.remove('highlight');}
}


// Get the image file from input filed
dropArea.addEventListener('drop', function (e) {
    var file = e.dataTransfer.files[0]
    if (file.type.slice(0,5)=="image") {display_img(file)} 
})
input.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (file) {display_img(file)}      	
})

function display_img(imageFile) {

    var reader = new FileReader();
    reader.readAsDataURL(imageFile);

    reader.onloadend = function (e) {

       	var myImage = new Image(); // Creates image object
        myImage.src = e.target.result; // Assigns converted image to image object

        myImage.onload = function() {

        	w=imageCanvas.width;
			h=imageCanvas.height;
			var imageContext = imageCanvas.getContext("2d", { willReadFrequently: true });
          	imageContext.clearRect(0,0,w,h)

        	w/h > myImage.width / myImage.height ? w = myImage.width / myImage.height * h : h = w / (myImage.width / myImage.height);// Image resize to fit canvas

          	imageContext.drawImage(myImage, 0, 0, w, h); // Draws the image on canvas

	        function magnifyImage(cur_pos_X, cur_pos_Y) {

	    		// Draw zoomed content
	    		var zoomContext = zoomCanvas.getContext("2d", { willReadFrequently: true });

	    		zoomContext.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);// clean zoom
	        	zoomContext.drawImage(
	        	imageCanvas, 
	        	cur_pos_X - (zoomCanvas.width/zoom) / 2, 
	        	cur_pos_Y - (zoomCanvas.height/zoom) / 2, 
	        	zoomCanvas.width / zoom, zoomCanvas.height / zoom, 0, 0, zoomCanvas.width, zoomCanvas.height);
	        	// drawImage(img_obj,
	    		// origin_offsetX, origin_offsetY, origin_width, origin_height, // origin pos and size
	    		// canvas_offsetX, canvas_offsetY, canvas_width, canvas_height) // canvas pos and size

	    		// Draw pointer
	        	zoomContext.fillStyle = "rgba(255, 255, 255, 0.5)";
	        	zoomContext.fillRect(75, 75, 5, 5);

			};

			imageCanvas.addEventListener("mousemove", function(e){
				mouse.x = e.pageX - this.offsetLeft;
				mouse.y = e.pageY - this.offsetTop;
				magnifyImage(mouse.x, mouse.y);
				    
			});
			imageCanvas.addEventListener("click", function(event) {
				var rgb = imageContext.getImageData(mouse.x, mouse.y, 1, 1).data; // rgb color code
				var html = "#" + ("000000" + rgbToHTML(rgb[0], rgb[1], rgb[2])).slice(-6); // html color code
				
				// Send color code to input field
				htmlInput.value = html
				rgbInput.value = "rgb("+rgb.slice(0,3)+")";
				
				// Fill color canvas with selected color
				var colorContext = colorCanvas.getContext("2d", { willReadFrequently: true });
				colorContext.fillStyle = html;
				colorContext.fillRect(0, 0, colorCanvas.width, colorCanvas.height);

			});

			function rgbToHTML(r, g, b) {
    			if (r > 255 || g > 255 || b > 255)
        			alert("Invalid color code");
    			return ((r << 16) | (g << 8) | b).toString(16);
			}
		}
	}
    
}