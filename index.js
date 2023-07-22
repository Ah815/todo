import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js'
import {
    getDatabase,
    ref,
    push,
    onValue,
    child,
    set,
    query,
    equalTo,
    get,
    orderByChild,
    update,
    remove
  } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js'


const firebaseConfig = {
    apiKey: "AIzaSyALSxXRXQ8h3Dd6nZ2VgOhdxjqeN0iYJlQ",
    authDomain: "todo-app-99928.firebaseapp.com",
    databaseURL: "https://todo-app-99928-default-rtdb.firebaseio.com",
    projectId: "todo-app-99928",
    storageBucket: "todo-app-99928.appspot.com",
    messagingSenderId: "1027068996920",
    appId: "1:1027068996920:web:e1f88cb6a7cf50d37ea5cd",
    measurementId: "G-54RDJK7Z6M"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app)
const loader = document.getElementById('loader')
const content_container = document.getElementById('content_container')
const login_container = document.getElementById('login_container')
const registerBtn = document.getElementById('register_btn')
const loginBtn = document.getElementById('login_btn')
const logoutBtn = document.getElementById('logout')
const submitTodo = document.getElementById('submit_todo')
const todo_container = document.getElementById('todo_container')

onAuthStateChanged(auth, user => {
  if (user) {
    const uid = user.uid
    console.log('user.uid->', user.uid)
    loader.style.display = 'none'
    content_container.style.display = 'block'
    login_container.style.display = 'none'
    getTodos()
    // ...
  } else {
    // User is signed out
    console.log('user mojood nahn he')
    loader.style.display = 'none'
    login_container.style.display = 'block'
    content_container.style.display = 'none'
    // ...
  }
})


var register_btn = document.getElementById('register_btn')
register_btn.addEventListener('click', RegisterUser)
function RegisterUser() {
    var email = document.getElementById('email')
    var password = document.getElementById('password')
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User in")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        })
}


const loginUser = async () => {
    var email = document.getElementById('email_log').value
    var password = document.getElementById('password_log').value
    try {
        const repsonse = await signInWithEmailAndPassword(auth, email, password)
        console.log(repsonse.user)
    } catch (e) {
        console.log(e.message)
    }
}
var signup_btn = document.getElementById('login_btn')
signup_btn.addEventListener('click', loginUser)



function logout () {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch(error => {
        // An error happened.
      })
  }
  
  function submitTodoFunc () {
    const todo = document.getElementById('todo_input').value
    if (!todo) return alert('Please add some todo')
    const todoListRef = ref(db, `todos/${auth.currentUser.uid}`)
    const newTodoRef = push(todoListRef)
    const obj = {
      todo,
      status: 'pending'
    }
    set(newTodoRef, obj)
    document.getElementById('todo_input').value = ''
  }
  
  function getTodos () {
    const todoListRef = ref(db, `todos/${auth.currentUser.uid}`)
    onValue(todoListRef, snapshot => {
      const isDataExist = snapshot.exists()
      if (isDataExist) {
        todo_container.innerHTML = null
        snapshot.forEach(childSnapshot => {
          const childKey = childSnapshot.key
          const childData = childSnapshot.val()
          console.log('childKey=>', childKey)
          console.log('childData=>', childData)
          const listItem = `<li id = ${childKey}> ${
            childData.todo
          } <button id =${childKey +
            '-edit'}>Edit</button> <button id =${childKey +
            '-del'}>Delete</button> </li>`
          todo_container.innerHTML += listItem
          setTimeout(() => {
            const editbtn = document.getElementById(childKey + '-edit')
            editbtn.addEventListener('click', editFunc)
            const deleteBtn = document.getElementById(childKey + '-del')
            deleteBtn.addEventListener('click', deleteFunc)
          }, 1000)
        })
      }
    })
  }
  
  function editFunc () {
    const elementId = this.id.slice(0, this.id.length - 5)
    const todoRef = ref(db, `todos/${auth.currentUser.uid}/${elementId}`)
    let newTodo = prompt('Edit your todo', this.parentNode.firstChild)
    update(todoRef, { status: newTodo })
  }
  
  function deleteFunc () {
    const elementId = this.id.slice(0, this.id.length - 4)
    console.log(this.id.slice(0, this.id.length - 4))
    const todoRef = ref(db, `todos/${auth.currentUser.uid}/${elementId}`)
    remove(todoRef)
  }
