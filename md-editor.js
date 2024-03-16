document.getElementById('markdown-content').addEventListener('input', function () {

    // Get references to the elements
    const markdownContent = document.getElementById('markdown-content');
    const htmlPreview = document.getElementById('html-preview');

    // Convert Markdown to HTML. Note that the resulting HTML is now stored in a variable.
    htmlContent = marked.parse(markdownContent.value);

    // Sanitize the generated HTML and display it.
    htmlPreview.innerHTML = DOMPurify.sanitize(htmlContent,
            {USE_PROFILES: {html: true}});

});

document.getElementById('editor-mode').addEventListener('click', function () {

    // Toggle the presence of the class "distraction-free" on the element with the id "editor".
    document.getElementById('editor').classList.toggle('distraction-free');

});