(function(){const c=document.createElement("link").relList;if(c&&c.supports&&c.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))m(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&m(o)}).observe(document,{childList:!0,subtree:!0});function d(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function m(n){if(n.ep)return;n.ep=!0;const a=d(n);fetch(n.href,a)}})();function L(i,c){return window.go.mediaapi.MediaAPI.AddImageToAlbum(i,c)}function M(i,c){return window.go.mediaapi.MediaAPI.ExportAlbumToFolder(i,c)}function B(i,c){return window.go.mediaapi.MediaAPI.ExportAlbumToZip(i,c)}function P(){return window.go.mediaapi.MediaAPI.GetAllThumbnails()}function x(i){return window.go.mediaapi.MediaAPI.GetImageBase64(i)}function C(i){return window.go.mediaapi.MediaAPI.GetImagesWithTag(i)}function $(i){return window.go.mediaapi.MediaAPI.GetTagsForImage(i)}function F(i){return window.go.mediaapi.MediaAPI.GetThumbnailBase64(i)}function H(i,c){return window.go.mediaapi.MediaAPI.ImportImage(i,c)}function S(i){return window.go.mediaapi.MediaAPI.ListAlbumNamesForImage(i)}function I(){return window.go.mediaapi.MediaAPI.ListAllAlbums()}function E(){return window.go.mediaapi.MediaAPI.ListAllTags()}function G(i){return window.go.mediaapi.MediaAPI.ListImagesInAlbum(i)}function k(i,c){return window.go.mediaapi.MediaAPI.TagImage(i,c)}setTimeout(()=>{console.log("⏱️ window.go after 200ms:",window.go)},200);console.log("window.go",window.go);console.log("window.go.mediaapi",window.go.mediaapi);console.log("window.go.mediaapi.MediaAPI",window.go.mediaapi?.MediaAPI);const N={home:`
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
`};let y=null,w=[],h=[];function T(){const i=[{id:"goToHome",route:"home"},{id:"goToUpload",route:"upload"},{id:"goToGallery",route:"gallery"},{id:"goToExport",route:"export"}];for(const{id:c,route:d}of i){const m=document.getElementById(c);m&&m.addEventListener("click",()=>f(d))}}function f(i){const c=document.getElementById("app");if(c.innerHTML=`
    <div class="sidebar-layout">
      <div class="sidebar">
        <h2>Media Manager</h2>
        <button id="goToHome">Main Menu</button>
        <button id="goToUpload">Upload Images</button>
        <button id="goToGallery">Gallery</button>
        <button id="goToExport">Export Albums</button>
      </div>
      <div class="main-content" id="main-content">
        ${N[i]}
      </div>
    </div>
  `,T(),i==="upload"&&(document.getElementById("goToUpload").addEventListener("click",()=>{f("upload")}),document.getElementById("goToGallery").addEventListener("click",()=>{f("gallery")}),document.getElementById("goToExport").addEventListener("click",()=>{f("export")})),i==="upload"&&(document.getElementById("menu").addEventListener("click",()=>{f("home")}),document.getElementById("uploadForm").addEventListener("submit",async d=>{d.preventDefault();const m=document.getElementById("imageInput").files,n=document.getElementById("uploadResults");n.innerHTML="";for(const a of m)try{const o=await a.arrayBuffer(),p=new Uint8Array(o),b=await H(a.name,Array.from(p)),t=document.createElement("li");t.innerHTML=`${a.name} uploaded! Image ID: <strong>${b}</strong>`,n.appendChild(t)}catch(o){const p=document.createElement("li");p.innerHTML=`${a.name} failed: <strong>${o?.message||o||"Unknown error"}</strong>`,n.appendChild(p)}})),i=="gallery"){document.getElementById("edit").addEventListener("click",()=>{f("imgedit")});const d=document.getElementById("imageViewer"),m=document.getElementById("thumbnailGallery"),n=document.getElementById("tagFilter"),a=document.getElementById("albumFilter"),o=async()=>{const t=await E();n.innerHTML="",t.forEach(s=>{const l=document.createElement("button");l.textContent=s,l.className="tag-btn",l.dataset.tag=s,l.classList.toggle("selected",w.includes(s)),l.addEventListener("click",()=>{w.includes(s)?(w=w.filter(u=>u!==s),l.classList.remove("selected")):(w.push(s),l.classList.add("selected")),b()}),n.appendChild(l)})},p=async()=>{const t=await I();a.innerHTML="",t.forEach(s=>{const l=s.Name,r=document.createElement("button");r.textContent=l,r.className="album-btn",r.dataset.album=l,r.classList.toggle("selected",h.includes(l)),r.addEventListener("click",()=>{h.includes(l)?(h=h.filter(g=>g!==l),r.classList.remove("selected")):(h.push(l),r.classList.add("selected")),b()}),a.appendChild(r)})},b=async()=>{m.innerHTML="",d.innerHTML="";let t=new Set;try{let s=new Set;w.length>0&&(s=(await Promise.all(w.map(u=>C(u)))).reduce((u,g)=>(g.forEach(v=>u.add(v)),u),new Set));let l=new Set;if(h.length>0&&(await Promise.all(h.map(u=>G(u)))).forEach(u=>{u.forEach(g=>l.add(g.ID))}),w.length&&h.length)t=new Set([...s].filter(r=>l.has(r)));else if(w.length)t=s;else if(h.length)t=l;else{const r=await P();t=new Set(r.map(u=>u.id))}for(const r of t)try{const u=await F(r),g=document.createElement("button");g.style.border="none",g.style.padding="0",g.style.background="none";const v=document.createElement("img");v.src=u,v.style.width="150px",v.style.height="150px",v.style.objectFit="cover",g.appendChild(v),g.addEventListener("click",async()=>{if(y===r){d.innerHTML="",y=null;return}y=r,d.innerHTML="Loading...";const A=await x(r);d.innerHTML=`
                <img 
                  src="${A}" 
                  data-id="${r}" 
                  style="max-width:100%; max-height:500px; cursor: pointer;" 
                  title="Click to close"
                />
              `,d.querySelector("img").addEventListener("click",()=>{d.innerHTML="",y=null})}),m.appendChild(g)}catch{console.error("Failed to load thumbnail for",r,e)}}catch(s){console.error("Error rendering gallery",s)}};(async()=>{try{(await E()).forEach(s=>{const l=document.createElement("option");l.value=s,l.textContent=s,n.appendChild(l)})}catch(t){console.warn("Couldn't load tags",t)}try{const t=await I();console.log("🎵 Albums:",t),t.forEach(s=>{const l=document.createElement("option");l.value=s.Name,l.textContent=s.Name,a.appendChild(l)})}catch(t){console.warn("Couldn't load albums",t)}n.addEventListener("change",b),a.addEventListener("change",b),await o(),await p(),await b()})()}if(i=="imgedit"){const d=document.getElementById("imageViewer");y?(d.innerHTML="Loading image...",(async()=>{try{const a=await x(y);d.innerHTML=`
            <img 
              src="${a}" 
              alt="Full Image" 
              style="max-width:100%; max-height:500px;" 
            />
          `}catch(a){d.innerHTML=`<p>Error loading image: ${a.message}</p>`}})()):d.innerHTML="<p>No image selected from gallery.</p>";const m=async()=>{const a=document.getElementById("albumSection");a.innerHTML="<p>Loading Albums...</p>";try{const o=await S(y),b=(await I()).map(t=>t.Name).filter(t=>!o.includes(t));a.innerHTML=`
          <h3>Albums</h3>
          <ul>
            ${o.map(t=>`
              <li>
                ${t}
                <button data-album="${t}" </button>
              </li>`).join("")}
          </ul>
    
          <label for="albumInput">Add Album:</label>
          <input id="albumInput" list="allAlbumsDatalist" placeholder="Type or select album" />
          <datalist id="allAlbumsDatalist">
            ${b.map(t=>`<option value="${t}"></option>`).join("")}
          </datalist>
          <button id="addAlbum">Add Album</button>
        `,document.getElementById("addAlbum").addEventListener("click",async()=>{const t=document.getElementById("albumInput").value.trim();t&&!o.includes(t)&&(await L(y,t),m())})}catch(o){console.error("Error loading albums",o),a.innerHTML=`<p>Error loading albums: ${o.message}</p>`}};m();const n=async()=>{const a=document.getElementById("tagSection");a.innerHTML="<p>Loading Tags...</p>";try{if(!y){a.innerHTML="<p>No image selected.</p>";return}const o=await $(y),b=(await E()).filter(t=>!o.includes(t));a.innerHTML=`
          <h3>Tags</h3>
          <ul>
            ${o.map(t=>`
              <li>
                ${t}
                <button data-tag="${t}"</button>
              </li>
            `).join("")}
          </ul>
    
          <label for="tagInput">Add Tag:</label>
          <input id="tagInput" list="allTagsDatalist" placeholder="Type or select tag" />
          <datalist id="allTagsDatalist">
            ${b.map(t=>`<option value="${t}"></option>`).join("")}
          </datalist>
          <button id="addTag">Add Tag</button>
        `,document.getElementById("addTag").addEventListener("click",async()=>{const t=document.getElementById("tagInput").value.trim();t&&!o.includes(t)&&(await k(y,t),n())})}catch(o){console.error("Error loading tags",o),a.innerHTML=`<p>Error loading tags: ${o.message}</p>`}};n()}if(i==="export"){document.getElementById("goToUpload").addEventListener("click",()=>{f("upload")}),document.getElementById("goToGallery").addEventListener("click",()=>{f("gallery")}),document.getElementById("goToExport").addEventListener("click",()=>{f("export")});const d=document.getElementById("exportStatus"),m=document.getElementById("exportAlbumSelect");(async()=>{try{(await I()).forEach(a=>{const o=document.createElement("option");o.value=a.Name,o.textContent=a.Name,m.appendChild(o)})}catch(n){d.textContent="Failed to load albums: "+n.message}})(),document.getElementById("browseExportPath").addEventListener("click",async()=>{try{const n=await window.go.mediaapi.MediaAPI.SelectDirectoryDialog();document.getElementById("exportPath").value=n}catch(n){d.textContent="Directory selection failed: "+n.message}}),document.getElementById("doExport").addEventListener("click",async()=>{const n=m.value,a=document.getElementById("exportPath").value,o=document.querySelector('input[name="exportType"]:checked')?.value;if(!n||!a){d.textContent="Please select an album and destination.";return}d.textContent="Exporting...";try{if(o==="zip"){const p=`${a}/${n}.zip`;await B(n,p),d.textContent=`Album "${n}" exported to "${p}".`}else await M(n,a),d.textContent=`Album "${n}" exported to folder "${a}/${n}/"`}catch(p){console.error("Export failed:",p),d.textContent=`Export failed: ${p.message||"Unknown error"}`}})}T()}window.addEventListener("DOMContentLoaded",()=>{f("home")});
