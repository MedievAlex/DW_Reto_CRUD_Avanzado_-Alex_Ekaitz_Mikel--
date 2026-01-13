async function comprobarSession() {
    try {
        const response = await fetch('../../api/CheckSession.php', {
            method: 'GET',
            credentials: 'include'
        });

        const currentPage = window.location.pathname.split('/').pop();
        const publicPages = ['login.html', 'signup.html'];

        if (response.ok) {
            if (document.getElementById('contenido')) {
                document.getElementById('contenido').style.display = 'block';
            }

            if (publicPages.includes(currentPage)) {
                window.location.href = 'main.html';
            }

        } else {
            if (!publicPages.includes(currentPage)) {
                window.location.href = 'login.html';
            }
        }

    } catch (error) {
        console.error('Error comprobando sesión:', error);
        window.location.href = 'login.html';
    }
}

comprobarSession();
