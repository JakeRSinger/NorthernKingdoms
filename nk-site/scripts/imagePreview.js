document.getElementById("artefact_image").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById("image-preview-container");
    const previewImage = document.getElementById("image-preview");

    // Check if a file is selected
    if (!file) {
        previewContainer.style.display = "none";
        previewImage.src = "";
        return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type! Only JPG and PNG images are allowed.");
        event.target.value = ""; // Clear the input
        previewContainer.style.display = "none";
        previewImage.src = "";
        return;
    }

    // Read and display the image
    const reader = new FileReader();
    reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewContainer.style.display = "block";
    };
    reader.readAsDataURL(file);
});


