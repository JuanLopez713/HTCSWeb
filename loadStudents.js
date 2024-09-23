// Purpose: Load student data from a JSON file and display it in the DOM.   
let studentsData = {};

function updateStudentLists() {
    for (let className in studentsData) {
        // clear existing list
        const classList = document.querySelector(`#${className} ul`);
        classList.innerHTML = '';

        // update block title
        const blockTitle = document.querySelector(`#${className} h2`);
        blockTitle.innerHTML = className.charAt(0).toUpperCase() + className.substring(1, 5) + " " + className.substring(5);

        // update list of students
        studentsData[className].forEach(student => {
            const li = document.createElement('li');

            li.innerHTML = `
                        <strong>${student.name}</strong><br>
                        <a href="${student.github}">GitHub</a> |`;

            if (student.website === "") {
                li.innerHTML += ` <a class="no-website" >Website</a>`;
            } else {
                li.innerHTML += `<a href="${student.website}">Website</a>`;
            }
            if (student.wallet === "") {
            } else {
                li.innerHTML += `<br>
            Crypto Wallet: ${student.wallet}`;
            }

            li.innerHTML += `<br>
            <span class="partner"></span><br><span class="assigned-repo"></span>`;

            classList.appendChild(li);
        });
    }
}

function assignPartners(className) {
    const students = [...studentsData[className]]; // Create a copy of the students array
    shuffleArray(students); // Shuffle the array to introduce randomness

    const pairs = [];
    const unpaired = [];

    for (let i = 0; i < students.length; i++) {
        const student = students[i];

        // Find a suitable partner
        const partner = students.find((s, index) => {
            return index > i && // Ensure we don't pair with already paired students
                Math.abs(s.rank - student.rank) <= 1 && // Check code difference
                !pairs.some(pair => pair.includes(s)); // Ensure the student isn't already paired
        });

        if (partner) {
            pairs.push([student, partner]);
        } else {
            unpaired.push(student);
        }
    }

    // Handle unpaired students
    while (unpaired.length >= 2) {
        pairs.push([unpaired.pop(), unpaired.pop()]);
    }

    // Update the DOM with partner information
    const classList = document.querySelector(`#${className} ul`);
    const listItems = classList.getElementsByTagName('li');

    for (let i = 0; i < listItems.length; i++) {
        const student = students[i];
        const partnerSpan = listItems[i].querySelector('.partner');

        const pair = pairs.find(p => p.includes(student));
        const partner = pair ? pair.find(s => s !== student) : null;

        partnerSpan.textContent = partner ? `Partner: ${partner.name}` : 'No partner assigned';
    }

    // If there's an odd number of students, display a message for the unpaired student
    if (unpaired.length === 1) {
        const unpairedStudent = unpaired[0];
        const unpairedSpan = Array.from(listItems).find(li => li.textContent.includes(unpairedStudent.name)).querySelector('.partner');
        unpairedSpan.textContent = 'No partner assigned (Choose a team to join)';
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function assignPartners(className) {
    const students = [...studentsData[className]]; // Create a copy of the students array
    shuffleArray(students); // Shuffle the array to introduce randomness

    const pairs = [];
    const unpaired = [];

    for (let i = 0; i < students.length; i++) {
        const student = students[i];

        // Find a suitable partner
        const partner = students.find((s, index) => {
            return index > i && // Ensure we don't pair with already paired students
                Math.abs(s.code - student.code) <= 1 && // Check rank difference
                !pairs.some(pair => pair.includes(s)); // Ensure the student isn't already paired
        });

        if (partner) {
            pairs.push([student, partner]);
        } else {
            unpaired.push(student);
        }
    }

    // Handle unpaired students
    while (unpaired.length >= 2) {
        pairs.push([unpaired.pop(), unpaired.pop()]);
    }

    // Update the DOM with partner information
    const classList = document.querySelector(`#${className} ul`);
    const listItems = classList.getElementsByTagName('li');

    for (let i = 0; i < listItems.length; i++) {
        const student = students[i];
        const partnerSpan = listItems[i].querySelector('.partner');

        const pair = pairs.find(p => p.includes(student));
        const partner = pair ? pair.find(s => s !== student) : null;

        partnerSpan.textContent = partner ? `Partner: ${partner.name}` : 'No partner assigned';
    }

    // If there's an odd number of students, display a message for the unpaired student
    if (unpaired.length === 1) {
        const unpairedStudent = unpaired[0];
        const unpairedSpan = Array.from(listItems).find(li => li.textContent.includes(unpairedStudent.name)).querySelector('.partner');
        unpairedSpan.textContent = 'No partner assigned (odd number of students)';
    }
}


function assignRepositories(className) {
    const students = studentsData[className];
    const n = students.length;

    // Create a copy of the students array to work with
    let availableStudents = [...students];

    // Shuffle the array to introduce randomness
    for (let i = availableStudents.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableStudents[i], availableStudents[j]] = [availableStudents[j], availableStudents[i]];
    }

    let assignments = new Map();
    let start = availableStudents[0];
    let current = start;

    while (availableStudents.length > 1) {
        // Find a suitable next student
        let next = availableStudents.find(s =>
            s !== current &&
            Math.abs(s.code - current.code) <= 1 &&
            s !== assignments.get(current)
        );

        // If no suitable student found, just pick the next available one
        if (!next) {
            next = availableStudents.find(s => s !== current && s !== assignments.get(current));
        }

        // Assign the repository
        assignments.set(current, next);

        // Remove the assigned student from the available list
        availableStudents = availableStudents.filter(s => s !== current);

        // Move to the next student
        current = next;
    }

    // Close the chain if possible
    if (!assignments.has(current) && current !== start) {
        assignments.set(current, start);
    }

    // Update the DOM with assignment information
    const classList = document.querySelector(`#${className} ul`);
    const listItems = classList.getElementsByTagName('li');

    for (let i = 0; i < listItems.length; i++) {
        const student = students[i];
        const assignedRepoSpan = listItems[i].querySelector('.assigned-repo');

        const assignedTo = assignments.get(student);

        if (assignedTo) {
            assignedRepoSpan.textContent = `Assigned to ${assignedTo.name}'s repository`;
        } else {
            assignedRepoSpan.textContent = 'No repository assigned';
        }
    }
}
// Fetch the JSON file and update the lists
fetch('students.json')
    .then(response => response.json())
    .then(data => {
        studentsData = data;
        updateStudentLists();
    })
    .catch(error => {
        console.error('Error fetching or parsing JSON:', error);
    });
