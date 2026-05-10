import DOMPurify from "dompurify";

export function purifyText(input = "") {
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    });
}
