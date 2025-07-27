import '../wailsjs/runtime/runtime';
import './style.css';
import './app.css';
import { ImportImage, GetAllThumbnails } from '../wailsjs/go/mediaapi/MediaAPI';



console.log("✅ Wails runtime loaded");
setTimeout(() => {
  console.log("⏱️ window.go after 200ms:", window.go);
}, 200);
console.log("window.go", window.go);                     // Should be an object
console.log("window.go.mediaapi", window.go.mediaapi);   // Should exist
console.log("window.go.mediaapi.MediaAPI", window.go.mediaapi?.MediaAPI); // Should have methods

const routes = {
  home: `
    <h1>Welcome to Media Manager</h1>
    <button id="goToUpload">Upload Images</button>
    <button id= "goToGallery">Gallery</button>
  `,
  upload: `
    <h1>Upload Images</h1>
    <form id="uploadForm" enctype="multipart/form-data">
      <input type="file" name="image" id="imageInput" multiple />
      <button type="submit">Upload</button>
    </form>
    <ul id="uploadResults"></ul>
    <div id="uploadStatus"></div>
    <button id="menu">Back To Menu</button>
  `,
  gallery:`
    <h1>Gallery</h1>
    <button id="menu">Back To Menu</button>
    `
    
};

function navigateTo(route) {
  const app = document.getElementById("app");
  app.innerHTML = routes[route];

  if (route === "home") {
    document.getElementById("goToUpload").addEventListener("click", () => {
      navigateTo("upload");
    });
    document.getElementById("goToGallery").addEventListener("click", () => {
      navigateTo("gallery");
    })
  }

  if (route === "upload") {
    document.getElementById("menu").addEventListener("click", () => {
      navigateTo("home");
    });

    document.getElementById("uploadForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const files = document.getElementById("imageInput").files;
      const resultsList = document.getElementById("uploadResults");
      resultsList.innerHTML = "";

      for (const file of files) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const byteArray = new Uint8Array(arrayBuffer);

          const imageId = await ImportImage(file.name, Array.from(byteArray));

          const li = document.createElement("li");
          li.innerHTML = `${file.name} uploaded! Image ID: <strong>${imageId}</strong>`;
          resultsList.appendChild(li);
        } catch (err) {
          const li = document.createElement("li");
          li.innerHTML = `${file.name} failed: ${err.message}`;
          resultsList.appendChild(li);
        }
      }
    });
  }

  if (route == "gallery") {
    document.getElementById("menu").addEventListener("click", () => {
      navigateTo("home");
    });

    const galleryContainer = document.createElement("div");
    galleryContainer.id = "thumbnailGallery";
    galleryContainer.style.display = "flex";
    galleryContainer.style.flexWrap = "wrap";
    galleryContainer.style.gap = "12px";

    document.getElementById("app").appendChild(galleryContainer);

    (async () => {
      try {
        const thumbnails = await GetAllThumbnails();
        for (const base64 of thumbnails) {
          const img = document.createElement("img");
          img.src = base64;
          img.alt = `Thumbnail`;
          img.style.width = "150px";
          img.style.height = "150px";
          img.style.objectFit = "cover";
  
          galleryContainer.appendChild(img);
        }
      } catch (err) {
        console.error("Failed to load thumbnails", err);
      }
    })();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  navigateTo("home");
});