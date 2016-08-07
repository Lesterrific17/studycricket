
/////////////////////////////////////////////////////////////////////

var tadaSound = null;
var clingSound = null;
var cricketSound = null;

$(document).ready(function () {

    tadaSound = document.getElementById("tada");
    clingSound = document.getElementById("cling");
    cricketSound = document.getElementById("cricket");

    $("#add").click(function () {
        if ($("#question").val() != "" && $("#answer").val() != "" && isEditing != true && $('#question').val() != $('#answer').val()) {
            combos.push(new Combo($("#question").val(), $("#answer").val()));
            $("#question").val('');
            $("#answer").val('');
        }
        else if ($("#question").val() != "" && $("#answer").val() != "" && isEditing == true) {
            combos[currentEdit].question = $("#question").val();
            combos[currentEdit].answer = $("#answer").val();
            clearEdit();
        }
        displayQuestions();
    });
    $("#print").click(function () {
        printCombos();
    });
    $('body').on('click', '.delete', function () {
        combos.splice($(this).attr('id'), 1);
        //printCombos();
        displayQuestions();
    });
    $('body').on('click', '.edit', function () {
        clearEdit();
        currentEdit = $(this).data('id');
        editMode();
        $("#display-" + currentEdit).html(
			'<input id="new-question" placeholder="new question" type="text"/>' +
			'<input id="new-answer" placeholder="new answer" type="text"/>' +
			'<button id="ok">Ok</button>' + '<button id="cancel">Cancel</button>'
			);
    });
    $('body').on('click', '#ok', function () {
        if ($("#new-question").val() != "") {
            combos[currentEdit].question = $("#new-question").val();
        }
        if ($("#new-answer").val() != "") {
            combos[currentEdit].answer = $("#new-answer").val();
        }
        printCombos();
    });
    $('body').on('click', '#cancel', function () {
        clearEdit();
    });
    $("#submit-answer").click(function () {
        nextQuestion();
    });
    $('#your-answer').on('keypress', function (e) {
        var key = e.which;
        if (key == 13) {
            nextQuestion();
        }
    });
    ///////////////////////////////////////////////
    $('body').on('click', '.box', function () {
        if (value1 == null) {
            value1 = $(this).html();
            v1 = $(this).attr('id');
            $(this).addClass('hbox');
        }
        else if (value1 != null && value2 == null) {
            value2 = $(this).html();
            v2 = $(this).attr('id');
            if (compare()) {
                $('#' + v2 + ', #' + v1).attr('class', 'box-clicked animate2s');
                checkBanner2('correct', 'Awesome!');
                $('.hbox').removeClass('hbox');
                score.addScore();
                $("#score").html(score.totalScore);
            }
            else {
                $('.hbox').removeClass('hbox');
                checkBanner2('wrong', 'Uh oh...!');
            }
            value1 = value2 = null;
        }

        if (clickCount == comboCount) {
            gameOver2(score.totalScore, comboCount);
            mode = 0;
            $("#container").html('');
            $("#score").html(score.totalScore);
        }
    });
    ///////////////////////////////////////////////
    $("#startmode1").click(function () {

        if (combos.length != 0 && mode != 1) {
            timer.defaultSeconds = 30;
            timer.reset();
            $('#game-screen').css('transform', 'translateY(-0%)');
            score = new Score();
            mode = 1;
            indexCount = 0;
            $("#score").html(score.totalScore + " / " + score.maxScore + " : " +
				indexCount + " / " + score.maxScore);
            $("#time").html(timer.seconds);
            initCombo();
            askQuestion();
            $('#your-answer').focus();
        }
        else {
            alert("ERRoR!");
        }
    });
    $("#startmode2").click(function () {

        if (combos.length != 0 && mode != 2) {
            timer.reset();
            $('#game-screen').css('transform', 'translateY(-0%)');
            score = new Score();
            mode = 2;
            indexCount = 0;
            $("#score").html(score.totalScore + " / " + score.maxScore + " : " +
				indexCount + " / " + score.maxScore);
            initCombo();
            $('#your-answer').focus();
            askQuestion();
        }
        else {
            alert("ERRoR!");
        }
    });
    $("#startmode3").click(function () {
        if (combos.length >= comboCount && mode != 3) {
            timer.defaultSeconds = 60;
            timer.reset();
            $('#match-screen').css('transform', 'translateY(-0%)');
            indexArr = [];
            stringArr = [];
            value1 = null;
            value2 = null;
            clickCount = 0;
            score = new Score();
            mode = 3;
            $("#score").html(score.totalScore);
            initCombo();
            initStrings();
            initBoxes();
        }
        else {
            alert("ERRoR!");
        }
    });
    //////////////////////////////////////////////
});

