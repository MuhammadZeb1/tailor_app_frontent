@import "tailwindcss";

@media print {
  /* 1. Global Reset: Hide everything */
  body * {
    visibility: hidden;
  }

  /* 2. Target the specific container and its children to be visible */
  .printable-form, 
  .printable-form * {
    visibility: visible !important;
  }

  /* 3. Positioning: Place at top left of physical page */
  .printable-form {
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
    margin: 0 !important;
    padding: 10px !important;
    border: none !important;
    box-shadow: none !important;
  }

  /* 4. Deep Clean: Remove buttons and inputs that shouldn't be on paper */
  .no-print, 
  button, 
  input[type="checkbox"],
  .flex.gap-2 {
    display: none !important;
  }

  /* 5. Typography & Force Colors */
  body {
    background-color: white !important;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color: black !important;
    border-color: black !important;
  }

  /* Ensure money colors stay visible */
  .text-red-600 { color: #dc2626 !important; }
  .text-green-700 { color: #15803d !important; }

  /* Style inputs to look like plain text on paper */
  input {
    border: none !important;
    outline: none !important;
    background: transparent !important;
    font-weight: bold !important;
  }
}