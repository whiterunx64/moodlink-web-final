// update UI metric values — hides skeleton, shows real value
export function sync_metrics(data) {
    update_card_value("metric-logs", data.logs);
    update_card_value("metric-students", data.students);
    update_card_value("metric-flagged", data.flagged);
    update_card_value("metric-requests", data.requests);
}

function update_card_value(id, value) {
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