/////////////////////////////////////////////////////////////////////

var combos = [];
var index;
var indexCount;
var currentEdit;
var isEditing = false;
var timer = new Timer();
var score = new Score();
var mode = 0;

var comboCount = 4

var indexArr = [];
var stringArr = [];
var value1 = null; var value2 = null;
var v1,v2;
var clickCount = 0;

setInterval(function printTime() {
	if (mode == 1 || mode == 3) {
		timer.minus();
		$("#time").html(timer.seconds);
        $("#time2").html(timer.seconds);
		if (timer.seconds == 0) {
			nextQuestion();
		}
	}
},1000);

/////////////////////////////////////////////////////////////////////

function printCombos() {
	$("#list").html('');
	for (var i = 0; i < combos.length; i++) {
		$("#list").html($("#list").html() + 
			(combos[i].question + " : " + combos[i].answer) +
			'<button id="' + i + '" class="edit">Edit</button>' +
			'<button id="' + i + '" class="delete">Delete</button>' +
			'<div class="edit-display" id="display-' + i + '"></div>' );
	}
}
function nextQuestion() {
	indexCount++;
	timer.reset();
	checkAnswer($("#your-answer").val());
	$("#your-answer").val('');
	if (indexCount < combos.length) {
		askQuestion();
	}
	else {
	    gameOver(score.totalScore, combos.length);
		mode = 0;
		$("#score").html("0");
		$("#time").html("0");
		$("#asked-question").html("This is the current question");
		$("#check").html('');
	}
}
function askQuestion() {
	index = randomBetween(0,combos.length);
	while (combos[index].done) {
		index = randomBetween(0,combos.length);
	}
	$("#asked-question").html(combos[index].question);
	combos[index].done = true;
}
function checkAnswer(ans) {
	if (similar((combos[index].answer).toLowerCase(), ans.toLowerCase())  >= 50 ) {
		score.addScore();
		checkBanner('correct', 'Awesome');
	}
	else {
	    checkBanner('wrong', 'Uh oh...');
	}
	$("#score").html(score.totalScore + " / " + score.maxScore + " : " +
			indexCount + " / " + score.maxScore);
}
function clearEdit() {
	isEditing = false;
	$('#question').html('');
	$('#answer').html('');
    $('#cancel').addClass('hidden');
}
function initStrings() {
	var rand
	for (var i = 0; i < comboCount; i++) {
		rand = randomBetween(0,combos.length);
		while (combos[rand].done) rand = randomBetween(0,combos.length);
		combos[rand].done = true;
		indexArr.push(rand);
	}
	var q_arr = []; var a_arr = [];
	initCombo();
	for (var i = 0; i < indexArr.length; i++) {
		rand = randomBetween(0,indexArr.length);
		while (combos[rand].done) rand = randomBetween(0,indexArr.length);
		q_arr.push(indexArr[rand]);
		combos[rand].done = true;
	}
	initCombo();
	for (var i = 0; i < indexArr.length; i++) {
		rand = randomBetween(0,indexArr.length);
		while (combos[rand].done) rand = randomBetween(0,indexArr.length);
		a_arr.push(indexArr[rand]);
		combos[rand].done = true;
	}
	indexArr = [];
	for (var i = 0; i < q_arr.length; i++) {
		indexArr.push(q_arr[i])
	}
	for (var i = 0; i < a_arr.length; i++) {
		indexArr.push(a_arr[i])
	}
	for (var i = 0; i < indexArr.length; i++) {
		if (i < indexArr.length/2) stringArr.push(combos[indexArr[i]].question);
		if (i >= indexArr.length/2) stringArr.push(combos[indexArr[i]].answer);
	}
}
function initBoxes() {
    $('#container').html('');
	for (var i = 0; i < stringArr.length; i++) {
		createBox(stringArr[i], i);
	}
}
function createBox(string, i) {
	$("#container").html($("#container").html()+'<div id="box-' + i + '" class="box animate2s">'+string+'</div>');
}
function compare() {
	for (var i = 0; i < indexArr.length/2; i++) {
		if ((combos[indexArr[i]].question == value1 &&
			combos[indexArr[i]].answer == value2) ||
			(combos[indexArr[i]].answer == value1 &&
			combos[indexArr[i]].question == value2)) {
			clickCount++;
			return true;
		}
	}
	return false;
}
function initCombo() {
	for (var i = 0; i < combos.length; i++) {
		combos[i].done = false;
	}
}

