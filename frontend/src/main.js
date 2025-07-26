import './style.css';
import './app.css';

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const files = document.getElementById("imageInput").files;
  const resultsList = document.getElementById("uploadResults");
  resultsList.innerHTML = "";

  if (!files.length) {
    alert("Please select at least one image.");
    return;
  }

  for (const file of files) {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      const li = document.createElement("li");
      li.innerHTML = `
        ${file.name}</strong> uploaded! 
        <a href="${result.image_url}" target="_blank">View</a>
      `;
      resultsList.appendChild(li);
    } catch (err) {
      const li = document.createElement("li");
      li.innerHTML = `${file.name}</strong> failed: ${err.message}`;
      resultsList.appendChild(li);
    }
  }
});

