export function openModal(link) {
  const modal = document.getElementById("popupModal");
  const iframe = document.getElementById("popupFrame");
  iframe.src = link;
  modal.style.display = "block";

  // Add click handler for outside clicks
  modal.onclick = function (event) {
    if (event.target === modal) {
      closeModal();
    }
  };
}

export function closeModal() {
  const modal = document.getElementById("popupModal");
  const iframe = document.getElementById("popupFrame");
  modal.style.display = "none";
  iframe.src = ""; // Clear the iframe source
}
