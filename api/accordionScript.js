/* accordion code from https://www.w3schools.com/howto/howto_js_accordion.asp */
var acc = document.getElementsByClassName("accordion");
//console.log("acc.length: " + acc.length);
var i;

for (i = 0; i < acc.length; i++) {
	acc[i].onclick = function() {
		/* Toggle between adding and removing the "active" class,
		to highlight the button that controls the panel */
		this.classList.toggle("active");
		//console.log(i);

		/* Toggle between hiding and showing the active panel */
		var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
		/*
		var panel = this.nextElementSibling;
		if (panel.style.maxHeight){
			panel.style.maxHeight = null;
		} else {
			panel.style.maxHeight = panel.scrollHeight + "px";
			//panel.style.maxHeight = 100 + "px";
		} 
		*/
	}
}