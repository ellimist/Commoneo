//globals
var ideas = [];

//main
$(function(){
    // extend String prototype
    if(!String.linkify) {
        String.prototype.linkify = function() {

            // http://, https://, ftp://
            var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

            // www. sans http:// or https://
            var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

            // Email addresses
            var emailAddressPattern = /\w+@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6})+/gim;

            return this
                .replace(urlPattern, '<a href="$&">$&</a>')
                .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
                .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
        };
    }
    // load the stuff
    loadFromServer();
});

// make the site responsive
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
        e = e.linkify();
        element.find("p").html(e);
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

