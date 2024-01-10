function replaceContent(html, replacements) {
  // Replace each placeholder with the corresponding value
  Object.keys(replacements).forEach((placeholder) => {
    const regex = new RegExp(`{%${placeholder}%}`, 'g');
    html = html.replace(regex, replacements[placeholder]);
  });

  return html;
}

module.exports = replaceContent;
