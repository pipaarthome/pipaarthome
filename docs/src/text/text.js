{
    const languages = {
        "pt": window.PAH.languages.pt,
    };

    const util = {
        findElements: () => document.querySelectorAll('[data-multilang]'),
        list: (maybeList) => Array.isArray(maybeList) ? maybeList : [maybeList],
        clear: (element) => { while(element.firstChild) element.removeChild(element.lastChild); },
    };

    function t(lang, path) {
        path = path.split(".");
        let obj = lang;
        while (path.length > 0) {
            const key = path.shift();
            if (!(key in obj)) {
                console.error("Could not find text in path", path, "for language", lang);
                return "";
            }
            obj = obj[key];
        }
        return obj;
    }

    window.PAH = window.PAH || {};
    window.PAH.translate = (language) => {
        const lang = languages[language];
        if (!lang) {
            console.error(`Language "${language}" not found.`);
            return;
        }

        for (const element of util.findElements()) {
            const multilang = element.getAttribute('data-multilang');
            const tokens = multilang.split(" ");

            if (tokens.length == 0) {
                console.error("Could not parse", multilang);
                continue;
            }

            if (tokens.length == 1) {
                element.textContent = t(lang, tokens[0]);
                continue;
            }

            switch (tokens[0]) {
                case "join_br":
                    element.innerHTML = t(lang, tokens[1]).join("<br />");
                    continue;
                case "href":
                    element.href = t(lang, tokens[1]);
                    continue;
                case "paragraphs":
                    util.clear(element);
                    for (const text of util.list(t(lang, tokens[1]))) {
                        const p = document.createElement("p");
                        p.textContent = text;
                        element.appendChild(p);
                    }
                    continue;
                case "cards":
                    util.clear(element);
                    for (const item of util.list(t(lang, tokens[1]))) {
                        const div = document.createElement("div");
                        const h3 = document.createElement("h3");
                        const span = document.createElement("span");
                        h3.textContent = item.title;
                        span.textContent = item.body;
                        div.appendChild(h3);
                        div.appendChild(span);
                        element.appendChild(div);
                    }
                    continue;
                case "list":
                    util.clear(element);
                    for (const item of util.list(t(lang, tokens[1]))) {
                        const li = document.createElement("li");
                        li.textContent = item;
                        element.appendChild(li);
                    }
                    continue;
            }

            // TODO
        }
    };
}