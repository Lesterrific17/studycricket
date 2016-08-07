/* ============  Global Variables, Object Definitions, and Global Constants ============  */

var flashDelay;
var educourses = [];

/* ================================================================================ */

/* ========================== Event Handlers =========================================== */


$(document).ready(function () {

    $('#flash-header').click(function () {
        $(this).addClass('hidden');
    });

    $('.rec-bookmark').click(function () {

        clearInterval(flashDelay);
        
        //add bookmark for opening
        if ($(this).attr('class').indexOf('bookmarked') == -1) {
            addBookmarkAjax($(this).data('opening-id'), $(this).data('company-name'));
            $(this).addClass('bookmarked');
            return;
        }

        //remove bookmark for opening
        removeBookmarkAjax($(this).data('opening-id'), $(this).data('company-name'));
        $(this).removeClass('bookmarked');
        return;
    });

    //Event handlers for appending skillsets in the resume skillset form
    $('body').on('blur', '.add-skillset-editable', function () {
        var skillInput = $(this).html();
        if (skillInput != '<br>') {
            $(this).remove();
            appendSkill('#editable-skillset-list', skillInput);

            //AJAX call to add the new skill to the intern's resume record
            addResumeSkill(skillInput);

        }
        else {
            $(this).html('Add a Skill');
        }
    });

    $('body').on('focus', '.add-skillset-editable', function (e) {
        $(this).html('');
    });

    $('body').on('keypress', '.add-skillset-editable', function (e) {
        var key = e.which;
        if (key == 13) {
            var skillInput = $(this).html();

            if (skillInput != '<br>') {
                $(this).remove();
                appendSkill('#editable-skillset-list', skillInput);

                //AJAX call to add the new skill to the intern's resume record
                addResumeSkill(skillInput);

                $('.add-skillset-editable').focus();
            }
            else {
                $(this).blur();
                $(this).html('Add a Skill');
            }
            return false;
        }
    });

    $('body').on('click', '.click-remove', function () {
        $(this).remove();
    });

    //Event handlers for appendign major courses in the resume edit form
    $('body').on('focus', '.add-course-editable', function () {
        $(this).html('');
    });

    $('body').on('blur', '.add-course-editable', function () {
        var courseInput = $(this).html();
        if (courseInput != '<br>') {
            $(this).remove();
            appendCourse('#major-list', courseInput);
            educourses.push(courseInput);
            $('#coursecsv').html(educourses.toString());
        }
        else {
            $(this).html('Add Major Course');
        }
    });

    $('body').on('click', '.course', function () {
        educourses.splice(educourses.indexOf($(this).html()), 1);
        $('#coursecsv').html(educourses.toString());
    });

    $('body').on('keypress', '.add-course-editable', function (e) {
        var key = e.which;
        if (key == 13) {
            var courseInput = $(this).html();
            if (courseInput != '<br>') {
                $(this).remove();
                appendCourse('#major-list', courseInput);
                educourses.push(courseInput);
                $('#coursecsv').html(educourses.toString());
            }
            else {
                $(this).blur();
                $(this).html('Add Major Course');
            }
            return false;
        }
    });

    $('#edit-resume-vsubmit').click(function () {
        $('#resume-submit').click();
    });

    $("#confirmPassword").keyup(checkPasswordMatch);

    var timer = null;
    $('#currentPassword').on('change', function(){
           checkInputPassword($(this).val());
    });

    $("#preferences-save").click(function(){
            checkToggle();
    });

    $('.sort-selector').click(function () {
        $('#sort-val').attr('value', $(this).data('sort'));
        filterOpeningsList();
    });

    $('.edit-portion-fab').click(function(){
        $('.overlay-tint').addClass('overlay');
        resumeEditPortion($(this).data('modal-select'), $(this).data('edit-id'));
    });

    $('.overlay-tint').click(function(){
        $('.modalbox').removeClass('modal-pop');
        $('.resume-editbox').html('');
        $('#delete-modal').attr('data-entity', '');
        $('#delete-modal').attr('data-id', '');
    });

    $('.skillset').click(function(){
        deleteRSkillAjax($(this).data('rskill-id'), $(this).html());
    });

    $('.delete-portion-fab').click(function () { 
        $('.overlay-tint').addClass('overlay');
        deleteModal($(this).data('modal-warning'), $(this).data('entity'), $(this).data('id'));
    });

    $('.cancel').click(function(){
        $('.overlay-tint').removeClass('overlay');
        $('#delete-modal').removeClass('modal-pop');
        $('#delete-modal').attr('data-entity', '');
        $('#delete-modal').attr('data-id', '');
    });

    $('.yes').click(function(){
        deleteInfoAjax($('#delete-modal').data('entity'), $('#delete-modal').data('id'));
    });

    $('#filter-form').on('submit', function(e){
        e.preventDefault();
        filterOpeningsList();
    });
});

