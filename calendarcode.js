// when user clicks sign-in button,
// reveals sign-in input fields
function signInSeq() {
	signInBtn.style.display = "none";
	signUpBtn.style.display = "none";
	usernameInput.style.display = "inline-block";
	passwordInput.style.display = "inline-block";

	backBtn.style.visibility = "visible";
	actSignInBtn.style.visibility = "visible";
	actSignUpBtn.style.display = "none";
	signOutBtn.style.display = "none";
}

// when user clicks sign-up button,
// reveals sign-up input fields
function signUpSeq() {
	signInBtn.style.display = "none";
	signUpBtn.style.display = "none";
	newUsernameInput.style.display = "inline-block";
	newPasswordInput.style.display = "inline-block";
	retypePasswordInput.style.display = "inline-block";

	backBtn.style.visibility = "visible";
	actSignInBtn.style.display = "none";
	actSignUpBtn.style.visibility = "visible";
	signOutBtn.style.display = "none";
}

// when user clicks back button,
// shows sign-in and sign-up buttons again
function goBack() {
	signInBtn.style.display = "inline-block";
	signUpBtn.style.display = "inline-block";
	usernameInput.value = "";
	usernameInput.style.display = "none";
	passwordInput.value = "";
	passwordInput.style.display = "none";
	newUsernameInput.value = "";
	newUsernameInput.style.display = "none";
	newPasswordInput.value = "";
	newPasswordInput.style.display = "none";
	retypePasswordInput.value = "";
	retypePasswordInput.style.display = "none";

	backBtn.style.visibility = "hidden";
	actSignInBtn.style.display = "inline-block";
	actSignInBtn.style.visibility = "hidden";
	actSignUpBtn.style.display = "inline-block";
	actSignUpBtn.style.visibility = "hidden";
	signOutBtn.style.display = "inline-block";
	actSignUpBtn.style.visibility = "hidden";

	message.textContent = "[message]"
	message.style.visibility = "hidden";
}

// when user clicks the second sign-in button,
// which is the actual sign-in button
function actSignInSeq() {
	function signInCallback(event) {
		var jsonData = JSON.parse(event.target.responseText);
		if(jsonData.signInSuccess) {
			currentUser = jsonData.currentUser;
			token = jsonData.token;

			usernameInput.style.display = "none";
			passwordInput.style.display = "none";
			userDisp.textContent = jsonData.currentUser; // sanitized in "signin_ajax.php"
			userDisp.style.display = "inline";

			backbtn.style.visibility = "hidden";
			backBtn.style.display = "none";
			actSignInBtn.style.visibility = "hidden";
			actSignInBtn.style.display = "none";
			signOutBtn.style.visibility = "visible";
			signOutBtn.style.display = "inline-block";

			message.textContent = "[message]";
			message.style.visibility = "hidden";

			agendaViewBtnDiv.style.display = "block";

			enterCalendarView();
			currentTime = new Date();
			currentMonth = new Month(currentTime.getFullYear(), currentTime.getMonth());
			updateCat();
			
		}
		else {
			message.textContent = jsonData.reason;
			message.style.visibility = "visible";
		}
	}

	message.style.visibility = "hidden";

	var dataString = "usernameinput=" + encodeURIComponent(usernameInput.value) + "&passwordinput=" + encodeURIComponent(passwordInput.value);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "signin_ajax.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", signInCallback, false);
	xmlHttp.send(dataString);
}

// when user clicks the second sign-up button,
// which is the actual sign-up button
function actSignUpSeq() {
	function signUpCallback(event) {
		var jsonData = JSON.parse(event.target.responseText);
		if(jsonData.signUpSuccess) {
			currentUser = jsonData.currentUser;
			token = jsonData.token;

			newUsernameInput.style.display = "none";
			newPasswordInput.style.display = "none";
			retypePasswordInput.style.display = "none";
			userDisp.textContent = jsonData.currentUser; // sanitized in "signup_ajax.php"
			userDisp.style.display = "inline";

			backbtn.style.visibility = "hidden";
			backBtn.style.display = "none";
			actSignUpBtn.style.visibility = "hidden";
			actSignUpBtn.style.display = "none";
			signOutBtn.style.visibility = "visible";
			signOutBtn.style.display = "inline-block";

			message.textContent = "[message]";
			message.style.visibility = "hidden";

			agendaViewBtnDiv.style.display = "block";

			enterCalendarView();
			currentTime = new Date();
			currentMonth = new Month(currentTime.getFullYear(), currentTime.getMonth());
			updateCat();
		}
		else {
			message.textContent = jsonData.reason;
			message.style.visibility = "visible";
		}
	}

	message.style.visibility = "hidden";

	var dataString = "newusername=" + encodeURIComponent(newUsernameInput.value) + "&newpassword=" + encodeURIComponent(newPasswordInput.value) + "&retypepassword=" + encodeURIComponent(retypePasswordInput.value);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "signup_ajax.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", signUpCallback, false);
	xmlHttp.send(dataString);
}

