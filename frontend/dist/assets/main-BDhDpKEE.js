(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const a of t.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function m(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=m(e);fetch(e.href,t)}})();function c(){return window.go.mediaapi.MediaAPI.GetAllThumbnails()}function u(o){return window.go.mediaapi.MediaAPI.GetImageBase64(o)}function g(o,r){return window.go.mediaapi.MediaAPI.ImportImage(o,r)}console.log("✅ Wails runtime loaded");setTimeout(()=>{console.log("⏱️ window.go after 200ms:",window.go)},200);console.log("window.go",window.go);console.log("window.go.mediaapi",window.go.mediaapi);console.log("window.go.mediaapi.MediaAPI",window.go.mediaapi?.MediaAPI);const p={home:`
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
    <div id="thumbnailGallery" style="display: flex; flex-wrap: wrap; gap: 12px;"></div>
    <div id="imageViewer" style="margin-top: 20px;"></div>
    <button id="menu">Back To Menu</button>
    `};function s(o){const r=document.getElementById("app");if(r.innerHTML=p[o],o==="home"&&(document.getElementById("goToUpload").addEventListener("click",()=>{s("upload")}),document.getElementById("goToGallery").addEventListener("click",()=>{s("gallery")})),o==="upload"&&(document.getElementById("menu").addEventListener("click",()=>{s("home")}),document.getElementById("uploadForm").addEventListener("submit",async m=>{m.preventDefault();const i=document.getElementById("imageInput").files,e=document.getElementById("uploadResults");e.innerHTML="";for(const t of i)try{const a=await t.arrayBuffer(),n=new Uint8Array(a),l=await g(t.name,Array.from(n)),d=document.createElement("li");d.innerHTML=`${t.name} uploaded! Image ID: <strong>${l}</strong>`,e.appendChild(d)}catch(a){const n=document.createElement("li");n.innerHTML=`${t.name} failed: ${a.message}`,e.appendChild(n)}})),o=="gallery"){document.getElementById("menu").addEventListener("click",()=>{s("home")});const m=document.getElementById("thumbnailGallery"),i=document.getElementById("imageViewer");(async()=>{try{(await c()).forEach(({id:t,image:a})=>{const n=document.createElement("button");n.style.border="none",n.style.padding="0",n.style.background="none",n.title=`Image ${index}`;const l=document.createElement("img");l.src=thumbDataUrl,l.alt=`Thumbnail ${index}`,l.style.width="150px",l.style.height="150px",l.style.objectFit="cover",n.appendChild(l),n.addEventListener("click",async()=>{i.innerHTML="Loading...";try{const d=await u(t);i.innerHTML=`<img src="${d}" alt="Full Image" style="max-width:100%; max-height:500px;" />`}catch(d){i.innerHTML=`<p>Error loading image: ${d.message}</p>`}}),m.appendChild(n)})}catch(e){console.error("Failed to load thumbnails",e)}})()}}window.addEventListener("DOMContentLoaded",()=>{s("home")});