/* ================================================================================ */

/* ======================= Methods/Functions ======================================= */

function flashHeader(msg){
    $('#flash-header').html(msg);
    $('#flash-header').fadeIn('3000');
    flashDelay = setInterval(function () {
        $('#flash-header').fadeOut('3000');
        clearInterval(flashDelay);
        return;
    }, 3000);
}

function appendSkill(containerSelect, skill){
    $(containerSelect).append('<div class="skillset click-remove">' + skill +  '</div>');
    $(containerSelect).append('<div class="add-skillset-editable" contenteditable>Add a Skill</div>');
}

function appendCourse(containerSelect, course){
    $(containerSelect).append('<div class="course click-remove">' + course +  '</div>');
    $(containerSelect).append('<div class="add-course-editable" contenteditable>Add Major Course</div>');
}

function addResumeSkill(skill){
    $('#skill-input').attr('value', skill);
    $('#submit-skill').click();
}

function addBookmarkAjax(openingId, companyName){
    $.post("/openings/addbookmark",
    {
        opening_id: openingId,
        company_name: companyName
    },
    function (data, status) {
        if (status == 'success') {
            flashHeader(data);
        }
        else {
            alert('something went wrong. please try again.')
        }
    });
}

function removeBookmarkAjax(openingId, companyName){
    $.post("/openings/removebookmark",
    {
        opening_id: openingId,
        company_name: companyName
    },
    function (data, status) {
        if (status == 'success') {
            flashHeader(data);
        }
        else {
            alert('something went wrong. please try again.')
        }
    });
}

function checkPasswordMatch() {
        var password = $("#newPassword").val();
        var confirmPassword = $("#confirmPassword").val();

        if (password != confirmPassword){
            $("#divCheckPasswordMatch").html("Passwords do not match!");
            $("#password-save").prop('disabled', true);
        }
        else{
            $("#divCheckPasswordMatch").html("Passwords match.");
            $("#password-save").prop('disabled', false);
        }
}
        

function checkInputPassword(currentPassword){
        $.post("/interns/verifypassword",
        {
            passwordAttempt: currentPassword
        },
        function(data, status){
            if(status == 'success'){
                $("#password-error").html(data);               
            }
            else{
                alert('something went wrong. please try again.')
            }
        });
}

function checkToggle(){
    var classname1 = $("#toggle1").attr('class');
    var classname2 = $("#toggle2").attr('class');
    var pref1 = null;
    var pref2 = null;

    if(classname1 == "toggle on"){
        pref1 = 1;
    }
    else{
        pref1 = 0;
    }

    if(classname2 == "toggle on"){
        pref2 = 1;
    }
    else{
        pref2 = 0;
    }

    $.post("/internsettings/verifyEdit",
        {
            pref1: pref1,
            pref2: pref2
        },
        function(data, status){
            if(status == 'success'){
                $("#status").html(data);
                $("#status").hide(5000);
            }
            else{
                alert('something went wrong. please try again.')
            }
        });

}

function resumeEditPortion(modalSelect, editId){
    $('#' + modalSelect).addClass('modal-pop');
    editModalPopulate(modalSelect, editId);
}

function editModalPopulate(modalId, editId){
    $.post(
    "/resumes/" + modalId + "/" + editId,
    {},
    function (data, status) {
        if(status == 'success'){
            $('#' + modalId).html(data);
            return;
        }
        alert('something went wrong.:( please refresh the page and try again.');
    });
}

function deleteRSkillAjax(rskillId, skillName){
    $.post(
    "/resume-skills/deleteajax/" + rskillId,
    {},
    function (data, status) {
        if(status == 'success'){
            flashHeader(data);
            return;
        }
        alert('something went wrong.:( please refresh the page and try again.');
    });
}

function deleteModal(msg, entity, id){
    $('#delete-modal').addClass('modal-pop');
    $('#delete-modal-warning').html(msg);
    $('#delete-modal').attr('data-entity', entity);
    $('#delete-modal').attr('data-id', id);
}

function deleteInfoAjax(entity, id){
    alert('Functionality not supported yet.');
}

function filterOpeningsList(){
    location.href = "/intern/companylist?" + "order=" + $('#sort-val').val()
                                    + "&address=" + $('#location').val()
                                    + "&term=" + $('#term').val()
                                    + "&keyword=" + encodeURIComponent($('#keyword').val())
                                    + "&f=true";
}

/* ================================================================================ */