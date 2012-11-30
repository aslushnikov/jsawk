function runScript(funBody, txt) {
    var output = [];
    var $output = $("#output");
    $output.removeClass("error success");
    var $input = $("#input");
    var error = false;

    delete window._internalMacroState;
    window._internalMacroState = {};
    try{    
        const extendedFunBody = [
            "var S=window._internalMacroState;", /* state object */
            "const firstLine = lineNumber === 0;", /* firstLine extension */
            "const lastLine = totalLines - 1 === lineNumber;", /* lastLine extension */
            "function squeeze(s) { return s.replace(/\s+/g, ' '); }", /* squeeze function */
            funBody
        ];

        var f = Function("lineNumber", "line", "totalLines", extendedFunBody.join("\n"));
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
        value: "1\n2\n3\n4\n5",
        lineNumbers: true
    });

    
    var bodyEditor = CodeMirror($("#editor-body").get(0), {
        value: "/**\n * This is an example of simple aggregation.\n * This piece of code will count sum of line values\n */\n\n//|firstLine| is readOnly variable with obvious meaning\nif (firstLine)\n  //S - state object, that persists between calls\n  S.value=0;\n\n//all js functions are available for you here, including regexps\nS.value += parseInt(line);\n\n//|lastLine| is similar to |firstLine|\nif (lastLine)\n  return S.value;"
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
