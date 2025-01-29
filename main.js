document.addEventListener("DOMContentLoaded", function () {
    const grid = document.querySelector(".grid");
    const table = document.createElement("table");
    table.classList.add("time-grid");

    const headerRow = document.createElement("tr");
    const firstCell = document.createElement("th");
    headerRow.appendChild(firstCell);

    for (let hour = 0; hour < 24; hour++) {
        const timeCell = document.createElement("th");
        timeCell.textContent = hour.toString().padStart(2, '0') + ":00";
        headerRow.appendChild(timeCell);
    }

    table.appendChild(headerRow);

    const totalRows = Math.ceil(144 / 24);
    let buttonIndex = 0;

    for (let i = 1; i <= totalRows; i++) {
        const row = document.createElement("tr");
        const rowLabel = document.createElement("td");
        rowLabel.textContent = `${(i-1)*10} - ${i*10}`;
        row.appendChild(rowLabel);

        for (let j = 0; j < 24 && buttonIndex < 144; j++) {
            const cell = document.createElement("td");
            const button = document.createElement("button");
            button.classList.add("button");
            cell.appendChild(button);
            row.appendChild(cell);
            buttonIndex++;
        }

        table.appendChild(row);
    }

    grid.appendChild(table);

    let isMouseDown = false;
    let isTouchpad = false;

    function detectTouchpad(event) {
        isTouchpad = event.movementX !== 0 || event.movementY !== 0;
    }

    const gridItems = document.querySelectorAll('.button');

    gridItems.forEach(item => {
        item.addEventListener('mousedown', () => {
            isMouseDown = true;
            item.classList.add('selected');
        });

        item.addEventListener('mouseover', (event) => {
            if (isMouseDown && isTouchpad) {
                item.classList.add('selected');
            }
        });

        item.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        item.addEventListener('mouseleave', () => {
            if (!isMouseDown) {
                item.classList.remove('selected');
            }
        });

        item.addEventListener('mousemove', detectTouchpad);
    });

    const newEventBtn = document.getElementById('new-event-btn');
    const newEventForm = document.getElementById('new-event-form');
    const createEventBtn = document.getElementById('create-event-btn');
    const eventsContainer = document.getElementById('events-container');

    newEventBtn.addEventListener('click', function () {
        newEventForm.style.display = 'block';
    });

    createEventBtn.addEventListener('click', function () {
        const eventName = document.getElementById('event-name').value;
        const eventColor = document.getElementById('event-color').value;

        if (eventName && eventColor) {
            const newEventButton = document.createElement('button');
            newEventButton.textContent = eventName;
            newEventButton.style.backgroundColor = eventColor;
            newEventButton.classList.add('event-button');

            eventsContainer.appendChild(newEventButton);
        }

        newEventForm.style.display = 'none';
    });

    // Correct date display handling
    const currentDateElement = document.getElementById('current-date');
    let currentDate = new Date();

    function updateDateDisplay() {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        const formattedDate = currentDate.toLocaleDateString('en-US', options);
        currentDateElement.textContent = formattedDate;
    }

    document.getElementById('prev-date').addEventListener('click', function () {
        currentDate.setDate(currentDate.getDate() - 1);
        updateDateDisplay();
    });

    document.getElementById('next-date').addEventListener('click', function () {
        currentDate.setDate(currentDate.getDate() + 1);
        updateDateDisplay();
    });

    updateDateDisplay(); // Initial date display
});
