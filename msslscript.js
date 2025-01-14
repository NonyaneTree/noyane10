// Save data to local storage
function saveToLocalStorage() {
    const tableData = [];
    const rows = document.querySelectorAll("tbody tr");
    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        tableData.push({
            part: cells[0].querySelector("select").value,
            color: cells[1].querySelector("select").value,
            total: cells[2].textContent,
            rework: cells[3].querySelector("input").value,
            polished: cells[4].querySelector("input").value,
            scrap: cells[5].querySelector("input").value,
            remarks: cells[6].querySelector("input").value,
            reworkDefect: cells[3].querySelector("select").value,
            scrapDefect: cells[5].querySelector("select").value,
        });
    });
    localStorage.setItem("loadingSheetData", JSON.stringify(tableData));
}

// Load data from local storage
function loadFromLocalStorage() {
    const tableData = JSON.parse(localStorage.getItem("loadingSheetData"));
    if (tableData) {
        const table = document.getElementById("loadingSheet").getElementsByTagName("tbody")[0];
        table.innerHTML = ""; // Clear existing rows
        tableData.forEach((data) => {
            const newRow = table.insertRow();
            newRow.innerHTML = document.querySelector("tbody tr").innerHTML;
            const cells = newRow.querySelectorAll("td");
            cells[0].querySelector("select").value = data.part;
            cells[1].querySelector("select").value = data.color;
            cells[2].textContent = data.total;
            cells[3].querySelector("input").value = data.rework;
            cells[4].querySelector("input").value = data.polished;
            cells[5].querySelector("input").value = data.scrap;
            cells[6].querySelector("input").value = data.remarks;
            cells[3].querySelector("select").value = data.reworkDefect;
            cells[5].querySelector("select").value = data.scrapDefect;
        });
    }
}

// Attach save functionality to relevant events
document.addEventListener("input", saveToLocalStorage);
document.addEventListener("DOMContentLoaded", loadFromLocalStorage);

