chrome.storage.sync.set({strDone: ""});
var docmentUrl = document.location.href;
if( docmentUrl.indexOf("linkedin.com/in/") == -1) { 
	alert("This is not profile page.");
	// chrome.storage.sync.set({pageError: "pageError"});
}
else {
	// chrome.storage.sync.set({pageError: "pageOK"});

    var strName = $(".pv-top-card-v3 ul.pv-top-card-v3--list li").eq(0).text().trim();
    if( !strName ){
        strName = $("h1.pv-top-card-section__name").text().trim();
    }
	// var strName = document.getElementsByClassName("pv-top-card-section__name")[0].innerHTML;
	chrome.storage.sync.set({strName: strName});


    var strHeadLine = $(".pv-top-card-v3 h2").eq(0).text().trim();
    if( !strHeadLine){
        strHeadLine = $("h2.pv-top-card-section__headline").text().trim();
    }
	// var HeadLineCtrl = document.getElementsByClassName("pv-top-card-section__headline")[0];
	// var strHeadLine = "";
	// if( HeadLineCtrl){
	// 	strHeadLine = HeadLineCtrl.innerHTML;
	// }
	chrome.storage.sync.set({strHeadLine: strHeadLine});


    var strLocation = $("ul.pv-top-card-v3--list-bullet li").eq(0).text().trim();
    if( !strLocation ){
        strLocation = $("h3.pv-top-card-section__location").text().trim();
    }
	// var LocationCtrl = document.getElementsByClassName("pv-top-card-section__location")[0];
	// var strLocation = "";
	// if( LocationCtrl){
	// 	strLocation = LocationCtrl.innerHTML;
	// }
	chrome.storage.sync.set({strLocation: strLocation});

	var isExperienceScrapped = false;
	var expMoreButton = $("#experience-section").find("button.pv-profile-section__see-more-inline");
	if( expMoreButton.length && $("#experience-section").find("button.pv-profile-section__see-more-inline").attr("aria-expanded") == "false"){
		// expMoreButton.click();
		var expInt = setInterval(function(){
			if( $("#experience-section").find("button.pv-profile-section__see-more-inline").length != 0){
				console.log("clicked");
				expMoreButton.click();
			} else{
				clearInterval(expInt);
				console.log("full expanded.");
				setTimeout(function(){
					var expLis = $("#experience-section").find("ul div li.pv-profile-section");
					var lstExperience = [];
					for( var i = 0; i < expLis.length; i++){
						var curExp = {}
						var curLi = expLis.eq(i);
						var curSummaryInfo = curLi.find(".pv-entity__summary-info");
						if( curSummaryInfo.length){
							curExp.companyName = curSummaryInfo.find("p.pv-entity__secondary-title").eq(0).text();
							curExp.workingHistory = [{title:curSummaryInfo.find("h3").eq(0).text(), duration: curSummaryInfo.find("div h4.pv-entity__date-range span").eq(1).text()}];
							lstExperience.push(curExp);
						} else{
							var companyInfo = curLi.find(".pv-entity__company-summary-info");
							curExp.companyName = companyInfo.find("h3 span").eq(1).text();
							curExp.allDuration = companyInfo.find("h4 span").eq(1).text();
							curExp.workingHistory = [];
							var hisLis = curLi.find("ul.pv-entity__position-group li");
							for( var j = 0; j < hisLis.length; j++){
								var curHisLi = hisLis.eq(j);
								var hisTitle = curHisLi.find("h3 span").eq(1).text();
								var hisDuration = curHisLi.find(".display-flex h4 span").eq(1).text();
								curExp.workingHistory.push({title: hisTitle, duration: hisDuration});
							}
							lstExperience.push(curExp);
						}
					}
					var strExperience = JSON.stringify(lstExperience);
					chrome.storage.sync.set({strExperience:strExperience});
					isExperienceScrapped = true;
					console.log(strExperience);
					console.log("Experience scrapping finished.");
				}, 100);
			}
		}, 1000);
	} else{
		var expLis = $("#experience-section").find("ul div li.pv-profile-section");
		var lstExperience = [];
		for( var i = 0; i < expLis.length; i++){
			var curExp = {}
			var curLi = expLis.eq(i);
			var curSummaryInfo = curLi.find(".pv-entity__summary-info");
			if( curSummaryInfo.length){
				curExp.companyName = curSummaryInfo.find("p.pv-entity__secondary-title").eq(0).text();
				curExp.workingHistory = [{title:curSummaryInfo.find("h3").eq(0).text(), duration: curSummaryInfo.find("div h4.pv-entity__date-range span").eq(1).text()}];
				lstExperience.push(curExp);
			} else{
				var companyInfo = curLi.find(".pv-entity__company-summary-info");
				curExp.companyName = companyInfo.find("h3 span").eq(1).text();
				curExp.allDuration = companyInfo.find("h4 span").eq(1).text();
				curExp.workingHistory = [];
				var hisLis = curLi.find("ul.pv-entity__position-group li");
				for( var j = 0; j < hisLis.length; j++){
					var curHisLi = hisLis.eq(j);
					var hisTitle = curHisLi.find("h3 span").eq(1).text();
					var hisDuration = curHisLi.find(".display-flex h4 span").eq(1).text();
					curExp.workingHistory.push({title: hisTitle, duration: hisDuration});
				}
				lstExperience.push(curExp);
			}
		}
		var strExperience = JSON.stringify(lstExperience);
		chrome.storage.sync.set({strExperience: strExperience});
		isExperienceScrapped = true;
	}
	var isEducationScrapped = false;
	var eduMoreButton = $("#education-section").find("button");
	if( eduMoreButton.length && $("#education-section").find("button").attr("aria-expanded") == "false"){
		var eduInt = setInterval(function(){
			if( $("#education-section").find("button.pv-profile-section__see-more-inline").attr("aria-expanded") == "false"){
				eduMoreButton.click();
			} else{
				clearInterval(eduInt);
				console.log("edu full expanded.");
				setTimeout(function(){
					var eduLis = $("#education-section").find("ul li");
					var lstEducation = [];
					for( var i = 0; i < eduLis.length; i++){
						var curEdu = {}
						var curLi = eduLis.eq(i);
						var curSummaryInfo = curLi.find(".pv-entity__summary-info");
						curEdu.schoolName = curSummaryInfo.find("h3.pv-entity__school-name").eq(0).text();
						curEdu.degreeName = curSummaryInfo.find("p.pv-entity__degree-name span").eq(1).text();
						curEdu.areaName = curSummaryInfo.find("p.pv-entity__fos span").eq(1).text();
						curEdu.duration = curSummaryInfo.find("p.pv-entity__dates span").eq(1).text().trim();
						lstEducation.push(curEdu);
					}
					var strEducation = JSON.stringify(lstEducation);
					chrome.storage.sync.set({strEducation:strEducation});
					isEducationScrapped = true;
					console.log("Education scrapping finished");
					console.log(strEducation);
				}, 100);
			}
		}, 1000);
	} else{
		var eduLis = $("#education-section").find("ul li");
		var lstEducation = [];
		for( var i = 0; i < eduLis.length; i++){
			var curEdu = {}
			var curLi = eduLis.eq(i);
			var curSummaryInfo = curLi.find(".pv-entity__summary-info");
			curEdu.schoolName = curSummaryInfo.find("h3.pv-entity__school-name").eq(0).text();
			curEdu.degreeName = curSummaryInfo.find("p.pv-entity__degree-name span").eq(1).text();
			curEdu.areaName = curSummaryInfo.find("p.pv-entity__fos span").eq(1).text();
			curEdu.duration = curSummaryInfo.find("p.pv-entity__dates span").eq(1).text().trim();
			lstEducation.push(curEdu);
		}
		var strEducation = JSON.stringify(lstEducation);
		chrome.storage.sync.set({strEducation: strEducation});
		isEducationScrapped = true;
	}

	var strImgUrl = $("img.pv-top-card-section__photo")[0].src;
	chrome.storage.sync.set({strImgUrl: strImgUrl});

	// var strImgStyle = $(".pv-top-card-section__photo").attr("style");
	// chrome.storage.sync.set({strImgUrl: ""});
	// var arrStyles = strImgStyle.split(";");
	// for( var i = 0; i < arrStyles.length; i++){
	// 	var strStyle = arrStyles[i];
	// 	var arrOneStyle = strStyle.split(":");
	// 	if( arrOneStyle[0] == 'background-image'){
	// 		arrOneStyle.shift();
	// 		var strUrlFunc = arrOneStyle.join(':').trim();
	// 		var strImgUrl = strUrlFunc.replace('url("', "");
	// 		strImgUrl = strImgUrl.replace('")', "");
	// 		chrome.storage.sync.set({strImgUrl: strImgUrl});
	// 		break;
	// 	}
	// }
	var enInfo = $(".pv-top-card-v2-section__link--contact-info");
	var otherInfo = $(".contact-see-more-less");
	if( enInfo.length != 0){
		enInfo.click();
	} else{
		otherInfo.click();
	}
	var isProfileScrapped = false;
	var profileInt = setInterval(function(){
		if( isExperienceScrapped == true && isEducationScrapped == true ){
			console.log("exp edu scrapping finished.");
			// document.getElementsByClassName("pv-top-card-v2-section__link--contact-info")[0].click();
			// var curUrl = document.location.href;
			// if( curUrl.substr(curUrl.length - 1) == "/"){
			// 	document.location.href = curUrl + "detail/contact-info/";
			// } else{
			// 	document.location.href = curUrl + "/detail/contact-info/";
			// }
			setTimeout(function(){
				document.querySelectorAll("a[data-control-name='contact_see_more']")[0].click();
				// $("a[data-control-name=contact_see_more]").click();
			})
			clearInterval(profileInt);
		}
	}, 100);

	var myInt = setInterval(function(){
		if( !document.getElementsByClassName("ci-vanity-url")[0])
			return;
		clearInterval(myInt);
		var strProfile = document.getElementsByClassName("ci-vanity-url")[0].getElementsByTagName("a")[0].getAttribute("href");
		chrome.storage.sync.set({strProfile: strProfile});

		var EmailCtrl = document.getElementsByClassName("ci-email")[0]; 
		var strEmail = "";
		if( EmailCtrl){ 
			strEmail= EmailCtrl.getElementsByTagName("a")[0].innerHTML;
		}
		chrome.storage.sync.set({strEmail: strEmail});

		var TwitterCtrl = document.getElementsByClassName("ci-twitter")[0]; 
		var strTwitter = "";
		if(TwitterCtrl){ 
			strTwitter = TwitterCtrl.getElementsByTagName("a")[0].getAttribute("href");
		}
		chrome.storage.sync.set({strTwitter: strTwitter});

		var PhoneCtrl = document.getElementsByClassName("ci-phone")[0]; 
		var strPhoneNumber = ""; 
		if( PhoneCtrl){ 
			strPhoneNumber = PhoneCtrl.getElementsByTagName("li")[0].getElementsByTagName("span")[0].innerHTML;
		}
		chrome.storage.sync.set({strPhoneNumber: strPhoneNumber});

		var SiteCtrl = document.getElementsByClassName("ci-websites")[0]; 
		var strSite = ""; 
		if( SiteCtrl){ 
			strSite = SiteCtrl.getElementsByTagName("li")[0].getElementsByTagName("a")[0].getAttribute("href");
		}
		chrome.storage.sync.set({strSite: strSite});

		// document.getElementsByClassName("artdeco-dismiss")[0].click();
		document.getElementsByClassName("artdeco-modal__dismiss")[0].click();
		isProfileScrapped = true;
		
	}, 50);
	var myFinalInt = setInterval( function(){
		// console.log("isExperienceScrapped : " + isExperienceScrapped);
		if( isExperienceScrapped == true && isEducationScrapped == true && isProfileScrapped == true){
			clearInterval(myFinalInt);
			chrome.storage.sync.set({strDone: "finished"});
		}
	}, 200);
}