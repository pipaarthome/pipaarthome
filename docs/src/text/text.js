{
    const languages = {
        "pt": window.PAH.languages.pt,
    };

    function findElements() {
        return document.querySelectorAll('[data-multilang]');
    }

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

    function _join_br(list) {
        return list.join("<br />");
    }

    window.PAH = window.PAH || {};
    window.PAH.translate = (language) => {
        const lang = languages[language];
        if (!lang) {
            console.error(`Language "${language}" not found.`);
            return;
        }

        for (const element of findElements()) {
            const multilang = element.getAttribute('data-multilang');
            const tokens = multilang.split(" ");

            if (tokens.length == 0) {
                console.error("Could not parse", multilang);
                continue;
            }

            if (tokens.length == 1) {
                element.textContent = tokens[0];
                continue;
            }

            switch (tokens[0]) {
                case "join_br":
                    element.innerHTML = _join_br(t(lang, tokens[1]));
                    return;
            }

            // TODO
        }
    };
}