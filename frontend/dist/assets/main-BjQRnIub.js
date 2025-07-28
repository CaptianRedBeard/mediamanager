(function(){const c=document.createElement("link").relList;if(c&&c.supports&&c.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))m(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&m(o)}).observe(document,{childList:!0,subtree:!0});function d(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function m(t){if(t.ep)return;t.ep=!0;const n=d(t);fetch(t.href,n)}})();function L(i,c){return window.go.mediaapi.MediaAPI.AddImageToAlbum(i,c)}function M(i,c){return window.go.mediaapi.MediaAPI.ExportAlbumToFolder(i,c)}function B(i,c){return window.go.mediaapi.MediaAPI.ExportAlbumToZip(i,c)}function P(){return window.go.mediaapi.MediaAPI.GetAllThumbnails()}function x(i){return window.go.mediaapi.MediaAPI.GetImageBase64(i)}function C(i){return window.go.mediaapi.MediaAPI.GetImagesWithTag(i)}function $(i){return window.go.mediaapi.MediaAPI.GetTagsForImage(i)}function F(i){return window.go.mediaapi.MediaAPI.GetThumbnailBase64(i)}function H(i,c){return window.go.mediaapi.MediaAPI.ImportImage(i,c)}function S(i){return window.go.mediaapi.MediaAPI.ListAlbumNamesForImage(i)}function I(){return window.go.mediaapi.MediaAPI.ListAllAlbums()}function E(){return window.go.mediaapi.MediaAPI.ListAllTags()}function G(i){return window.go.mediaapi.MediaAPI.ListImagesInAlbum(i)}function N(i,c){return window.go.mediaapi.MediaAPI.TagImage(i,c)}setTimeout(()=>{console.log("⏱️ window.go after 200ms:",window.go)},200);console.log("window.go",window.go);console.log("window.go.mediaapi",window.go.mediaapi);console.log("window.go.mediaapi.MediaAPI",window.go.mediaapi?.MediaAPI);const D={home:`
  <div class="content-wrapper">
    <h1>Welcome to Media Manager</h1>
    <p>Select an action from the left menu.</p>
  </div> 
`,upload:`
  <div class="content-wrapper">
    <h1>Upload Images</h1>
    <form id="uploadForm" enctype="multipart/form-data">
      <input type="file" name="image" id="imageInput" multiple />
      <button type="submit">Upload</button>
    </form>
    <ul id="uploadResults"></ul>
    <div id="uploadStatus"></div>
  </div> 
  `,gallery:`
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
`,imgedit:`
  <div class="content-wrapper">
    <h1>Image Editor</h1>
    <div id="imageViewer" style="margin-top: 20px;"></div>
    <div id="tagSection" style="margin-top: 20px;"></div>
    <div id="albumSection" style="margin-top: 20px;"></div>
  </div>  
`,export:`
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
`};let y=null,f=[],w=[];function T(){const i=[{id:"goToHome",route:"home"},{id:"goToUpload",route:"upload"},{id:"goToGallery",route:"gallery"},{id:"goToExport",route:"export"}];for(const{id:c,route:d}of i){const m=document.getElementById(c);m&&m.addEventListener("click",()=>v(d))}}function v(i){const c=document.getElementById("app");if(c.innerHTML=`
    <div class="sidebar-layout">
      <div class="sidebar">
        <h2>Media Manager</h2>
        <button id="goToHome">Main Menu</button>
        <button id="goToUpload">Upload Images</button>
        <button id="goToGallery">Gallery</button>
        <button id="goToExport">Export Albums</button>
      </div>
      <div class="main-content" id="main-content">
        ${D[i]}
      </div>
    </div>
  `,T(),i==="upload"&&document.getElementById("uploadForm").addEventListener("submit",async d=>{d.preventDefault();const m=document.getElementById("imageInput").files,t=document.getElementById("uploadResults");t.innerHTML="";for(const n of m)try{const o=await n.arrayBuffer(),p=new Uint8Array(o),b=await H(n.name,Array.from(p)),a=document.createElement("li");a.innerHTML=`${n.name} uploaded! Image ID: <strong>${b}</strong>`,t.appendChild(a)}catch(o){const p=document.createElement("li");p.innerHTML=`${n.name} failed: <strong>${o?.message||o||"Unknown error"}</strong>`,t.appendChild(p)}}),i=="gallery"){document.getElementById("edit").addEventListener("click",()=>{v("imgedit")});const d=document.getElementById("imageViewer"),m=document.getElementById("thumbnailGallery"),t=document.getElementById("tagFilter"),n=document.getElementById("albumFilter"),o=async()=>{const a=await E();t.innerHTML="",a.forEach(s=>{const l=document.createElement("button");l.textContent=s,l.className="tag-btn",l.dataset.tag=s,l.classList.toggle("selected",f.includes(s)),l.addEventListener("click",()=>{f.includes(s)?(f=f.filter(u=>u!==s),l.classList.remove("selected")):(f.push(s),l.classList.add("selected")),b()}),t.appendChild(l)})},p=async()=>{const a=await I();n.innerHTML="",a.forEach(s=>{const l=s.Name,r=document.createElement("button");r.textContent=l,r.className="album-btn",r.dataset.album=l,r.classList.toggle("selected",w.includes(l)),r.addEventListener("click",()=>{w.includes(l)?(w=w.filter(g=>g!==l),r.classList.remove("selected")):(w.push(l),r.classList.add("selected")),b()}),n.appendChild(r)})},b=async()=>{m.innerHTML="",d.innerHTML="";let a=new Set;try{let s=new Set;f.length>0&&(s=(await Promise.all(f.map(u=>C(u)))).reduce((u,g)=>(g.forEach(h=>u.add(h)),u),new Set));let l=new Set;if(w.length>0&&(await Promise.all(w.map(u=>G(u)))).forEach(u=>{u.forEach(g=>l.add(g.ID))}),f.length&&w.length)a=new Set([...s].filter(r=>l.has(r)));else if(f.length)a=s;else if(w.length)a=l;else{const r=await P();a=new Set(r.map(u=>u.id))}for(const r of a)try{const u=await F(r),g=document.createElement("button");g.style.border="none",g.style.padding="0",g.style.background="none";const h=document.createElement("img");h.src=u,h.style.width="150px",h.style.height="150px",h.style.objectFit="cover",g.appendChild(h),g.addEventListener("click",async()=>{if(y===r){d.innerHTML="",y=null;return}y=r,d.innerHTML="Loading...";const A=await x(r);d.innerHTML=`
                <img 
                  src="${A}" 
                  data-id="${r}" 
                  style="max-width:100%; max-height:500px; cursor: pointer;" 
                  title="Click to close"
                />
              `,d.querySelector("img").addEventListener("click",()=>{d.innerHTML="",y=null})}),m.appendChild(g)}catch{console.error("Failed to load thumbnail for",r,e)}}catch(s){console.error("Error rendering gallery",s)}};(async()=>{try{(await E()).forEach(s=>{const l=document.createElement("option");l.value=s,l.textContent=s,t.appendChild(l)})}catch(a){console.warn("Couldn't load tags",a)}try{(await I()).forEach(s=>{const l=document.createElement("option");l.value=s.Name,l.textContent=s.Name,n.appendChild(l)})}catch(a){console.warn("Couldn't load albums",a)}t.addEventListener("change",b),n.addEventListener("change",b),await o(),await p(),await b()})()}if(i=="imgedit"){const d=document.getElementById("imageViewer");y?(d.innerHTML="Loading image...",(async()=>{try{const n=await x(y);d.innerHTML=`
            <img 
              src="${n}" 
              alt="Full Image" 
              style="max-width:100%; max-height:500px;" 
            />
          `}catch(n){d.innerHTML=`<p>Error loading image: ${n.message}</p>`}})()):d.innerHTML="<p>No image selected from gallery.</p>";const m=async()=>{const n=document.getElementById("albumSection");n.innerHTML="<p>Loading Albums...</p>";try{const o=await S(y),b=(await I()).map(a=>a.Name).filter(a=>!o.includes(a));n.innerHTML=`
          <h3>Albums</h3>
          <ul>
            ${o.map(a=>`
              <li>
                ${a}
                <button data-album="${a}" </button>
              </li>`).join("")}
          </ul>
    
          <label for="albumInput">Add Album:</label>
          <input id="albumInput" list="allAlbumsDatalist" placeholder="Type or select album" />
          <datalist id="allAlbumsDatalist">
            ${b.map(a=>`<option value="${a}"></option>`).join("")}
          </datalist>
          <button id="addAlbum">Add Album</button>
        `,document.getElementById("addAlbum").addEventListener("click",async()=>{const a=document.getElementById("albumInput").value.trim();a&&!o.includes(a)&&(await L(y,a),m())})}catch(o){console.error("Error loading albums",o),n.innerHTML=`<p>Error loading albums: ${o.message}</p>`}};m();const t=async()=>{const n=document.getElementById("tagSection");n.innerHTML="<p>Loading Tags...</p>";try{if(!y){n.innerHTML="<p>No image selected.</p>";return}const o=await $(y),b=(await E()).filter(a=>!o.includes(a));n.innerHTML=`
          <h3>Tags</h3>
          <ul>
            ${o.map(a=>`
              <li>
                ${a}
                <button data-tag="${a}"</button>
              </li>
            `).join("")}
          </ul>
    
          <label for="tagInput">Add Tag:</label>
          <input id="tagInput" list="allTagsDatalist" placeholder="Type or select tag" />
          <datalist id="allTagsDatalist">
            ${b.map(a=>`<option value="${a}"></option>`).join("")}
          </datalist>
          <button id="addTag">Add Tag</button>
        `,document.getElementById("addTag").addEventListener("click",async()=>{const a=document.getElementById("tagInput").value.trim();a&&!o.includes(a)&&(await N(y,a),t())})}catch(o){console.error("Error loading tags",o),n.innerHTML=`<p>Error loading tags: ${o.message}</p>`}};t()}if(i==="export"){document.getElementById("goToUpload").addEventListener("click",()=>{v("upload")}),document.getElementById("goToGallery").addEventListener("click",()=>{v("gallery")}),document.getElementById("goToExport").addEventListener("click",()=>{v("export")});const d=document.getElementById("exportStatus"),m=document.getElementById("exportAlbumSelect");(async()=>{try{(await I()).forEach(n=>{const o=document.createElement("option");o.value=n.Name,o.textContent=n.Name,m.appendChild(o)})}catch(t){d.textContent="Failed to load albums: "+t.message}})(),document.getElementById("browseExportPath").addEventListener("click",async()=>{try{const t=await window.go.mediaapi.MediaAPI.SelectDirectoryDialog();document.getElementById("exportPath").value=t}catch(t){d.textContent="Directory selection failed: "+t.message}}),document.getElementById("doExport").addEventListener("click",async()=>{const t=m.value,n=document.getElementById("exportPath").value,o=document.querySelector('input[name="exportType"]:checked')?.value;if(!t||!n){d.textContent="Please select an album and destination.";return}d.textContent="Exporting...";try{if(o==="zip"){const p=`${n}/${t}.zip`;await B(t,p),d.textContent=`Album "${t}" exported to "${p}".`}else await M(t,n),d.textContent=`Album "${t}" exported to folder "${n}/${t}/"`}catch(p){console.error("Export failed:",p),d.textContent=`Export failed: ${p.message||"Unknown error"}`}})}T()}window.addEventListener("DOMContentLoaded",()=>{v("home")});
