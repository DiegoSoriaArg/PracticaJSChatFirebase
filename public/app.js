const botones = document.querySelector('#botones')
const nombreUsuario = document.querySelector('#nombreUsuario')
const contenidoProtegido = document.querySelector('#contenidoProtegido')
const formulario = document.querySelector('#formulario')
const inputChat = document.querySelector('#inputChat')

firebase.auth().onAuthStateChanged( user => {
    
    if (user) {
        console.log(user)
        botones.innerHTML = /*html*/`
            <button class="btn btn-outline-danger" id="btnCerrar" >Cerrar Sesion</button>
        `
        nombreUsuario.innerHTML = user.displayName
        cerrarSesion()
        formulario.classList = 'input-group py-3 fixed-bottom container'
        contenidoChat(user)

    } else {
        console.log('No existe usuario..')
        botones.innerHTML = /*html*/`
            <button class="btn btn-outline-success mr-2" id="btnAcceder">Acceder</button>
        `
        iniciarSesion()
        nombreUsuario.innerHTML = `Chat`
        contenidoProtegido.innerHTML = `
            <p class="text-center lead mt-5">Debes iniciar sesion..</p>
        `
        formulario.classList = 'input-group py-3 fixed-bottom container d-none'
    }
  });

  const iniciarSesion = () => {
      const btnAcceder = document.querySelector('#btnAcceder')
      btnAcceder.addEventListener('click', async() => {
          try {
              const provider = new firebase.auth.GoogleAuthProvider();
              await firebase.auth().signInWithPopup(provider)
              
          } catch (error) {
              console.log(error)
          }
      })
  }

  const cerrarSesion = () => {
      const btnCerrar = document.querySelector('#btnCerrar')
      btnCerrar.addEventListener('click', () => {
        firebase.auth().signOut()
      })
  }
  
  const contenidoChat = (user) => {
    
        formulario.addEventListener('submit', (e) => {
            e.preventDefault()
            
            if (!inputChat.value.trim()) {
                console.log('input vacio')
                return
            }

            firebase.firestore().collection('chat').add({
                texto: inputChat.value,
                uid: user.uid,
                fecha: Date.now()
            })
                .then(res => {console.log('mensaje guardado')})
                .catch(e => console.log(e))
            
            inputChat.value = ''
        })

        firebase.firestore().collection('chat').orderBy('fecha')
            .onSnapshot(query => {
                contenidoProtegido.innerHTML = ''
                query.forEach(doc => {
                    if (doc.data().uid === user.uid) {
                        contenidoProtegido.innerHTML += `
                        <div class="d-flex justify-content-end">
                            <span class="badge bg-primary">${doc.data().texto}</span>
                        </div>
                        `
                    }else{
                        contenidoProtegido.innerHTML += `
                        <div class="d-flex justify-content-estart">
                            <span class="badge bg-secondary">${doc.data().texto}</span>
                        </div>
                        `
                    }
                    contenidoProtegido.scrollTop = contenidoProtegido.scrollHeight

                })
            })
        

  }