/* empty css              */(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function i(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=i(e);fetch(e.href,t)}})();const a=document.getElementById("uploadStatus");a.innerHTML=`
  <h2>Upload Multiple Images</h2>
  <form id="uploadForm">
    <input type="file" id="imageInput" name="images" multiple accept="image/*" />
    <button type="submit">Upload</button>
  </form>
  <ul id="uploadResults"></ul>
`;document.getElementById("uploadForm").addEventListener("submit",async s=>{s.preventDefault();const r=document.getElementById("imageInput").files,i=document.getElementById("uploadResults");if(i.innerHTML="",!r.length){alert("Please select at least one image.");return}for(const n of r){const e=new FormData;e.append("image",n);try{const t=await fetch("http://localhost:8080/upload",{method:"POST",body:e});if(!t.ok)throw new Error(await t.text());const o=await t.json(),l=document.createElement("li");l.innerHTML=`
        ${n.name}</strong> uploaded! 
        <a href="${o.image_url}" target="_blank">View</a>
      `,i.appendChild(l)}catch(t){const o=document.createElement("li");o.innerHTML=`${n.name}</strong> failed: ${t.message}`,i.appendChild(o)}}});