// when user clicks sign-out button,
// resets all input fields and ends session
function signOutSeq() {
	function signOutCallback() {
		currentUser = "";

		signInBtn.style.display = "inline-block";
		signUpBtn.style.display = "inline-block";
		usernameInput.value = "";
		passwordInput.value = "";
		newUsernameInput.value = "";
		newPasswordInput.value = "";
		retypePasswordInput.value = "";
		userDisp.textContent = "[current user]";
		userDisp.style.display = "none";

		backBtn.style.display = "inline-block";
		actSignInBtn.style.display = "inline-block";
		actSignUpBtn.style.display = "inline-block";
		signOutBtn.style.visibility = "hidden";

		agendaViewBtnDiv.style.display = "none";

		newEventNameInput.value = "";
		hrselect.value = "hr";
		minselect.value = "min";
		ampmselect.value = "am";

		updateCat();
		currentTime = new Date();
		currentMonth = new Month(currentTime.getFullYear(), currentTime.getMonth());
		updateDisplays();
	}

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "signout_ajax.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", signOutCallback, false);
	xmlHttp.send();
}

(function() {
	Date.prototype.deltaDays = function(c) {
		return new Date(this.getFullYear(),this.getMonth(),this.getDate()+c)
	}; 

	Date.prototype.getSunday = function() {
		return this.deltaDays(-1*this.getDay())
	}
})();

function Week(c) {
	this.sunday = c.getSunday();
	this.prevWeek = function() {
		return new Week(this.sunday.deltaDays(-7))
	};
	this.nextWeek = function() {
		return new Week(this.sunday.deltaDays(7))
	};
	this.contains = function(b) {
		return this.sunday.valueOf()===b.getSunday().valueOf()
	};
	this.getDates = function() {
		for(var b=[],a=0;7>a;a++)b.push(this.sunday.deltaDays(a));return b
	}
}

function Month(c,b) {
	this.year = c;
	this.month = b;
	this.prevMonth = function() {
		return new Month(c+Math.floor((b-1)/12),(b+11)%12)
	};
	this.nextMonth = function() {
		return new Month(c+Math.floor((b+1)/12),(b+1)%12)
	};
	this.getDateObject = function(a) {
		return new Date(this.year,this.month,a)
	};
	this.getWeeks = function() {
		var a = this.getDateObject(1), b = this.nextMonth().getDateObject(0), c = [], a = new Week(a);
		for(c.push(a);!a.contains(b);) a=a.nextWeek(),c.push(a);return c
	}
};

