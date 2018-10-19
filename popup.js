$( document ).ready(function() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.executeScript( tabs[0].id, {file: "js/jquery.min.js"});
		chrome.tabs.executeScript( tabs[0].id, {file: "scrap.js"});
	});
});
var objProfile = {};
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
			});
			// Location => must be changed to country and get timezone
			chrome.storage.sync.get('strLocation', function(data) {
				objProfile.strLocation = data.strLocation.trim();
				$("input[name=country]").val(objProfile.strLocation);
			});
			// Email
			chrome.storage.sync.get('strEmail', function(data){
				objProfile.strEmail = (data.strEmail == '' ? '' : data.strEmail.trim());
				$("input[name=email]").val(objProfile.strEmail);
			});
			// Phone Number
			chrome.storage.sync.get('strPhoneNumber', function(data) {
				objProfile.strPhoneNumber = ( data.strPhoneNumber == '' ? '' : data.strPhoneNumber.trim());
				$("input[name=mobileNumber]").val(objProfile.strPhoneNumber);
			});
			// profile url
			chrome.storage.sync.get('strProfile', function(data) {
				objProfile.strProfile = ( data.strProfile == '' ? '' : data.strProfile.trim());
				$("input[name=linkedinProfileUrl]").val(objProfile.strProfile);
			});
			// avatar image url
			chrome.storage.sync.get('strImgUrl', function(data) {
				objProfile.strImgUrl = ( data.strImgUrl == '' ? '' : data.strImgUrl.trim());
				$("input[name=imgProfileUrl]").val(objProfile.strImgUrl);
			});
			// headline : title
			chrome.storage.sync.get('strHeadLine', function(data){
				objProfile.strHeadLine = data.strHeadLine.trim();
				$("input[name=title]").val(objProfile.strHeadLine);
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
						strHtml += '<div class="empHistoryRow">';
							strHtml += '<p>';
								strHtml += '<span class="empTitle">' + title + '</span>';
								strHtml += '<span class="empDuration">' + duration + '</span>';
							strHtml += '</p>';
						strHtml += '</div>';
					}
					strHtml += '</div>';
				}
				// console.log(strHtml);
				$(".employmentHistory").append(strHtml);
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
					strHtml += '<div class="eduDiv hiddenItem">';
						strHtml += '<h4 class="eduSchoolName">' + schoolName + '</h4>';
						strHtml += '<p>';
							strHtml += '<span class="eduDegree">' + degree + '</span>';
							strHtml += '<span class="eduArea">' + area + '</span>';
						strHtml += '</p>';
						strHtml += '<p>';
							strHtml += '<span class="eduDuration">' + duration + '</span>';
						strHtml += '</p>';
					strHtml += '</div>';
				}
				$(".educationHistory").append(strHtml);
			});
			console.log(objProfile);
			console.log("scrapping finished.");
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


// <div class="eduDiv" index="0">
//   <h3 class="eduMainTitle"></h3>
//   <table>
//     <tr>
//       <td>Degree, Subject</td>
//       <td>Period</td>
//     </tr>
//     <tr>
//       <td><input type="text" name="eduPart"></td>
//       <td><input type="text" name="eduPeriod"></td>
//     </tr>
//   </table>
// </div>