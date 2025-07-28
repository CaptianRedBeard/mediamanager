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
  ExportAlbumToZip,
  ExportAlbumToFolder,
  //RemoveAlbumFromImage,
  //RemoveTagFromImage,
} from '../wailsjs/go/mediaapi/MediaAPI';

setTimeout(() => {
  console.log("⏱️ window.go after 200ms:", window.go);
}, 200);
console.log("window.go", window.go);                     // Should be an object
console.log("window.go.mediaapi", window.go.mediaapi);   // Should exist
console.log("window.go.mediaapi.MediaAPI", window.go.mediaapi?.MediaAPI); // Should have methods

const routes = {
  home: `
  <div class="content-wrapper">
    <h1>Welcome to Media Manager</h1>
    <p>Select an action from the left menu.</p>
  </div> 
`,
  upload: `
  <div class="content-wrapper">
    <h1>Upload Images</h1>
    <form id="uploadForm" enctype="multipart/form-data">
      <input type="file" name="image" id="imageInput" multiple />
      <button type="submit">Upload</button>
    </form>
    <ul id="uploadResults"></ul>
    <div id="uploadStatus"></div>
  </div> 
  `,

  gallery: `
  <div class="content-wrapper">
    <h1 style="text-align: center;">Gallery</h1>
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <div style="align-self: center;">
        <button id="edit">Edit Image</button>
      </div>

      <div id="filterSection" style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 10px;">
        <div>
          <label>Filter by Tags:</label>
          <div id="tagFilter" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
        </div>
        <div>
          <label>Filter by Albums:</label>
          <div id="albumFilter" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
        </div>
      </div>

      <div id="imageViewer" style="align-self: center; min-height: 500px; display: flex; justify-content: center; align-items: center;"></div>

      <div id="thumbnailGallery" style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;"></div>
    </div>
  </div> 
`,

  imgedit:`
  <div class="content-wrapper">
    <h1>Image Editor</h1>
    <div id="imageViewer" style="margin-top: 20px;"></div>
    <div id="tagSection" style="margin-top: 20px;"></div>
    <div id="albumSection" style="margin-top: 20px;"></div>
  </div>  
`,

  export: `
  <div class="content-wrapper">
    <h1>Export Albums</h1>
    <div>
      <label>Select an album to export:</label>
      <select id="exportAlbumSelect"></select>
    </div>
    <div>
      <label>Choose destination folder:</label>
      <input type="text" id="exportPath" readonly />
      <button id="browseExportPath">Browse</button>
    </div>
    <div>
      <label>
        <input type="radio" name="exportType" value="zip" checked /> Zip File
      </label>
      <label>
        <input type="radio" name="exportType" value="folder" /> Folder
      </label>
    </div>
    <button id="doExport">Export Album</button>
    <div id="exportStatus">
  </div>
`,

    
};

let selectedImageId = null;
let selectedTags = [];
let selectedAlbums = [];

function setupSidebarNavigation() {
  const routes = [
    { id: "goToHome", route: "home" },
    { id: "goToUpload", route: "upload" },
    { id: "goToGallery", route: "gallery" },
    { id: "goToExport", route: "export" },
  ];

  for (const { id, route } of routes) {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => navigateTo(route));
    }
  }
}

