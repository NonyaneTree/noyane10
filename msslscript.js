// Save data to local storage
function saveToLocalStorage() {
    const tableData = [];
    const rows = document.querySelectorAll("#loadingSheet tbody tr");
    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        tableData.push({
            part: cells[0]?.querySelector("select")?.value || "",
            color: cells[1]?.querySelector("select")?.value || "",
            total: parseInt(cells[2]?.textContent) || 0,
            rework: parseInt(cells[3]?.querySelector("input")?.value) || 0,
            polished: parseInt(cells[4]?.querySelector("input")?.value) || 0,
            scrap: parseInt(cells[5]?.querySelector("input")?.value) || 0,
            remarks: cells[6]?.querySelector("input")?.value || "",
        });
    });
    localStorage.setItem("loadingSheetData", JSON.stringify(tableData));
}

// Load data from local storage
function loadFromLocalStorage() {
    const tableData = JSON.parse(localStorage.getItem("loadingSheetData")) || [];
    const tableBody = document.querySelector("#loadingSheet tbody");

    // Clear existing rows
    tableBody.innerHTML = "";

    // Populate table from stored data
    tableData.forEach((data) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <select onchange="loadRowData(this)">
                    <option value="H Bar_WLT" ${data.part === "H Bar_WLT" ? "selected" : ""}>H Bar_WLT</option>
                    <option value="H_Bar LTD" ${data.part === "H_Bar LTD" ? "selected" : ""}>H_Bar LTD</option>
                    <option value="WLT" ${data.part === "WLT" ? "selected" : ""}>WLT</option>
                </select>
            </td>
            <td>
                <select onchange="loadRowData(this)">
                    <option value="Boulder Gray" ${data.color === "Boulder Gray" ? "selected" : ""}>Boulder Gray</option>
                    <option value="Black" ${data.color === "Black" ? "selected" : ""}>Black</option>
                </select>
            </td>
            <td class="total-cell">${data.total}</td>
            <td><input type="number" class="number-input" value="${data.rework}" onchange="updateValue(this)" /></td>
            <td><input type="number" class="number-input" value="${data.polished}" onchange="updateValue(this)" /></td>
            <td><input type="number" class="number-input" value="${data.scrap}" onchange="updateValue(this)" /></td>
            <td><input type="text" class="remarks-input" value="${data.remarks}" /></td>
        `;
        tableBody.appendChild(row);
    });
}

// Load row data when part and color are selected
function loadRowData(selectElement) {
    const row = selectElement.closest("tr");
    const selectedPart = row.querySelector("td:nth-child(1) select").value;
    const selectedColor = row.querySelector("td:nth-child(2) select").value;

    const tableData = JSON.parse(localStorage.getItem("loadingSheetData")) || [];
    const matchingData = tableData.find(
        (data) => data.part === selectedPart && data.color === selectedColor
    );

    if (matchingData) {
        row.querySelector("td:nth-child(3)").textContent = matchingData.total;
        row.querySelector("td:nth-child(4) input").value = matchingData.rework;
        row.querySelector("td:nth-child(5) input").value = matchingData.polished;
        row.querySelector("td:nth-child(6) input").value = matchingData.scrap;
        row.querySelector("td:nth-child(7) input").value = matchingData.remarks;
    }
}

// Update value dynamically and save changes
function updateValue(input) {
    const row = input.closest("tr");
    const totalCell = row.querySelector(".total-cell");

    const rework = parseInt(row.querySelector("td:nth-child(4) input").value) || 0;
    const polished = parseInt(row.querySelector("td:nth-child(5) input").value) || 0;
    const scrap = parseInt(row.querySelector("td:nth-child(6) input").value) || 0;

    const total = rework + polished + scrap;
    totalCell.textContent = total;

    saveToLocalStorage(); // Save updated values
}

// Add a new row dynamically
function addRow() {
    const tableBody = document.querySelector("#loadingSheet tbody");
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>
            <select onchange="loadRowData(this)">
                <option value="H Bar_WLT">H Bar_WLT</option>
                <option value="H_Bar LTD">H_Bar LTD</option>
                <option value="WLT">WLT</option>
            </select>
        </td>
        <td>
            <select onchange="loadRowData(this)">
                <option value="Boulder Gray">Boulder Gray</option>
                <option value="Black">Black</option>
            </select>
        </td>
        <td class="total-cell">0</td>
        <td><input type="number" class="number-input" value="0" onchange="updateValue(this)" /></td>
        <td><input type="number" class="number-input" value="0" onchange="updateValue(this)" /></td>
        <td><input type="number" class="number-input" value="0" onchange="updateValue(this)" /></td>
        <td><input type="text" class="remarks-input" /></td>
    `;
    tableBody.appendChild(newRow);
}

// Generate PDF and redirect
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("PP2 Off Loading Sheet", 10, 10);

    let y = 20;
    const rows = document.querySelectorAll("#loadingSheet tbody tr");
    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        doc.text(cells[0].querySelector("select").value, 10, y);
        doc.text(cells[1].querySelector("select").value, 50, y);
        doc.text(cells[2].textContent, 100, y);
        y += 10;
    });

    doc.save("PP2_Off_Loading_Sheet.pdf");

    // Redirect to monthly.html with data
    const tableData = JSON.parse(localStorage.getItem("loadingSheetData"));
    localStorage.setItem("monthlyData", JSON.stringify(tableData));
    window.location.href = "monthly.html";
}

// Initialize
document.addEventListener("DOMContentLoaded", loadFromLocalStorage);
document.addEventListener("input", saveToLocalStorage);
