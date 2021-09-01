// Cache DOM Selection

const mainApp = document.querySelector('body');
const tasksList = document.querySelector('#tasks-list');
const noTasksTag = document.querySelector('#no-tasks-tag');
const inputBox = document.querySelector('#input-box');
const addTaskBtn = document.querySelector('#add-todo');
const themeBtn = document.querySelector('#change-theme');

const LOCAL_STORAGE_KEY = 'main.task.tracker'
const LOCAL_STORAGE_KEY__THEME = 'main.task.tracker.theme'
let theme = localStorage.getItem(LOCAL_STORAGE_KEY__THEME) || ''
let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

// Initializing

window.onload = () => {
	// Check task item count
	taskListCount(tasksList, noTasksTag)
	// Check the theme
	if (localStorage.getItem(LOCAL_STORAGE_KEY__THEME)) {
		setTheme(mainApp, localStorage.getItem(LOCAL_STORAGE_KEY__THEME))
	}
	// check ths tasks if any data is present
	if (tasks !== []) {
		renderList(tasksList, tasks)
	}
}

// Functions

const changeTheme = (component, currentTheme, nextTheme) => {
	// Theme change functionality
	if (component.classList.contains(currentTheme)) {
		component.classList.replace(currentTheme, nextTheme);
	}
	// Save the theme choice to local storage
	localStorage.setItem(LOCAL_STORAGE_KEY__THEME, nextTheme)
}

const setTheme = (component, theme) => {
	// Set the theme
	if (component.classList.contains('light')) {
		component.classList.remove('light')
		component.classList.add(theme)
	} else {
		component.classList.remove('dark')
		component.classList.add(theme)
	}
}

const taskListCount = (list, render) => {
	// Check if the number of elements in the list is greater than 2
	if (list.childElementCount > 0) {
		render.classList.add('tasks');
	} else {
		render.classList.remove('tasks');
	}
}

const addTodo = (value, arr) => {
	// control how todo is added
	const todo = {
		value,
		checked: false,
		id: Date.now()
	}
	arr.push(todo)
	renderTodo(todo, tasksList)
	updateStorage(tasks)
}

const checkItem = (id) => {
	// Get the node required
	const checkNode = tasksList.querySelector(`li[data-id='${id}']`)
	// Check if the node is already checked or not
	let index = tasks.findIndex(item => {
		return item.id === Number(checkNode.getAttribute('data-id'))
	})
	if (checkNode.classList.contains('checked-item')) {
		checkNode.classList.remove('checked-item')
		tasks[index].checked = false
	} else {
		checkNode.classList.add('checked-item')
		tasks[index].checked = true
	}
	updateStorage(tasks)
}

const removeItem = (id, list, arr) => {
	// Select the required node
	const removeNode = document.querySelector(`li[data-id='${id}']`)
	list.removeChild(removeNode)
	let newArr = arr.filter(item => {
		// Filter it off the existing tasks array
		return item.id !== Number(id)
	})
	tasks = newArr
	taskListCount(tasksList, noTasksTag)
	updateStorage(tasks)
}

const updateStorage = (arr) => {
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(arr))
}

const renderList = (list, arr) => {
	// populate the DOM list with the array data
	arr.forEach(todo => {
		renderTodo(todo, list)
	})
	taskListCount(tasksList, noTasksTag)
}

const renderTodo = (todo, list) => {
	// list components
	const node = document.createElement('li')
	const value = document.createElement('p')
	const appContainer = document.createElement('div')
	const checkIcon = document.createElement('i')
	const trashIcon = document.createElement('i')

	node.setAttribute('class', 'task-item')
	node.setAttribute('data-id', todo.id)
	appContainer.setAttribute('class', 'item-actions')
	checkIcon.setAttribute('class', 'ti ti-checks')
	trashIcon.setAttribute('class', 'ti ti-trash')

	node.addEventListener(
		'click',
		(event) => {
			if (event.target.classList.contains('ti-checks')) {
				// check if check icon was clicked
				checkItem(node.getAttribute('data-id'))
			}
			if (event.target.classList.contains('ti-trash')) {
				// check if trash icon was clicked
				removeItem(node.getAttribute('data-id'), tasksList, tasks)
			}
		},
		false
	)

	if (todo.checked) {
		// if todo is checked
		node.setAttribute('class', 'task-item checked-item')
	}

	value.textContent = todo.value
	appContainer.appendChild(checkIcon)
	appContainer.appendChild(trashIcon)
	node.appendChild(value).appendChild(appContainer)

	list.appendChild(node)
	taskListCount(tasksList, noTasksTag)
}

// Event Handlers

themeBtn.addEventListener (
	'click',
	() => {
		if (mainApp.classList.contains('dark')) {
			changeTheme(mainApp, 'dark', 'light')
		} else {
			changeTheme(mainApp, 'light', 'dark')
		}
	},
	false
)

addTaskBtn.addEventListener (
	'click',
	(event) => {
		// Prevent Default Behavior
		event.preventDefault();
		// Check if the input box is not empty
		if (inputBox.value.trim() !== '') {
			addTodo(inputBox.value, tasks)
			inputBox.value = '';
		}
	}
)