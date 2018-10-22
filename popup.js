$( document ).ready(function() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.executeScript( tabs[0].id, {file: "js/jquery.min.js"});
		chrome.tabs.executeScript( tabs[0].id, {file: "scrap.js"});
	});
});
var objProfile = {};
var monthName = ["Jan", "Feb", "March", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var processed = {name:false, location: false, email: false, phone: false, profileUrl: false, imgUrl: false, headline: false, experience: false, education: false};
var processedInterval = null;
function convertDuration( lstDuration){
	var lstStartDate = lstDuration[0].split(" ");
	var lstEndDate = lstDuration[1].split(" ");
	var duration = ( lstEndDate[1] - lstStartDate[1] ) * 12 + ( monthName.indexOf(lstEndDate[0]) - monthName.indexOf(lstStartDate[0]));
	return duration + "months";
}
var interval = setInterval(function(){
	chrome.storage.sync.get('strDone', function(data){
		if( data.strDone != ""){
			clearInterval(interval);
			$(".scrappingWait").addClass("hiddenItem");
			// First & Last Name
			chrome.storage.sync.get('strName', function(data){
				var arrNames = data.strName.trim().split(" ");
				objProfile.firstName = arrNames.shift();
				objProfile.lastName = arrNames.join(" ");
				$("input[name=firstName]").val(objProfile.firstName);
				$("input[name=lastName]").val(objProfile.lastName);
				processed.name = true;
			});
			// Location => must be changed to country and get timezone
			chrome.storage.sync.get('strLocation', function(data) {
				objProfile.strLocation = data.strLocation.trim();
				$("input[name=country]").val(objProfile.strLocation);
				processed.location = true;
			});
			// Email
			chrome.storage.sync.get('strEmail', function(data){
				objProfile.strEmail = (data.strEmail == '' ? '' : data.strEmail.trim());
				$("input[name=email]").val(objProfile.strEmail);
				processed.email = true;
			});
			// Phone Number
			chrome.storage.sync.get('strPhoneNumber', function(data) {
				objProfile.strPhoneNumber = ( data.strPhoneNumber == '' ? '' : data.strPhoneNumber.trim());
				$("input[name=mobileNumber]").val(objProfile.strPhoneNumber);
				processed.phone = true;
			});
			// profile url
			chrome.storage.sync.get('strProfile', function(data) {
				objProfile.strProfile = ( data.strProfile == '' ? '' : data.strProfile.trim());
				$("input[name=linkedinProfileUrl]").val(objProfile.strProfile);
				processed.profileUrl = true;
			});
			// avatar image url
			chrome.storage.sync.get('strImgUrl', function(data) {
				objProfile.strImgUrl = ( data.strImgUrl == '' ? '' : data.strImgUrl.trim());
				$("input[name=imgProfileUrl]").val(objProfile.strImgUrl);
				processed.imgUrl = true;
			});
			// headline : title
			chrome.storage.sync.get('strHeadLine', function(data){
				objProfile.strHeadLine = data.strHeadLine.trim();
				$("input[name=title]").val(objProfile.strHeadLine);
				processed.headline = true;
			});
			// experience : strExperience
			chrome.storage.sync.get('strExperience', function(data){
				objProfile.strExperience = JSON.parse(data.strExperience.trim());
				var lstExperience = objProfile.strExperience;
				var strHtml = "";
				for( var i = 0; i < lstExperience.length; i++){
					var curExp = lstExperience[i];
					var comName = curExp.companyName;
					var lstWorkings = curExp.workingHistory;
					strHtml += '<div class="empDiv hiddenItem">';
					strHtml += '<h4 class="empCompanyName">' + comName + '</h4>';
					for( var j = 0; j < lstWorkings.length; j++){
						var curWorking = lstWorkings[j];
						var title = curWorking.title;
						var duration = curWorking.duration;
						duration = encodeURIComponent(duration);
						duration = duration.replace("%E2%80%93", "-");
						duration = decodeURIComponent(duration);
						var lstDuration = duration.split(" - ");
						curWorking.duration = duration;
						var startDate = lstDuration[0];
						var endDate = "";
						if( lstDuration.length > 1){
							endDate = lstDuration[1];
							if( endDate == "Present"){
								var curDate = new Date();
								var yyyy = curDate.getFullYear();
								var month = monthName[curDate.getMonth()];
								endDate = month + " " + yyyy;
							}	
						}
						strHtml += '<div class="empHistoryRow">';
							strHtml += '<p>';
								strHtml += '<span class="empTitle">' + title + '</span>';
								if( endDate == ""){
									strHtml += '<span class="empDuration">' + startDate + '</span>';
								} else{
									strHtml += '<span class="empDuration">' + startDate + " - "  + endDate + '</span>';
								}
							strHtml += '</p>';
						strHtml += '</div>';
					}
					strHtml += '</div>';
				}
				// console.log(strHtml);
				$(".employmentHistory").append(strHtml);
				processed.experience = true;
			});
			// education : strEducation
			chrome.storage.sync.get('strEducation', function(data){
				objProfile.strEducation = JSON.parse(data.strEducation.trim());
				var lstLearning = objProfile.strEducation;
				var strHtml = "";
				for( var i = 0; i < lstLearning.length; i++){
					var curEdu = lstLearning[i];
					var schoolName = curEdu.schoolName;
					var degree = curEdu.degreeName;
					var area = curEdu.areaName;
					var duration = curEdu.duration;
					duration = encodeURIComponent(duration);
					duration = duration.replace("%E2%80%93", "-");
					duration = decodeURIComponent(duration);
					curEdu.duration = duration;
					var lstDuration = duration.split(" - ");
					var startDate = lstDuration[0];
					var endDate = "";
					if( lstDuration.length > 1){
						endDate = lstDuration[1];
						if( endDate == "Present"){
							var curDate = new Date();
							var yyyy = curDate.getFullYear();
							endDate = yyyy;
						}	
					}
					strHtml += '<div class="eduDiv hiddenItem">';
						strHtml += '<h4 class="eduSchoolName">' + schoolName + '</h4>';
						strHtml += '<p>';
							if( degree )
								strHtml += '<span class="eduDegree">' + degree + '</span>';
							if( area)
								strHtml += '<span class="eduArea">' + area + '</span>';
						strHtml += '</p>';
						strHtml += '<p>';
							if( endDate == ""){
								strHtml += '<span class="eduDuration">' + startDate + '</span>';
							} else{
								strHtml += '<span class="eduDuration">' + startDate + " - " + endDate + '</span>';
							}
						strHtml += '</p>';
					strHtml += '</div>';
				}
				$(".educationHistory").append(strHtml);
				processed.education = true;
			});
			console.log(objProfile);
			console.log("scrapping finished.");
			processedInterval = setInterval(function(){
				if( processed.name && processed.location && processed.email && processed.phone && processed.profileUrl && processed.imgUrl && processed.headline && processed.experience && processed.education){
					clearInterval(processedInterval);
					var strBio = "";
					var fullName = objProfile.firstName + " " + objProfile.lastName;
					var prevCount = 0;
					for( var i = 0; i < objProfile.strExperience.length; i++){
						var curExp = objProfile.strExperience[i];
						// if( curExp.workingHistory.length == 1){
							var curWorking = curExp.workingHistory[0];
							var strDuration = curWorking.duration;
							var lstDuration = strDuration.split(" - ");
							if( curWorking.duration.indexOf("Present") != -1){
								strBio += fullName + " is currently employed at " + curExp.companyName + ", since " + lstDuration[0] + ", holding  the title of " + curWorking.title + ".";
							} else{
								prevCount++;
								if( prevCount % 2 ){
									strBio += " Previously, ";
								} else{
									strBio + " Before this, ";
								}
								strBio += objProfile.firstName + " held the position of " + curWorking.title + ", while working at " + curExp.companyName + ".";
								strBio += " " + objProfile.firstName + "held this role for " + convertDuration(lstDuration) + "(" + strDuration + ")."
							}
						// } else{

						// }
					}
					$("textarea[name=englishBiography]").val(strBio);
				}
			});
		}
	});
}, 300);

var EmpHistory = document.getElementById('EmpHistory');
EmpHistory.onclick = function(element){
	$(".employmentHistory > h3").toggleClass("hidden");
	$(".employmentHistory > h3").toggleClass("shown");
	$(".empDiv").toggleClass("hiddenItem");
}

var EduHistory = document.getElementById('EduHistory');
EduHistory.onclick = function(element){
	$(".educationHistory > h3").toggleClass("hidden");
	$(".educationHistory > h3").toggleClass("shown");
	$(".eduDiv").toggleClass("hiddenItem");
}