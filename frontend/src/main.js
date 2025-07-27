import '../wailsjs/runtime/runtime';
import './style.css';
import './app.css';
import { ImportImage, GetAllThumbnails, GetImageBase64 } from '../wailsjs/go/mediaapi/MediaAPI';



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
    <button id="edit">Edit Image</button>
    <div id="imageViewer" style="margin-top: 20px;"></div>
    <div id="thumbnailGallery" style="display: flex; flex-wrap: wrap; gap: 12px;"></div>
  `,
  imgedit:`
    <h1>Gallery</h1>
    <button id="menu">Back To Menu</button>
    <button id="goToGallery">Gallery</button>
    <div id="imageViewer" style="margin-top: 20px;"></div>
  `,

    
};

let selectedImageId = null;

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
    document.getElementById("edit").addEventListener("click", () => {
      navigateTo("imgedit");
    });

    const galleryContainer = document.getElementById("thumbnailGallery");
    const viewer = document.getElementById("imageViewer");

    (async () => {
      try {
        const thumbnails = await GetAllThumbnails();

        thumbnails.forEach(({ id, image }) => {
          const button = document.createElement("button");
          button.style.border = "none";
          button.style.padding = "0";
          button.style.background = "none";
          button.title = `Image ${image}`;

          const img = document.createElement("img");
          img.src = image;
          img.alt = `Thumbnail ${image}`;
          img.style.width = "150px";
          img.style.height = "150px";
          img.style.objectFit = "cover";

          button.appendChild(img);

          button.addEventListener("click", async () => {
            selectedImageId = id;
            viewer.innerHTML = "Loading...";

            try {
              const fullImage = await GetImageBase64(id);
              viewer.innerHTML = `
                <img 
                  id="fullImage" 
                  src="${fullImage}" 
                  alt="Full Image" 
                  style="max-width:100%; max-height:500px; cursor: pointer;" 
                />
              `;
              
              const fullImg = document.getElementById("fullImage");
              fullImg.addEventListener("click", () => {
                selectedImageId = null;
                fullImg.style.display = fullImg.style.display === "none" ? "block" : "none";
              });
            } catch (err) {
              viewer.innerHTML = `<p>Error loading image: ${err.message}</p>`;
            }
          });

          galleryContainer.appendChild(button);
        });
      } catch (err) {
        console.error("Failed to load thumbnails", err);
      }
    })();
  }

  if (route == "imgedit") {
    document.getElementById("menu").addEventListener("click", () => {
      navigateTo("home");
    });
    document.getElementById("goToGallery").addEventListener("click", () => {
      navigateTo("gallery");
    });

    const viewer = document.getElementById("imageViewer");

    if (selectedImageId) {
      viewer.innerHTML = "Loading image...";

      (async () => {
        try {
          const fullImage = await GetImageBase64(selectedImageId);
          viewer.innerHTML = `
            <img 
              src="${fullImage}" 
              alt="Full Image" 
              style="max-width:100%; max-height:500px;" 
            />
          `;
        } catch (err) {
          viewer.innerHTML = `<p>Error loading image: ${err.message}</p>`;
        }
      })();
    } else {
      viewer.innerHTML = "<p>No image selected from gallery.</p>";
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  navigateTo("home");
});