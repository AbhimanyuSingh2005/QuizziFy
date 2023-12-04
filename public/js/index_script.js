let heading_text = heading.textContent;
heading.textContent = "";
setTimeout(() => {
    let i = 0;
    setInterval(() => {
        if (i < heading_text.length)
            heading.textContent += heading_text[i];
        i++;
    }, 100);
}, 1000);