window.onload = function() {
	var data = document.getElementById("data");
	var butGo = document.getElementById("butGo");
	var result = document.getElementById("result");
		
	butGo.onclick = function(e) {				    
	    result.value = concat_sql(data.value);
	    e.preventDefault();
	}
}
