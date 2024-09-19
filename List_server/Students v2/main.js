//Работа с cервером
const server = 'http://localhost:3000'

//Добавление студентов с сервера
async function serverAddStudent(obj) {
    let response = await fetch(server + '/api/students', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj),
    })

    let data = await response.json()

    return data
}

//Получение студентов с сервера
async function serverGetStudent() {
  let response = await fetch(server + '/api/students', {
    method: "GET",
    headers: { 'Content-Type': 'application/json' },
  })

  let data = await response.json()

  return data
}

//Удаление студентов с сервера
async function serverDeleteStudent(id) {
  let response = await fetch(server + '/api/students/' + id, {
    method: "DELETE",
  })

  let data = await response.json()

  return data
}

//Массив студентов в рот его ебать
let serverData = await serverGetStudent()

let studentsList = []

if(serverData) {
  studentsList = serverData
}

//Функция получения ФИО
function getFio(surname, name, lastname) {
    return surname + ' ' + name + ' ' + lastname;
}

//Дата рождения и возраст студента
function getBirthDate(birthday) {
    const yyyy = birthday.getFullYear();
    let mm = birthday.getMonth() + 1;
    let dd = birthday.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) dd = '0' + mm;

    return dd + '.' + mm + '.' + yyyy;
}

function getAge(birthday) {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    let m = today.getMonth() - birthday.getMonth();
    if ( m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--
    };
    return age;
}

//Период обучения и номер курса студента
function getStudePeriod(studyStart) {
    const today = new Date();
    let date = today.getFullYear()
    if ((studyStart + 4) >= date) {
        return studyStart + ' - ' + date
    } else
    return studyStart + ' - ' + (studyStart + 4)
}

function getCourse(studyStart) {
    const today = new Date();
    let date = today.getFullYear()
    if((date - studyStart) === 1) {
        return ' ( 1 Курс )'
    } else if ((date - studyStart) === 2) {
        return ' ( 2 Курс )'
    } else if ((date - studyStart) === 3) {
        return ' ( 3 Курс )'
    } else
        return ' ( Закончил )'
}

//Получаем тр студента
function $getNewStudentTR(studeObj) {
    const $tr = document.createElement('tr')
    const $tdFio = document.createElement('td')
    const $tdFaculty = document.createElement('td')
    const $tdBirthday = document.createElement('td')
    const $tdStudyStart = document.createElement('td')
    const $tdDelete = document.createElement('td')
    const $btnDelete = document.createElement('button')

    $btnDelete.classList.add('btn', 'btn-danger')
    $btnDelete.textContent = 'Удалить'

    $tdFio.textContent = getFio(studeObj.surname, studeObj.name, studeObj.lastname)
    $tdBirthday.textContent = getBirthDate(new Date(studeObj.birthday)) + ' (' + getAge(new Date(studeObj.birthday)) + ' лет)'
    $tdFaculty.textContent = studeObj.faculty
    $tdStudyStart.textContent = getStudePeriod(studeObj.studyStart) + getCourse(studeObj.studyStart)
    $tdDelete.append($btnDelete)

    $btnDelete.addEventListener('click', async function(){
      await serverDeleteStudent(studeObj.id)
      $tr.remove()
    })

    $tr.append($tdFio, $tdFaculty, $tdBirthday, $tdStudyStart, $tdDelete)

    return $tr
}

//Переменная достающая заголовок таблицы
const $studentListThAll = document.querySelectorAll('.table th')

//Сортируем массив объектов (функция возвращает отсортированный массив)
let column = 'surname',
    columnDir = false

function getSortStudents(arr, prop, dir) {
    return arr.sort((a,b) => (!dir ? a[prop] < b[prop] : a[prop] > b[prop]) ? -1 : 1)
}

