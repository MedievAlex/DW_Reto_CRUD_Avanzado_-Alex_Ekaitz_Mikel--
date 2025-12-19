async function comprobarsession() {
    try{
        const response = await fetch('../../api/Auth.php', {
            method : 'GET',
            credentials : 'include'
        });
        if(response.ok){
            const user = await response.json();
            document.getElementById('contenido').style.display = 'block';
        }else{
            window.location.href = 'login.html';
        }
    }catch(error){
        console.error(error);
        window.location.href = 'login.html';
    }
}
comprobarsession();