function navigateTo(route) {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="sidebar-layout">
      <div class="sidebar">
        <h2>Media Manager</h2>
        <button id="goToHome">Main Menu</button>
        <button id="goToUpload">Upload Images</button>
        <button id="goToGallery">Gallery</button>
        <button id="goToExport">Export Albums</button>
      </div>
      <div class="main-content" id="main-content">
        ${routes[route]}
      </div>
    </div>
  `;

  setupSidebarNavigation();

  if (route === "home") {
   
  }
    
  if (route === "upload") {

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
          li.innerHTML = `${file.name} failed: <strong>${err?.message || err || "Unknown error"}</strong>`;
          resultsList.appendChild(li);
        }
      }      
    });
  }

  if (route == "gallery") {  
    document.getElementById("edit").addEventListener("click", () => {
      navigateTo("imgedit");
    });
    
    const viewer = document.getElementById("imageViewer");
    const galleryContainer = document.getElementById("thumbnailGallery");


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
              if (selectedImageId === id) {
                viewer.innerHTML = "";
                selectedImageId = null;
                return;
              }
            
              selectedImageId = id;
              viewer.innerHTML = "Loading...";
            
              const fullImage = await GetImageBase64(id);
              viewer.innerHTML = `
                <img 
                  src="${fullImage}" 
                  data-id="${id}" 
                  style="max-width:100%; max-height:500px; cursor: pointer;" 
                  title="Click to close"
                />
              `;
            
              // Add click-to-close behavior on full image
              const fullImg = viewer.querySelector("img");
              fullImg.addEventListener("click", () => {
                viewer.innerHTML = "";
                selectedImageId = null;
              });
            });
    
            galleryContainer.appendChild(button);
          } catch {
            console.error("Failed to load thumbnail for", id, e);
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
      albumContainer.innerHTML = "<p>Loading Albums...</p>";
    
      try {
        const existingAlbums = await ListAlbumNamesForImage(selectedImageId);
        const allAlbums = await ListAllAlbums();
    
        // Exclude already-added albums from the datalist
        const availableAlbums = allAlbums
          .map(a => a.Name)
          .filter(name => !existingAlbums.includes(name));
    
        albumContainer.innerHTML = `
          <h3>Albums</h3>
          <ul>
            ${existingAlbums.map(album => `
              <li>
                ${album}
                <button data-album="${album}" </button>
              </li>`).join("")}
          </ul>
    
          <label for="albumInput">Add Album:</label>
          <input id="albumInput" list="allAlbumsDatalist" placeholder="Type or select album" />
          <datalist id="allAlbumsDatalist">
            ${availableAlbums.map(album => `<option value="${album}"></option>`).join("")}
          </datalist>
          <button id="addAlbum">Add Album</button>
        `;
        //<button data-album="${album}" class="remove-album">❌</button>
    
        document.getElementById("addAlbum").addEventListener("click", async () => {
          const newAlbum = document.getElementById("albumInput").value.trim();
          if (newAlbum && !existingAlbums.includes(newAlbum)) {
            await AddImageToAlbum(selectedImageId, newAlbum);
            renderAlbums();
          }
        });
    
        /*document.querySelectorAll(".remove-album").forEach(btn => {
          btn.addEventListener("click", async () => {
            await RemoveAlbumFromImage(selectedImageId, btn.dataset.album);
            renderAlbums(); // Refresh album list
          });
        });*/
      } catch (err) {
        console.error("Error loading albums", err);
        albumContainer.innerHTML = `<p>Error loading albums: ${err.message}</p>`;
      }
    };
    

    renderAlbums()


    const renderTags = async () => {
      const tagContainer = document.getElementById("tagSection");
      tagContainer.innerHTML = "<p>Loading Tags...</p>";
    
      try {
        if (!selectedImageId) {
          tagContainer.innerHTML = "<p>No image selected.</p>";
          return;
        }
        const existingTags = await GetTagsForImage(selectedImageId);
        const allTags = await ListAllTags();
    
        // Exclude already-added tags from the datalist
        const availableTags = allTags.filter(tag => !existingTags.includes(tag));
    
        tagContainer.innerHTML = `
          <h3>Tags</h3>
          <ul>
            ${existingTags.map(tag => `
              <li>
                ${tag}
                <button data-tag="${tag}"</button>
              </li>
            `).join("")}
          </ul>
    
          <label for="tagInput">Add Tag:</label>
          <input id="tagInput" list="allTagsDatalist" placeholder="Type or select tag" />
          <datalist id="allTagsDatalist">
            ${availableTags.map(tag => `<option value="${tag}"></option>`).join("")}
          </datalist>
          <button id="addTag">Add Tag</button>
        `;
        //<button data-tag="${tag}" class="remove-tag">❌</button>
    
        // Handle adding tag
        document.getElementById("addTag").addEventListener("click", async () => {
          const tag = document.getElementById("tagInput").value.trim();
          if (tag && !existingTags.includes(tag)) {
            await TagImage(selectedImageId, tag);
            renderTags();
          }
        });
    
        // Handle removing tags
        /*document.querySelectorAll(".remove-tag").forEach(btn => {
          btn.addEventListener("click", async () => {
            await RemoveTagFromImage(selectedImageId, btn.dataset.tag);
            renderTags();
          });
        });*/
    
      } catch (err) {
        console.error("Error loading tags", err);
        tagContainer.innerHTML = `<p>Error loading tags: ${err.message}</p>`;
      }
    };
    renderTags()
  }

  if (route === "export") {
    document.getElementById("goToUpload").addEventListener("click", () => {
      navigateTo("upload");
    });
    document.getElementById("goToGallery").addEventListener("click", () => {
      navigateTo("gallery");
    });
    document.getElementById("goToExport").addEventListener("click", () => {
      navigateTo("export");
    });
    
    
    const exportStatus = document.getElementById("exportStatus");
    const albumSelect = document.getElementById("exportAlbumSelect");
    
    (async () => {
      try {
        const albums = await ListAllAlbums();
        albums.forEach(album => {
          const opt = document.createElement("option");
          opt.value = album.Name;
          opt.textContent = album.Name;
          albumSelect.appendChild(opt);
        });
      } catch (err) {
        exportStatus.textContent = "Failed to load albums: " + err.message;
      }
    })();
    
    // Browse destination
    document.getElementById("browseExportPath").addEventListener("click", async () => {
      try {
        const path = await window.go.mediaapi.MediaAPI.SelectDirectoryDialog();
        document.getElementById("exportPath").value = path;
      } catch (err) {
        exportStatus.textContent = "Directory selection failed: " + err.message;
      }
    });
    
    document.getElementById("doExport").addEventListener("click", async () => {
      const album = albumSelect.value;
      const exportDir = document.getElementById("exportPath").value;
      const exportType = document.querySelector('input[name="exportType"]:checked')?.value;
    
      if (!album || !exportDir) {
        exportStatus.textContent = "Please select an album and destination.";
        return;
      }
    
      exportStatus.textContent = "Exporting...";
    
      try {
        if (exportType === "zip") {
          const zipPath = `${exportDir}/${album}.zip`;
          await ExportAlbumToZip(album, zipPath);
          exportStatus.textContent = `Album "${album}" exported to "${zipPath}".`;
        } else {
          await ExportAlbumToFolder(album, exportDir);
          exportStatus.textContent = `Album "${album}" exported to folder "${exportDir}/${album}/"`;
        }
      } catch (err) {
        console.error("Export failed:", err);
        exportStatus.textContent = `Export failed: ${err.message || "Unknown error"}`;
      }
    });
    
  }
  setupSidebarNavigation();
  
}

window.addEventListener('DOMContentLoaded', () => {
  navigateTo("home");
});