//Валидация формы
function valid(form) {

    function removeError(input) {
        const parent = input.parentNode

        if (parent.classList.contains('error')) {
            parent.querySelector('.error-lable').remove()
            parent.classList.remove('error')
        }
    }

    function error(input, text) {
        const parent = input.parentNode
        const errorLable = document.createElement('lable')

        errorLable.classList.add('error-lable')
        errorLable.textContent = text

        parent.classList.add('error')

        parent.append(errorLable)
    }

    let result = true

    form.querySelectorAll('input').forEach(input => {

        removeError(input)

//Проверка года начала обучения
        if(input.dataset.min){

            if (input.value <= input.dataset.min) {
                removeError(input)
                error(input, 'Дата не может быть меньше 2000 года')
                result = false
            }
        }

//Проверка заполнености формы
        if (input.value == '') {
            removeError(input)
            error(input, 'Заполните поле!')
            result = false
        }
    })

    return result
}

//Цикл для вывода студентов из объекта в таблицу
function render(arr) {
    let coppyArr = [...arr]

    coppyArr = getSortStudents(studentsList, column, columnDir)

    const $tableBody = document.getElementById('table_body')
    $tableBody.innerHTML = ' '

    for (const studeObj of coppyArr) {
        const $newTr = $getNewStudentTR(studeObj)

        $tableBody.append($newTr)
    }
}

render(studentsList)

//Слухач отрисовки по нажатию на кнопку
document.getElementById('add-student').addEventListener('submit',async function(event) {
    event.preventDefault()

    if (valid(this) == true) {
        let newStudentObj = {
            name : document.getElementById('input-name').value,
            lastname: document.getElementById('input-lastname').value,
            surname: document.getElementById('input-surname').value,
            birthday: new Date(document.getElementById('input-birthDate').value),
            faculty: document.getElementById('input-faculty').value,
            studyStart: Number(document.getElementById('input-studyStart').value)
            }
            let serverDataObj = await serverAddStudent(newStudentObj)
            serverDataObj.birthday = new Date(serverDataObj.birthday)

            studentsList.push(serverDataObj)
    }

    document.querySelectorAll("input").forEach(input => input.value = "");
    render(studentsList)
})


//Слухач для сортировки таблицы по клику на заголовок
$studentListThAll.forEach(element => {
    element.addEventListener('click', function(){
        column = this.dataset.column;
        columnDir = !columnDir
        render(studentsList)
    })
})

//Поиск студентов в списке
function srcStudent(arr, prop, value) {
    let studentsListSrc = []

    if (prop === 'studeEnd') {
    studentsListSrc = arr.filter(x => {
        const studEnd = String(x['studyStart'] + 4)
        return studEnd.includes(value)}
    )
    } else {
        for (const item of arr) {
            if (String(item[prop]).includes(value) == true)
                studentsListSrc.push(item)
        }
    }
    return studentsListSrc
}

//Функция рендера и добавления в таблицу списка студентов с фильтром
function renderSrc(arr) {
    const $tableBody = document.getElementById('table_body')
    $tableBody.innerHTML = ''

    const srcName = document.getElementById('src-name').value,
        srcLastname = document.getElementById('src-lastname').value,
        srcSurname = document.getElementById('src-surname').value,
        srcFaculty = document.getElementById('src-faculty').value,
        srcStudyStart = document.getElementById('src-studyStart').value,
        srcStudeEnd = document.getElementById('src-studeEnd').value

    if(srcName !== '') arr = srcStudent(studentsList, 'name', srcName)
    if(srcSurname !== '') arr = srcStudent(studentsList, 'surname', srcSurname)
    if(srcLastname !== '') arr = srcStudent(studentsList, 'lastname', srcLastname)
    if(srcFaculty !== '') arr = srcStudent(studentsList, 'faculty', srcFaculty)
    if(srcStudyStart !== '') arr = srcStudent(studentsList, 'studyStart', srcStudyStart)
    if(srcStudeEnd !== '') arr = srcStudent(studentsList, 'studeEnd', srcStudeEnd)

    for (const studeObj of arr) {
        const $newTr = $getNewStudentTR(studeObj)

        $tableBody.append($newTr)
    }
}

//Слухач на кнопку поиска отфильтрованного списка
document.getElementById('src-student').addEventListener('submit', function(event){
    event.preventDefault()

    renderSrc(studentsList)
})
