//default
const defaultPageLimit = 20;
let datab;

/**
 *  Fetching the data
 *
 * */

// This function is called only after the data has been fetched, and parsed.
// heroes is the data
const loadData = (heroes) => {
  datab = heroes;
  const QueryString = window.location.search;
  console.log(QueryString);
  const urlParams = new URLSearchParams(QueryString);
  let resultsPerPage = parseInt(urlParams.get("results"));
  let pageNumber = parseInt(urlParams.get("pageNumber"));
  console.log(resultsPerPage, pageNumber);

  let pageLimit = defaultPageLimit;
  if (!Number.isNaN(resultsPerPage)) pageLimit = resultsPerPage;
  if (Number.isNaN(pageNumber)) pageNumber = 1;

  const selectElem = document.getElementById('results')
  const pElem = selectElem.getElementsByTagName('option')
  
  // document.querySelectorAll("#results option").forEach(element => {
  //   element.removeAttribute("selected")
  // });

  if (resultsPerPage === 10) pElem[0].setAttribute('selected', "")
  if (resultsPerPage === 20 || !resultsPerPage) pElem[1].setAttribute('selected', "")
  if (resultsPerPage === 50) pElem[2].setAttribute('selected', "")
  if (resultsPerPage === 100) pElem[3].setAttribute('selected', "")
  if (resultsPerPage === 999) pElem[4].setAttribute('selected', "")


  let currData = heroes.slice(0, pageLimit);
  console.log("page limit", pageLimit);
  console.log("Received", heroes.length);
  console.log("Default", currData.length);

  let NoOfPages = Math.ceil(heroes.length / pageLimit);
  console.log("pageNumber", pageNumber);

  let startValue = (pageNumber - 1) * pageLimit;
  console.log("start value", startValue);

  let endValue = pageNumber * pageLimit - 1;
  console.log("end value", endValue);

  let div = document.createElement("div");

  div.setAttribute("id", "pageNumber");
  div.innerHTML += "Pages: ";
  for (let i = 1; i < NoOfPages + 1; i++) {
    let activePage = ""
    if (i===pageNumber){
      activePage = "active"
    }
    div.innerHTML += `<a class="${activePage}" href = "?results=${pageLimit}&pageNumber=${i}"> ${i} </a>`;
  }
  document.body.appendChild(div);
  
  //buildTable(currData.slice)
  //adding 1 to end value as slice excludes the last index
  buildTable(heroes.slice(startValue, endValue + 1));

  addSortableListeners();
};

// Request the file with fetch, the data will downloaded to your browser cache.
fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
  .then((response) => response.json()) // parse the response from JSON
  .then(loadData); // .then will call the `loadData` function with the JSON value

/**
 *  Creating the table and adding it to the DOM at the body
 *
 * */

const buildTable = (data) => {
  let headers = [
    "ICON",
    "NAME",
    "FULL NAME",
    "INTELLIGENCE",
    "STRENGTH",
    "SPEED",
    "DURABILITY",
    "POWER",
    "COMBAT",
    "RACE",
    "GENDER",
    "HEIGHT",
    "WEIGHT",
    "PLACE OF BIRTH",
    "ALIGNMENT",
  ];
  let table = document.createElement("TABLE"); //makes a table element for the page

  table.setAttribute("class", "Table-Heroes");
  table.setAttribute("id", "myTable");

  data.forEach((hero, index) => {
    let row = table.insertRow(index);

    row.insertCell(0).innerHTML = `<img src='${hero.images.xs}'>`;
    row.insertCell(1).innerHTML = hero.name;
    row.insertCell(2).innerHTML = hero.biography.fullName;
    row.insertCell(3).innerHTML = hero.powerstats.intelligence;
    row.insertCell(4).innerHTML = hero.powerstats.strength;
    row.insertCell(5).innerHTML = hero.powerstats.speed;
    row.insertCell(6).innerHTML = hero.powerstats.durability;
    row.insertCell(7).innerHTML = hero.powerstats.power;
    row.insertCell(8).innerHTML = hero.powerstats.combat;
    row.insertCell(9).innerHTML = hero.appearance.race;
    row.insertCell(10).innerHTML = hero.appearance.gender;
    row.insertCell(11).innerHTML = hero.appearance.height;
    row.insertCell(12).innerHTML = hero.appearance.weight;
    row.insertCell(13).innerHTML = hero.biography.placeOfBirth;
    row.insertCell(14).innerHTML = hero.biography.alignment;
  });

  let header = table.createTHead();
  let headerRow = header.insertRow(0);
  for (let i = 0; i < headers.length; i++) {
    headerRow.insertCell(i).outerHTML = `<th>${headers[i]}</th>`;
    //cannot use innerhtml.. as it would be inserted as a <td>
    //  headerRow.insertCell(i).innerHTML = ;
  }

  document.body.append(table);
};

