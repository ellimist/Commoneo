//globals
var ideas = [];

//main
$(function(){
    loadFromServer();
});
if (!navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
    $('section :input').val('').fancyInput()[0].focus();
    $("body").addClass("fancy");
} else {
    $("body").addClass("notfancy");
}

//eventing
$("section.input").click(function(){
    //$("#input_box").trigger("focus");
});
$("#button_add").click(function(){
    var value = $("#input_box").val();
    $("#input_box").val("");
    $("div.fancyInput").find("span").remove();
    addIdea(value);
});

//logic
function addIdea(idea){
    if(idea=="") return;
    ideas.push(idea);
    saveToServer();
}
function removeIdea(index){
    ideas.splice(index, 1);
}
function redrawIdeas(){
    $("#ideas").find("li").remove();
    ideas.reverse().forEach(function(e, index){
        var element = $("<li><p/></li>");
        element.find("p").text(e);
        var deleteButton = $("<button/>");
        deleteButton.text("delete");
        deleteButton.addClass("delete-button");
        $(deleteButton).click(function(){
            ideas.reverse();
            removeIdea(index);
            ideas.reverse();
            saveToServer();
        });
        deleteButton.prependTo(element.find("p"));
        element.appendTo($("#ideas"));
    });
    ideas.reverse();
}
function saveToServer(){
    $.post("./api.php", { action : "store", data : JSON.stringify(ideas) }, function(){
        loadFromServer();
    });
}
function loadFromServer(){
    $.getJSON("./api.php", { action : "retrieve" }, function(data){
        ideas = data;
        redrawIdeas();
    });
}