function updateDisplays() {

	// clears every cell in calendar and removes popup
	for(var i in cells) {
		cells[i].textContent = "";
	}
	popup.style.display = "none";

	// clears every row in the agenda table
	while (agendaTable.firstChild) {
	    agendaTable.removeChild(agendaTable.firstChild);
	}

	// displays year and month
	yearDisp.textContent = currentMonth.year;
	monthDisp.textContent = monthsNames[currentMonth.month];

	// returns array of week objects associated with current month
	var weeks = currentMonth.getWeeks(); 

	// obtains number of days in current month
	var numDays = 0;
	var currMonthRegex = new RegExp(monthsNames[currentMonth.month]);
	for(var w in weeks) {
		var days = weeks[w].getDates();
		for (var d in days) {	
			var str = String(days[d]);
			var match = str.match(currMonthRegex);
			if(match != null) numDays=numDays+1;
		}
	}

	// obtains day of week on which current month begins
	var daysOfWeekOne = weeks[0].getDates();
	var currMonthFirstDayRegex = new RegExp(" 01 ");
	for (var d in daysOfWeekOne) {
		var str = String(daysOfWeekOne[d]);
		var match = str.match(currMonthFirstDayRegex);
		if(match != null) {
			currMonthFirstDay = d;
			break;
		}
	}

	// function that retrieves events from database
	function getEventsCallback(event) {
		var jsonData = JSON.parse(event.target.responseText);
		eventsInMonth=[];
		// filters only the events in the categories that have been checked
		for (var e in jsonData.events) {
			if(checkedCats.includes(jsonData.events[e].category)) { 
				eventsInMonth.push(jsonData.events[e]);
			}
			else if(checkedCats.includes("uncategorized") && jsonData.events[e].category==null) {
				eventsInMonth.push(jsonData.events[e]);
			}
		}

		// displays dates and events in calendar cells
		var eventsInMonthTemp = Array.from(eventsInMonth);
		for(i=0 ; i<numDays ; i++) {
			cells[parseInt(currMonthFirstDay)+i].textContent = (i+1);
			var linebreak = document.createElement("br");
			cells[parseInt(currMonthFirstDay)+i].appendChild(linebreak);
			for(var e in eventsInMonthTemp) {
				if(eventsInMonthTemp[e].day==(i+1)) {
					var eventDiv = document.createElement("div");
					var strong = document.createElement("strong");
					strong.appendChild(document.createTextNode(eventsInMonthTemp[e].hr + "." + eventsInMonthTemp[e].min + eventsInMonthTemp[e].ampm + ": "));
					eventDiv.appendChild(strong);
					eventDiv.appendChild(document.createTextNode(eventsInMonthTemp[e].eventName));
					cells[parseInt(currMonthFirstDay)+i].appendChild(eventDiv);
					eventsInMonthTemp.shift;
				}
			}
		}

		// displays events in agenda table
		for(var e in eventsInMonth) {
			var newRow = document.createElement("tr");
			var newAgendaDateCell = document.createElement("td");
			newAgendaDateCell.append(document.createTextNode(eventsInMonth[e].day + " " + monthsNames[currentMonth.month]));
			newAgendaDateCell.setAttribute("class", "agendadate");
			var newAgendaTimeCell = document.createElement("td");
			newAgendaTimeCell.append(document.createTextNode(eventsInMonth[e].hr + "." + eventsInMonth[e].min + eventsInMonth[e].ampm));
			newAgendaTimeCell.setAttribute("class", "agendatime");
			var newAgendaEventNameCell = document.createElement("td");
			newAgendaEventNameCell.append(document.createTextNode(eventsInMonth[e].eventName));
			newAgendaEventNameCell.setAttribute("class", "agendaeventname");
			var newAgendaCategoryCell = document.createElement("td");
			if(eventsInMonth[e].category == null) {
				newAgendaCategoryCell.append(document.createTextNode("uncategorized"));
			}
			else {
				newAgendaCategoryCell.append(document.createTextNode(eventsInMonth[e].category));
			}
			newAgendaCategoryCell.setAttribute("class", "agendacategory");
			newRow.appendChild(newAgendaDateCell);
			newRow.appendChild(newAgendaTimeCell);
			newRow.appendChild(newAgendaEventNameCell);
			newRow.appendChild(newAgendaCategoryCell);
			agendaTable.appendChild(newRow);
		}
	}

	// gets events from database only if a user is currently logged in
	if(currentUser != "") {
		var dataString = "&year=" + encodeURIComponent(currentMonth.year) + "&month=" +  encodeURIComponent(monthsNames[currentMonth.month]);

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("POST", "getevents_ajax.php", true);
		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xmlHttp.addEventListener("load", getEventsCallback, false);
		xmlHttp.send(dataString);
	}
	else { // otherwise, just displays dates in calendar cells
		for(i=0 ; i<numDays ; i++) {
			cells[parseInt(currMonthFirstDay)+i].textContent = (i+1);
		}
	}
}

// for viewing the agenda table
function enterAgendaView() {
	agendaViewBtnDiv.style.display = "none";
	calendarViewBtnDiv.style.display = "block";
	calTable.style.display = "none";
	agendaTable.style.display = "table";
}

