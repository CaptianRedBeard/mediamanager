(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))g(a);new MutationObserver(a=>{for(const t of a)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&g(o)}).observe(document,{childList:!0,subtree:!0});function u(a){const t={};return a.integrity&&(t.integrity=a.integrity),a.referrerPolicy&&(t.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?t.credentials="include":a.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function g(a){if(a.ep)return;a.ep=!0;const t=u(a);fetch(a.href,t)}})();function A(i,s){return window.go.mediaapi.MediaAPI.AddImageToAlbum(i,s)}function v(){return window.go.mediaapi.MediaAPI.GetAllThumbnails()}function h(i){return window.go.mediaapi.MediaAPI.GetImageBase64(i)}function M(i){return window.go.mediaapi.MediaAPI.GetImagesWithTag(i)}function B(i){return window.go.mediaapi.MediaAPI.GetTagsForImage(i)}function F(i){return window.go.mediaapi.MediaAPI.GetThumbnailBase64(i)}function G(i,s){return window.go.mediaapi.MediaAPI.ImportImage(i,s)}function x(i){return window.go.mediaapi.MediaAPI.ListAlbumNamesForImage(i)}function P(){return window.go.mediaapi.MediaAPI.ListAllAlbums()}function H(){return window.go.mediaapi.MediaAPI.ListAllTags()}function T(i){return window.go.mediaapi.MediaAPI.ListImagesInAlbum(i)}function C(i,s){return window.go.mediaapi.MediaAPI.TagImage(i,s)}console.log("✅ Wails runtime loaded");setTimeout(()=>{console.log("⏱️ window.go after 200ms:",window.go)},200);console.log("window.go",window.go);console.log("window.go.mediaapi",window.go.mediaapi);console.log("window.go.mediaapi.MediaAPI",window.go.mediaapi?.MediaAPI);const S={home:`
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

  <div style="margin: 10px 0;">
    <label for="tagFilter">Filter by Tags:</label>
    <select id="tagFilter" multiple size="5" style="width: 200px;"></select>

    <label for="albumFilter">Filter by Albums:</label>
    <select id="albumFilter" multiple size="5" style="width: 200px;"></select>
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
`};let p=null,w=[],b=[];function E(i){return Array.from(i.selectedOptions).map(s=>s.value)}function y(i){const s=document.getElementById("app");if(s.innerHTML=S[i],i==="home"&&(document.getElementById("goToUpload").addEventListener("click",()=>{y("upload")}),document.getElementById("goToGallery").addEventListener("click",()=>{y("gallery")})),i==="upload"&&(document.getElementById("menu").addEventListener("click",()=>{y("home")}),document.getElementById("uploadForm").addEventListener("submit",async u=>{u.preventDefault();const g=document.getElementById("imageInput").files,a=document.getElementById("uploadResults");a.innerHTML="";for(const t of g)try{const o=await t.arrayBuffer(),n=new Uint8Array(o),c=await G(t.name,Array.from(n)),r=document.createElement("li");r.innerHTML=`${t.name} uploaded! Image ID: <strong>${c}</strong>`,a.appendChild(r)}catch(o){const n=document.createElement("li");n.innerHTML=`${t.name} failed: ${o.message}`,a.appendChild(n)}})),i=="gallery"){document.getElementById("menu").addEventListener("click",()=>{w=[],b=[],y("home")}),document.getElementById("edit").addEventListener("click",()=>{y("imgedit")});const u=document.getElementById("thumbnailGallery"),g=document.getElementById("imageViewer"),a=document.getElementById("tagFilter"),t=document.getElementById("albumFilter"),o=async()=>{const n=await T("LOTR");console.log("Images in LOTR album:",n),u.innerHTML="",g.innerHTML="",w=E(a),b=E(t);let c=new Set;try{let r=new Set;w.length>0&&(r=(await Promise.all(w.map(l=>M(l)))).reduce((l,m)=>(m.forEach(f=>l.add(f)),l),new Set));let I=new Set;if(b.length>0&&(await Promise.all(b.map(l=>T(l)))).forEach(l=>{l.forEach(m=>I.add(m.ID))}),w.forEach(d=>{const l=Array.from(a.options).find(m=>m.value===d);l&&(l.selected=!0)}),b.forEach(d=>{const l=Array.from(t.options).find(m=>m.value===d);l&&(l.selected=!0)}),w.length&&b.length)c=new Set([...r].filter(d=>I.has(d)));else if(w.length)c=r;else if(b.length)c=I;else{const d=await v();c=new Set(d.map(l=>l.id))}for(const d of c)try{console.log("🔍 Trying to render image with ID:",d);const l=await F(d),m=document.createElement("button");m.style.border="none",m.style.padding="0",m.style.background="none";const f=document.createElement("img");f.src=l,f.style.width="150px",f.style.height="150px",f.style.objectFit="cover",m.appendChild(f),m.addEventListener("click",async()=>{p=d,g.innerHTML="Loading...";const L=await h(d);g.innerHTML=`<img src="${L}" style="max-width:100%; max-height:500px;" />`}),u.appendChild(m)}catch{console.error("❌ Failed to load thumbnail for",d,e)}}catch(r){console.error("Error rendering gallery",r)}};(async()=>{try{(await H()).forEach(c=>{const r=document.createElement("option");r.value=c.Name,r.textContent=c.Name,a.appendChild(r)})}catch(n){console.warn("Couldn't load tags",n)}try{const n=await P();console.log("🎵 Albums:",n),n.forEach(c=>{const r=document.createElement("option");r.value=c.Name,r.textContent=c.Name,t.appendChild(r)})}catch(n){console.warn("Couldn't load albums",n)}a.addEventListener("change",o),t.addEventListener("change",o),await o()})()}if(i=="imgedit"){document.getElementById("menu").addEventListener("click",()=>{y("home")}),document.getElementById("goToGallery").addEventListener("click",()=>{y("gallery")});const u=document.getElementById("imageViewer");p?(u.innerHTML="Loading image...",(async()=>{try{const t=await h(p);u.innerHTML=`
            <img 
              src="${t}" 
              alt="Full Image" 
              style="max-width:100%; max-height:500px;" 
            />
          `}catch(t){u.innerHTML=`<p>Error loading image: ${t.message}</p>`}})()):u.innerHTML="<p>No image selected from gallery.</p>";const g=async()=>{const t=document.getElementById("albumSection");t.innerHTML="<p>Loading Albums</p>";try{const o=await x(p);console.log("albums:",o),t.innerHTML=`
          <h3>Albums</h3>
          <ul>
            ${o.map(n=>`
              <li>
                ${n}
                <button data-album="${n}" class="remove-album">❌</button>
              </li>`).join("")}
           </ul>
          <input id="newAlbum" placeholder="New tag" />
          <button id="addAlbum">Add Tag</button> 
        `,document.getElementById("addAlbum").addEventListener("click",async()=>{const n=document.getElementById("newAlbum").value.trim();n&&(await A(p,n),g())}),document.querySelectorAll(".remove-album").forEach(n=>{n.addEventListener("click",async()=>{await RemoveAlbumFromImage(p,n.dataset.album),a()})})}catch(o){console.error("❌ Error in GetAlbumsForImage",o),tagContainer.innerHTML=`<p>Error loading albums: ${o.message}</p>`}};g();const a=async()=>{const t=document.getElementById("tagSection");t.innerHTML="<p>Loading Tags</p>";try{const o=await B(p);console.log("tags:",o),t.innerHTML=`
          <h3>Tags</h3>
          <ul>
            ${o.map(n=>`
              <li>
                ${n}
                <button data-tag="${n}" class="remove-tag">❌</button>
              </li>`).join("")}
           </ul>
          <input id="newTag" placeholder="New tag" />
          <button id="addTag">Add Tag</button> 
        `,document.getElementById("addTag").addEventListener("click",async()=>{const n=document.getElementById("newTag").value.trim();n&&(await C(p,n),a())}),document.querySelectorAll(".remove-tag").forEach(n=>{n.addEventListener("click",async()=>{await RemoveTagFromImage(p,n.dataset.tag),a()})})}catch(o){console.error("❌ Error in GetDetailedTagsForImage",o),t.innerHTML=`<p>Error loading tags: ${o.message}</p>`}};a()}}window.addEventListener("DOMContentLoaded",()=>{y("home")});
