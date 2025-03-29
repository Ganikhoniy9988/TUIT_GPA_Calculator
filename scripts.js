// Centralized GPA calculation logic
function calculateGPA(grades) {
    let totalPoints = 0;
    let totalCredits = 0;

    grades.forEach(grade => {
        totalPoints += grade.points * grade.credits;
        totalCredits += grade.credits;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
}

// Multilingual texts
const texts = {
    uz: {
        headerTitle: "GPA Kalkulyator",
        question: "Nechta fan?",
        enter: "Kiritish",
        info: "O'tolmagan fanlaringizni kiritish shart emas",
        calculate: "Hisoblash",
        subjectHeader: "№",
        inputHeader: "Kredit / Baho",
        creditPlaceholder: "Kredit",
        gradePlaceholder: "Baho",
        supportLabel: "Murojaat uchun:",
        supportLink: "Ganikhoniy",
        courseLabel: "Kurs:",
        credits: "Kreditlar"
    },
    ru: {
        headerTitle: "GPA Калькулятор",
        question: "Сколько предметов?",
        enter: "Начать",
        info: "Предметы, которые вы не сдали вставлять не нужно",
        calculate: "Вычислить",
        subjectHeader: "№",
        inputHeader: "Кредит / Оценка",
        creditPlaceholder: "Кредит",
        gradePlaceholder: "Оценка",
        supportLabel: "Тех подержка:",
        supportLink: "Ganikhoniy",
        courseLabel: "Курс:",
        credits: "Кредиты"
    },
    en: {
        headerTitle: "GPA Calculator",
        question: "How many subjects?",
        enter: "Enter",
        info: "You don't need to enter subjects you didn't pass",
        calculate: "Calculate",
        subjectHeader: "№",
        inputHeader: "Credit / Grade",
        creditPlaceholder: "Credit",
        gradePlaceholder: "Grade",
        supportLabel: "Support:",
        supportLink: "Ganikhoniy",
        courseLabel: "Course:",
        credits: "Credits"
    }
};

let currentLang = "uz";
let semestrCredit = parseFloat(document.getElementById("courseSelect").value);

const elements = {
    langSelect: document.getElementById("langSelect"),
    headerTitle: document.getElementById("headerTitle"),
    questionLabel: document.getElementById("questionLabel"),
    enterButton: document.getElementById("enterButton"),
    infoText: document.getElementById("infoText"),
    tableContainer: document.getElementById("tableContainer"),
    calculateButton: document.getElementById("calculateButton"),
    gpaDisplay: document.getElementById("gpaDisplay"),
    creditInfo: document.getElementById("creditInfo"),
    courseLabel: document.getElementById("courseLabel"),
    courseInfo: document.getElementById("courseInfo"),
    subjectCountInput: document.getElementById("subjectCount"),
    courseSelect: document.getElementById("courseSelect"),
    supportLabelFixed: document.getElementById("supportLabelFixed"),
    supportLinkFixed: document.getElementById("supportLinkFixed"),
    logoImage: document.getElementById("logoImage"),
    languageImage: document.getElementById("languageImage")
};

document.addEventListener("DOMContentLoaded", function() {
    elements.gpaDisplay.style.display = "none"; // Ensure GPA display is hidden on page load
});

function updateLanguage() {
    const t = texts[currentLang];
    elements.headerTitle.textContent = t.headerTitle;
    elements.questionLabel.textContent = t.question;
    elements.enterButton.textContent = t.enter;
    elements.infoText.textContent = t.info;
    elements.calculateButton.textContent = t.calculate;
    elements.supportLabelFixed.textContent = t.supportLabel + " ";
    elements.supportLinkFixed.textContent = t.supportLink;
    elements.courseLabel.textContent = t.courseLabel;
    elements.courseInfo.textContent = `${elements.courseSelect.value} ${t.credits}`;
}

function updateTableHeaders() {
    const table = elements.tableContainer.querySelector("table");
    if (table) {
        const t = texts[currentLang];
        const headerCells = table.querySelectorAll("tr:first-child th");
        if (headerCells.length === 2) {
            headerCells[0].textContent = t.subjectHeader;
            headerCells[1].textContent = t.inputHeader;
        }
        const creditInputs = table.querySelectorAll("input.credit");
        const gradeInputs = table.querySelectorAll("input.grade");
        creditInputs.forEach(input => input.placeholder = t.creditPlaceholder);
        gradeInputs.forEach(input => input.placeholder = t.gradePlaceholder);
    }
}

function createTableRow(index, t) {
    return `
        <tr>
            <td>${index}</td>
            <td>
                <div class="input-group">
                    <input type="number" class="credit" placeholder="${t.creditPlaceholder}" min="0">
                    <input type="number" class="grade" placeholder="${t.gradePlaceholder}" min="0">
                </div>
                <div class="result"></div>
            </td>
        </tr>
    `;
}

function updateTableWithPreservedData(newCount) {
    const table = elements.tableContainer.querySelector("table");
    if (!table) return;

    const existingRows = Array.from(table.querySelectorAll("tr")).slice(1); // Exclude header row
    const t = texts[currentLang];
    const preservedData = existingRows.map(row => {
        const creditInput = row.querySelector("input.credit");
        const gradeInput = row.querySelector("input.grade");
        return {
            credit: creditInput.value || "",
            grade: gradeInput.value || ""
        };
    });

    const updatedData = preservedData.slice(0, newCount); // Trim data if reducing rows
    while (updatedData.length < newCount) {
        updatedData.push({ credit: "", grade: "" }); // Add empty rows if increasing
    }

    table.innerHTML = `
        <tr>
            <th>${t.subjectHeader}</th>
            <th>${t.inputHeader}</th>
        </tr>
        ${updatedData.map((data, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>
                    <div class="input-group">
                        <input type="number" class="credit" placeholder="${t.creditPlaceholder}" min="0" value="${data.credit}">
                        <input type="number" class="grade" placeholder="${t.gradePlaceholder}" min="0" value="${data.grade}">
                    </div>
                    <div class="result"></div>
                </td>
            </tr>
        `).join('')}
    `;
}

function handleEnterButtonClick() {
    const count = parseInt(elements.subjectCountInput.value);
    if (!count || count < 1 || count > 100) {
        alert(currentLang === "uz" ? "Iltimos, 1 dan 100 gacha bo'lgan son kiriting!" : currentLang === "ru" ? "Пожалуйста, введите число от 1 до 100!" : "Please enter a number between 1 and 100!");
        return;
    }

    const tableExists = elements.tableContainer.querySelector("table");
    if (tableExists) {
        updateTableWithPreservedData(count); // Update table while preserving data
    } else {
        const t = texts[currentLang];
        const table = document.createElement("table");
        table.innerHTML = `
            <tr>
                <th>${t.subjectHeader}</th>
                <th>${t.inputHeader}</th>
            </tr>
            ${Array.from({ length: count }, (_, i) => createTableRow(i + 1, t)).join('')}
        `;
        elements.tableContainer.appendChild(table);
    }

    // Hide the photo container
    const photoContainer = elements.tableContainer.querySelector("div");
    if (photoContainer) {
        photoContainer.style.display = "none"; // Hide the photo container
    }

    elements.calculateButton.style.display = "inline-block";
    elements.gpaDisplay.style.display = "none"; // Ensure GPA display is hidden initially
}

function handleCalculateButtonClick() {
    const table = elements.tableContainer.querySelector("table");
    if (!table) return;
    let totalCredits = 0;
    let sumCreditGrade = 0;
    const rows = table.querySelectorAll("tr");
    rows.forEach((row, i) => {
        if (i === 0) return; // Skip header row
        const creditInput = row.querySelector("input.credit");
        const gradeInput = row.querySelector("input.grade");
        let credit = parseFloat(creditInput.value) || 0;
        let grade = parseFloat(gradeInput.value) || 0;
        if (credit < 0) {
            alert(currentLang === "uz" 
                ? `Qator ${i}: Kredit salbiy kiritildi. Avtomatik tarzda musbatga o'zgartirildi.`
                : currentLang === "ru" 
                ? `Строка ${i}: Значение кредита отрицательное. Оно автоматически преобразовано в положительное.`
                : `Row ${i}: Credit value is negative. It has been automatically converted to positive.`);
            credit = Math.abs(credit);
            creditInput.value = credit;
        }
        if (grade < 0) {
            alert(currentLang === "uz" 
                ? `Qator ${i}: Baho noto'g'ri kiritildi. Avtomatik tarzda 2 ga o'zgartirildi.`
                : currentLang === "ru" 
                ? `Строка ${i}: Значение оценки некорректно. Оно установлено в 2.`
                : `Row ${i}: Grade value is incorrect. It has been set to 2.`);
            grade = 2;
            gradeInput.value = grade;
        }
        if (grade > 5) {
            alert(currentLang === "uz" 
                ? `Qator ${i}: Baho 5 dan katta kiritildi. Avtomatik tarzda 5 ga o'zgартирилди.`
                : currentLang === "ru" 
                ? `Строка ${i}: Оценка больше 5. Теперь установлено как 5.`
                : `Row ${i}: Grade is greater than 5. The value is now set to 5.`);
            grade = 5;
            gradeInput.value = grade;
        }
        totalCredits += credit;
        let creditGrade = (grade <= 2.0) ? 0 : credit * grade;
        sumCreditGrade += creditGrade;
        const resultDiv = row.querySelector(".result");
        resultDiv.textContent = creditGrade || "";
    });
    if (totalCredits > semestrCredit) {
        alert(currentLang === "uz" 
            ? `Kiritilgan kreditlar ${semestrCredit} dan oshib ketmasligi kerak!` 
            : currentLang === "ru" 
            ? `Сумма кредитов не должна превышать ${semestrCredit}!`
            : `The total credits entered should not exceed ${semestrCredit}!`);
        elements.creditInfo.textContent = "";
        elements.gpaDisplay.textContent = "";
        elements.gpaDisplay.style.display = "none"; // Ensure GPA display is hidden if invalid
    } else {
        const gpa = (sumCreditGrade / semestrCredit).toFixed(2);
        elements.gpaDisplay.textContent = `GPA: ${gpa}`;
        elements.creditInfo.textContent = currentLang === "uz" 
            ? `Jadvalga kiritilgan kredit: ${totalCredits}` 
            : currentLang === "ru" 
            ? `Выведенные кредиты из таблицы: ${totalCredits}`
            : `Credits entered in the table: ${totalCredits}`;
        elements.gpaDisplay.style.display = "block"; // Ensure GPA display is visible
    }
}

