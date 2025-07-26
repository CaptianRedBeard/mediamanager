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

const app = document.getElementById('app');
app.innerHTML = `
  <h2>Upload Multiple Images</h2>
  <form id="uploadForm">
    <input type="file" id="imageInput" name="images" multiple accept="image/*" />
    <button type="submit">Upload</button>
  </form>
  <ul id="uploadResults"></ul>
`;

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const files = document.getElementById("imageInput").files;
  const resultsList = document.getElementById("uploadResults");
  resultsList.innerHTML = "";

  if (!files.length) {
    alert("Please select at least one image.");
    return;
  }

  for (const file of files) {
    const formData = new FormData();
    formData.append("image", file);
    console.log(file)

    try {
      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      const li = document.createElement("li");
      li.innerHTML = `
        ${file.name}</strong> uploaded! 
        <a href="${result.image_url}" target="_blank">View</a>
      `;
      resultsList.appendChild(li);
    } catch (err) {
      const li = document.createElement("li");
      li.innerHTML = `${file.name}</strong> failed: ${err.message}`;
      resultsList.appendChild(li);
    }
  }
});

