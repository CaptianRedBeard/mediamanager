(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const n of t.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function a(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=a(e);fetch(e.href,t)}})();function c(i,o){return window.go.mediaapi.MediaAPI.ImportImage(i,o)}console.log("✅ Wails runtime loaded");setTimeout(()=>{console.log("⏱️ window.go after 200ms:",window.go)},200);console.log("window.go",window.go);console.log("window.go.mediaapi",window.go.mediaapi);console.log("window.go.mediaapi.MediaAPI",window.go.mediaapi?.MediaAPI);const m={home:`
    <h1>Welcome to Media Manager</h1>
    <button id="goToUpload">Upload Images</button>
  `,upload:`
    <h1>Upload Images</h1>
    <form id="uploadForm" enctype="multipart/form-data">
      <input type="file" name="image" id="imageInput" multiple />
      <button type="submit">Upload</button>
    </form>
    <ul id="uploadResults"></ul>
    <div id="uploadStatus"></div>
    <button id="menu">Back To Menu</button>
  `};function l(i){const o=document.getElementById("app");o.innerHTML=m[i],i==="home"&&document.getElementById("goToUpload").addEventListener("click",()=>{l("upload")}),i==="upload"&&(document.getElementById("menu").addEventListener("click",()=>{l("home")}),document.getElementById("uploadForm").addEventListener("submit",async a=>{a.preventDefault();const r=document.getElementById("imageInput").files,e=document.getElementById("uploadResults");e.innerHTML="";for(const t of r)try{const n=await t.arrayBuffer(),d=new Uint8Array(n),u=await c(t.name,Array.from(d)),s=document.createElement("li");s.innerHTML=`${t.name} uploaded! Image ID: <strong>${u}</strong>`,e.appendChild(s)}catch(n){const d=document.createElement("li");d.innerHTML=`${t.name} failed: ${n.message}`,e.appendChild(d)}}))}window.addEventListener("DOMContentLoaded",()=>{l("home")});
