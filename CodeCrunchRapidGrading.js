// ==UserScript==
// @name            CodeCrunch Rapid Grading
// @description     This script allows you to open submissions grading, code edit page from submission list page
// @downloadURL     https://github.com/imjayson/CodeCrunchRapidGrading
// @version         0.1
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @include         https://codecrunch.comp.nus.edu.sg/course_task_viewsubmissions.php?course_id=*

// ==/UserScript==


var params = {}
location.search.substr(1).split("&").forEach(function(item) {params[item.split("=")[0]] = item.split("=")[1]})
var courseId = params["course_id"];
var submissions;

$(document).ready(function() {    
    // Add grade all link
    $('.panel').append($('<div class="clear"></div><span class="label">&nbsp;</span><span class="value-long">&nbsp;</span>&nbsp;&nbsp;&rarr;&nbsp;<a href="#" id="grade-all">Grade all on page</a>'));
    
    $('#grade-all').click(function() {
        // get submissions on page
        submissions = $('#submissionTable').find('td a');
        
        // get filename from first submission and use for the other submissions
        var fileName;
        var firstSubId = submissionIdFromATag(submissions[0])
        $.ajax({                    
            type: "POST",           
            url: "submit_directorytree.php",
            data: ({sid: firstSubId}),
            success: openSubmissions
        }); 
        
    });
    
})

function openSubmissions(data) {
    extractFileName(data);
    // TODO: handle case with multiple file 
    
    // open all submissions
    var r = confirm('Open ' + submissions.length + ' windows to grade submissions? (Disable your popup blocker');
    if (r) {
        $.each(submissions, function(i,ele) {
            var win = window.open('https://codecrunch.comp.nus.edu.sg/edit_submitfile.php?sid='+ submissionIdFromATag(ele) + '&vfile=' + fileName, '_blank');
            win.focus();
        })
    }
}

function extractFileName(data) {
    fileName = $(data).find('.file').html().split(" ")[0];   
}
function submissionIdFromATag(tag) {
    return tag.getAttribute('href').split(/=|\"/)[1];
}