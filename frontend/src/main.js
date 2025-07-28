import '../wailsjs/runtime/runtime';
import './style.css';
import './app.css';
import {
  ImportImage,
  GetAllThumbnails,
  GetImageBase64,
  GetTagsForImage,
  ListAllTags,
  TagImage,
  AddImageToAlbum,
  ListAlbumNamesForImage,
  ListAllAlbums,
  GetThumbnailBase64,
  ListImagesInAlbum,
  GetImagesWithTag,
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

  <div id="filterSection" style="margin: 10px 0;">
    <div>
      <label>Filter by Tags:</label>
      <div id="tagFilter" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
    </div>

    <div>
      <label>Filter by Albums:</label>
      <div id="albumFilter" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
    </div>
  </div>

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
let selectedTags = [];
let selectedAlbums = [];


function getSelectedValues(selectElement) {
  return Array.from(selectElement.selectedOptions).map(option => option.value);
}


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
      selectedTags = [];
      selectedAlbums = [];
      navigateTo("home");
    });
    document.getElementById("edit").addEventListener("click", () => {
      navigateTo("imgedit");
    });

    

    const galleryContainer = document.getElementById("thumbnailGallery");
    const viewer = document.getElementById("imageViewer");

    const tagFilter = document.getElementById("tagFilter");
    const albumFilter = document.getElementById("albumFilter");

    const renderTagButtons = async () => {
      const allTags = await ListAllTags();
      tagFilter.innerHTML = "";
      allTags.forEach(tag => {
        const btn = document.createElement("button");
        btn.textContent = tag;
        btn.className = "tag-btn";
        btn.dataset.tag = tag;
        btn.classList.toggle("selected", selectedTags.includes(tag));

        btn.addEventListener("click", () => {
          const isActive = selectedTags.includes(tag);
          if (isActive) {
            selectedTags = selectedTags.filter(t => t !== tag);
            btn.classList.remove("selected");
          } else {
            selectedTags.push(tag);
            btn.classList.add("selected");
          }
          renderGallery();
        });

        tagFilter.appendChild(btn);
      });
    };

    const renderAlbumButtons = async () => {
      const allAlbums = await ListAllAlbums();
      albumFilter.innerHTML = "";
      allAlbums.forEach(album => {
        const name = album.Name;
        const btn = document.createElement("button");
        btn.textContent = name;
        btn.className = "album-btn";
        btn.dataset.album = name;
        btn.classList.toggle("selected", selectedAlbums.includes(name));

        btn.addEventListener("click", () => {
          const isActive = selectedAlbums.includes(name);
          if (isActive) {
            selectedAlbums = selectedAlbums.filter(a => a !== name);
            btn.classList.remove("selected");
          } else {
            selectedAlbums.push(name);
            btn.classList.add("selected");
          }
          renderGallery();
        });

        albumFilter.appendChild(btn);
      });
    };

    const renderGallery = async () => {
      const albumImages = await ListImagesInAlbum("LOTR");
      console.log("Images in LOTR album:", albumImages);

      galleryContainer.innerHTML = "";
      viewer.innerHTML = "";
    
      let matchingImageIDs = new Set();
    
      try {
        // Gather image IDs based on tag filter
        let tagFilteredIDs = new Set();
        if (selectedTags.length > 0) {
          const tagImageLists = await Promise.all(
            selectedTags.map(tag => GetImagesWithTag(tag))
          );
          tagFilteredIDs = tagImageLists.reduce((acc, ids) => {
            ids.forEach(id => acc.add(id));
            return acc;
          }, new Set());
        }
    
        // Gather image IDs based on album filter
        let albumFilteredIDs = new Set();
        if (selectedAlbums.length > 0) {
          const albumImageLists = await Promise.all(
            selectedAlbums.map(album => ListImagesInAlbum(album))
          );
          albumImageLists.forEach(images => {
            images.forEach(img => albumFilteredIDs.add(img.ID));
          });
        }
    
        // Intersect or union logic
        if (selectedTags.length && selectedAlbums.length) {
          // Intersection of both filters
          matchingImageIDs = new Set(
            [...tagFilteredIDs].filter(id => albumFilteredIDs.has(id))
          );
        } else if (selectedTags.length) {
          matchingImageIDs = tagFilteredIDs;
        } else if (selectedAlbums.length) {
          matchingImageIDs = albumFilteredIDs;
        } else {
          const allThumbs = await GetAllThumbnails();
          matchingImageIDs = new Set(allThumbs.map(t => t.id));
        }
    
        // Render thumbnails
        for (const id of matchingImageIDs) {
          try {
            console.log("🔍 Trying to render image with ID:", id);
            const thumb = await GetThumbnailBase64(id);
    
            const button = document.createElement("button");
            button.style.border = "none";
            button.style.padding = "0";
            button.style.background = "none";
    
            const img = document.createElement("img");
            img.src = thumb;
            img.style.width = "150px";
            img.style.height = "150px";
            img.style.objectFit = "cover";
    
            button.appendChild(img);
            button.addEventListener("click", async () => {
              selectedImageId = id;
              viewer.innerHTML = "Loading...";
              const fullImage = await GetImageBase64(id);
              viewer.innerHTML = `<img src="${fullImage}" style="max-width:100%; max-height:500px;" />`;
            });
    
            galleryContainer.appendChild(button);
          } catch {
            console.error("❌ Failed to load thumbnail for", id, e);
          }
        }
      } catch (err) {
        console.error("Error rendering gallery", err);
      }
    };
    
  
    (async () => {
      try {
        // Filter for tags
        const allTags = await ListAllTags();
        allTags.forEach(tag => {
          const option = document.createElement("option");
          option.value = tag;
          option.textContent = tag;
          tagFilter.appendChild(option);
        });
      } catch (err) {
        console.warn("Couldn't load tags", err);
      }
  
      try {
        // Filter for albums
        const allAlbums = await ListAllAlbums();
        console.log("🎵 Albums:", allAlbums);
        allAlbums.forEach(album => {
          const option = document.createElement("option");
          option.value = album.Name;
          option.textContent = album.Name;
          albumFilter.appendChild(option);
        });
      } catch (err) {
        console.warn("Couldn't load albums", err);
      }
  
      tagFilter.addEventListener("change", renderGallery);
      albumFilter.addEventListener("change", renderGallery);
      await renderTagButtons();
      await renderAlbumButtons();
      await renderGallery();
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