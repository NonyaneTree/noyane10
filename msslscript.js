// Generate PDF with a unique filename
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

    // Generate a unique filename using the current timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `PP2_Off_Loading_Sheet_${timestamp}.pdf`;

    doc.save(filename);

    // Save data with a unique key in localStorage
    saveToLocalStorage(timestamp);

    // Redirect to monthly.html with data
    window.location.href = "monthly.html";
}

// Save data to localStorage with a unique key
function saveToLocalStorage(timestamp) {
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

    // Retrieve existing data from localStorage
    const existingData = JSON.parse(localStorage.getItem("loadingSheetData")) || {};

    // Add new data with a unique timestamp key
    existingData[timestamp] = tableData;

    // Save the updated data back to localStorage
    localStorage.setItem("loadingSheetData", JSON.stringify(existingData));
}

// Load data from localStorage
function loadFromLocalStorage() {
    const existingData = JSON.parse(localStorage.getItem("loadingSheetData")) || {};
    const tableBody = document.querySelector("#loadingSheet tbody");

    // Clear existing rows
    tableBody.innerHTML = "";

    // Iterate over each data entry and populate the table
    Object.values(existingData).forEach((tableData) => {
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
    });
}

// Initialize
document.addEventListener("DOMContentLoaded", loadFromLocalStorage);
