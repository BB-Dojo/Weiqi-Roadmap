document.addEventListener("DOMContentLoaded", () => {
  let deferredPrompt; // Store the install prompt event
  let popupDisplayed = false; // Ensure the popup shows only once

  // Create the popup dynamically
  const popup = document.createElement("div");
  popup.id = "install-pwa-popup";
  popup.innerHTML = `
      <div id="popup-content">
        <p id="popup-message">Use web-app for a better experience!</p>
        <div id="popup-buttons">
        <button id="install-pwa-yes">Install</button>
        <button id="install-pwa-no">Close</button>
        </div>
      </div>
    `;
  document.body.appendChild(popup);

  // Style the popup
  const popupStyles = `
    #install-pwa-popup {
      position: fixed;
      top: 50px;
      left: 50%;
      transform: translate(-50%, -50%); /* Center the popup */
      background: #b7b7c720;
      color: white;
      width: 100vw;
      padding: 10px; /* Minimal padding */
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      display: none;
      z-index: 1000;
    }
    
    #install-pwa-popup.show {
      display: block;
    }
    
    #popup-content {
      display: flex;
      flex-direction: column; /* Arrange items vertically */
      align-items: center; /* Center horizontally */
      justify-content: center; /* Center vertically */
      gap: 5px; /* Minimal spacing between items */
      width: auto; /* Ensure the content stays centered */
      max-width: 500px; /* Set a max width for the content */
      margin: 0 auto; /* Center content horizontally within the popup */
    }
    
    #popup-message {
      font-weight: bold;
      font-size: 20px;
    }
    
    #install-pwa-popup button {
      padding: 5px 10px; /* Minimal button padding */
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    
    #install-pwa-yes {
      background-color: #4caf50;
      color: white;
    }
    
    #install-pwa-no {
      background-color: #f44336;
      color: white;
    }
    
    `;
  const styleSheet = document.createElement("style");
  // styleSheet.type = "text/css";
  styleSheet.innerText = popupStyles;
  document.head.appendChild(styleSheet);

  // Listen for the beforeinstallprompt event
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show the popup after 4 seconds
    setTimeout(() => {
      if (!popupDisplayed && !window.matchMedia("(display-mode: standalone)").matches) {
        popup.classList.add("show"); // Show the popup by sliding it down
        popupDisplayed = true;
      }
    }, 4000); // 4-second delay
  });

  // Handle the Install button click
  document.getElementById("install-pwa-yes").addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      deferredPrompt = null; // Clear the event
    }
    popup.classList.remove("show"); // Hide the popup
  });

  // Handle the Close button click
  document.getElementById("install-pwa-no").addEventListener("click", () => {
    popup.classList.remove("show"); // Hide the popup
  });

  // Hide popup if app is installed
  window.addEventListener("appinstalled", () => {
    console.log("PWA installed");
    popup.classList.remove("show");
  });
});