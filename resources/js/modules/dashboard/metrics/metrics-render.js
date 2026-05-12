// update UI metric values — hides skeleton, shows real value
export function sync_metrics(data) {
    set_value("metric-logs", data.logs);
    set_value("metric-students", data.students);
    set_value("metric-flagged", data.flagged);
    set_value("metric-requests", data.requests);
}

function set_value(id, value) {
    const card = document.querySelector(`#${id}`);
    if (!card) return;

    const number = card.querySelector(".text-4xl");
    const skeleton = card.querySelector(".metric-skeleton");

    if (skeleton) skeleton.remove();

    if (number) {
        number.classList.remove("hidden");
        number.textContent = value;
    }
}
