import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDocs, collection, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCnUfHW7ZFMlAr7dCT6rN3hPiACME9hYYA",
    authDomain: "sandbox-bb9f2.firebaseapp.com",
    databaseURL: "https://sandbox-bb9f2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sandbox-bb9f2",
    storageBucket: "sandbox-bb9f2.firebasestorage.app",
    messagingSenderId: "118199686299",
    appId: "1:118199686299:web:02eef1d189e541eb8aa23e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const addButton = document.getElementById('add-btn');
const inputField = document.getElementById('todo-input');
const prioritySelect = document.getElementById('priority-select');
const todoList = document.getElementById('todo-list');

let userId = null;
let todoRef = null;

// Check if the user is logged in
onAuthStateChanged(auth, async (user) => {
    if (user) {
        userId = user.uid;
        todoRef = collection(db, 'users', userId, 'todolist');
        console.log('User logged in:', userId);

        // Load existing tasks from Firestore
        await loadTasks();
    } else {
        console.log('User not logged in');
        // Optionally, hide the todo list or show a login prompt
        todoList.innerHTML = "<p>Please log in to view your to-do list.</p>";
    }
});

// Load existing tasks from Firestore when the page loads
async function loadTasks() {
    if (!userId) return; // No user logged in, skip loading tasks

    const querySnapshot = await getDocs(todoRef);
    querySnapshot.forEach((doc) => {
        const task = doc.data();
        addTaskToUI(task, doc.id); // Add task to the UI
    });
}

// Add a new task to the Firestore and the UI
addButton.addEventListener('click', async function() {
    if (!userId) {
        console.error("User is not logged in.");
        return;
    }

    const taskText = inputField.value.trim();
    const priority = prioritySelect.value;
    if (taskText) {
        const taskData = {
            text: taskText,
            priority: priority,
            completed: false,
        };

        // Add task to Firestore
        const taskDocRef = await addDoc(todoRef, taskData);
        const taskId = taskDocRef.id;

        // Add task to UI
        addTaskToUI(taskData, taskId);

        inputField.value = ''; // Clear the input field
    }
});

// Function to create and append task to UI
function addTaskToUI(taskData, taskId) {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    // Check if the task is completed
    if (taskData.completed) {
        checkbox.checked = true;
        li.classList.add('completed');
    }

    checkbox.addEventListener('change', async function() {
        if (checkbox.checked) {
            li.classList.add('completed');
            await updateTaskStatus(taskId, true);
        } else {
            li.classList.remove('completed');
            await updateTaskStatus(taskId, false);
        }
    });

    const taskLabel = document.createElement('span');
    taskLabel.textContent = taskData.text;

    const priorityLabel = document.createElement('span');
    priorityLabel.textContent = taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1);
    priorityLabel.classList.add('priority');
    priorityLabel.classList.add(`priority-${taskData.priority}`);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', async function() {
        await deleteTask(taskId);
        li.remove(); // Remove task from UI
    });

    li.appendChild(checkbox);
    li.appendChild(taskLabel);
    li.appendChild(priorityLabel);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
}

// Update task status in Firestore (completed or not)
async function updateTaskStatus(taskId, completed) {
    const taskRef = doc(db, 'users', userId, 'todolist', taskId);
    await setDoc(taskRef, { completed: completed }, { merge: true });
}

// Delete task from Firestore
async function deleteTask(taskId) {
    const taskRef = doc(db, 'users', userId, 'todolist', taskId);
    await deleteDoc(taskRef);
}

// Allow adding tasks by pressing 'Enter'
inputField.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addButton.click();
    }
});