// for viewing the calendar table
function enterCalendarView() {
	agendaViewBtnDiv.style.display = "block";
	calendarViewBtnDiv.style.display = "none";
	calTable.style.display = "table";
	agendaTable.style.display = "none";
}

function prevMonth() {
	currentMonth = currentMonth.prevMonth();
	updateDisplays();
}

function nextMonth() {
	currentMonth = currentMonth.nextMonth();
	updateDisplays();
}

// when user clicks the edit categories button,
// reveals edit category input fields
function editCatSeq() {
	altCatDivPt1.style.display = "none";
	altCatDivPt2.style.display = "block";
	catBackBtn.style.display = "inline-block";
}

// when user clicks the new category button,
// reveals new category input fields
function newCatSeq() {
	altCatDivPt1.style.display = "none";
	altCatDivPt3.style.display = "block";
	catBackBtn.style.display = "inline-block";
}


function updateCatDisplays() {
	var labels = catDivPt1.getElementsByTagName("label");
	var checkboxes = catDivPt1.getElementsByTagName("input");
	checkedCats = [];
	for(var c in checkboxes) {
		if(checkboxes[c].checked) checkedCats.push(labels[c].textContent);
	}
	updateDisplays();
}

// retrieves categories that user has created,
// displays the categories checkboxes,
// then calls updateCatDisplays function so that, eventually,
// correct events are displayed in calendar table and agenda table as well
function updateCat() {
	function getCatCallback(event) {
		var jsonData = JSON.parse(event.target.responseText);
		for(var c in jsonData) {
			var newCatDiv = document.createElement("div");
			var label = document.createElement("label");
			var input =  document.createElement("input");
			label.appendChild(document.createTextNode(jsonData[c]));
			label.setAttribute("for", (jsonData[c]+"checkbox"));
			newCatDiv.appendChild(label);
			input.setAttribute("type", "checkbox");
			input.setAttribute("value", jsonData[c]);
			input.setAttribute("id", (jsonData[c]+"checkbox"));
			input.setAttribute("checked", "checked");
			newCatDiv.appendChild(input);
			catDivPt1.appendChild(newCatDiv);
			document.getElementById(jsonData[c]+"checkbox").addEventListener("click", updateCatDisplays, false);

			var newOption = document.createElement("option");
			newOption.appendChild(document.createTextNode(jsonData[c]));
			editCatSelect.appendChild(newOption);

			newOption = document.createElement("option");
			newOption.appendChild(document.createTextNode(jsonData[c]));
			categorySelect.appendChild(newOption);
		}
		var newCatDiv = document.createElement("div");
		var label = document.createElement("label");
		var input =  document.createElement("input");
		label.appendChild(document.createTextNode("uncategorized"));
		label.setAttribute("for", "uncategorizedcheckbox");
		newCatDiv.appendChild(label);
		input.setAttribute("type", "checkbox");
		input.setAttribute("value", "uncategorized");
		input.setAttribute("id", "uncategorizedcheckbox");
		input.setAttribute("checked", "checked");
		newCatDiv.appendChild(input);
		catDivPt1.appendChild(newCatDiv);
		document.getElementById("uncategorizedcheckbox").addEventListener("click", updateCatDisplays, false);

		// lists categories in the drop-down menus 
		// in the popup and in the edit category section
		var newOption = document.createElement("option");
		newOption.appendChild(document.createTextNode("none"));
		newOption.setAttribute("selected", "selected");
		categorySelect.appendChild(newOption);
		
		catDivPt1.style.display = "block";
		catDivPt2.style.display = "block";

		updateCatDisplays();
	}

	// clears all category checkboxes
	while (catDivPt1.firstChild) {
		catDivPt1.firstChild.removeEventListener("click", updateCatDisplays);
	    catDivPt1.removeChild(catDivPt1.firstChild);
	}
	// clears all categories listed in edit category section
	while (editCatSelect.firstChild) {
	    editCatSelect.removeChild(editCatSelect.firstChild);
	}
	// clears all categories listed in popup
	while (categorySelect.firstChild) {
	    categorySelect.removeChild(categorySelect.firstChild);
	}
	// if a user is currently logged in, loads categories that user has
	if(currentUser != "") {
		var secXmlHttp = new XMLHttpRequest();
		secXmlHttp.open("POST", "getcategories_ajax.php", true);
		secXmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		secXmlHttp.addEventListener("load", getCatCallback, false);
		secXmlHttp.send();
	}
	else {
		catDivPt1.style.display = "none";
		catDivPt2.style.display = "none";
	}
}

