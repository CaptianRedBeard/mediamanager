(function(){const c=document.createElement("link").relList;if(c&&c.supports&&c.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))m(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&m(l)}).observe(document,{childList:!0,subtree:!0});function r(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function m(t){if(t.ep)return;t.ep=!0;const n=r(t);fetch(t.href,n)}})();function M(o,c){return window.go.mediaapi.MediaAPI.AddImageToAlbum(o,c)}function B(o,c){return window.go.mediaapi.MediaAPI.ExportAlbumToFolder(o,c)}function P(o,c){return window.go.mediaapi.MediaAPI.ExportAlbumToZip(o,c)}function C(){return window.go.mediaapi.MediaAPI.GetAllThumbnails()}function T(o){return window.go.mediaapi.MediaAPI.GetImageBase64(o)}function F(o){return window.go.mediaapi.MediaAPI.GetImagesWithTag(o)}function S(o){return window.go.mediaapi.MediaAPI.GetTagsForImage(o)}function $(o){return window.go.mediaapi.MediaAPI.GetThumbnailBase64(o)}function k(o,c){return window.go.mediaapi.MediaAPI.ImportImage(o,c)}function G(o){return window.go.mediaapi.MediaAPI.ListAlbumNamesForImage(o)}function v(){return window.go.mediaapi.MediaAPI.ListAllAlbums()}function L(){return window.go.mediaapi.MediaAPI.ListAllTags()}function A(o){return window.go.mediaapi.MediaAPI.ListImagesInAlbum(o)}function H(o,c){return window.go.mediaapi.MediaAPI.TagImage(o,c)}setTimeout(()=>{console.log("⏱️ window.go after 200ms:",window.go)},200);console.log("window.go",window.go);console.log("window.go.mediaapi",window.go.mediaapi);console.log("window.go.mediaapi.MediaAPI",window.go.mediaapi?.MediaAPI);const N={home:`
    <h1>Welcome to Media Manager</h1>
    <button id="goToUpload">Upload Images</button>
    <button id= "goToGallery">Gallery</button>
    <button id="goToExport">Export Albums</button>
  `,upload:`
    <h1>Upload Images</h1>
    <form id="uploadForm" enctype="multipart/form-data">
      <input type="file" name="image" id="imageInput" multiple />
      <button type="submit">Upload</button>
    </form>
    <ul id="uploadResults"></ul>
    <div id="uploadStatus"></div>
    <button id="menu">Back To Menu</button>
  `,gallery:`
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
`,imgedit:`
  <h1>Image Editor</h1>
  <button id="menu">Back To Menu</button>
  <button id="goToGallery">Gallery</button>
  <div id="imageViewer" style="margin-top: 20px;"></div>
  <div id="tagSection" style="margin-top: 20px;"></div>
  <div id="albumSection" style="margin-top: 20px;"></div>
`,export:`
  <h1>Export Albums</h1>
  <button id="menu">Back To Menu</button>
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
  <div id="exportStatus"></div>
`};let h=null,y=[],w=[];function f(o){const c=document.getElementById("app");if(c.innerHTML=N[o],o==="home"&&(document.getElementById("goToUpload").addEventListener("click",()=>{f("upload")}),document.getElementById("goToGallery").addEventListener("click",()=>{f("gallery")}),document.getElementById("goToExport").addEventListener("click",()=>{f("export")})),o==="upload"&&(document.getElementById("menu").addEventListener("click",()=>{f("home")}),document.getElementById("uploadForm").addEventListener("submit",async r=>{r.preventDefault();const m=document.getElementById("imageInput").files,t=document.getElementById("uploadResults");t.innerHTML="";for(const n of m)try{const l=await n.arrayBuffer(),a=new Uint8Array(l),I=await k(n.name,Array.from(a)),s=document.createElement("li");s.innerHTML=`${n.name} uploaded! Image ID: <strong>${I}</strong>`,t.appendChild(s)}catch(l){const a=document.createElement("li");a.innerHTML=`${n.name} failed: <strong>${l?.message||l||"Unknown error"}</strong>`,t.appendChild(a)}})),o=="gallery"){document.getElementById("menu").addEventListener("click",()=>{y=[],w=[],f("home")}),document.getElementById("edit").addEventListener("click",()=>{f("imgedit")});const r=document.getElementById("thumbnailGallery"),m=document.getElementById("imageViewer"),t=document.getElementById("tagFilter"),n=document.getElementById("albumFilter"),l=async()=>{const s=await L();t.innerHTML="",s.forEach(d=>{const i=document.createElement("button");i.textContent=d,i.className="tag-btn",i.dataset.tag=d,i.classList.toggle("selected",y.includes(d)),i.addEventListener("click",()=>{y.includes(d)?(y=y.filter(u=>u!==d),i.classList.remove("selected")):(y.push(d),i.classList.add("selected")),I()}),t.appendChild(i)})},a=async()=>{const s=await v();n.innerHTML="",s.forEach(d=>{const i=d.Name,p=document.createElement("button");p.textContent=i,p.className="album-btn",p.dataset.album=i,p.classList.toggle("selected",w.includes(i)),p.addEventListener("click",()=>{w.includes(i)?(w=w.filter(g=>g!==i),p.classList.remove("selected")):(w.push(i),p.classList.add("selected")),I()}),n.appendChild(p)})},I=async()=>{const s=await A("LOTR");console.log("Images in LOTR album:",s),r.innerHTML="",m.innerHTML="";let d=new Set;try{let i=new Set;y.length>0&&(i=(await Promise.all(y.map(g=>F(g)))).reduce((g,b)=>(b.forEach(E=>g.add(E)),g),new Set));let p=new Set;if(w.length>0&&(await Promise.all(w.map(g=>A(g)))).forEach(g=>{g.forEach(b=>p.add(b.ID))}),y.length&&w.length)d=new Set([...i].filter(u=>p.has(u)));else if(y.length)d=i;else if(w.length)d=p;else{const u=await C();d=new Set(u.map(g=>g.id))}for(const u of d)try{console.log("🔍 Trying to render image with ID:",u);const g=await $(u),b=document.createElement("button");b.style.border="none",b.style.padding="0",b.style.background="none";const E=document.createElement("img");E.src=g,E.style.width="150px",E.style.height="150px",E.style.objectFit="cover",b.appendChild(E),b.addEventListener("click",async()=>{h=u,m.innerHTML="Loading...";const x=await T(u);m.innerHTML=`<img src="${x}" style="max-width:100%; max-height:500px;" />`}),r.appendChild(b)}catch{console.error("Failed to load thumbnail for",u,e)}}catch(i){console.error("Error rendering gallery",i)}};(async()=>{try{(await L()).forEach(d=>{const i=document.createElement("option");i.value=d,i.textContent=d,t.appendChild(i)})}catch(s){console.warn("Couldn't load tags",s)}try{const s=await v();console.log("🎵 Albums:",s),s.forEach(d=>{const i=document.createElement("option");i.value=d.Name,i.textContent=d.Name,n.appendChild(i)})}catch(s){console.warn("Couldn't load albums",s)}t.addEventListener("change",I),n.addEventListener("change",I),await l(),await a(),await I()})()}if(o=="imgedit"){document.getElementById("menu").addEventListener("click",()=>{f("home")}),document.getElementById("goToGallery").addEventListener("click",()=>{f("gallery")});const r=document.getElementById("imageViewer");h?(r.innerHTML="Loading image...",(async()=>{try{const n=await T(h);r.innerHTML=`
            <img 
              src="${n}" 
              alt="Full Image" 
              style="max-width:100%; max-height:500px;" 
            />
          `}catch(n){r.innerHTML=`<p>Error loading image: ${n.message}</p>`}})()):r.innerHTML="<p>No image selected from gallery.</p>";const m=async()=>{const n=document.getElementById("albumSection");n.innerHTML="<p>Loading Albums</p>";try{const l=await G(h);console.log("albums:",l),n.innerHTML=`
          <h3>Albums</h3>
          <ul>
            ${l.map(a=>`
              <li>
                ${a}
                <button data-album="${a}" class="remove-album">❌</button>
              </li>`).join("")}
           </ul>
          <input id="newAlbum" placeholder="New tag" />
          <button id="addAlbum">Add Tag</button> 
        `,document.getElementById("addAlbum").addEventListener("click",async()=>{const a=document.getElementById("newAlbum").value.trim();a&&(await M(h,a),m())}),document.querySelectorAll(".remove-album").forEach(a=>{a.addEventListener("click",async()=>{await RemoveAlbumFromImage(h,a.dataset.album),t()})})}catch(l){console.error("Error in GetAlbumsForImage",l),tagContainer.innerHTML=`<p>Error loading albums: ${l.message}</p>`}};m();const t=async()=>{const n=document.getElementById("tagSection");n.innerHTML="<p>Loading Tags</p>";try{const l=await S(h);console.log("tags:",l),n.innerHTML=`
          <h3>Tags</h3>
          <ul>
            ${l.map(a=>`
              <li>
                ${a}
                <button data-tag="${a}" class="remove-tag">❌</button>
              </li>`).join("")}
           </ul>
          <input id="newTag" placeholder="New tag" />
          <button id="addTag">Add Tag</button> 
        `,document.getElementById("addTag").addEventListener("click",async()=>{const a=document.getElementById("newTag").value.trim();a&&(await H(h,a),t())}),document.querySelectorAll(".remove-tag").forEach(a=>{a.addEventListener("click",async()=>{await RemoveTagFromImage(h,a.dataset.tag),t()})})}catch(l){console.error("Error in GetDetailedTagsForImage",l),n.innerHTML=`<p>Error loading tags: ${l.message}</p>`}};t()}if(o==="export"){document.getElementById("menu").addEventListener("click",()=>{f("home")});const r=document.getElementById("exportStatus"),m=document.getElementById("exportAlbumSelect");(async()=>{try{(await v()).forEach(n=>{const l=document.createElement("option");l.value=n.Name,l.textContent=n.Name,m.appendChild(l)})}catch(t){r.textContent="Failed to load albums: "+t.message}})(),document.getElementById("browseExportPath").addEventListener("click",async()=>{try{const t=await window.go.mediaapi.MediaAPI.SelectDirectoryDialog();document.getElementById("exportPath").value=t}catch(t){r.textContent="Directory selection failed: "+t.message}}),document.getElementById("doExport").addEventListener("click",async()=>{const t=m.value,n=document.getElementById("exportPath").value,l=document.querySelector('input[name="exportType"]:checked')?.value;if(!t||!n){r.textContent="Please select an album and destination.";return}r.textContent="Exporting...";try{if(l==="zip"){const a=`${n}/${t}.zip`;await P(t,a),r.textContent=`Album "${t}" exported to "${a}".`}else await B(t,n),r.textContent=`Album "${t}" exported to folder "${n}/${t}/"`}catch(a){console.error("Export failed:",a),r.textContent=`Export failed: ${a.message||"Unknown error"}`}})}}window.addEventListener("DOMContentLoaded",()=>{f("home")});
