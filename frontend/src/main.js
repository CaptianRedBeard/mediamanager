import '../wailsjs/runtime/runtime';
import './style.css';
import './app.css';
import { ImportImage } from '../wailsjs/go/mediaapi/MediaAPI';


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
  `
};

function navigateTo(route) {
  const app = document.getElementById("app");
  app.innerHTML = routes[route];

  if (route === "home") {
    document.getElementById("goToUpload").addEventListener("click", () => {
      navigateTo("upload");
    });
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
}

window.addEventListener('DOMContentLoaded', () => {
  navigateTo("home");
});