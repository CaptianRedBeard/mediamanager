import '../wailsjs/runtime/runtime';
import './style.css';
import './app.css';
import {
  ImportImage,
  GetAllThumbnails,
  GetImageBase64,
  GetTagsForImage,
  TagImage,
  AddImageToAlbum,
  ListAlbumNamesForImage,
} from '../wailsjs/go/mediaapi/MediaAPI';


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
  imgedit: `
  <h1>Image Editor</h1>
  <button id="menu">Back To Menu</button>
  <button id="goToGallery">Gallery</button>
  <div id="imageViewer" style="margin-top: 20px;"></div>
  <div id="tagSection" style="margin-top: 20px;"></div>
  <div id="albumSection" style="margin-top: 20px;"></div>
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

    const renderAlbums = async () => {
      const albumContainer = document.getElementById("albumSection");
      albumContainer.innerHTML = "<p>Loading Albums</p>";

      try {
        const albums = await ListAlbumNamesForImage(selectedImageId);
        console.log("albums:", albums)
        albumContainer.innerHTML =`
          <h3>Albums</h3>
          <ul>
            ${albums.map(album=>`
              <li>
                ${album}
                <button data-album="${album}" class="remove-album">❌</button>
              </li>`).join("")}
           </ul>
          <input id="newAlbum" placeholder="New tag" />
          <button id="addAlbum">Add Tag</button> 
        `;

        document.getElementById("addAlbum").addEventListener("click", async () => {
          const newAlbum = document.getElementById("newAlbum").value.trim();
          if (newAlbum) {
            await AddImageToAlbum(selectedImageId, newAlbum);
            renderAlbums();
          }
        });

        document.querySelectorAll(".remove-album").forEach(btn => {
          btn.addEventListener("click", async () => {
            await RemoveAlbumFromImage(selectedImageId, btn.dataset.album);
            renderTags();
          });
        });
      } catch (err) {
        console.error("❌ Error in GetAlbumsForImage", err);
        tagContainer.innerHTML = `<p>Error loading albums: ${err.message}</p>`;
      }
    }

    renderAlbums()


    const renderTags = async () => {
      const tagContainer = document.getElementById("tagSection");
      tagContainer.innerHTML = "<p>Loading Tags</p>";

      try {
        const tags = await GetTagsForImage(selectedImageId);
        console.log("tags:", tags)
        tagContainer.innerHTML =`
          <h3>Tags</h3>
          <ul>
            ${tags.map(tag=>`
              <li>
                ${tag}
                <button data-tag="${tag}" class="remove-tag">❌</button>
              </li>`).join("")}
           </ul>
          <input id="newTag" placeholder="New tag" />
          <button id="addTag">Add Tag</button> 
        `;

        document.getElementById("addTag").addEventListener("click", async () => {
          const newTag = document.getElementById("newTag").value.trim();
          if (newTag) {
            await TagImage(selectedImageId, newTag);
            renderTags();
          }
        });

        document.querySelectorAll(".remove-tag").forEach(btn => {
          btn.addEventListener("click", async () => {
            await RemoveTagFromImage(selectedImageId, btn.dataset.tag);
            renderTags();
          });
        });
      } catch (err) {
        console.error("❌ Error in GetDetailedTagsForImage", err);
        tagContainer.innerHTML = `<p>Error loading tags: ${err.message}</p>`;
      }
    }

    renderTags()
  }

  
}

window.addEventListener('DOMContentLoaded', () => {
  navigateTo("home");
});