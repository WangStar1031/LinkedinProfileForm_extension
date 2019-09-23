// var serverUrl = "http://localhost/linkedinForm/api_getProfiles.php";
var serverUrl = "http://18.188.148.74/linkedinForm/api_getProfiles.php";

var mainEmail = "";
function process(){
	$(".login").addClass("hiddenItem");
	$(".mainContents").removeClass("hiddenItem");
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
	var lstUSStates = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
	function isUSState( _strCountryName){
		for( var i = 0; i < lstUSStates.length; i++){
			if( _strCountryName.indexOf(lstUSStates[i]) != -1)
				return true;
		}
		return false;
	}
	function convertDuration( lstDuration){
		console.log(lstDuration);
		if( lstDuration.length < 2)return "";
		var lstStartDate = lstDuration[0].split(" ");
		if( lstStartDate.length == 1){
			lstStartDate = ["Jan", lstStartDate[0]];
		}
		var lstEndDate = lstDuration[1].split(" ");
		if( lstEndDate.length == 1){
			lstEndDate = ["Jan", lstEndDate[0]];
		}
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
					var location = data.strLocation.trim();
					var lstLocation = location.split(",");
					objProfile.strLocation = lstLocation[lstLocation.length - 1].trim();
					if( isUSState(objProfile.strLocation)){
						objProfile.strLocation = "United States";
					}
					$("input[name=country]").val(objProfile.strLocation);
					processed.location = true;
				});
				// Email
				chrome.storage.sync.get('strEmail', function(data){
					objProfile.strEmail = (data.strEmail == '' ? '' : data.strEmail.trim());
					$("input[name=strEmail]").val(objProfile.strEmail);
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
					$(".profileImg").attr("src", objProfile.strImgUrl).removeClass("hiddenItem");
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
				// console.log(objProfile);
				// console.log("scrapping finished.");
				processedInterval = setInterval(function(){
					if( processed.name && processed.location && processed.email && processed.phone && processed.profileUrl && processed.imgUrl && processed.headline && processed.experience && processed.education){
						clearInterval(processedInterval);
						var strBio = "";
						var fullName = objProfile.firstName + " " + objProfile.lastName;
						var prevCount = false;
						var isCurrentJob = false;
						if( objProfile.strExperience.length == 0){
							strBio += fullName + " is currently in-between jobs.";
						}
						for( var i = 0; i < objProfile.strExperience.length; i++){
							var curExp = objProfile.strExperience[i];
							// if( curExp.workingHistory.length == 1){
								var curWorking = curExp.workingHistory[0];
								var strDuration = curWorking.duration;
								var lstDuration = strDuration.split(" - ");
								if( curWorking.duration.indexOf("Present") != -1){
									isCurrentJob = true;
									strBio += fullName + " is currently employed at " + curExp.companyName + ", since " + lstDuration[0] + ", holding  the title of " + curWorking.title + ".";
								} else{
									if( isCurrentJob == false){
										strBio += fullName + " is currently in-between jobs.";
									}
									prevCount = !prevCount;
									if( prevCount ){
										strBio += " Previously, ";
									} else{
										strBio += " Before this, ";
									}
									// console.log(prevCount );
									// console.log( strBio);
									strBio += objProfile.firstName + " held the position of " + curWorking.title + ", while working at " + curExp.companyName + ".";
									if( lstDuration != ""){
										strBio += " " + objProfile.firstName + " held this role for " + convertDuration(lstDuration) + "(" + strDuration + ")."
									}
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

	var btnLogout = document.getElementById('btnLogout');
	btnLogout.onclick = function(element){
		chrome.storage.sync.set({loginEmail:""});
		$(".login").removeClass("hiddenItem");
		$(".mainContents").addClass("hiddenItem");
		window.close();
	}
	function objectVerify(){
		if( !objProfile.firstName){
			console.log("firstName");
			return false;
		}
		if( !objProfile.lastName){
			console.log("lastName");
			return false;
		}
		if( !objProfile.strLocation){
			console.log("strLocation");
			return false;
		}
		// if( !objProfile.strEmail){
		// 	console.log("strEmail");
		// 	return false;
		// }
		if( !objProfile.industry){
			console.log("industry");
			return false;
		}
		// if( !objProfile.jobsFunction)
		// 	return false;
		if( !objProfile.strHeadLine){
			console.log("strHeadLine");
			return false;
		}
		return true;
	}
	var btnSend = document.getElementById("btnSend");
	btnSend.onclick = function(element){
		var email = mainEmail;
		objProfile.prefix = $("#Prefix").val();
		objProfile.industry = $("#industry").val();
		objProfile.jobsFunction = $("#jobsFunction").val();
		objProfile.biography = $("#biography").val();
		objProfile.strEmail = $("#strEmail").val();
		console.log(objProfile);
		// verify values
		if( !objectVerify() ){
			$("#validate").removeClass("hiddenItem");
			return;
		}
		$("#validate").addClass("hiddenItem");
		var strProfile = JSON.stringify(objProfile);

		console.log( strProfile);
		if( email != ""){
			$(".sendingWait").removeClass("hiddenItem");
			$.post(serverUrl,{case:"profiles",email: email,data: strProfile}, function (data){
				$(".sendingWait").addClass("hiddenItem");
				if( data == "Inserted."){
					$(".sentOK").removeClass("hiddenItem");
					setTimeout( function(){ $(".sentOK").addClass("hiddenItem");}, 3000);
				} else{
					$(".sentCancel").removeClass("hiddenItem");
					setTimeout( function(){ $(".sentCancel").addClass("hiddenItem");}, 3000);
				}
			});
		}
	}
}
chrome.storage.sync.get('loginEmail', function(data){
	// console.log(data.loginEmail);
	if( !data.loginEmail){
		var submitBtn = document.getElementById("submitBtn");
		submitBtn.onclick = function(element){
			var email = $("input[name=email]").val();
			var pass = $("input[name=Password]").val();
			if( email != "" && pass != ""){
				$.get(serverUrl + "?case=verify&email=" + email + "&pass=" + pass, function (data){
					if( data == "Success"){
						$(".login").addClass("hiddenItem");
						$(".mainContents").removeClass("hiddenItem");
						mainEmail = email;
						chrome.storage.sync.set({loginEmail:email});
						process();
					} else{

					}
				});
			}
		}
	} else{
		mainEmail = data.loginEmail;
		process();
	}
});