elements.langSelect.addEventListener("change", function() {
    currentLang = elements.langSelect.value;
    updateLanguage();
    if (elements.tableContainer.firstChild) {
        updateTableHeaders();
    }
    if (elements.calculateButton.style.display !== "none") {
        elements.calculateButton.click();
    }
});

elements.courseSelect.addEventListener("change", function() {
    semestrCredit = parseFloat(elements.courseSelect.value);
    elements.courseInfo.textContent = `${semestrCredit} ${texts[currentLang].credits}`;
});

document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle("dark");
    const isDarkMode = document.body.classList.contains("dark");
    const glowClass = isDarkMode ? 'glow-cyan' : 'glow-white';
    document.querySelectorAll('#header img[src="img/Logo.png"], #header img[src="img/language.png"], #header img[src="img/day-night.png"]').forEach(img => {
        img.classList.remove('glow-cyan', 'glow-white');
        img.classList.add(glowClass);
    });
});

elements.logoImage.addEventListener('click', function() {
    const currentCourse = parseInt(elements.courseSelect.value);
    const nextCourse = currentCourse === 240 ? 60 : currentCourse + 60;
    elements.courseSelect.value = nextCourse;
    elements.courseSelect.dispatchEvent(new Event('change'));
});

elements.languageImage.addEventListener('click', function() {
    const languages = ['uz', 'ru', 'en'];
    const currentLangIndex = languages.indexOf(currentLang);
    const nextLangIndex = (currentLangIndex + 1) % languages.length;
    elements.langSelect.value = languages[nextLangIndex];
    elements.langSelect.dispatchEvent(new Event('change'));
});

elements.enterButton.addEventListener("click", handleEnterButtonClick);
elements.calculateButton.addEventListener("click", handleCalculateButtonClick);

elements.subjectCountInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        handleEnterButtonClick();
    }
});

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add("dark");
}

if (/Mobi|Android/i.test(navigator.userAgent)) {
    document.body.classList.add("mobile");
}

updateLanguage();