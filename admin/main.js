let myEditor


      ClassicEditor
                                .create( document.querySelector( '#editor' ) )
                                .then( editor => {
                                        console.log( editor.value);
                                        myEditor = editor

                                } )
                                .catch( error => {
                                        console.error( error );
                                } );



let updateEditor


      ClassicEditor
                                .create( document.querySelector( '#update-editor' ) )
                                .then( editor => {
                                        console.log( editor.value);
                                        updateEditor = editor

                                } )
                                .catch( error => {
                                        console.error( error );
                                } );



document.getElementById('create-post').addEventListener('click', () => {
    document.querySelector('.modal').style.display = 'block'
})

document.getElementById('message-card').addEventListener('click', async (e) => {
    e.preventDefault()
    document.querySelector('.message-modal').style.display = 'block'
    // fetch messages
    try {
          const response = await fetch('https://andela-capstone-api-production.up.railway.app/api/get-messages', {
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('user-loggedin')}`
            },
        })
        if (response.status === 200) {
            const messages = await response.json()
            console.log(messages, 'just message')
            let output = ''
            for (message of messages) {
                console.log(message, 'just message')
                output += `
                    <div style="background-color: #272727; color: #fff; padding: 10px">
                        <h5>${message.name}</h5> 
                        <p>${message.message}</p>
                        <small>${message.createdAt.slice(0, 10)}</small>
                        <hr style="background-color: yellow" />
                    </div>
                ` 
            }
            document.querySelector('#message-content').innerHTML = output


        }
    }catch(err) {
        console.log(err.message)
    }
})




document.querySelector('.close').addEventListener("click", () => {
    document.querySelector('.modal').style.display = 'none'
})

document.querySelector('#message-close').addEventListener("click", () => {
    document.querySelector('.message-modal').style.display = 'none'
})

document.querySelector('.update-close').addEventListener("click", () => {
    document.querySelector('.update-modal').style.display = 'none'
})



const blogForm = document.querySelector('#blog-form')
const blogImg = document.querySelector('#blog-img')
const updatedImg = document.querySelector('#updated-img')
const update = document.querySelector('#update-form')

let blogimgUrl = ''
let updatedImgUrl = ''

blogImg.addEventListener('change', () => {
    const fr = new FileReader()
    fr.readAsDataURL(blogImg.files[0])

    fr.addEventListener('load', () => {
        const url = fr.result
        blogimgUrl = url
    })
})

updatedImg.addEventListener('change', () => {
    const fr = new FileReader()
    fr.readAsDataURL(updatedImg.files[0])

    fr.addEventListener('load', () => {
        const url = fr.result
        updatedImgUrl = url
    })
})


blogForm.addEventListener('submit', async (e) => {
  e.preventDefault()

const title = document.getElementById('title').value
const author = document.getElementById('author').value
const htmlParsed =  myEditor.getData().replace(/<\/?[^>]+(>|$)/g, "")

if (!title ||  !author || !htmlParsed) {
     document.querySelector('.warning').classList.add('show')
    document.querySelector('.warning').innerHTML = "Cannot post empty fields" 
    document.querySelector('.modal').style.display = 'none'


                  setTimeout(() => {
                   document.querySelector('.warning').classList.remove('show')
                }, 3000)
                  return
}

// save to locastorage
const myBlog = {
    title,
    author,
    content: htmlParsed,
    imgUrl: blogimgUrl
}


try {
     const response = await fetch('https://andela-capstone-api-production.up.railway.app/api/posts', {
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('user-loggedin')}`
            },
            body: JSON.stringify(myBlog)
        })
    
     console.log(response, 'just reponse')
}catch(err){
    console.log(err)
}
     // call getBlogs function after save
    await getBlogs()
    getBlogsLength()
})


async function getBlogs() {
    const tableBody = document.querySelector('#table-body')

     try {
        const response = await fetch('https://andela-capstone-api-production.up.railway.app/api/posts', {
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('user-loggedin')}`
            },
        })
        if (response.status === 200) {
            const { posts: savedBlogs } = await response.json()
        let output = ''  
    savedBlogs.forEach(blog => {
        output += `
        <tr>
             <td>${blog.title}</td>
            <td>${blog.author}</td>
            <td>${blog.createdAt.slice(0, 10)}</td>
            <td><button id=${blog._id} onclick="viewBlog(this)" type="button" class="btn btn-sm btn-primary">
                <i class="fa-solid fa-book-open-reader"></i>
            </button></td>
             <td><button id=${blog._id} type="button" class="btn btn-sm btn-primary"  onclick="deleteBlog(this)">
                <i class="fa-solid fa-trash"></i>
                
            </button></td>
              <td><button id=${blog._id} onclick="updateBlog(this)" type="button" class="btn btn-sm btn-primary">
                <i class="fa-solid fa-pencil"></i>
            </button></td>
        <tr>
        `
    })

    tableBody.innerHTML = output
        }
     }catch(err){
        console.log(err.message)
     }

    // fetch blogs
    const tr = document.createElement('tr') 

  
}

const postsCount = document.getElementById('posts-count')

async function getBlogsLength(){
    try {
        const response = await fetch('https://andela-capstone-api-production.up.railway.app/api/posts-count', {
             headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('user-loggedin')}`
            },
        })
        if (response.status === 200) {
            const data = await response.json()
            console.log('my data', data)
            document.getElementById('posts-counter').innerHTML = data.postCount
        }
    }catch(err) {
        console.log(err.message)
    }
}

async function getUsersCount(){
    try {
        const response = await fetch('https://andela-capstone-api-production.up.railway.app/api/users-count', {
             headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('user-loggedin')}`
            },
        })
        if (response.status === 200) {
            const data = await response.json()
            console.log('my data', data)
            document.getElementById('users-counter').innerHTML = data.usersCount
        }
    }catch(err) {
        console.log(err.message)
    }
}

// fetch blogs from backend
document.addEventListener('DOMContentLoaded', async () => {
    await getBlogs()
    await getBlogsLength()
    await getUsersCount()
})



async function deleteBlog(e) {
    const blogId = e.id
    alert("Are you sure?")
    try {
        const response = await fetch(`https://andela-capstone-api-production.up.railway.app/api/posts/${blogId}`, {
            method: 'DELETE',
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('user-loggedin')}`
            },
        })
     await getBlogs()    
    }catch(err) {
        console.log(err.message)
    }
    getBlogsLength()
}



function updateBlog(e) {
    const blogId = e.id
    document.querySelector('.update-modal').style.display = 'block' 
    const blogPosts = JSON.parse(localStorage.getItem('admin-blog')) 

    update.addEventListener('submit', async (e) => {
        e.preventDefault()
        const title = document.getElementById('update-title').value
        const author = document.getElementById('update-author').value  
        const htmlParsed =  updateEditor.getData().replace(/<\/?[^>]+(>|$)/g, "")

        const updated = {
            title,
            author,
            imgUrl: updatedImgUrl,
            content: htmlParsed, 
        }
       
        try {
        const response = await fetch(`https://andela-capstone-api-production.up.railway.app/api/posts/${blogId}`, {
            method: 'PATCH',
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('user-loggedin')}`
            },
            body: JSON.stringify(updated)
        })

        await getBlogs()         

        }catch(err){
            console.log(err.message)
        }


    })
}


function viewBlog(e) {
    const blogId = e.id
    window.location.href=`../articles.html?id=${blogId}`

}


