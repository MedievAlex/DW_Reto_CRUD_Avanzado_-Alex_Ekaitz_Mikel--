async function comprobarSession() {
    try {
        const response = await fetch('../../api/CheckSession.php', {
            method: 'GET',
            credentials: 'include'
        });

        const currentPage = window.location.pathname.split('/').pop();
        const loginPage = 'login.html';
        const signupPage = 'signup.html';

        if (response.ok) {
            if (document.getElementById('contenido')) {
                document.getElementById('contenido').style.display = 'block';
            }
            if (currentPage === loginPage && currentPage=== signupPage) {
                window.location.href = 'main.html';
            }
        } else {
            const protectedPages = ['main.html'];
            if (protectedPages.includes(currentPage)) {
                window.location.href = loginPage;
            }
        }

    } catch (error) {
        console.error('Error comprobando sesión:', error);
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage !== 'login.html' && currentPage !== 'signup.html') {
            window.location.href = 'login.html';
        }
    }
}

comprobarSession();