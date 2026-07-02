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

        if (!response.ok) {
            throw new Error("تعذر تحميل البيانات");
        }

        const data = await response.json();
        universitiesData = data.universities || [];

        if (universitiesData.length === 0) {
            resultBox.innerHTML = "لا توجد جامعات في قاعدة البيانات";
            return;
        }

        renderUniversities();

    } catch (error) {
        console.error(error);
        resultBox.innerHTML = "حدث خطأ أثناء تحميل بيانات الجامعات";
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

    formulaBox.innerHTML =
        `الثانوية ${track.highSchool}% + القدرات ${track.qudrat}%` +
        (track.tahseeli > 0 ? ` + التحصيلي ${track.tahseeli}%` : "");

    if (track.tahseeli > 0) {
        tahseeliField.style.display = "block";
    } else {
        tahseeliField.style.display = "none";
        tahseeliInput.value = "";
    }

}

function calculateAdmission() {

    const university = universitiesData[universitySelect.value];

    const track = university.tracks[trackSelect.value];

    const highSchool = parseFloat(highSchoolInput.value);

    const qudrat = parseFloat(qudratInput.value);

    const tahseeli = parseFloat(tahseeliInput.value || 0);

    if (isNaN(highSchool) || isNaN(qudrat)) {

        resultBox.innerHTML = "يرجى إدخال جميع الدرجات";

        return;

    }

    if (track.tahseeli > 0 && isNaN(parseFloat(tahseeliInput.value))) {

        resultBox.innerHTML = "يرجى إدخال درجة التحصيلي";

        return;

    }

    const score =
        (highSchool * track.highSchool / 100) +
        (qudrat * track.qudrat / 100) +
        (tahseeli * track.tahseeli / 100);

    resultBox.innerHTML =
        `
        <h2>${score.toFixed(2)}%</h2>
        <p>${university.name}</p>
        <p>${track.name}</p>
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