// when user clicks on second edit categories button,
// which actually edits selected category
function actEditCatSeq() {
	function editCatCallback(event) {
		var jsonData = JSON.parse(event.target.responseText);
		if(jsonData.editCatSuccess) {
			updateCat();
			editedCatNameInput.value = "";
			editCatErrorMessage.textContent = "[error message]";
			editCatErrorMessage.style.visibility = "hidden";
		}
		else {
			editCatErrorMessage.textContent = jsonData.reason;
			editCatErrorMessage.style.visibility = "visible";
		}
	}

	var dataString = "editedcategoryname=" + encodeURIComponent(editedCatNameInput.value) + "&originalcategoryname=" + encodeURIComponent(editCatSelect.value) + "&token=" + encodeURIComponent(token);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "editcategory_ajax.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", editCatCallback, false);
	xmlHttp.send(dataString);
}

// when user clicks on delete category button
function deleteCatSeq() {
	function deleteCatCallback(event) {
		var jsonData = JSON.parse(event.target.responseText);
		if(jsonData.deleteCatSuccess) {
			updateCat();
			editedCatNameInput.value = "";
			editCatErrorMessage.textContent = "[error message]";
			editCatErrorMessage.style.visibility = "hidden";
		}
		else {
			editCatErrorMessage.textContent = jsonData.reason;
			editCatErrorMessage.style.visibility = "visible";
		}
	}

	var dataString = "category=" + encodeURIComponent(editCatSelect.value) + "&token=" + encodeURIComponent(token);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "deletecategory_ajax.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", deleteCatCallback, false);
	xmlHttp.send(dataString);
}

// when user clicks on second create category button,
// which actually creates a new category
function actNewCatSeq() {
	function newCatCallback(event) {
		var jsonData = JSON.parse(event.target.responseText);
		if(jsonData.newCatSuccess) {
			updateCat();
			newCatNameInput.value = "";
			editCatErrorMessage.textContent = "[error message]";
			editCatErrorMessage.style.visibility = "hidden";
		}
		else {
			editCatErrorMessage.textContent = jsonData.reason;
			editCatErrorMessage.style.visibility = "visible";
		}
	}

	var dataString = "newcategoryname=" + encodeURIComponent(newCatNameInput.value) + "&token=" + encodeURIComponent(token);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "newcategory_ajax.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", newCatCallback, false);
	xmlHttp.send(dataString);
}

// when user clicks the back button in the categories section,
// displays the original edit and create buttons
function catGoBack() {
	altCatDivPt1.style.display = "block";
	altCatDivPt2.style.display = "none";
	altCatDivPt3.style.display = "none";
	catBackBtn.style.display = "none";
	editCatErrorMessage.textContent = "[error message]";
	editCatErrorMessage.style.visibility = "hidden";
}

// when user clicks on a certain calendar cell,
// displays popup with the associated events
function chooseCell(event) {
	if(currentUser == "") {
		alert("To create events, please sign in.");
	}
	else if(event.target.textContent != "") {
		resetPopup();
		var selectedCell;
		if(event.target.nodeName=="TD") {
			selectedCell = event.target; 
		}
		else if(event.target.parentNode.nodeName=="TD") {
			selectedCell = event.target.parentNode;
		}
		else if(event.target.parentNode.parentNode.nodeName=="TD") {
			selectedCell = event.target.parentNode.parentNode;
		}
		var cellRect = selectedCell.getBoundingClientRect();
		var horzMidPt = cellRect.left+(cellRect.right-cellRect.left)/2;
		var popupBoxWidth = 200.0;
		var popupXCoord = horzMidPt - popupBoxWidth/2;
		for(var i in cells) {
			if(cells[i] == selectedCell) {
				createEventBtn.style.display = "inline-block";
				editEventBtn.style.display = "none";
				deleteEventBtn.style.display = "none";
				errormessage.textContent = "[error message]";
				errormessage.style.display = "none";
				popup.style.left = (popupXCoord + window.scrollX) + "px";
				popup.style.top = ((cellRect.bottom+2) + window.scrollY) + "px"; // find way to put box above cell if cell is too far below
				popup.style.display = "inline-block";
				dateSelected = i - parseInt(currMonthFirstDay) + 1;
				updatePopup();
				break;
			}
		}
	} 
	else {
		resetPopup();
		popup.style.display = "none";
	}
}

