(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const l of e.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function o(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function n(t){if(t.ep)return;t.ep=!0;const e=o(t);fetch(t.href,e)}})();function m(i,a){return window.go.mediaapi.MediaAPI.ImportImage(i,a)}console.log("✅ Wails runtime loaded");setTimeout(()=>{console.log("⏱️ window.go after 200ms:",window.go)},200);console.log("window.go",window.go);console.log("window.go.mediaapi",window.go.mediaapi);console.log("window.go.mediaapi.MediaAPI",window.go.mediaapi?.MediaAPI);const u={home:`
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
    `};function r(i){const a=document.getElementById("app");if(a.innerHTML=u[i],i==="home"&&(document.getElementById("goToUpload").addEventListener("click",()=>{r("upload")}),document.getElementById("goToGallery").addEventListener("click",()=>{r("gallery")})),i==="upload"&&(document.getElementById("menu").addEventListener("click",()=>{r("home")}),document.getElementById("uploadForm").addEventListener("submit",async o=>{o.preventDefault();const n=document.getElementById("imageInput").files,t=document.getElementById("uploadResults");t.innerHTML="";for(const e of n)try{const l=await e.arrayBuffer(),d=new Uint8Array(l),c=await m(e.name,Array.from(d)),s=document.createElement("li");s.innerHTML=`${e.name} uploaded! Image ID: <strong>${c}</strong>`,t.appendChild(s)}catch(l){const d=document.createElement("li");d.innerHTML=`${e.name} failed: ${l.message}`,t.appendChild(d)}})),i=="gallery"){document.getElementById("menu").addEventListener("click",()=>{r("home")});const o=document.createElement("div");o.id="thumbnailGallery",o.style.display="flex",o.style.flexWrap="wrap",o.style.gap="12px",document.getElementById("app").appendChild(o),(async()=>{try{const n=await GetAllThumbnails();for(const t of n){const e=document.createElement("img");e.src=t,e.alt="Thumbnail",e.style.width="150px",e.style.height="150px",e.style.objectFit="cover",o.appendChild(e)}}catch(n){console.error("Failed to load thumbnails",n)}})()}}window.addEventListener("DOMContentLoaded",()=>{r("home")});
