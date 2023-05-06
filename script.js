const apikey = '7401458e-f2e9-43c5-8b3d-5ec5c3963e91';
const apihost = 'https://todo-api.coderslab.pl';

function apiListTasks() {
    return fetch(apihost + '/api/tasks', {
        headers: {Authorization: apikey}
    }).then(function (resp) {
        if (!resp.ok) {
            alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
        }
        return resp.json();
    });
}

function apiListOperationsForTask(taskId) {
    return fetch(apihost + `/api/tasks/${taskId}/operations`, {
        headers: {Authorization: apikey}
    }).then(function (resp) {
        if (!resp.ok) {
            alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
        }
        return resp.json();
    });
}

function apiCreateTask(title, description) {
    return fetch(apihost + '/api/tasks', {
        headers: {
            'Authorization': apikey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: title, description: description, status: 'open'}),
        method: 'POST'
    }).then(function (resp) {
        if (!resp.ok) {
            alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
        }
        return resp.json();
    });
}

function apiDeleteTask(taskId) {
    return fetch(apihost + `/api/tasks/${taskId}`, {
        headers: {Authorization: apikey},
        method: 'DELETE'
    }).then(function (resp) {
        if (!resp.ok) {
            alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
        }
        return resp.json();
    });
}

function apiCreateOperationForTask(taskId, description) {
    return fetch(apihost + `/api/tasks/${taskId}/operations`, {
        headers: {
            'Authorization': apikey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({description: description, timeSpent: 0}),
        method: 'POST'
    }).then(function (resp) {
        if (!resp.ok) {
            alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
        }
        return resp.json();
    });
}

function apiUpdateOperation(operationId, description, timeSpent) {
    return fetch(apihost + `/api/operations/${operationId}`, {
        headers: {
            'Authorization': apikey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({description: description, timeSpent: timeSpent}),
        method: 'PUT'
    }).then(function (resp) {
        if (!resp.ok) {
            alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
        }
        return resp.json();
    });
}

function apiDeleteOperation(operationId) {
    return fetch(apihost + `/api/operations/${operationId}`, {
        headers: {Authorization: apikey},
        method: 'DELETE'
    }).then(function (resp) {
        if (!resp.ok) {
            alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
        }
        return resp.json();
    });
}

function apiUpdateTask(taskId, title, description, status) {
    return fetch(apihost + `/api/tasks/${taskId}`, {
        headers: {
            'Authorization': apikey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: title, description: description, status: status}),
        method: 'PUT'
    }).then(function (resp) {
        if (!resp.ok) {
            alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
        }
        return resp.json();
    });
}

function renderTask(taskId, title, description, status) {
    const section = document.createElement('section');
    section.classList = 'card mt-5 shadow-sm';
    document.querySelector('main#app').appendChild(section);

    const headerDiv = document.createElement('div');
    headerDiv.classList = 'card-header d-flex justify-content-between align-items-center';
    section.appendChild(headerDiv);

    const headerLeftDiv = document.createElement('div')
    headerDiv.appendChild(headerLeftDiv);

    const h5 = document.createElement('h5');
    h5.innerText = title;
    headerLeftDiv.appendChild(h5);

    const h6 = document.createElement('h6');
    h6.classList = 'card-subtitle text-muted';
    h6.innerText = description;
    headerLeftDiv.appendChild(h6);

    const headerRightDiv = document.createElement('div');
    headerDiv.appendChild(headerRightDiv);

    if (status === 'open') {
        const finishButton = document.createElement('button');

        finishButton.classList = 'btn btn-dark btn-sm js-task-open-only';
        finishButton.innerText = 'Finish';
        headerRightDiv.appendChild(finishButton);
        finishButton.addEventListener('click', function () {
            apiUpdateTask(taskId, title, description, 'closed')
                .then(function () {
                    let elementsToDelete = section.querySelectorAll('.js-task-open-only');
                    elementsToDelete.forEach(element => element.parentElement.removeChild(element));
                });
        });
    }

    const deleteButton = document.createElement('button');
    deleteButton.classList = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'Delete'
    headerRightDiv.appendChild(deleteButton);
    deleteButton.addEventListener('click', function () {
        apiDeleteTask(taskId).then(function () {
                section.parentElement.removeChild(section);
            }
        );
    });

    const ulList = document.createElement('ul');
    ulList.classList = 'list-group list-group-flush';
    section.appendChild(ulList);

    apiListOperationsForTask(taskId).then(function (response) {
        response.data.forEach(function (operation) {
            renderOperation(ulList, status, operation.id,
                operation.description, operation.timeSpent);
        });
    });

    if (status === 'open') {
        const formDiv = document.createElement('div');
        formDiv.classList = 'card-body js-task-open-only';
        section.appendChild(formDiv);

        const formAddOperation = document.createElement('form');
        formDiv.appendChild(formAddOperation);
        formDiv.appendChild(formAddOperation);
        formAddOperation.addEventListener('submit', function (event) {
            event.preventDefault();
            if (formInput.value) {
                apiCreateOperationForTask(taskId, formInput.value).then(
                    function (operation) {
                        renderOperation(ulList, status, operation.data.id,
                            operation.data.description, operation.data.timeSpent);
                    }
                );
            }
            formInput.value = '';
        })

        const formInternalDiv = document.createElement('div');
        formInternalDiv.classList = 'input-group';
        formAddOperation.appendChild(formInternalDiv);

        const formInput = document.createElement('input');
        formInput.classList = 'form-control';
        formInput.type = 'text'
        formInput.placeholder = 'Operation description';
        formInput.minLength = 5;
        formInternalDiv.appendChild(formInput);

        const formInternalDivButtonDiv = document.createElement('div');
        formInternalDivButtonDiv.classList = 'input-group-append';
        formInternalDiv.appendChild(formInternalDivButtonDiv);

        const formAddButton = document.createElement('button');
        formAddButton.classList = 'btn btn-info';
        formAddButton.innerText = 'Add';
        formInternalDivButtonDiv.appendChild(formAddButton);
    }
}

function renderOperation(operationList, status, operationId, operationDescription, timeSpent) {
    const li = document.createElement('li');
    li.classList = 'list-group-item d-flex justify-content-between align-items-center';
    operationList.appendChild(li);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.innerText = operationDescription;
    li.appendChild(descriptionDiv);

    const time = document.createElement('span');
    time.classList = 'badge badge-success badge-pill ml-2';
    time.innerText = timeFormat(timeSpent);
    descriptionDiv.appendChild(time);

    if (status === 'open') {
        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList = 'js-task-open-only';
        li.appendChild(buttonsDiv);

        const button15m = document.createElement('button');
        button15m.classList = 'btn btn-outline-success btn-sm mr-2';
        button15m.innerText = '+15m';
        buttonsDiv.appendChild(button15m);
        button15m.addEventListener('click', function () {
            apiUpdateOperation(operationId, operationDescription, timeSpent + 15)
                .then(function (response) {
                    time.innerText = timeFormat(response.data.timeSpent);
                    timeSpent = response.data.timeSpent
                });
        });

        const button60m = document.createElement('button');
        button60m.classList = 'btn btn-outline-success btn-sm mr-2';
        button60m.innerText = '+1h';
        buttonsDiv.appendChild(button60m);
        button60m.addEventListener('click', function () {
            apiUpdateOperation(operationId, operationDescription, timeSpent + 60)
                .then(function (operation) {
                    time.innerText = timeFormat(operation.data.timeSpent);
                    timeSpent = operation.data.timeSpent
                });
        });

        const buttonDelete = document.createElement('button');
        buttonDelete.classList = 'btn btn-outline-danger btn-sm';
        buttonDelete.innerText = 'Delete'
        buttonsDiv.appendChild(buttonDelete);
        buttonDelete.addEventListener('click', function () {
            apiDeleteOperation(operationId)
                .then(function () {
                    operationList.removeChild(li);
                });
        });
    }
}

function timeFormat(time) {
    let finalTime;
    let hours = 0;
    while (time >= 60) {
        hours++;
        time -= 60;
    }
    if (hours > 0) {
        finalTime = `${hours}h ${time}m`;
    } else {
        finalTime = `${time}m`;
    }
    return finalTime
}

// MAIN ---------------------------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    let formAddTask = document.querySelector('form.js-task-adding-form');

    apiListTasks().then(function (response) {
        response.data.forEach(function (task) {
            console.log(task)
            renderTask(task.id, task.title, task.description, task.status);
        });
    });

    formAddTask.addEventListener('submit', function (event) {
        event.preventDefault();
        let title = formAddTask.querySelector("input[name='title']")
        let description = formAddTask.querySelector("input[name='description']")
        console.log(title)
        if (title.value) {
            apiCreateTask(title.value, description.value)
                .then(function (response) {
                    renderTask(response.data.id, response.data.title,
                        response.data.description, response.data.status);
                });
        }
        title.value = '';
        description.value = '';
    });
});
