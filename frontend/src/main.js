import './style.css';
import './app.css';

const gallery = document.getElementById('gallery');

// Simple HTML structure to hold the image
document.querySelector('#app').innerHTML = `
  <h2>Single Image Display</h2>
  <div id="image-container" style="padding:20px;">
    <img id="single-image" style="width:300px; height:auto; border-radius:8px;" />
  </div>
`;

// Hardcoded image ID
const imageId = "295c0f47-ec77-4ac7-8ed1-dda7556fb594";

// Set image src to the thumbnail endpoint
const img = document.getElementById('single-image');
img.src = `http://localhost:8080/thumb/${imageId}`;
img.alt = 'Thumbnail image';

// Optional: handle image loading errors
img.onerror = () => {
  img.alt = 'Failed to load image';
};
