function runScript(funBody) {
    var output = [];
    var $output = $("#output");
    $output.removeClass("error success");
    var $input = $("#input");
    var error = false;

    try{    
        var f = Function("lineNumber", "line", funBody);
        var txt = $input.text().split("\n");
        for (var i = 0; i < txt.length; i++) {
                output.push(f(i, txt[i]));
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
        value: "/**\n* @param {number} lineNumber zero-based\n* @param {string} line\n*/\nfunction perLine(line, lineNumber) {",
        readOnly: true
    });
    var footerEditor = CodeMirror($("#editor-footer").get(0), {
        value: "}",
        readOnly: true
    });

    
    var bodyEditor = CodeMirror($("#editor-body").get(0), {
        value: "return line.split(\":\").pop();"
    });
    
    $("#editor-body").keypress(function(e) {
        if (e.keyCode === 10 && e.ctrlKey === true) {
            $("#submit").click();
        }
    });
    
    $("#submit").click(function() {
        runScript(bodyEditor.getValue());
    });
});
