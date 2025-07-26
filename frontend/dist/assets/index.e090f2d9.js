(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const n of t.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function l(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function o(e){if(e.ep)return;e.ep=!0;const t=l(e);fetch(e.href,t)}})();document.getElementById("gallery");document.querySelector("#app").innerHTML=`
  <h2>Single Image Display</h2>
  <div id="image-container" style="padding:20px;">
    <img id="single-image" style="width:300px; height:auto; border-radius:8px;" />
  </div>
`;const d="295c0f47-ec77-4ac7-8ed1-dda7556fb594",r=document.getElementById("single-image");r.src=`http://localhost:8080/thumb/${d}`;r.alt="Thumbnail image";r.onerror=()=>{r.alt="Failed to load image"};const c=document.getElementById("app");c.innerHTML=`
  <h2>Upload Multiple Images</h2>
  <form id="uploadForm">
    <input type="file" id="imageInput" name="images" multiple accept="image/*" />
    <button type="submit">Upload</button>
  </form>
  <ul id="uploadResults"></ul>
`;document.getElementById("uploadForm").addEventListener("submit",async a=>{a.preventDefault();const i=document.getElementById("imageInput").files,l=document.getElementById("uploadResults");if(l.innerHTML="",!i.length){alert("Please select at least one image.");return}for(const o of i){const e=new FormData;e.append("image",o),console.log(o);try{const t=await fetch("http://localhost:8080/upload",{method:"POST",body:e});if(!t.ok)throw new Error(await t.text());const n=await t.json(),s=document.createElement("li");s.innerHTML=`
        ${o.name}</strong> uploaded! 
        <a href="${n.image_url}" target="_blank">View</a>
      `,l.appendChild(s)}catch(t){const n=document.createElement("li");n.innerHTML=`${o.name}</strong> failed: ${t.message}`,l.appendChild(n)}}});
