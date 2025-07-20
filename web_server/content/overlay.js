// Overlay functionality
// callbacks
function CB_toggleLike() {
    const likeButton = document.querySelector('.like-button');
    likeButton.classList.toggle('liked');
}

function CB_buy(){};
function CB_mint(){};

function CB_artwork_picked(index) {
	return function() {
		manual_navigation_idx = index;
		manual_move();
	};
}


//rest of utility functions

function manual_move(){
	//get active camera
	const camera = scene.activeCamera;
	const camera_distance = [4, 6];


	var gallery=config_file_content[current_gallery];
	var dict_items=Object.keys(gallery).filter(key => gallery[key]["resource_type"]== "image");
	if (dict_items.length ==0) return;
	var n_items=dict_items.length;

	//check limits
	if (manual_navigation_idx<0){
		manual_navigation_idx= n_items-1;
	} else if (manual_navigation_idx ==n_items){
		manual_navigation_idx=0;
	}


	//get position and vector. Assuming they are JSON strings of 3-element arrays [x, y, z]
	let item_position_array = JSON.parse(gallery[dict_items[manual_navigation_idx]]['location']);
	let item_vector_array = JSON.parse(gallery[dict_items[manual_navigation_idx]]['vector']);

	// Create Babylon.js Vector3 objects
	const target_position = new BABYLON.Vector3(item_position_array[0], item_position_array[2], item_position_array[1]);
	const target_vector = new BABYLON.Vector3(item_vector_array[0], item_vector_array[2], item_vector_array[1]).normalize();

	// Calculate the camera's position to be in front of the item
	let camera_position;
	if  (window.innerWidth>600){
	    camera_position = target_position.add(target_vector.scale(camera_distance[0]));
	}
	else {
	    camera_position = target_position.add(target_vector.scale(camera_distance[1]));
	}

	// Aim the camera at the target
	camera.position = camera_position;
	camera.setTarget(target_position);

	showInfoBox("Title:  " + gallery[dict_items[manual_navigation_idx]]["metadata"]);


}

function manual_move_backward(){
	manual_navigation_idx--;
	manual_move();
}

function manual_move_forward(){
	manual_navigation_idx++;
	manual_move();
}

// show metadata or other info
function showInfoBox(title) {
    document.getElementById("artwork-info").innerText = title;
    //enable action buttons
    document.querySelectorAll('.action-button').forEach(button => {
        button.disabled = false;
    });
}

function hideInfoBox() {
    document.getElementById("artwork-info").innerText = "";
    //disable action buttons. Called when entering a new gallery
    document.querySelectorAll('.action-button').forEach(button => {
        button.disabled = true;
    });
    const likeButton = document.querySelector('.like-button');
    if (likeButton) {
        likeButton.classList.remove('liked');
    }
}



// Help popup functionality
function toggleHelp() {
    const helpPopup = document.getElementById('help-popup');
    helpPopup.style.display = helpPopup.style.display === 'none' ? 'block' : 'none';
}

function changeLanguage(lang) {
    // Remove active class from all language buttons and texts
    document.querySelectorAll('.lang-button').forEach(button => button.classList.remove('active'));
    document.querySelectorAll('.help-text').forEach(text => text.classList.remove('active'));
    
    // Add active class to selected language button and text
    document.querySelector(`.lang-button[onclick="changeLanguage('${lang}')"]`).classList.add('active');
    document.querySelector(`.help-text.${lang}`).classList.add('active');
}

// Load overlay content
document.addEventListener('DOMContentLoaded', function() {
    fetch('overlay.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
            // Initialize help popup as hidden
            document.getElementById('help-popup').style.display = 'none';
            hideInfoBox(); // Call hideInfoBox to set initial state
        });
});