/**
 * Sorting HTML table.
 *
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column The index of the column to sort
 * @param {boolean} asc Determnes if the sorting will be in ascending
 */
function sortTableByColumn(table, column, asc = true) {
  const dirModifier = asc ? 1 : -1;
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));

  // Sort each row
  const sortedRows = rows.sort((a, b) => {
    let aColText = a
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();
    let bColText = b
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();

    if (aColText === "" && asc) {
      aColText = "zzzzz";
    }
    if (bColText === "" && asc) {
      bColText = "zzzzz";
    }

    if (aColText === "-" && asc) {
      aColText = "zzzzz";
    }
    if (aColText === "-" && !asc) {
      aColText = " ";
    }

    if (bColText === "-" && asc) {
      bColText = "zzzzz";
    }
    if (bColText === "-" && !asc) {
      bColText = " ";
    }

    if (aColText.includes("Galan")) {
      aColText = "Galan";
    }
    if (bColText.includes("Galan")) {
      bColText = "Galan";
    }

    // edge case for WEIGHT
    // split eg 980 lb,441 kg
    if (column === 12) {
      aColText = aColText.split(",")[0].split(" ")[0];
      // console.log("weight", aColText);
      if (aColText === "-" && asc === true) {
        aColText = Number.MAX_SAFE_INTEGER;
      } else if (aColText === "-" && asc === false) {
        aColText = Number.MIN_SAFE_INTEGER;
      }
      bColText = bColText.split(",")[0].split(" ")[0];
    }

    //sortingHeight
    if (column === 11) {
      aColText = getHeight(aColText, dirModifier);
      bColText = getHeight(bColText, dirModifier);
      // console.log(aColText)

      return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
    }

    // checks if value is a numeric, if so, it changes it to an int from a string
    if (isNumeric(aColText)) aColText = parseInt(aColText);
    if (isNumeric(bColText)) bColText = parseInt(bColText);

    return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
  });

  // Remove all existing TRs from the table
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  // Re-add the newly sorted rows
  tBody.append(...sortedRows);

  // Remember how the column is currently sorted
  table
    .querySelectorAll("th")
    .forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-asc", asc);
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-desc", !asc);
}

const addSortableListeners = () => {
  document.querySelectorAll(".Table-Heroes th").forEach((headerCell) => {
    // console.log(headerCell)
    if (headerCell.textContent.includes("ICON")) return; // Do not require the image column to be sortable
    headerCell.addEventListener("click", () => {
      const tableElement = headerCell.closest(".Table-Heroes");
      const headerIndex = Array.prototype.indexOf.call(
        headerCell.parentElement.children,
        headerCell
      );
      const currentIsAscending = headerCell.classList.contains("th-sort-asc");

      sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    });
  });
};

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

const getHeight = (str, direction) => {
  // console.log("khgg")
  let smallNum = -999999;
  let bigNum = 999999;
  /* 
    cases to consider for height
     "-,0 cm"
     "5'9,175 cm"
     "1000,304.8 meters"

     "Shaker Heights, Ohio" */

  if (str === "Shaker Heights, Ohio") {
    return direction == 1 ? bigNum : smallNum;
  }

  if (str === "-,0 cm") {
    return direction == 1 ? bigNum + 1 : smallNum - 1;
  }

  let temp = str.split(",")[1].split(" ");

  let numValue = parseInt(temp[0]);
  // let measurementValue= temp[1]

  if (str.includes("meters")) {
    numValue = 100 * numValue;
  }

  return numValue;
};

const tableSearch = () => {
  const element = document.getElementById("myTable");
  element.remove();
  buildTable(datab);
  let input = document.getElementById("searchBar");
  let filter = input.value.toUpperCase();
  let table = document.getElementById("myTable");
  let tr = table.getElementsByTagName("tr");
  let th = table.getElementsByTagName("th");

  for (i = 1; i < tr.length; i++) {
    tr[i].style.display = "none";
    for (let j = 0; j < th.length; j++) {
      td = tr[i].getElementsByTagName("td")[j];
      if (td) {
        if (td.innerHTML.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
          tr[i].style.display = "";
          break;
        }
      }
    }
  }

  addSortableListeners();
};