// fills popup with the events of the day that has been selected
function updatePopup() {
	while (eventTable.firstChild) {
	    eventTable.removeChild(eventTable.firstChild);
	}
	popupheader.textContent = String(dateSelected) + " " + monthsNames[currentMonth.month] + " " + currentMonth.year;
	for(var e in eventsInMonth) {
		if(eventsInMonth[e].day==dateSelected) {
			var newEventTableRow = document.createElement("tr");
			var newTimeCell = document.createElement("td");
			newTimeCell.setAttribute("class", "eventtime");
			newTimeCell.appendChild(document.createTextNode(eventsInMonth[e].hr + "." + eventsInMonth[e].min + eventsInMonth[e].ampm));
			newEventTableRow.appendChild(newTimeCell);
			var newEventNameCell = document.createElement("td");
			newEventNameCell.setAttribute("class", "eventname");
			newEventNameCell.appendChild(document.createTextNode(eventsInMonth[e].eventName));
			newEventTableRow.appendChild(newEventNameCell);
			eventTable.appendChild(newEventTableRow);
		}
		else if(eventsInMonth[e].day > dateSelected) break;
	}

}

// resets all input fields in popup
function resetPopup() {
	newEventNameInput.value = "";
	hrSelect.value = "hr";
	minSelect.value = "min";
	ampmSelect.value = "am";
	categorySelect.value = "none";
	createEventBtn.style.display = "inline-block";
	editEventBtn.style.display = "none";
	deleteEventBtn.style.display = "none";
	shareEventInput.value = "";
	shareEventInput.style.display = "none";
	shareEventBtn.style.display = "none";
	errormessage.textContent = "[error message]";
	errormessage.style.display = "none";
}

// hides popup when user clicks elsewhere
function hidePopup(event) {
	if(event.target.nodeName!="TD" && event.target.parentNode.nodeName!="TD" && event.target.parentNode.parentNode.nodeName!="TD" && event.target!=popup && event.target.parentNode!=popup && event.target.parentNode.parentNode!=popup) {
		resetPopup();
		popup.style.display = "none";
		dateSelected = "";
	}
}

// when user clicks on the create event button in the popup
function createEventSeq() {
	function createEventCallback(event) {
		var jsonData = JSON.parse(event.target.responseText);
		if(jsonData.createEventSuccess) {
			updateDisplays();
			resetPopup();
			popup.style.display = "inline-block";
			updatePopup();
		}
		else {
			errorMessage.textContent = jsonData.reason;
			errorMessage.style.display = "inline";
		}
	}

	var dataString = "neweventname=" + encodeURIComponent(newEventNameInput.value) + "&year=" + encodeURIComponent(currentMonth.year) + "&month=" +  encodeURIComponent(monthsNames[currentMonth.month]) + "&day=" + encodeURIComponent(dateSelected) +  "&hr=" + encodeURIComponent(hrSelect.value) + "&min=" + encodeURIComponent(minSelect.value) + "&ampm=" + encodeURIComponent(ampmSelect.value) + "&category=" + encodeURIComponent(categorySelect.value) + "&token=" + encodeURIComponent(token);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "createevent_ajax.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", createEventCallback, false);
	xmlHttp.send(dataString);
}

