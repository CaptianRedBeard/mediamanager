(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const e of n)if(e.type==="childList")for(const a of e.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&l(a)}).observe(document,{childList:!0,subtree:!0});function d(n){const e={};return n.integrity&&(e.integrity=n.integrity),n.referrerPolicy&&(e.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?e.credentials="include":n.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function l(n){if(n.ep)return;n.ep=!0;const e=d(n);fetch(n.href,e)}})();function p(o,i){return window.go.mediaapi.MediaAPI.AddImageToAlbum(o,i)}function y(){return window.go.mediaapi.MediaAPI.GetAllThumbnails()}function g(o){return window.go.mediaapi.MediaAPI.GetImageBase64(o)}function f(o){return window.go.mediaapi.MediaAPI.GetTagsForImage(o)}function I(o,i){return window.go.mediaapi.MediaAPI.ImportImage(o,i)}function w(o){return window.go.mediaapi.MediaAPI.ListAlbumNamesForImage(o)}function b(o,i){return window.go.mediaapi.MediaAPI.TagImage(o,i)}console.log("✅ Wails runtime loaded");setTimeout(()=>{console.log("⏱️ window.go after 200ms:",window.go)},200);console.log("window.go",window.go);console.log("window.go.mediaapi",window.go.mediaapi);console.log("window.go.mediaapi.MediaAPI",window.go.mediaapi?.MediaAPI);const h={home:`
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
  <h1>Image Editor</h1>
  <button id="menu">Back To Menu</button>
  <button id="goToGallery">Gallery</button>
  <div id="imageViewer" style="margin-top: 20px;"></div>
  <div id="tagSection" style="margin-top: 20px;"></div>
  <div id="albumSection" style="margin-top: 20px;"></div>
`};let r=null;function s(o){const i=document.getElementById("app");if(i.innerHTML=h[o],o==="home"&&(document.getElementById("goToUpload").addEventListener("click",()=>{s("upload")}),document.getElementById("goToGallery").addEventListener("click",()=>{s("gallery")})),o==="upload"&&(document.getElementById("menu").addEventListener("click",()=>{s("home")}),document.getElementById("uploadForm").addEventListener("submit",async d=>{d.preventDefault();const l=document.getElementById("imageInput").files,n=document.getElementById("uploadResults");n.innerHTML="";for(const e of l)try{const a=await e.arrayBuffer(),t=new Uint8Array(a),m=await I(e.name,Array.from(t)),c=document.createElement("li");c.innerHTML=`${e.name} uploaded! Image ID: <strong>${m}</strong>`,n.appendChild(c)}catch(a){const t=document.createElement("li");t.innerHTML=`${e.name} failed: ${a.message}`,n.appendChild(t)}})),o=="gallery"){document.getElementById("menu").addEventListener("click",()=>{s("home")}),document.getElementById("edit").addEventListener("click",()=>{s("imgedit")});const d=document.getElementById("thumbnailGallery"),l=document.getElementById("imageViewer");(async()=>{try{(await y()).forEach(({id:e,image:a})=>{const t=document.createElement("button");t.style.border="none",t.style.padding="0",t.style.background="none",t.title=`Image ${a}`;const m=document.createElement("img");m.src=a,m.alt=`Thumbnail ${a}`,m.style.width="150px",m.style.height="150px",m.style.objectFit="cover",t.appendChild(m),t.addEventListener("click",async()=>{r=e,l.innerHTML="Loading...";try{const c=await g(e);l.innerHTML=`
                <img 
                  id="fullImage" 
                  src="${c}" 
                  alt="Full Image" 
                  style="max-width:100%; max-height:500px; cursor: pointer;" 
                />
              `;const u=document.getElementById("fullImage");u.addEventListener("click",()=>{r=null,u.style.display=u.style.display==="none"?"block":"none"})}catch(c){l.innerHTML=`<p>Error loading image: ${c.message}</p>`}}),d.appendChild(t)})}catch(n){console.error("Failed to load thumbnails",n)}})()}if(o=="imgedit"){document.getElementById("menu").addEventListener("click",()=>{s("home")}),document.getElementById("goToGallery").addEventListener("click",()=>{s("gallery")});const d=document.getElementById("imageViewer");r?(d.innerHTML="Loading image...",(async()=>{try{const e=await g(r);d.innerHTML=`
            <img 
              src="${e}" 
              alt="Full Image" 
              style="max-width:100%; max-height:500px;" 
            />
          `}catch(e){d.innerHTML=`<p>Error loading image: ${e.message}</p>`}})()):d.innerHTML="<p>No image selected from gallery.</p>";const l=async()=>{const e=document.getElementById("tagSection");e.innerHTML="<p>Loading Tags</p>";try{const a=await w(r);console.log("albums:",a),albumContainer.innerHTML=`
          <h3>Albums</h3>
          <ul>
            ${a.map(t=>`
              <li>
                ${t}
                <button data-tag="${t}" class="remove-album">❌</button>
              </li>`).join("")}
           </ul>
          <input id="newAlbum" placeholder="New tag" />
          <button id="addAlbum">Add Tag</button> 
        `,document.getElementById("addAlbum").addEventListener("click",async()=>{const t=document.getElementById("newAlbum").value.trim();t&&(await p(r,t),l())}),document.querySelectorAll(".remove-album").forEach(t=>{t.addEventListener("click",async()=>{await RemoveAlbumFromImage(r,t.dataset.album),n()})})}catch(a){console.error("❌ Error in GetAlbumsForImage",a),e.innerHTML=`<p>Error loading albums: ${a.message}</p>`}};l();const n=async()=>{const e=document.getElementById("tagSection");e.innerHTML="<p>Loading Tags</p>";try{const a=await f(r);console.log("tags:",a),e.innerHTML=`
          <h3>Tags</h3>
          <ul>
            ${a.map(t=>`
              <li>
                ${t}
                <button data-tag="${t}" class="remove-tag">❌</button>
              </li>`).join("")}
           </ul>
          <input id="newTag" placeholder="New tag" />
          <button id="addTag">Add Tag</button> 
        `,document.getElementById("addTag").addEventListener("click",async()=>{const t=document.getElementById("newTag").value.trim();t&&(await b(r,t),n())}),document.querySelectorAll(".remove-tag").forEach(t=>{t.addEventListener("click",async()=>{await RemoveTagFromImage(r,t.dataset.tag),n()})})}catch(a){console.error("❌ Error in GetDetailedTagsForImage",a),e.innerHTML=`<p>Error loading tags: ${a.message}</p>`}};n()}}window.addEventListener("DOMContentLoaded",()=>{s("home")});
