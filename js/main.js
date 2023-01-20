const btnScrollTop = document.querySelector('#myBtn')
const contactForm = document.querySelector('#contact-form')
const signupForm = document.querySelector('#signup-form')
const loginForm = document.querySelector('#login-form')
const hamburgerMenu = document.querySelector('.menu-btn')
const loggedIn = document.querySelector('.login-user')
const nav = document.querySelector('nav')


if (localStorage.getItem('user-loggedin')) {
    const parentEl = loggedIn.parentNode
    const button = document.createElement('button')
    button.className = 'btn btn-logout'
    const textNode = document.createTextNode('Logout')
    button.addEventListener('click', logout)
    button.appendChild(textNode)
    parentEl.insertBefore(button, loggedIn.nextSibling)
    loggedIn.remove()

}

function logout() {
    localStorage.removeItem('user-loggedin')
    window.location.reload()
}


if (btnScrollTop && btnScrollTop !== "undefined") {
    window.onscroll = function(){scroll()}
}


if (hamburgerMenu && hamburgerMenu !== "undefined") {
    hamburgerMenu.addEventListener('click', () => {
        document.querySelector('.mobile-nav').classList.toggle('show')
    })
}

function scroll() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 ) 
        btnScrollTop.style.display = "block"
    else 
        btnScrollTop.style.display = 'none' 
}


function topFunction() {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
}


const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

    // contact form submission
if (contactForm && contactForm !== "undefined") {
     contactForm.addEventListener('submit', async function(e){
            e.preventDefault()
            const [name, email, message] = [
                document.querySelector('#name').value,
                document.querySelector('#email').value,
                document.querySelector('#message').value,
            ]

            //simple validation
            if (!name || !email || !message) {
                   document.querySelector('.warning').classList.add('show')
                  document.querySelector('.warning').innerHTML = "All fields are required" 

                  setTimeout(() => {
                   document.querySelector('.warning').classList.remove('show')
                  }, 2000)
                  return
            }
            if (!validateEmail(email)) {
                  document.querySelector('.warning').classList.add('show')
                  document.querySelector('.warning').innerHTML = "Invalid email" 

                  setTimeout(() => {
                   document.querySelector('.warning').classList.remove('show')
                  }, 2000)
                  return
            }

            const data = {
                name,
                email,
                message
            }
             
            try {
                const response = await fetch('http://localhost:5000/api/create-message', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('user-loggedin')}`
                    }
                })

                if (response.ok) {
                    document.querySelector('.warning').classList.add('show')
                    document.querySelector('.warning').style.backgroundColor = 'green'
                    document.querySelector('.warning').innerHTML = "Message sent successfully" 
                    this.reset() 
                }else {
                    document.querySelector('.warning').classList.add('show')
                    document.querySelector('.warning').innerHTML = "Something went wrong" 

                }

            }catch(err) {
                alert('There was a problem submitting your form')
            }

    })

}

let brandUsers = []

if (signupForm && signupForm !== "undefined") {
        // register form submission
 signupForm.addEventListener('submit', async function(e){
            e.preventDefault()
            const [name, email, password] = [
                document.querySelector('#name').value,
                document.querySelector('#email').value,
                document.querySelector('#password').value,
            ]
            //simple validation
            if (!name || !email || !password) {
                  document.querySelector('.warning').classList.add('show')
                  document.querySelector('.warning').innerHTML = "All fields are required" 
                return
            }

             if (!validateEmail(email)) {
                  document.querySelector('.warning').classList.add('show')
                  document.querySelector('.warning').innerHTML = "Invalid email" 

                  setTimeout(() => {
                   document.querySelector('.warning').classList.remove('show')
                  }, 2000)
                  return
            }

            const newUser = {
                name, 
                email,
                password,
            }        

            await registerUser(newUser)
})
}
// Login user Form
if (loginForm && loginForm !== "undefined") {
    loginForm.addEventListener('submit', async function(e){
            e.preventDefault()
            const [email, password] = [
                document.querySelector('#email').value,
                document.querySelector('#password').value,
            ]
            //simple validation
            if (!email || !password) {
                document.querySelector('.warning').classList.add('show')
                document.querySelector('.warning').innerHTML = "All fields are required" 
                return
            }
             if (!validateEmail(email)) {
                  document.querySelector('.warning').classList.add('show')
                  document.querySelector('.warning').innerHTML = "Invalid email" 

                  setTimeout(() => {
                   document.querySelector('.warning').classList.remove('show')
                  }, 2000)
                  return
            }
            document.querySelector('.warning').classList.remove('show') 
        // Get password stored in local storage 
        const data = {
            email, 
            password
        }
        // login user
        await loginUser(data)
})
}

// user regisration
async function registerUser(data) {
    try {
    const response = await fetch('http://localhost:5000/api/user/signup', {
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    if (response.status === 400 && !response.ok) {
        const res = await response.text()
        const parsedErrorMessage = JSON.parse(res)
        document.querySelector('.warning').classList.add('show')
        document.querySelector('.warning').innerHTML = parsedErrorMessage.message
    }else {
        const data = await response.json()
        if (data.user.accessToken) {
            // decode token
            const tokenData = atob(data.user.accessToken.split('.')[1]) 
            // set credentials to local storage
            localStorage.setItem('user-loggedin', data.user.accessToken)
            localStorage.setItem('loggedin-user', tokenData)
            // parse json string
            const parsedTokenData = JSON.parse(tokenData)
            // redirect users
            if (parsedTokenData.role === "admin") return window.location.href = "/admin/index.html"
            return window.location.href="/blog.html"
        }
    }
    }catch(err){
        console.log('just', err.message)
    }
}

// login user
async function loginUser(data) {
    try {
    const response = await fetch('http://localhost:5000/api/user/login', {
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    if (response.status === 400 && !response.ok) {
        const res = await response.text()
        const parsedErrorMessage = JSON.parse(res)
         document.querySelector('.warning').classList.add('show')
        document.querySelector('.warning').innerHTML = parsedErrorMessage.message
    }else {
        const data = await response.json()
        if (data.user.accessToken) {
            // decode token
            const tokenData = atob(data.user.accessToken.split('.')[1]) 
            // set credentials to local storage
            localStorage.setItem('user-loggedin', data.user.accessToken)
            localStorage.setItem('loggedin-user', tokenData)
            // parse json string
            const parsedTokenData = JSON.parse(tokenData)
            // redirect users
            if (parsedTokenData.role === "admin") return window.location.href = "/admin/index.html"
            return window.location.href="/blog.html"
        }
    }
    }catch(err){
        console.log('just', err.message)
    }

}