// when user clicks on an event in the popup,
// loads fields with the details of the event
function editEventSeq(event) {
	if(event.target.nodeName=="TD") {
		var tableRows = eventTable.getElementsByTagName("tr");
		var selectedRowIndex = -1; 
		for (var r in tableRows) {
			selectedRowIndex = selectedRowIndex + 1;
			if(tableRows[r]==event.target.parentNode) break;
		}
		var eventsInDay = [];
		for(var e in eventsInMonth) {
			if(eventsInMonth[e].day==dateSelected) eventsInDay.push(eventsInMonth[e]);
		}

		selectedEventId = eventsInDay[selectedRowIndex].eventId;

		newEventNameInput.value = eventsInDay[selectedRowIndex].eventName;
		hrSelect.value = eventsInDay[selectedRowIndex].hr;
		minSelect.value = eventsInDay[selectedRowIndex].min;
		ampmSelect.value = eventsInDay[selectedRowIndex].ampm;
		if(eventsInDay[selectedRowIndex].category == null) {
			categorySelect.value = "none";
		}
		else {
			categorySelect.value = eventsInDay[selectedRowIndex].category;
		}
		errorMessage.textContent = "[error message]";
		errorMessage.style.display = "none";
		createEventBtn.style.display = "none";
		editEventBtn.style.display = "inline-block";
		deleteEventBtn.style.display = "inline-block";
		shareEventInput.style.display = "inline-block";
		shareEventBtn.style.display = "inline-block";
	}
	
}

// when user clicks on the edit event button,
// saves changes to database
function actEditEventSeq() {
	function editEventCallback(event) {
		var jsonData = JSON.parse(event.target.responseText);
		if(jsonData.editEventSuccess) {
			updateDisplays();
			resetPopup();
			popup.style.display = "inline-block";
			updatePopup();
		}
		else {
			errorMessage.textContent = jsonData.reason;
			errorMessage.style.display = "inline";
		}
	}

	var dataString = "eventid=" + encodeURIComponent(selectedEventId) + "&editedeventname=" + encodeURIComponent(newEventNameInput.value) + "&hr=" + encodeURIComponent(hrSelect.value) + "&min=" + encodeURIComponent(minSelect.value) + "&ampm=" + encodeURIComponent(ampmSelect.value) + "&category=" + encodeURIComponent(categorySelect.value) + "&token=" + encodeURIComponent(token);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "editevent_ajax.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", editEventCallback, false);
	xmlHttp.send(dataString);
}

// when user clicks on the delete event button
function deleteEventSeq() {
	function deleteEventCallback(event) {
		var jsonData = JSON.parse(event.target.responseText);
		if(jsonData.deleteEventSuccess) {
			updateDisplays();
			resetPopup();
			popup.style.display = "inline-block";
			updatePopup();
		}
		else {
			errorMessage.textContent = jsonData.reason;
			errorMessage.style.display = "inline";
		}
	}

	var dataString = "eventid=" + encodeURIComponent(selectedEventId) + "&token=" + encodeURIComponent(token);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "deleteevent_ajax.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", deleteEventCallback, false);
	xmlHttp.send(dataString);
}

// when user clicks on the share event button
function shareEventSeq() {
	function shareEventCallback(event) {
		var jsonData = JSON.parse(event.target.responseText);
		if(jsonData.shareEventSuccess) {
			shareEventInput.value="";
			errorMessage.textContent = "Event shared successfully.";
			errorMessage.style.display = "inline";
		}
		else {
			errorMessage.textContent = jsonData.reason;
			errorMessage.style.display = "inline";
		}
	}

	var dataString = "eventid=" + encodeURIComponent(selectedEventId) + "&usertosharewith=" + encodeURIComponent(shareEventInput.value) + "&token=" + encodeURIComponent(token);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "shareevent_ajax.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", shareEventCallback, false);
	xmlHttp.send(dataString);
}

// state variables
var currentUser = "";
var currMonthFirstDay;
var checkedCats = [];
var eventsInMonth = [];
var dateSelected;
var selectedEventId;
var token;

// variables for DOM elements
var signInBtn = document.getElementById("signinbtn");
var signUpBtn = document.getElementById("signupbtn");
var usernameInput = document.getElementById("usernameinput");
var passwordInput = document.getElementById("passwordinput");
var newUsernameInput = document.getElementById("newusernameinput");
var newPasswordInput = document.getElementById("newpasswordinput");
var retypePasswordInput = document.getElementById("retypepasswordinput");
var userDisp = document.getElementById("userdisp");

var backBtn = document.getElementById("backbtn");
var actSignInBtn = document.getElementById("actsigninbtn");
var actSignUpBtn = document.getElementById("actsignupbtn");
var signOutBtn = document.getElementById("signoutbtn");
var message = document.getElementById("message");