/////////////////////////////////////////////////////////////////////

function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

/////////////////////////////////////////////////////////////////////

function Combo(q,a) {
	this.question = q;
	this.answer = a;
	this.done;
}
function Timer() {
	this.defaultSeconds = 10;
	this.seconds = this.defaultSeconds;
	this.minSeconds = 0;
	this.reset = function() {
		this.seconds = this.defaultSeconds+1;
	}
	this.minus = function() {
		this.seconds--;
	}
}
function Score() {
	this.totalScore = 0;
	this.maxScore = combos.length;
	this.addScore = function() {
		this.totalScore++;
	}
}

function displayQuestions(){
    $('#save-set').removeClass('hidden');
    $('#questions-list').html('');
    for(var i = 0; i < combos.length; i++){
        $('#questions-list').html($('#questions-list').html() + 
            '<div class="question-card">' +
			'<b>Question: </b>' + combos[i].question + 
	        '<br/><br/><b>Answer: </b>' + combos[i].answer +
			'<div class="q-actions">' +
			'<input type="button" class="edit" value="Edit" data-id="' + i + '"/>' + 
			'<input type="button" class="delete" value="Delete" data-id="' + i + '"/>' +
			'</div></div>'
        );
    }
    $('#qcount').html(combos.length);
}

function editMode(){
    isEditing = true;
    $('#cancel').removeClass('hidden');
    $('#question').html(combos[currentEdit].question);
    $('#answer').html(combos[currentEdit].answer);
}

function checkBanner(ch, msg){
    $('#check-banner').attr('class', ch);
    $('#check-banner').html(msg);
    $('#check-banner').fadeIn('1500');
    if(ch == 'correct'){
        clingSound.play();
    }
    else{
        cricketSound.play();
    }
    
    flashDelay = setInterval(function () {
        $('#check-banner').fadeOut('1500');
        clearInterval(flashDelay);
        return;
    }, 1500);
}
function checkBanner2(ch, msg){
    $('#check-banner2').attr('class', ch);
    $('#check-banner2').html(msg);
    $('#check-banner2').fadeIn('1500');
    if(ch == 'correct'){
        clingSound.play();
    }
    else{
        cricketSound.play();
    }
    flashDelay = setInterval(function () {
        $('#check-banner2').fadeOut('1500');
        clearInterval(flashDelay);
        return;
    }, 1500);
}

function gameOver(score, maxscore){
    $('#game-over').css({'transform' : 'translateX(-0%)'});
    $('#stats').html('You answered ' + score + ' out of ' + maxscore + ' questions correctly!');
    $('#your-answer').blur();
    tadaSound.play();

    var percent = score / maxscore;
    var starCount = Math.ceil((percent * 100) / 20);
    
    var i = 0;
    var st = setInterval(function () {

        if (i < starCount) {
            $('#stars').html($('#stars').html() +
            '<div class="star icon-holder">' +
            '<img alt="icon" src="svg/star.svg"/>' +
            '</div>');
            i++;
        }
        else {
            clearInterval(st);
            return;
        }
    }, 500);
    
}

function gameOver2(score, maxscore){
    $('#game-over2').css({'transform' : 'translateX(-0%)'});
    $('#stats2').html('You answered ' + score + ' out of ' + maxscore + ' questions correctly!');
    $('#your-answer').blur();
    tadaSound.play();
    var percent = score / maxscore;
    var starCount = Math.ceil((percent * 100) / 20);
    
    var i = 0;
    var st = setInterval(function () {

        if (i < starCount) {
            $('#stars2').html($('#stars2').html() +
            '<div class="star icon-holder">' +
            '<img alt="icon" src="svg/star.svg"/>' +
            '</div>');
            i++;
        }
        else {
            clearInterval(st);
            return;
        }
    }, 500);
    
}

function similar(a,b) {
    var lengthA = a.length;
    var lengthB = b.length;
    var equivalency = 0;
    var minLength = (a.length > b.length) ? b.length : a.length;    
    var maxLength = (a.length < b.length) ? b.length : a.length;    
    for(var i = 0; i < minLength; i++) {
        if(a[i] == b[i]) {
            equivalency++;
        }
    }
    var weight = equivalency / maxLength;
    return (weight * 100);
}