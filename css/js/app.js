let universitiesData = [];

const universitySelect = document.getElementById("university");
const trackSelect = document.getElementById("track");
const highSchoolInput = document.getElementById("highSchool");
const qudratInput = document.getElementById("qudrat");
const tahseeliInput = document.getElementById("tahseeli");
const tahseeliField = document.getElementById("tahseeliField");
const formulaBox = document.getElementById("formula");
const resultBox = document.getElementById("result");
const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");

async function loadUniversities() {
  try {
    const response = await fetch("data/universities.json");
    const data = await response.json();
    universitiesData = data.universities || [];
    renderUniversities();
  } catch (error) {
    resultBox.innerHTML = "تعذر تحميل بيانات الجامعات";
  }
}

function renderUniversities() {
  universitySelect.innerHTML = "";

  universitiesData.forEach((university, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = university.name;
    universitySelect.appendChild(option);
  });

  renderTracks();
}

function renderTracks() {
  const university = universitiesData[universitySelect.value];
  trackSelect.innerHTML = "";

  university.tracks.forEach((track, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = track.name;
    trackSelect.appendChild(option);
  });

  updateFormula();
}

function updateFormula() {
  const university = universitiesData[universitySelect.value];
  const track = university.tracks[trackSelect.value];

  let formula = `المعادلة: الثانوية ${track.highSchool}% + القدرات ${track.qudrat}%`;

  if (track.tahseeli > 0) {
    formula += ` + التحصيلي ${track.tahseeli}%`;
    tahseeliField.style.display = "block";
  } else {
    tahseeliField.style.display = "none";
    tahseeliInput.value = "";
  }

  formulaBox.innerHTML = formula;
}

function calculateAdmission() {
  const university = universitiesData[universitySelect.value];
  const track = university.tracks[trackSelect.value];

  const highSchool = parseFloat(highSchoolInput.value);
  const qudrat = parseFloat(qudratInput.value);
  const tahseeli = parseFloat(tahseeliInput.value || 0);

  if (isNaN(highSchool) || isNaN(qudrat)) {
    resultBox.innerHTML = "يرجى إدخال درجة الثانوية والقدرات";
    return;
  }

  if (track.tahseeli > 0 && isNaN(parseFloat(tahseeliInput.value))) {
    resultBox.innerHTML = "يرجى إدخال درجة التحصيلي";
    return;
  }

  if (
    highSchool < 0 || highSchool > 100 ||
    qudrat < 0 || qudrat > 100 ||
    tahseeli < 0 || tahseeli > 100
  ) {
    resultBox.innerHTML = "يجب أن تكون الدرجات بين 0 و 100";
    return;
  }

  const score =
    (highSchool * track.highSchool / 100) +
    (qudrat * track.qudrat / 100) +
    (tahseeli * track.tahseeli / 100);

  resultBox.innerHTML = `
    <div>${university.name}</div>
    <div>${track.name}</div>
    <div>النسبة: ${score.toFixed(2)}%</div>
  `;
}

function resetCalculator() {
  highSchoolInput.value = "";
  qudratInput.value = "";
  tahseeliInput.value = "";
  resultBox.innerHTML = "--";
}

universitySelect.addEventListener("change", renderTracks);
trackSelect.addEventListener("change", updateFormula);
calculateBtn.addEventListener("click", calculateAdmission);
resetBtn.addEventListener("click", resetCalculator);

loadUniversities();