var agendaViewBtnDiv = document.getElementById("agendaviewbtndiv");
var calendarViewBtnDiv = document.getElementById("calendarviewbtndiv");
var agendaViewBtn = document.getElementById("agendaviewbtn");
var agendaTable = document.getElementById("agendatable");
var calendarViewBtn = document.getElementById("calendarviewbtn");

var prevBtn = document.getElementById("prevbtn");
var nextBtn = document.getElementById("nextbtn");
var yearDisp = document.getElementById("yearheader");
var monthDisp = document.getElementById("monthheader");
var calTable = document.getElementById("caltable");
var cells = document.getElementById("caltable").getElementsByTagName("td");

var popup = document.getElementById("popup");
var popupheader = document.getElementById("popupheader");
var eventTable = document.getElementById("eventtable");
var newEventNameInput = document.getElementById("neweventnameinput");
var hrSelect = document.getElementById("hrselect");
var minSelect = document.getElementById("minselect");
var ampmSelect = document.getElementById("ampmselect");
var categorySelect = document.getElementById("categoryselect");
var createEventBtn = document.getElementById("createeventbtn");
var editEventBtn = document.getElementById("editeventbtn");
var deleteEventBtn = document.getElementById("deleteeventbtn");
var shareEventInput = document.getElementById("shareeventinput");
var shareEventBtn = document.getElementById("shareeventbtn");
var errorMessage = document.getElementById("errormessage");

var catDivPt1 = document.getElementById("categoriesdivpt1");
var catDivPt2 = document.getElementById("categoriesdivpt2");
var altCatDivPt1 = document.getElementById("altercategoriesdivpt1");
var editCatBtn = document.getElementById("editcategorybtn");
var newCatBtn = document.getElementById("newcategorybtn");
var altCatDivPt2 = document.getElementById("altercategoriesdivpt2");
var editCatSelect = document.getElementById("editcategoryselect");
var editedCatNameInput = document.getElementById("editedcategorynameinput");
var actEditCatBtn = document.getElementById("acteditcategorybtn");
var deleteCatBtn = document.getElementById("deletecategorybtn");
var altCatDivPt3 = document.getElementById("altercategoriesdivpt3");
var newCatNameInput = document.getElementById("newcategorynameinput");
var actNewCatBtn = document.getElementById("actnewcategorybtn");
var catBackBtn = document.getElementById("categoriesbackbtn");
var editCatErrorMessage = document.getElementById("editcategorieserrormessage");

var body = document.getElementsByTagName("body");

var monthsNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var currentTime = new Date();
var currentMonth = new Month(currentTime.getFullYear(), currentTime.getMonth());
updateDisplays();

// various event listeners
signInBtn.addEventListener("click", signInSeq, false);
signUpBtn.addEventListener("click", signUpSeq, false);

backBtn.addEventListener("click", goBack, false);
actSignInBtn.addEventListener("click", actSignInSeq, false);
actSignUpBtn.addEventListener("click", actSignUpSeq, false);
signOutBtn.addEventListener("click", signOutSeq, false);

agendaViewBtn.addEventListener("click", enterAgendaView, false);
calendarViewBtn.addEventListener("click", enterCalendarView, false);

prevBtn.addEventListener("click", prevMonth, false);
nextBtn.addEventListener("click", nextMonth, false);

calTable.addEventListener("click", chooseCell, false);
body[0].addEventListener("click", hidePopup, false);

editCatBtn.addEventListener("click", editCatSeq, false);
newCatBtn.addEventListener("click", newCatSeq, false);
actEditCatBtn.addEventListener("click", actEditCatSeq, false);
deleteCatBtn.addEventListener("click", deleteCatSeq, false);
actNewCatBtn.addEventListener("click", actNewCatSeq, false);
catBackBtn.addEventListener("click", catGoBack, false);

createEventBtn.addEventListener("click", createEventSeq, false);
eventTable.addEventListener("click", editEventSeq, false);
editEventBtn.addEventListener("click", actEditEventSeq, false);
deleteEventBtn.addEventListener("click", deleteEventSeq, false);
shareEventBtn.addEventListener("click", shareEventSeq, false);











