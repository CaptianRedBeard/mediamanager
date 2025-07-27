(function(){const m=document.createElement("link").relList;if(m&&m.supports&&m.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function l(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=l(e);fetch(e.href,t)}})();function p(){return window.go.mediaapi.MediaAPI.GetAllThumbnails()}function g(a){return window.go.mediaapi.MediaAPI.GetImageBase64(a)}function y(a,m){return window.go.mediaapi.MediaAPI.ImportImage(a,m)}console.log("✅ Wails runtime loaded");setTimeout(()=>{console.log("⏱️ window.go after 200ms:",window.go)},200);console.log("window.go",window.go);console.log("window.go.mediaapi",window.go.mediaapi);console.log("window.go.mediaapi.MediaAPI",window.go.mediaapi?.MediaAPI);const f={home:`
    <h1>Welcome to Media Manager</h1>
    <button id="goToUpload">Upload Images</button>
    <button id= "goToGallery">Gallery</button>
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
    <div id="imageViewer" style="margin-top: 20px;"></div>
    <div id="thumbnailGallery" style="display: flex; flex-wrap: wrap; gap: 12px;"></div>
  `,imgedit:`
    <h1>Gallery</h1>
    <button id="menu">Back To Menu</button>
    <button id="goToGallery">Gallery</button>
    <div id="imageViewer" style="margin-top: 20px;"></div>
  `};let c=null;function r(a){const m=document.getElementById("app");if(m.innerHTML=f[a],a==="home"&&(document.getElementById("goToUpload").addEventListener("click",()=>{r("upload")}),document.getElementById("goToGallery").addEventListener("click",()=>{r("gallery")})),a==="upload"&&(document.getElementById("menu").addEventListener("click",()=>{r("home")}),document.getElementById("uploadForm").addEventListener("submit",async l=>{l.preventDefault();const n=document.getElementById("imageInput").files,e=document.getElementById("uploadResults");e.innerHTML="";for(const t of n)try{const i=await t.arrayBuffer(),o=new Uint8Array(i),d=await y(t.name,Array.from(o)),s=document.createElement("li");s.innerHTML=`${t.name} uploaded! Image ID: <strong>${d}</strong>`,e.appendChild(s)}catch(i){const o=document.createElement("li");o.innerHTML=`${t.name} failed: ${i.message}`,e.appendChild(o)}})),a=="gallery"){document.getElementById("menu").addEventListener("click",()=>{r("home")}),document.getElementById("edit").addEventListener("click",()=>{r("imgedit")});const l=document.getElementById("thumbnailGallery"),n=document.getElementById("imageViewer");(async()=>{try{(await p()).forEach(({id:t,image:i})=>{const o=document.createElement("button");o.style.border="none",o.style.padding="0",o.style.background="none",o.title=`Image ${i}`;const d=document.createElement("img");d.src=i,d.alt=`Thumbnail ${i}`,d.style.width="150px",d.style.height="150px",d.style.objectFit="cover",o.appendChild(d),o.addEventListener("click",async()=>{c=t,n.innerHTML="Loading...";try{const s=await g(t);n.innerHTML=`
                <img 
                  id="fullImage" 
                  src="${s}" 
                  alt="Full Image" 
                  style="max-width:100%; max-height:500px; cursor: pointer;" 
                />
              `;const u=document.getElementById("fullImage");u.addEventListener("click",()=>{c=null,u.style.display=u.style.display==="none"?"block":"none"})}catch(s){n.innerHTML=`<p>Error loading image: ${s.message}</p>`}}),l.appendChild(o)})}catch(e){console.error("Failed to load thumbnails",e)}})()}if(a=="imgedit"){document.getElementById("menu").addEventListener("click",()=>{r("home")}),document.getElementById("goToGallery").addEventListener("click",()=>{r("gallery")});const l=document.getElementById("imageViewer");c?(l.innerHTML="Loading image...",(async()=>{try{const n=await g(c);l.innerHTML=`
            <img 
              src="${n}" 
              alt="Full Image" 
              style="max-width:100%; max-height:500px;" 
            />
          `}catch(n){l.innerHTML=`<p>Error loading image: ${n.message}</p>`}})()):l.innerHTML="<p>No image selected from gallery.</p>"}}window.addEventListener("DOMContentLoaded",()=>{r("home")});
