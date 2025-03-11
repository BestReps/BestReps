function openModal(imageSrc) {
  const modal = document.getElementById("popupModal");
  const iframe = document.getElementById("popupFrame");
  iframe.src = imageSrc;
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("popupModal");
  modal.style.display = "none";
}

// Close the modal when clicking outside of the modal content
window.onclick = function (event) {
  const modal = document.getElementById("popupModal");
  if (event.target === modal) {
    closeModal();
  }
};
