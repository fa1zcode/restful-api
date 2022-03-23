const logout = (value) => {
  $.ajax({
    url: "http://localhost:3000/todo",
    method: "GET",
    dataType: "json",
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
  }).done(function (result) {
    if(result.success){
        localStorage.setItem('token', null)
        window.location = '/login.html'
    } else {
        alert('gagal logoout')
    }
  });
};
