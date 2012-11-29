function runScript(funBody, txt) {
    var output = [];
    var $output = $("#output");
    $output.removeClass("error success");
    var $input = $("#input");
    var error = false;

    window._internalMacroState = {};
    try{    
        var stateFunction = "$=window._internalMacroState;";
        var f = Function("lineNumber", "line", "totalLines", stateFunction + funBody);
        for (var i = 0; i < txt.length; i++) {
           var result = f(i, txt[i], txt.length);
           if (result) 
               output.push(result);
        }
    } catch (e) {
        output = [];
        output.push(e.message);
        error = true;
    }

    $output.text(output.join("\n"));
    if (error) {
        $output.addClass("error");
    } else {
        $output.addClass("success");
    }
}

$(document).ready(function() {

    var headEditor = CodeMirror($("#editor-header").get(0), {
        value: "/**\n* @param {number} lineNumber zero-based\n* @param {string} line\n* @param {number} totalLines total amount of lines (would be 4 in sample)\n*/\nfunction perLine(lineNumber, line, totalLines) {",
        readOnly: "nocursor"
    });
    var footerEditor = CodeMirror($("#editor-footer").get(0), {
        value: "}",
        readOnly: "nocursor"
    });
    
    var inputEditor = CodeMirror($("#input").get(0), {
        value: "Andrey Lushnikov\nAnna Dobrolezh\nChalov Ivan\nVasilinets Sergey",

        lineNumbers: true
    });

    
    var bodyEditor = CodeMirror($("#editor-body").get(0), {
        value: "//swap name and last name\nvar tokens=line.split(' ');\nreturn tokens[1] + ' ' + tokens[0];"
    });

    $("#editor-header").click(function(e) {
        bodyEditor.focus();
    });
    $("#editor-footer").click(function(e) {
        bodyEditor.focus();
    });

    $("#output").click(function(e) {
        $(this).focus();
        document.execCommand("selectAll", false, null);
    });
    
    $("body").keypress(function(e) {
        if (e.keyCode === 10 && e.ctrlKey === true) {
            $("#submit").click();
        }
    });
    
    $("#submit").click(function() {
        runScript(bodyEditor.getValue(), inputEditor.getValue().split('\n'));
    });
});
