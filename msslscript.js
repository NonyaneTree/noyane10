// Initialize
document.addEventListener("DOMContentLoaded", () => {
    loadTableFromLocalStorage(); // Load saved data on page load
    document.getElementById("addButton").addEventListener("click", addRow); // Attach event listener to Add button
    document.getElementById("compileButton").addEventListener("click", generatePDF); // Attach event listener to Compile button
});

// Function to add a row to the table
function addRow() {
    const tableBody = document.querySelector("#loadingSheet tbody");

    // Create a new row
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" class="editable partField" placeholder="Part"></td>
        <td><input type="text" class="editable colorField" placeholder="Color"></td>
        <td><input type="number" class="editable" placeholder="Total"></td>
        <td><input type="number" class="editable" placeholder="Rework"></td>
        <td><input type="number" class="editable" placeholder="Polished"></td>
        <td><input type="number" class="editable" placeholder="Scrap"></td>
        <td><input type="text" class="editable" placeholder="Remarks"></td>
    `;

    // Append the new row to the table body
    tableBody.appendChild(row);

    // Add event listeners for part and color fields
    row.querySelector(".partField").addEventListener("input", checkPreviousData);
    row.querySelector(".colorField").addEventListener("input", checkPreviousData);

    // Save the updated table data to localStorage
    saveTableToLocalStorage();
}

// Function to save the table data to localStorage
function saveTableToLocalStorage() {
    const tableBody = document.querySelector("#loadingSheet tbody");
    const rows = tableBody.querySelectorAll("tr");
    const tableData = [];

    // Loop through each row and extract data
    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        const rowData = {
            part: cells[0].querySelector("input").value,
            color: cells[1].querySelector("input").value,
            total: cells[2].querySelector("input").value,
            rework: cells[3].querySelector("input").value,
            polished: cells[4].querySelector("input").value,
            scrap: cells[5].querySelector("input").value,
            remarks: cells[6].querySelector("input").value,
        };
        tableData.push(rowData);
    });

    // Save the table data to localStorage
    localStorage.setItem("loadingSheetData", JSON.stringify(tableData));
}

// Function to load the table data from localStorage
function loadTableFromLocalStorage() {
    const tableBody = document.querySelector("#loadingSheet tbody");
    const tableData = JSON.parse(localStorage.getItem("loadingSheetData")) || [];

    // Clear the table body
    tableBody.innerHTML = "";

    // Populate the table with saved data
    tableData.forEach((data) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" class="editable partField" value="${data.part}" placeholder="Part"></td>
            <td><input type="text" class="editable colorField" value="${data.color}" placeholder="Color"></td>
            <td><input type="number" class="editable" value="${data.total}" placeholder="Total"></td>
            <td><input type="number" class="editable" value="${data.rework}" placeholder="Rework"></td>
            <td><input type="number" class="editable" value="${data.polished}" placeholder="Polished"></td>
            <td><input type="number" class="editable" value="${data.scrap}" placeholder="Scrap"></td>
            <td><input type="text" class="editable" value="${data.remarks}" placeholder="Remarks"></td>
        `;
        tableBody.appendChild(row);

        // Add event listeners for part and color fields
        row.querySelector(".partField").addEventListener("input", checkPreviousData);
        row.querySelector(".colorField").addEventListener("input", checkPreviousData);
    });
}

// Function to check previous data when Part or Color is entered
function checkPreviousData(event) {
    const row = event.target.closest("tr");
    const part = row.querySelector(".partField").value;
    const color = row.querySelector(".colorField").value;
    const tableData = JSON.parse(localStorage.getItem("loadingSheetData")) || [];

    // Search for a matching row in the saved data
    const match = tableData.find((data) => data.part === part && data.color === color);

    if (match) {
        row.querySelector("input[placeholder='Total']").value = match.total || "";
        row.querySelector("input[placeholder='Rework']").value = match.rework || "";
        row.querySelector("input[placeholder='Polished']").value = match.polished || "";
        row.querySelector("input[placeholder='Scrap']").value = match.scrap || "";
        row.querySelector("input[placeholder='Remarks']").value = match.remarks || "";
    }
}

// Attach event listener to save table data when inputs are modified
document.addEventListener("input", (event) => {
    if (event.target.classList.contains("editable")) {
        saveTableToLocalStorage();
    }
});

// Function to generate and download the PDF
function generatePDF() {
    const { jsPDF } = window.jspdf; // Import jsPDF
    const doc = new jsPDF();

    // Title of the PDF
    doc.text("PP2 Off Loading Sheet", 10, 10);

    // Select table rows to include in the PDF
    const rows = document.querySelectorAll("#loadingSheet tbody tr");
    let y = 20; // Initial Y position

    // Loop through each table row and add content to the PDF
    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        doc.text(cells[0].querySelector("input").value || "", 10, y); // Part
        doc.text(cells[1].querySelector("input").value || "", 50, y); // Color
        doc.text(cells[2].querySelector("input").value || "", 100, y); // Total
        y += 10; // Move down for the next row
    });

    // Generate a unique filename with the current timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `PP2_Off_Loading_Sheet_${timestamp}.pdf`;

    // Save the PDF
    doc.save(filename);
            }
