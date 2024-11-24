document.getElementById('add-pros-button').addEventListener('click', async () => {
    const input = document.getElementById('pros-input').value
    if (input) {
        await saveToDatabase(input, 'http://localhost:3000/pro')
        document.getElementById('pros-input').value = ''
    }
    renderList(document.getElementById('pros-list'), 'http://localhost:3000/pro')
})
document.getElementById('add-cons-button').addEventListener('click', async () => {
    const input = document.getElementById('cons-input').value
    if (input) {
        await saveToDatabase(input, 'http://localhost:3000/con')
        document.getElementById('cons-input').value = ''
    }
    renderList(document.getElementById('cons-list'), 'http://localhost:3000/con')
})

async function saveToDatabase(content, route) {
    const id = generateUniqueId()
    const response = await fetch(route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, content })
    })
    if (!response.ok) {
        console.error('Failed to save to database')
    }
}

function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9)
}

async function getFromDatabase(route) {
    const response = await fetch(route)
    if (!response.ok) {
        console.error('Failed to get data from database')
        return []
    }
    return response.json()
}

async function renderList(list, route) {
    const data = await getFromDatabase(route)
    list.innerHTML = ''
    data.forEach(item => {
    const html = `
        <li>
        <span>${item.content}</span>
        <button onclick="updateItem('${route}', '${item.id}', '${item.content}', this.closest('ul'))">Update</button>
        <button onclick="deleteItem('${route}', '${item.id}', this.closest('ul'))">Delete</button>
        </li>
    `
    list.insertAdjacentHTML('beforeend', html)
    })
}

async function updateItem(route, id, content, list) {
    const newContent = prompt('Enter new content:', content)
    if (newContent) {
    await fetch(`${route}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent })
    })
    await renderList(list, route)
    }
}

async function deleteItem(route, id, list) {
    await fetch(`${route}/${id}`, {
    method: 'DELETE'
    })
    await renderList(list, route)
}

// Initial render of both lists
window.addEventListener('DOMContentLoaded', () => {
    renderList(document.getElementById('pros-list'), 'http://localhost:3000/pro')
    renderList(document.getElementById('cons-list'), 'http://localhost:3000/con')
})